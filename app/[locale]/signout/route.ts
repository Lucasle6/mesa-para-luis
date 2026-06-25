import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Sign out via a plain form POST. Runs entirely on the server: it clears the
 * Supabase auth cookies on the redirect response, so logout is reliable and
 * doesn't depend on client-side timing. 303 turns the POST into a GET of home.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { locale: string } },
) {
  const response = NextResponse.redirect(
    new URL(`/${params.locale}`, request.url),
    { status: 303 },
  );

  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore — we redirect (and the cookies are cleared) either way */
    }
  }

  return response;
}
