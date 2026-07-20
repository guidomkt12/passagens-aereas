import type { AwardOffer, AwardProgram, AwardProvider, AwardSourceType } from '@/lib/types';

const programProvider: Record<AwardProgram, AwardProvider> = { latam_pass: 'latam_web', smiles: 'smiles_web', azul_fidelidade: 'azul_web' };
export function normalizeAward(raw: Record<string, unknown>, program: AwardProgram, sourceType: AwardSourceType, fallback: { origin: string; destination: string; departureDate: string; cabin: string }): AwardOffer | null {
  const points = Number(raw.points ?? raw.miles ?? raw.pricePoints);
  if (!Number.isFinite(points) || points < 0) return null;
  const provider = sourceType === 'api' ? 'seats_aero' : programProvider[program];
  const taxes = raw.taxes == null ? undefined : Number(raw.taxes);
  const airlines = Array.isArray(raw.airlines) ? raw.airlines.filter((x): x is string => typeof x === 'string') : typeof raw.airline === 'string' ? [raw.airline] : undefined;
  const origin = String(raw.origin ?? fallback.origin).toUpperCase(); const destination = String(raw.destination ?? fallback.destination).toUpperCase(); const date = String(raw.departureDate ?? raw.departure_date ?? fallback.departureDate);
  return { fingerprint: `${program}:${origin}:${destination}:${date}:${points}:${raw.cabin ?? fallback.cabin}:${airlines?.join(',') ?? ''}`, provider, program, sourceType, origin, destination, departureDate: date, arrivalDate: typeof raw.arrivalDate === 'string' ? raw.arrivalDate : undefined, cabin: String(raw.cabin ?? fallback.cabin), points, taxes: Number.isFinite(taxes) ? taxes : undefined, taxesCurrency: typeof raw.taxesCurrency === 'string' ? raw.taxesCurrency : 'BRL', seats: Number.isFinite(Number(raw.seats)) ? Number(raw.seats) : undefined, direct: typeof raw.direct === 'boolean' ? raw.direct : undefined, airlines, lastCheckedAt: typeof raw.lastCheckedAt === 'string' ? raw.lastCheckedAt : new Date().toISOString(), requiresRevalidation: sourceType === 'api' || raw.requiresRevalidation === true, authenticatedPrice: raw.authenticatedPrice === true, clubPrice: raw.clubPrice === true, accountSpecific: raw.accountSpecific === true };
}
export function dedupeAwards(offers: AwardOffer[]) { return [...new Map(offers.map(offer => [`${offer.program}:${offer.fingerprint}`, offer])).values()]; }
