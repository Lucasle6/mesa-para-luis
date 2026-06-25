'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createClient, supabaseConfigured } from '@/lib/supabase/client';
import { signOutAction } from '@/lib/auth-actions';
import { extra } from '@/lib/uiText';
import type { Locale } from '@/lib/i18n';
import type { Role } from '@/lib/supabase/types';
import { ChevronDown, Check } from './icons';

interface Account {
  email: string;
  role: Role;
}

export function UserMenu({
  locale,
  initial,
}: {
  locale: Locale;
  initial: Account | null;
}) {
  const t = extra(locale).account;
  const [account, setAccount] = useState<Account | null>(initial);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Keep the menu in sync with client-side auth changes (login/logout).
  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!session?.user) {
        setAccount(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('id', session.user.id)
        .single();
      setAccount({
        email: data?.email ?? session.user.email ?? '',
        role: (data?.role as Role) ?? 'reader',
      });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function signOut() {
    setOpen(false);
    // Clear the browser's local session copy…
    if (supabaseConfigured) {
      try {
        await createClient().auth.signOut({ scope: 'local' });
      } catch {
        /* ignore */
      }
    }
    // …and the server-issued cookies (only the server can remove those)…
    try {
      await signOutAction();
    } catch {
      /* ignore */
    }
    setAccount(null);
    // …then hard-reload so the server re-renders the logged-out nav.
    window.location.href = `/${locale}`;
  }

  // Logged out → simple sign-in link.
  if (!account) {
    return (
      <Link
        href={`/${locale}/login`}
        className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-[0.7rem] uppercase tracking-label text-ink transition-colors hover:border-ink/40"
      >
        {t.signIn}
      </Link>
    );
  }

  const isAdmin = account.role === 'admin';
  const initials = account.email.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-ink/40"
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.62rem] text-paper ${
            isAdmin ? 'bg-ember' : 'bg-ink'
          }`}
        >
          {initials}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: reduce ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-[0_12px_40px_-12px_rgba(27,23,20,0.3)]"
          >
            <div className="px-3 py-2.5">
              <p className="font-mono text-[0.6rem] uppercase tracking-label text-muted">
                {t.signedInAs}
              </p>
              <p className="mt-1 truncate text-sm text-ink" title={account.email}>
                {account.email}
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-label ${
                  isAdmin ? 'bg-ember/10 text-ember' : 'bg-line text-muted'
                }`}
              >
                <Check className="h-3 w-3" />
                {isAdmin ? t.role_admin : t.role_reader}
              </span>
            </div>

            {isAdmin && (
              <Link
                href={`/${locale}/admin`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl bg-ink px-3 py-2.5 text-center font-mono text-[0.7rem] uppercase tracking-label text-paper transition-colors hover:bg-ember"
              >
                {t.adminPanel}
              </Link>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {t.signOut}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
