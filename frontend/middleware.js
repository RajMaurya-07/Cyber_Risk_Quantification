import { NextResponse } from 'next/server';
import { readSessionToken, SESSION_COOKIE_NAME } from './lib/server/auth';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/') return NextResponse.next();
  const isAuthPage = pathname === '/signup' || pathname === '/login';

  let user = null;
  try {
    user = await readSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  } catch (error) {
    console.error('[Auth Middleware] Session validation failed:', error);
  }

  if (isAuthPage) {
    return user
      ? NextResponse.redirect(new URL('/data-sources', request.url))
      : NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
