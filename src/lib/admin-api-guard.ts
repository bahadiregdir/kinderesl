import { NextResponse } from 'next/server';
import { authenticateAdminRequest } from './admin-auth';
import { checkRateLimit } from './rate-limit';

export interface AdminAccessResult {
  authorized: true;
  method: 'bearer' | 'cookie';
  headers: Record<string, string>;
}

export interface AdminAccessDenied {
  authorized: false;
  response: NextResponse;
}

export async function requireAdminApiAccess(
  request: Request
): Promise<AdminAccessResult | AdminAccessDenied> {
  const auth = await authenticateAdminRequest(request);
  if (!auth.ok || !auth.method) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const headers: Record<string, string> = {};
  if (auth.method === 'bearer' && auth.rateLimitKey) {
    const rl = checkRateLimit(auth.rateLimitKey, 30, 60_000);
    headers['X-RateLimit-Limit'] = String(rl.limit);
    headers['X-RateLimit-Remaining'] = String(rl.remaining);
    headers['X-RateLimit-Reset'] = String(rl.resetAt);

    if (!rl.allowed) {
      const retryAfter = Math.max(1, rl.resetAt - Math.floor(Date.now() / 1000));
      headers['Retry-After'] = String(retryAfter);
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Rate limit exceeded (max 30 requests per minute).' },
          { status: 429, headers }
        ),
      };
    }
  }

  return {
    authorized: true,
    method: auth.method,
    headers,
  };
}
