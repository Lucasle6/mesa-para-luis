import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isLocale } from './lib/i18n';

const COOKIE = 'NEXT_LOCALE';

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = req.headers.get('accept-language');
  if (header) {
    const preferred = header
      .split(',')
      .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
    const match = preferred.find((code) => isLocale(code));
    if (match) return match;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and any path containing a file extension.
  matcher: ['/((?!_next|.*\\..*).*)'],
};
