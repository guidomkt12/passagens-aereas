export type DealLabel = 'imperdivel' | 'excelente' | 'boa' | 'normal';
export type FlightSegment = { departure: string; arrival: string; airline?: string; durationMinutes?: number };
export type PriceInsights = { typicalLow?: number; typicalHigh?: number; average?: number; freshness?: string };
export type CashOffer = { fingerprint: string; searchId: string; provider: string; origin: string; destination: string; departureDate: string; returnDate?: string | null; currency: string; price: number; airline?: string | null; segments: FlightSegment[]; stops: number; totalDurationMinutes?: number | null; priceInsights?: PriceInsights | null; discountPercent?: number | null; dealScore: number; dealLabel: DealLabel };

export type AwardProgram = 'latam_pass' | 'smiles' | 'azul_fidelidade';
export type AwardProvider = 'seats_aero' | 'latam_web' | 'smiles_web' | 'azul_web';
export type AwardSourceType = 'api' | 'browser';
export type AwardOffer = {
  fingerprint: string; provider: AwardProvider; program: AwardProgram; sourceType: AwardSourceType;
  origin: string; destination: string; departureDate: string; arrivalDate?: string;
  cabin: string; points: number; taxes?: number; taxesCurrency?: string; seats?: number;
  direct?: boolean; airlines?: string[]; lastCheckedAt: string; requiresRevalidation: boolean;
  authenticatedPrice?: boolean; clubPrice?: boolean; accountSpecific?: boolean;
};
export type AwardSourceStatus = { program: AwardProgram; provider: AwardProvider; status: 'searching' | 'received' | 'unavailable' | 'login_required' | 'session_expired' | 'captcha_mfa_required' | 'temporarily_unavailable'; detail?: string };
export type ProviderHealth = { name: string; active: boolean; detail: string };
