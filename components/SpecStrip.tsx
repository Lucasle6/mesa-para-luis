import { Clock, Flame, Pin, Plate } from './icons';
import type { Recipe } from '@/lib/types';
import type { UIDict } from '@/lib/dictionary';

/**
 * The "kitchen ticket" — a monospaced spec sheet that encodes the four facts a
 * cook actually wants before committing: time, demand, origin, course.
 */
export function SpecStrip({
  recipe,
  ui,
  className = '',
}: {
  recipe: Recipe;
  ui: UIDict;
  className?: string;
}) {
  const items = [
    { Icon: Clock, label: ui.spec.time, value: `${recipe.timeMins} ${ui.recipe.min}` },
    { Icon: Flame, label: ui.spec.heat, value: ui.heat[recipe.difficulty] },
    { Icon: Pin, label: ui.spec.origin, value: recipe.origin },
    { Icon: Plate, label: ui.spec.course, value: recipe.course },
  ];

  return (
    <dl
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 ${className}`}
    >
      {items.map(({ Icon, label, value }) => (
        <div key={label} className="bg-surface px-4 py-3.5">
          <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-label text-muted">
            <Icon className="h-3.5 w-3.5 text-ember" />
            {label}
          </dt>
          <dd className="mt-1.5 font-display text-base leading-tight text-ink">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
