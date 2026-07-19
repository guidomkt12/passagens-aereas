export type ApiEnvelope = { data?: unknown; cached?: boolean; error?: { code?: string; message?: string } };
export type NormalOffer = Record<string, unknown>;
function object(value: unknown): Record<string, unknown> | null { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null; }
function offers(value: unknown): NormalOffer[] { if (Array.isArray(value)) return value.flatMap(offers); const item = object(value); if (!item) return []; for (const key of ['offers','results','data','flights','deals']) { if (key in item) { const found=offers(item[key]); if(found.length) return found; } } return item.origin || item.price || item.points ? [item] : []; }
export function normalizeCashResponse(response: ApiEnvelope): NormalOffer[] { return offers(response.data); }
export function normalizeAwardResponse(response: ApiEnvelope): NormalOffer[] { return offers(response.data); }
export function normalizeDealsResponse(response: ApiEnvelope): NormalOffer[] { return offers(response.data); }
export function normalizeTrendsResponse(response: ApiEnvelope): NormalOffer[] { return offers(response.data); }
export function value(offer: NormalOffer, ...keys: string[]) { for(const key of keys) if(offer[key] !== undefined && offer[key] !== null && offer[key] !== '') return String(offer[key]); return 'Não informado'; }
