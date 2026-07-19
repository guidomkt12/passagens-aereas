export type DealLabel = 'imperdivel' | 'excelente' | 'boa' | 'normal';
export type FlightSegment = { departure: string; arrival: string; airline?: string; durationMinutes?: number };
export type PriceInsights = { typicalLow?: number; typicalHigh?: number; average?: number; freshness?: string };
export type CashOffer = { fingerprint: string; searchId: string; provider: string; origin: string; destination: string; departureDate: string; returnDate?: string | null; currency: string; price: number; airline?: string | null; segments: FlightSegment[]; stops: number; totalDurationMinutes?: number | null; priceInsights?: PriceInsights | null; discountPercent?: number | null; dealScore: number; dealLabel: DealLabel };
export type AwardOffer = { fingerprint: string; provider: string; program: string; origin: string; destination: string; departureDate: string; cabin: string; points: number; taxes?: number | null; taxesCurrency?: string | null; seats?: number | null; direct: boolean; airlines?: string | null; requiresRevalidation: boolean };
export type ProviderHealth = { name: string; active: boolean; detail: string };
