'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { locales, localeNames, isLocale, type Locale } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from './icons';

export function LanguageSwitcher({
  locale,
  label,
  align = 'right',
}: {
  locale: Locale;
  label: string;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function switchTo(target: Locale) {
    // Swap the leading locale segment, preserving the rest of the path.
    const segments = pathname.split('/');
    if (isLocale(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    const next = segments.join('/') || `/${target}`;
    // One year, so the choice sticks on the next visit.
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    router.push(next);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 font-mono text-[0.7rem] uppercase tracking-label text-ink transition-colors hover:border-ink/40"
      >
        <Globe className="h-4 w-4 text-muted" />
        {locale.toUpperCase()}
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: reduce ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-[0_12px_40px_-12px_rgba(27,23,20,0.3)] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {locales.map((l) => {
              const active = l === locale;
              return (
                <li key={l} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => switchTo(l)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                      active ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[0.65rem] uppercase tracking-label text-muted">
                        {l}
                      </span>
                      <span className="font-display text-base">
                        {localeNames[l]}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-ember" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
