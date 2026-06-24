'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from './icons';

export interface NewsletterLabels {
  label: string;
  placeholder: string;
  join: string;
  done: string;
  error: string;
}

export function Newsletter({ labels }: { labels: NewsletterLabels }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError(labels.error);
      return;
    }
    setError('');
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-ember/40 bg-ember/5 px-5 py-3 text-sm text-ink">
        <Check className="h-5 w-5 shrink-0 text-ember" />
        {labels.done}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="eyebrow mb-2 block">
        {labels.label}
      </label>
      <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 focus-within:border-ink/40">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={labels.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-muted/70"
          aria-describedby={error ? 'newsletter-error' : undefined}
          aria-invalid={!!error}
        />
        <button
          type="submit"
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-[0.7rem] uppercase tracking-label text-paper transition-colors hover:bg-ember"
        >
          {labels.join}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </form>
  );
}
