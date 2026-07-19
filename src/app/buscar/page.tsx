'use client';

import { Nav } from '@/components/nav';
import { awardPayload, postFlight, storageKeys } from '@/lib/client-search';
import type { SearchInput } from '@/lib/schemas';
import { useState } from 'react';

const initial: SearchInput = { origin: 'GRU', destination: 'LIS', departureDate: '', adults: 1, cabin: 'economy', stops: 'any', mode: 'cash', currency: 'BRL', gl: 'br', hl: 'pt' };
type ConnectorStatus = { seatsAeroEnabled: boolean };

function errorMessage(error: unknown) { const status = (error as { status?: number }).status; if (status === 503) return 'Conector indisponível.'; if (status === 502) return 'Falha na fonte de dados.'; if (status === 401) return 'Sua sessão expirou. Entre novamente.'; return error instanceof Error ? error.message : 'Não foi possível concluir a busca.'; }

export default function Buscar() {
  const [form, setForm] = useState<SearchInput>(initial);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const change = (key: keyof SearchInput, value: string | number) => setForm(current => ({ ...current, [key]: value } as SearchInput));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true); setError('');
    const payload = { ...form, maxPrice: form.maxPrice || undefined };
    const errors: Record<string, string> = {};
    try {
      let cash: unknown; let awards: unknown;
      if (form.mode === 'cash') { setSource('Google Flights'); cash = await postFlight('/api/flights/search-cash', payload); }
      else if (form.mode === 'awards') { setSource('Seats.aero'); awards = await postFlight('/api/flights/search-awards', awardPayload(form)); }
      else {
        const config = await fetch('/api/config/status').then(async response => (await response.json()) as ConnectorStatus);
        setSource(config.seatsAeroEnabled ? 'Google Flights e Seats.aero' : 'Google Flights');
        const tasks: Promise<unknown>[] = [postFlight('/api/flights/search-cash', payload)];
        if (config.seatsAeroEnabled) tasks.push(postFlight('/api/flights/search-awards', awardPayload(form))); else errors.awards = 'Seats.aero está desativado.';
        const settled = await Promise.allSettled(tasks);
        if (settled[0].status === 'fulfilled') cash = settled[0].value; else errors.cash = errorMessage(settled[0].reason);
        if (settled[1]?.status === 'fulfilled') awards = settled[1].value; else if (settled[1]?.status === 'rejected') errors.awards = errorMessage(settled[1].reason);
      }
      sessionStorage.setItem(storageKeys.search, JSON.stringify({ params: payload, at: new Date().toISOString() }));
      if (cash) sessionStorage.setItem(storageKeys.cash, JSON.stringify(cash)); else sessionStorage.removeItem(storageKeys.cash);
      if (awards) sessionStorage.setItem(storageKeys.award, JSON.stringify(awards)); else sessionStorage.removeItem(storageKeys.award);
      sessionStorage.setItem(storageKeys.errors, JSON.stringify(errors));
      if (!cash && !awards) throw new Error(Object.values(errors)[0] ?? 'Nenhuma fonte respondeu.');
      location.assign('/resultados');
    } catch (reason) { setError(errorMessage(reason)); } finally { setLoading(false); setSource(''); }
  }

  return <main className="shell"><Nav /><h1>Planeje sua busca</h1><form className="card grid cols-2" onSubmit={submit}>
    <label>Origem (IATA)<input className="input" value={form.origin} onChange={e => change('origin', e.target.value.toUpperCase())} required /></label><label>Destino (IATA)<input className="input" value={form.destination} onChange={e => change('destination', e.target.value.toUpperCase())} required /></label>
    <label>Ida<input className="input" type="date" value={form.departureDate} onChange={e => change('departureDate', e.target.value)} required /></label><label>Volta<input className="input" type="date" value={form.returnDate ?? ''} onChange={e => change('returnDate', e.target.value)} /></label>
    <label>Adultos<input className="input" type="number" min="1" max="9" value={form.adults} onChange={e => change('adults', Number(e.target.value))} /></label><label>Cabine<select className="input" value={form.cabin} onChange={e => change('cabin', e.target.value)}><option value="economy">Econômica</option><option value="premium_economy">Premium economy</option><option value="business">Executiva</option><option value="first">Primeira</option></select></label>
    <label>Escalas<select className="input" value={form.stops} onChange={e => change('stops', e.target.value)}><option value="any">Qualquer</option><option value="nonstop">Direto</option><option value="one_or_less">Até uma escala</option><option value="two_or_less">Até duas escalas</option></select></label><label>Preço máximo<input className="input" type="number" value={form.maxPrice ?? ''} onChange={e => change('maxPrice', Number(e.target.value))} /></label>
    <label>Modo<select className="input" value={form.mode} onChange={e => change('mode', e.target.value)}><option value="cash">Dinheiro</option><option value="awards">Milhas</option><option value="compare">Comparar</option></select></label>{error && <p role="alert">{error}</p>}<button className="btn" disabled={loading}>{loading ? `Consultando ${source}…` : 'Buscar oportunidades'}</button>
  </form></main>;
}
