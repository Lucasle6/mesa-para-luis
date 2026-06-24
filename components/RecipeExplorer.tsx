'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Cuisine, Level, Recipe } from '@/lib/types';
import { interpolate, type Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { RecipeCard } from './RecipeCard';
import { Search, Close } from './icons';

interface Props {
  recipes: Recipe[];
  cuisines: Cuisine[];
  levels: Level[];
  locale: Locale;
  ui: UIDict;
}

type SortKey = 'featured' | 'quick' | 'level-asc' | 'level-desc';

export function RecipeExplorer({ recipes, cuisines, levels, locale, ui }: Props) {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>('featured');
  const reduce = useReducedMotion();

  const sorts: { key: SortKey; label: string }[] = [
    { key: 'featured', label: ui.explorer.sortFeatured },
    { key: 'quick', label: ui.explorer.sortQuick },
    { key: 'level-asc', label: ui.explorer.sortLevelAsc },
    { key: 'level-desc', label: ui.explorer.sortLevelDesc },
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = recipes.filter((r) => {
      if (cuisine && r.cuisine !== cuisine) return false;
      if (level && r.level !== level) return false;
      if (q) {
        const haystack = [r.title, r.excerpt, r.origin, r.course, ...r.tags]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case 'quick':
          return a.timeMins - b.timeMins;
        case 'level-asc':
          return a.level - b.level;
        case 'level-desc':
          return b.level - a.level;
        default:
          return Number(b.featured ?? false) - Number(a.featured ?? false);
      }
    });
    return out;
  }, [recipes, query, cuisine, level, sort]);

  const hasFilters = !!query || !!cuisine || !!level;

  function reset() {
    setQuery('');
    setCuisine(null);
    setLevel(null);
  }

  const countLabel =
    results.length === 1
      ? ui.explorer.resultOne
      : interpolate(ui.explorer.resultMany, { count: results.length });

  return (
    <div>
      <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
        <label htmlFor="recipe-search" className="sr-only">
          {ui.explorer.searchPlaceholder}
        </label>
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-4 focus-within:border-ink/40">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            id="recipe-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.explorer.searchPlaceholder}
            className="w-full bg-transparent py-3 text-[0.95rem] text-ink outline-none placeholder:text-muted/70"
          />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <span className="eyebrow mb-2 block">{ui.explorer.cuisine}</span>
            <div className="flex flex-wrap gap-2">
              <Chip active={!cuisine} onClick={() => setCuisine(null)}>
                {ui.explorer.all}
              </Chip>
              {cuisines.map((c) => (
                <Chip
                  key={c.slug}
                  active={cuisine === c.slug}
                  onClick={() =>
                    setCuisine((v) => (v === c.slug ? null : c.slug))
                  }
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <span className="eyebrow mb-2 block">{ui.explorer.level}</span>
            <div className="flex flex-wrap gap-2">
              <Chip active={!level} onClick={() => setLevel(null)}>
                {ui.explorer.any}
              </Chip>
              {levels.map((l) => (
                <Chip
                  key={l.value}
                  active={level === l.value}
                  onClick={() =>
                    setLevel((v) => (v === l.value ? null : l.value))
                  }
                >
                  {l.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-label text-muted">
            {countLabel}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="flex cursor-pointer items-center gap-1 font-mono text-xs uppercase tracking-label text-ember hover:text-ember-dark"
            >
              <Close className="h-3.5 w-3.5" />
              {ui.explorer.clear}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-label text-muted">
            {ui.explorer.sort}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sorts.map((s) => (
              <Chip
                key={s.key}
                active={sort === s.key}
                onClick={() => setSort(s.key)}
                small
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <motion.ul
          layout={!reduce}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {results.map((r, i) => (
              <motion.li
                key={r.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                transition={{
                  duration: 0.4,
                  delay: reduce ? 0 : Math.min(i * 0.03, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <RecipeCard
                  recipe={r}
                  locale={locale}
                  levels={levels}
                  ui={ui}
                  priority={i < 3}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-12 rounded-3xl border border-dashed border-line bg-surface py-20 text-center">
          <p className="font-display text-2xl text-ink">
            {ui.explorer.emptyTitle}
          </p>
          <p className="mt-2 text-muted">{ui.explorer.emptyBody}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 cursor-pointer rounded-full bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember"
          >
            {ui.explorer.reset}
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  small = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full border font-mono uppercase tracking-label transition-colors ${
        small ? 'px-3 py-1.5 text-[0.62rem]' : 'px-4 py-2 text-[0.68rem]'
      } ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-paper text-muted hover:border-ink/40 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
