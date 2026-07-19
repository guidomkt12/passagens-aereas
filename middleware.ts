import { NextRequest, NextResponse } from 'next/server';

const cookie = 'radar_session';
const encoder = new TextEncoder();
const secret = () => process.env.APP_SESSION_SECRET || process.env.APP_ACCESS_PASSWORD || 'development-only-secret';
async function validSession(value?: string) {
  if (!value) return false;
  const [payload, signature] = value.split('.');
  if (payload !== 'radar-owner' || !signature) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  const expected = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  if (signature.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= signature.charCodeAt(index) ^ expected.charCodeAt(index);
  return difference === 0;
}
export async function middleware(req: NextRequest) { const { pathname }=req.nextUrl; if(pathname==='/login'||pathname.startsWith('/api/auth/login')||pathname.startsWith('/api/health')||pathname.startsWith('/_next')) return NextResponse.next(); if(await validSession(req.cookies.get(cookie)?.value)) return NextResponse.next(); if(pathname.startsWith('/api/')) return NextResponse.json({error:{code:'UNAUTHORIZED',message:'Autenticação necessária.'}},{status:401}); return NextResponse.redirect(new URL('/login',req.url)); }
export const config={matcher:['/((?!favicon.ico).*)']};
