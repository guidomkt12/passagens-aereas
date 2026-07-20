'use client';

import { Nav } from '@/components/nav';
import { useState } from 'react';

const programs = [{ id: 'latam_pass', label: 'LATAM Pass' }, { id: 'smiles', label: 'Smiles' }, { id: 'azul_fidelidade', label: 'Azul Fidelidade' }];

export default function Buscar() {
  const [selected, setSelected] = useState(programs.map(p => p.id));
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(p => p !== id) : [...current, id]);
  return <main className="app-shell"><Nav />
    <section className="search-hero"><div className="eyebrow">BUSCA DE PASSAGENS</div><h1>Encontre a melhor forma de viajar.</h1><p>Compare emissões em milhas em uma única busca, com dados e disponibilidade das fontes configuradas.</p></section>
    <form className="search-panel" onSubmit={event => { event.preventDefault(); if (!selected.length) return; const data = new FormData(event.currentTarget); const query = new URLSearchParams({ origin: String(data.get('origin')).toUpperCase(), destination: String(data.get('destination')).toUpperCase(), departureDate: String(data.get('departureDate')), returnDate: String(data.get('returnDate') || ''), cabin: String(data.get('cabin')), mode: String(data.get('mode')), programs: selected.join(',') }); location.href = `/resultados?${query}`; }}>
      <div className="trip-switch"><button type="button" className="trip-active">Ida e volta</button><button type="button">Só ida</button></div>
      <div className="route-fields"><label><span>Origem</span><div className="field-with-icon"><i>◉</i><input name="origin" className="input" placeholder="Código ou cidade" maxLength={3} required /></div></label><button type="button" className="swap-route" aria-label="Inverter origem e destino">⇄</button><label><span>Destino</span><div className="field-with-icon"><i>⌖</i><input name="destination" className="input" placeholder="Código ou cidade" maxLength={3} required /></div></label></div>
      <div className="search-details"><label><span>Data de ida</span><input name="departureDate" className="input" type="date" required /></label><label><span>Data de volta <em>Opcional</em></span><input name="returnDate" className="input" type="date" /></label><label><span>Cabine</span><select name="cabin" className="input"><option value="economica">Econômica</option><option value="premium">Premium economy</option><option value="executiva">Executiva</option><option value="primeira">Primeira</option></select></label><label><span>Tipo de busca</span><select name="mode" className="input"><option value="compare">Comparar programas</option><option value="awards">Somente milhas</option><option value="cash">Somente dinheiro</option></select></label></div>
      <div className="program-row"><div><strong>Programas para consultar</strong><small>Selecione ao menos um programa.</small></div><div className="programs">{programs.map(program => <label key={program.id} className={`program-check ${selected.includes(program.id) ? 'selected' : ''}`}><input type="checkbox" checked={selected.includes(program.id)} onChange={() => toggle(program.id)} />{program.label}</label>)}</div></div>
      <div className="search-submit"><p>Consultas idênticas podem usar resultados em cache por até 60 minutos.</p><button className="btn btn-large" disabled={!selected.length}>Buscar passagens <span>→</span></button></div>
    </form>
    <section className="search-notes"><article><span>◷</span><div><b>Consulte com calma</b><p>Resultados dependem da disponibilidade informada pelas fontes.</p></div></article><article><span>⌁</span><div><b>Compare com clareza</b><p>Milhas, taxas e condições ficam separadas em cada oferta.</p></div></article><article><span>⌂</span><div><b>Dados sob seu controle</b><p>Uma ferramenta pessoal para planejar emissões.</p></div></article></section>
  </main>;
}
