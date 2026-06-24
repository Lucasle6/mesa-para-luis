'use client';

import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase env vars are present (see .env.local.example). */
export const supabaseConfigured = Boolean(url && anon);

/** Browser-side Supabase client. Call only after checking supabaseConfigured. */
export function createClient() {
  if (!supabaseConfigured) {
    throw new Error(
      'Supabase no está configurado: define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  return createBrowserClient(url!, anon!);
}
