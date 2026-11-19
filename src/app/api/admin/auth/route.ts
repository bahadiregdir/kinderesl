import { NextResponse } from 'next/server';
import {
  clearAdminSessionCookie,
  getAdminPasswordConfig,
  isAdminAuthenticated,
  setAdminSessionCookie,
  verifyPassword,
} from '@/lib/admin-auth';
import { getStorageInfo } from '@/lib/cms-storage';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  const pwConfig = getAdminPasswordConfig();

  return NextResponse.json({
    authenticated,
    passwordConfigured: pwConfig.configured,
    isDevDefaultPassword: pwConfig.isDevDefault,
    storage: getStorageInfo(),
  });
}

export async function POST(request: Request) {
  const pwConfig = getAdminPasswordConfig();
  if (!pwConfig.configured) {
    return NextResponse.json(
      {
        error:
          'ADMIN_PASSWORD is not configured in Vercel Environment Variables. Admin login is disabled in production until set.',
      },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 401 });
  }

  await setAdminSessionCookie();
  return NextResponse.json({
    authenticated: true,
    isDevDefaultPassword: pwConfig.isDevDefault,
    storage: getStorageInfo(),
  });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ authenticated: false });
}
