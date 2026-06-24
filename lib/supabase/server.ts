import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Profile } from './types';

type CookieToSet = { name: string; value: string; options: CookieOptions };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

/** Server-side Supabase client bound to the request cookies. */
export function createClient() {
  if (!supabaseConfigured) {
    throw new Error(
      'Supabase no está configurado: define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  const cookieStore = cookies();
  return createServerClient(url!, anon!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        // In a Server Component cookies are read-only; ignore writes there.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* called from a Server Component — safe to ignore */
        }
      },
    },
  });
}

/** Current authenticated user, or null. Never throws if unconfigured. */
export async function getUser() {
  if (!supabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Current user's profile (includes role), or null. */
export async function getProfile(): Promise<Profile | null> {
  if (!supabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return (data as Profile) ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === 'admin';
}
