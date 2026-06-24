'use client';

import { useState } from 'react';
import type { Step } from '@/lib/types';
import { interpolate } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { Clock } from './icons';

export function Steps({ steps, ui }: { steps: Step[]; ui: UIDict }) {
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">{ui.recipe.method}</h2>
        <span className="font-mono text-[0.68rem] uppercase tracking-label text-muted">
          {interpolate(ui.recipe.done, { done: done.size, total: steps.length })}
        </span>
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => {
          const isDone = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer gap-5 rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:border-ink/30"
                aria-pressed={isDone}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm transition-colors ${
                    isDone ? 'bg-ember text-paper' : 'bg-ink text-paper'
                  }`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  {step.title && (
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className={`font-display text-lg leading-tight transition-colors ${
                          isDone ? 'text-muted line-through' : 'text-ink'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.minutes && (
                        <span className="flex items-center gap-1 rounded-full bg-paper px-2.5 py-0.5 font-mono text-[0.62rem] text-muted">
                          <Clock className="h-3 w-3" />~{step.minutes} {ui.recipe.min}
                        </span>
                      )}
                    </div>
                  )}
                  <p
                    className={`mt-1.5 text-[0.95rem] leading-relaxed transition-colors ${
                      isDone ? 'text-muted/70' : 'text-muted'
                    }`}
                  >
                    {step.body}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
