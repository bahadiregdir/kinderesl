import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'kinderesl_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminPasswordConfig {
  configured: boolean;
  password: string;
  isDevDefault: boolean;
}

export function getAdminPasswordConfig(): AdminPasswordConfig {
  const envPass = process.env.ADMIN_PASSWORD?.trim();
  if (envPass) {
    return { configured: true, password: envPass, isDevDefault: false };
  }
  if (process.env.NODE_ENV === 'development') {
    return { configured: true, password: 'kinderesl-dev', isDevDefault: true };
  }
  return { configured: false, password: '', isDevDefault: false };
}

function getSigningSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  return getAdminPasswordConfig().password;
}

export function verifyPassword(input: string): boolean {
  const cfg = getAdminPasswordConfig();
  if (!cfg.configured || !cfg.password || !input) {
    return false;
  }
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const targetHash = crypto.createHash('sha256').update(cfg.password).digest();
  return crypto.timingSafeEqual(inputHash, targetHash);
}

interface SessionPayload {
  exp: number;
  iat: number;
  v: number;
}

export function createSessionToken(): string {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error('Cannot create admin session without ADMIN_PASSWORD or ADMIN_SESSION_SECRET');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    v: 1,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('hex');
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token?: string): boolean {
  const secret = getSigningSecret();
  if (!secret || !token) return false;

  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return false;

  const encoded = token.slice(0, dotIdx);
  const providedSig = token.slice(dotIdx + 1);
  if (!encoded || !providedSig) return false;

  const expectedSig = crypto.createHmac('sha256', secret).update(encoded).digest('hex');
  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');

  if (providedBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return false;

  try {
    const raw = Buffer.from(encoded, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (typeof parsed.exp !== 'number' || parsed.exp <= now) {
      return false;
    }
    return parsed.v === 1;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
