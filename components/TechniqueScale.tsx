import type { Level, LevelValue } from '@/lib/types';

interface Props {
  value: LevelValue;
  levels: Level[];
  /** 'bar' = compact 5-segment meter, 'full' = labelled scale. */
  variant?: 'bar' | 'full';
  /** Heading for the full variant, e.g. "Technique level" (localized). */
  title?: string;
  className?: string;
}

/**
 * The journal's signature device. Every recipe sits somewhere on one road —
 * from the street to the pass — and this meter says where, using real
 * technique level rather than decoration.
 */
export function TechniqueScale({
  value,
  levels,
  variant = 'bar',
  title = 'Technique level',
  className = '',
}: Props) {
  const current = levels.find((l) => l.value === value) ?? levels[0];

  if (variant === 'bar') {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        role="img"
        aria-label={`${title}: ${value}/5 ${current.label}`}
      >
        <div className="flex items-end gap-[3px]" aria-hidden>
          {levels.map((l) => (
            <span
              key={l.value}
              className={`w-[6px] rounded-full transition-colors ${
                l.value <= value ? 'bg-ember' : 'bg-line'
              }`}
              style={{ height: `${6 + l.value * 3}px` }}
            />
          ))}
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-label text-muted">
          {current.label}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow">{title}</span>
        <span className="font-mono text-xs text-ember">
          {value}/5 · {current.label}
        </span>
      </div>
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`${title}: ${value}/5 ${current.label}`}
      >
        {levels.map((l) => (
          <div key={l.value} className="flex-1" aria-hidden>
            <div
              className={`h-1.5 w-full rounded-full transition-colors ${
                l.value <= value ? 'bg-ember' : 'bg-line'
              }`}
            />
            <div
              className={`mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${
                l.value === value ? 'text-ink' : 'text-muted/70'
              }`}
            >
              {l.label}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 max-w-prose text-sm text-muted">{current.blurb}.</p>
    </div>
  );
}
