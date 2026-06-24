import { Sparkle } from './icons';

/** CSS-only ticker. The reduced-motion media query in globals.css freezes it. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div
      className="relative flex overflow-hidden border-y border-line bg-surface py-4"
      aria-hidden
    >
      <div className="flex shrink-0 animate-ticker items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg italic text-ink">{item}</span>
            <Sparkle className="h-4 w-4 text-ember" />
          </span>
        ))}
      </div>
    </div>
  );
}
