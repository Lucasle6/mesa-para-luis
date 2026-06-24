import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, isLocale } from './lib/i18n';
import { updateSession } from './lib/supabase/middleware';

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!hasLocale) {
    const locale = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  // On localized routes, keep the Supabase session fresh.
  const res = NextResponse.next();
  return updateSession(req, res);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
