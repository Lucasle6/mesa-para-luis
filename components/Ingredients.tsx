'use client';

import { useMemo, useState } from 'react';
import type { Recipe } from '@/lib/types';
import { interpolate } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { Minus, Plus } from './icons';

const FRACTIONS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '0.33': '⅓',
  '0.67': '⅔',
};

function formatQty(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const whole = Math.floor(rounded);
  const frac = Math.round((rounded - whole) * 100) / 100;
  const fracSymbol = FRACTIONS[frac.toString()];

  if (fracSymbol) {
    return whole > 0 ? `${whole}${fracSymbol}` : fracSymbol;
  }
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}

export function Ingredients({ recipe, ui }: { recipe: Recipe; ui: UIDict }) {
  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const factor = servings / recipe.servings;

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const totalItems = useMemo(
    () => recipe.ingredients.reduce((n, g) => n + g.items.length, 0),
    [recipe],
  );

  const servingWord = servings === 1 ? ui.recipe.serving : ui.recipe.servings;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">{ui.recipe.ingredients}</h2>
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            disabled={servings <= 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={ui.recipe.fewer}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[6rem] text-center font-mono text-xs uppercase tracking-label text-ink">
            {servings} {servingWord}
          </span>
          <button
            type="button"
            onClick={() => setServings((s) => Math.min(20, s + 1))}
            disabled={servings >= 20}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={ui.recipe.more}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-label text-muted">
        {interpolate(ui.recipe.gathered, {
          checked: checked.size,
          total: totalItems,
        })}
      </p>

      <div className="mt-6 space-y-7">
        {recipe.ingredients.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <h3 className="eyebrow mb-3 text-ember">{group.title}</h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item, ii) => {
                const key = `${gi}-${ii}`;
                const isChecked = checked.has(key);
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-baseline gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                        className="peer sr-only"
                      />
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-surface transition-colors peer-checked:border-ember peer-checked:bg-ember"
                        aria-hidden
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className={`h-3.5 w-3.5 text-paper transition-opacity ${
                            isChecked ? 'opacity-100' : 'opacity-0'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 12.5 9 17.5 20 6.5" />
                        </svg>
                      </span>
                      <span
                        className={`text-[0.95rem] leading-snug transition-colors ${
                          isChecked ? 'text-muted line-through' : 'text-ink'
                        }`}
                      >
                        {item.qty !== undefined && (
                          <span className="font-mono text-sm text-ember">
                            {formatQty(item.qty * factor)}
                            {item.unit ? ` ${item.unit}` : ''}{' '}
                          </span>
                        )}
                        {item.name}
                        {item.note && (
                          <span className="text-muted">, {item.note}</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
