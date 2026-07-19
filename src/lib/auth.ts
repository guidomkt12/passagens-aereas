import crypto from 'node:crypto';
const cookie = 'radar_session';
const secret = () => process.env.APP_SESSION_SECRET || process.env.APP_ACCESS_PASSWORD || 'development-only-secret';
export function signSession() { const payload = 'radar-owner'; return `${payload}.${crypto.createHmac('sha256', secret()).update(payload).digest('hex')}`; }
export function validSession(value?: string) { if (!value) return false; const expected = Buffer.from(signSession()); const received = Buffer.from(value); return received.length === expected.length && crypto.timingSafeEqual(received, expected); }
export { cookie };
