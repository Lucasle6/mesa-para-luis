'use client';

import { Printer } from './icons';

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-label text-ink transition-colors hover:border-ink/40"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
