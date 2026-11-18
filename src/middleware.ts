import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;

  // 1. 301 Permanent Redirect from kinderesl.vercel.app to kinderesl.com
  if (host === 'kinderesl.vercel.app') {
    const destination = new URL(`https://kinderesl.com${pathname}${search}`);
    return NextResponse.redirect(destination, { status: 301 });
  }

  const response = NextResponse.next();

  // 2. Set X-Robots-Tag: noindex, nofollow on all hosts other than the canonical production domain
  const isProductionDomain = host === 'kinderesl.com' || host === 'www.kinderesl.com';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (!isProductionDomain && !isLocalhost) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
