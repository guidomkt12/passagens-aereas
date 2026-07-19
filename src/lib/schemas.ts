import { z } from 'zod';
const airport = z.string().trim().toUpperCase().regex(/^[A-Z]{3}(,[A-Z]{3})*$/, 'Use códigos IATA separados por vírgula');
export const searchSchema = z.object({ origin: airport, destination: airport, departureDate: z.string().date(), returnDate: z.string().date().optional(), adults: z.number().int().min(1).max(9).default(1), cabin: z.enum(['economica','premium','executiva','primeira']).default('economica'), stops: z.enum(['direto','uma','duas','qualquer']).default('qualquer'), maxPrice: z.number().positive().optional(), mode: z.enum(['cash','awards','compare']).default('cash') }).refine(v => !v.returnDate || v.returnDate >= v.departureDate, { message: 'Retorno deve ser posterior à ida', path: ['returnDate'] });
export const dealsSchema = z.object({ origin: airport, maxPrice: z.number().positive().optional(), cabin: z.string().optional() });
export const trendsSchema = z.object({ origin: airport, destination: airport, departureDate: z.string().date() });
export const awardsSchema = searchSchema.pick({ origin:true, destination:true, departureDate:true, returnDate:true, adults:true, cabin:true });
export type SearchInput = z.infer<typeof searchSchema>;
