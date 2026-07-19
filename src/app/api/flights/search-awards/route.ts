import { NextResponse } from 'next/server';
import { normalizeAward, dedupeAwards } from '@/lib/awards';
import { awardsSchema } from '@/lib/schemas';
import type { AwardOffer, AwardProgram, AwardSourceStatus } from '@/lib/types';

const seatPrograms: AwardProgram[] = ['smiles', 'azul_fidelidade'];
const enabled = (key: string) => process.env[key] === 'true';
async function request(url: string | undefined, body: unknown) { if (!url) throw new Error('unconfigured'); const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-flight-secret': process.env.N8N_SHARED_SECRET ?? '' }, body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15_000) }); if (!response.ok) throw new Error(String(response.status)); return response.json() as Promise<unknown>; }
function rows(value: unknown): Record<string, unknown>[] { const valueRows = value && typeof value === 'object' && 'offers' in value ? (value as { offers: unknown }).offers : value; return Array.isArray(valueRows) ? valueRows.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : []; }
export async function POST(requestIn: Request) {
  const parsed = awardsSchema.safeParse(await requestIn.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: 'VALIDATION', message: 'Dados de busca inválidos.', details: parsed.error.flatten() } }, { status: 400 });
  const input = parsed.data; const offers: AwardOffer[] = []; const sources: AwardSourceStatus[] = [];
  const directions = [{ origin: input.origin, destination: input.destination, departureDate: input.departureDate }, ...(input.returnDate ? [{ origin: input.destination, destination: input.origin, departureDate: input.returnDate }] : [])];
  const tasks: Promise<void>[] = [];
  for (const program of input.programs) {
    if (seatPrograms.includes(program) && enabled('SEATS_AERO_ENABLED')) for (const direction of directions) tasks.push((async () => { try { const payload = await request(process.env.N8N_AWARDS_URL, { ...input, ...direction, returnDate: undefined, program }); offers.push(...rows(payload).map(raw => normalizeAward(raw, program, 'api', { ...direction, cabin: input.cabin })).filter((x): x is AwardOffer => x !== null)); sources.push({ program, provider: 'seats_aero', status: 'received' }); } catch { sources.push({ program, provider: 'seats_aero', status: 'temporarily_unavailable', detail: 'Seats.aero indisponível ou não configurado.' }); } })());
    else if (seatPrograms.includes(program)) sources.push({ program, provider: 'seats_aero', status: 'temporarily_unavailable', detail: 'Seats.aero desativada.' });
    const browserEnabled = program === 'latam_pass' ? enabled('LATAM_SCRAPER_ENABLED') : program === 'smiles' ? enabled('SMILES_SCRAPER_ENABLED') : enabled('AZUL_SCRAPER_ENABLED');
    if (browserEnabled && (program === 'latam_pass' || input.revalidatePrograms.includes(program as 'smiles' | 'azul_fidelidade'))) for (const direction of directions) tasks.push((async () => { const provider = program === 'latam_pass' ? 'latam_web' : program === 'smiles' ? 'smiles_web' : 'azul_web'; try { const payload = await request(`${process.env.AWARD_SCRAPER_URL ?? ''}/v1/award/search`, { ...input, ...direction, program }); const result = payload as { offers?: unknown; state?: AwardSourceStatus['status']; reloginUrl?: string }; offers.push(...rows(result).map(raw => normalizeAward(raw, program, 'browser', { ...direction, cabin: input.cabin })).filter((x): x is AwardOffer => x !== null)); sources.push({ program, provider, status: result.state === 'received' ? 'received' : 'unavailable', detail: result.reloginUrl }); } catch { sources.push({ program, provider, status: 'temporarily_unavailable' }); } })());
    else if (program === 'latam_pass') sources.push({ program, provider: 'latam_web', status: 'temporarily_unavailable', detail: 'Fallback LATAM Pass desativado.' });
  }
  await Promise.all(tasks); return NextResponse.json({ offers: dedupeAwards(offers), sources, searchedDirections: directions, cached: false });
}
