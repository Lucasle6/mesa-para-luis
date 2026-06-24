'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Cuisine, Level, Recipe } from '@/lib/types';
import { interpolate, type Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { TechniqueScale } from './TechniqueScale';
import { ArrowRight, Clock } from './icons';

interface Props {
  cuisines: Cuisine[];
  recipesByCuisine: Record<string, Recipe[]>;
  locale: Locale;
  levels: Level[];
  ui: UIDict;
}

export function CuisineTabs({
  cuisines,
  recipesByCuisine,
  locale,
  levels,
  ui,
}: Props) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = cuisines[active];
  const recipes = recipesByCuisine[current.slug] ?? [];

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (active + dir + cuisines.length) % cuisines.length;
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={ui.nav.cuisines}
        onKeyDown={onKey}
        className="no-scrollbar -mx-[var(--shell-pad)] flex gap-2 overflow-x-auto px-[var(--shell-pad)] pb-1"
      >
        {cuisines.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={selected}
              aria-controls={`panel-${c.slug}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 cursor-pointer rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-label transition-colors ${
                selected ? 'text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              {c.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.slug}`}
        aria-labelledby={`tab-${current.slug}`}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch"
          >
            <div className="relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl border border-line bg-line p-7">
              <Image
                src={current.image}
                alt={current.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              <div className="relative">
                <span className="eyebrow text-paper/70">{current.tagline}</span>
                <h3 className="mt-2 font-display text-4xl text-paper">
                  {current.name}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/80">
                  {current.description}
                </p>
                <Link
                  href={`/${locale}/cuisines/${current.slug}`}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-label text-ink transition-colors hover:bg-ember hover:text-paper"
                >
                  {interpolate(ui.home.explore, { name: current.name })}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
              {recipes.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/${locale}/recipes/${r.slug}`}
                    className="group flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-paper"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-line">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate font-display text-lg text-ink">
                          {r.title}
                        </h4>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-[0.65rem] text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {r.timeMins} {ui.recipe.min}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                        {r.excerpt}
                      </p>
                      <div className="mt-2">
                        <TechniqueScale value={r.level} levels={levels} />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-ember" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
