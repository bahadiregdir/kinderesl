import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;

  // 1. 301 Permanent Redirect from kinderesl.vercel.app to kinderesl.com
  // ONLY active when custom domain is registered and connected (ENABLE_DOMAIN_REDIRECT=true)
  // Default is OFF so kinderesl.vercel.app functions normally without DNS NXDOMAIN errors.
  const enableDomainRedirect = process.env.ENABLE_DOMAIN_REDIRECT === 'true';
  if (enableDomainRedirect && (host === 'kinderesl.vercel.app' || host.endsWith('.vercel.app'))) {
    const destination = new URL(`https://kinderesl.com${pathname}${search}`);
    return NextResponse.redirect(destination, { status: 301 });
  }

  const response = NextResponse.next();

  // 2. Set X-Robots-Tag: noindex, nofollow on all hosts other than canonical production domain,
  // and ALWAYS on /admin and /api routes regardless of host.
  const isProductionDomain = host === 'kinderesl.com' || host === 'www.kinderesl.com';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const isAdminOrApi = pathname.startsWith('/admin') || pathname.startsWith('/api/');

  if (isAdminOrApi || (!isProductionDomain && !isLocalhost)) {
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
