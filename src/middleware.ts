import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 proxy (replaces middleware) to protect /app/* routes.
 *
 * Checks for a `cashcollect_session` cookie with a plausible format.
 * Full HMAC verification happens in the API routes (Node runtime);
 * Edge proxy only does a structural check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /app/* dashboard routes
  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('cashcollect_session');

  if (!session?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Structural check: token must be base64-payload.hex-hmac
  const dotIdx = session.value.indexOf('.');
  if (dotIdx < 10 || dotIdx === session.value.length - 1) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
