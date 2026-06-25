'use server';

import { createClient, supabaseConfigured } from '@/lib/supabase/server';

/**
 * Server-side sign out. Runs in a Server Action context where cookies are
 * writable, so it reliably clears the auth cookies the server set — unlike a
 * browser-side signOut, which can't remove server-issued cookies.
 * The caller hard-reloads afterwards to render the logged-out state.
 */
export async function signOutAction() {
  if (supabaseConfigured) {
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore */
    }
  }
}
