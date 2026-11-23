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

export function verifyBearerToken(authHeader: string | null): {
  valid: boolean;
  tokenKey?: string;
} {
  const configuredToken = process.env.ADMIN_API_TOKEN?.trim();
  if (!configuredToken || !authHeader) {
    return { valid: false };
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authHeader.trim());
  if (!match) {
    return { valid: false };
  }

  const provided = match[1];
  const providedHash = crypto.createHash('sha256').update(provided).digest();
  const expectedHash = crypto.createHash('sha256').update(configuredToken).digest();

  if (!crypto.timingSafeEqual(providedHash, expectedHash)) {
    return { valid: false };
  }

  const tokenKey = expectedHash.toString('hex').slice(0, 16);
  return { valid: true, tokenKey };
}

export async function authenticateAdminRequest(request: Request): Promise<{
  ok: boolean;
  method: 'bearer' | 'cookie' | null;
  rateLimitKey?: string;
}> {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== null) {
    const res = verifyBearerToken(authHeader);
    if (!res.valid) {
      return { ok: false, method: null };
    }
    return {
      ok: true,
      method: 'bearer',
      rateLimitKey: `bearer:${res.tokenKey}`,
    };
  }

  const cookieOk = await isAdminAuthenticated();
  return cookieOk
    ? { ok: true, method: 'cookie' }
    : { ok: false, method: null };
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
