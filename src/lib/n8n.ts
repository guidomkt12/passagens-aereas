import { NextResponse } from 'next/server';
import type { ZodType } from 'zod';
const cache = new Map<string, { until: number; body: unknown }>();
export async function proxyN8n(request: Request, schema: ZodType, envKey: string, enabled = true) {
  if (!enabled) return NextResponse.json({ error: { code: 'DISABLED', message: 'Conector desativado.' } }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: 'VALIDATION', message: 'Dados de busca inválidos.', details: parsed.error.flatten() } }, { status: 400 });
  const url = process.env[envKey]; if (!url) return NextResponse.json({ error: { code: 'UNAVAILABLE', message: 'Fonte não configurada.' } }, { status: 503 });
  const key = `${envKey}:${JSON.stringify(parsed.data)}`; const hit = cache.get(key); if (hit && hit.until > Date.now()) return NextResponse.json({ data: hit.body, cached: true });
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 12_000);
  try { const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-flight-secret': process.env.N8N_SHARED_SECRET ?? '' }, body: JSON.stringify(parsed.data), signal: controller.signal, cache: 'no-store' }); if (!response.ok) throw new Error(`upstream:${response.status}`); const body: unknown = await response.json(); cache.set(key, { until: Date.now() + 3_600_000, body }); console.info('flight_proxy', { connector: envKey, cached: false }); return NextResponse.json({ data: body, cached: false }); } catch (e) { const timeout = e instanceof Error && e.name === 'AbortError'; console.warn('flight_proxy_failure', { connector: envKey, timeout }); return NextResponse.json({ error: { code: timeout ? 'TIMEOUT' : 'UPSTREAM', message: timeout ? 'A fonte demorou para responder.' : 'A fonte está indisponível.' } }, { status: 502 }); } finally { clearTimeout(timer); }
}
