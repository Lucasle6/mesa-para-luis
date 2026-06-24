'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BRAND, type Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, Close } from './icons';

export function Nav({ locale, ui }: { locale: Locale; ui: UIDict }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const links = [
    { href: `/${locale}/cuisines`, label: ui.nav.cuisines },
    { href: `/${locale}/recipes`, label: ui.nav.recipes },
    { href: `/${locale}/about`, label: ui.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto mt-3 flex max-w-shell items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border border-line bg-paper/85 shadow-[0_8px_30px_-12px_rgba(27,23,20,0.25)] backdrop-blur-md'
            : 'border border-transparent bg-transparent'
        }`}
        style={{ marginInline: 'clamp(0.75rem, 4vw, 2rem)' }}
      >
        <Link
          href={`/${locale}`}
          className="font-display text-xl font-semibold tracking-tight text-ink"
          aria-label={`${BRAND} — ${ui.nav.home}`}
        >
          {BRAND}
          <span className="text-ember">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`link-underline font-sans text-sm transition-colors hover:text-ink ${
                  active ? 'text-ink' : 'text-muted'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <LanguageSwitcher locale={locale} label={ui.nav.language} />
          <Link
            href={`/${locale}/recipes`}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[0.7rem] uppercase tracking-label text-paper transition-colors hover:bg-ember"
          >
            {ui.nav.start}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} label={ui.nav.language} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer rounded-full border border-line bg-surface p-2 text-ink"
            aria-label={open ? ui.nav.close : ui.nav.open}
            aria-expanded={open}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-3 mt-2 rounded-3xl border border-line bg-paper/95 p-4 backdrop-blur-md md:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-xl px-4 py-3 font-display text-2xl text-ink transition-colors hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/recipes`}
              className="mt-2 block rounded-xl bg-ink px-4 py-3 text-center font-mono text-xs uppercase tracking-label text-paper"
            >
              {ui.nav.start}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
