'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, supabaseConfigured } from '@/lib/supabase/client';
import { extra } from '@/lib/uiText';
import type { Locale } from '@/lib/i18n';
import { ArrowRight } from './icons';

export function AuthForm({ locale }: { locale: Locale }) {
  const t = extra(locale).auth;
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!supabaseConfigured) {
      setError('Supabase no está configurado.');
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(t.errInvalid);
        } else {
          router.push(`/${locale}`);
          router.refresh();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
        } else if (data.session) {
          // Email confirmation disabled → signed in immediately.
          router.push(`/${locale}`);
          router.refresh();
        } else {
          setNotice(t.checkEmail);
          setMode('signin');
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <span className="eyebrow">{mode === 'signin' ? t.signInTitle : t.signUpTitle}</span>
      <h1 className="mt-3 font-display text-4xl text-ink">
        {mode === 'signin' ? t.signInTitle : t.signUpTitle}
      </h1>
      <p className="mt-3 text-muted">
        {mode === 'signin' ? t.signInLede : t.signUpLede}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="eyebrow mb-1.5 block">
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-ink/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="eyebrow mb-1.5 block">
            {t.password}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-ink/40"
          />
          {mode === 'signup' && (
            <p className="mt-1.5 text-xs text-muted">{t.passwordHint}</p>
          )}
        </div>

        {error && <p className="text-sm text-ember">{error}</p>}
        {notice && <p className="text-sm text-ink">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember disabled:opacity-50"
        >
          {busy ? t.working : mode === 'signin' ? t.signInBtn : t.signUpBtn}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setError('');
          setNotice('');
        }}
        className="mt-6 w-full cursor-pointer text-center font-mono text-xs uppercase tracking-label text-muted hover:text-ink"
      >
        {mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}
      </button>

      {mode === 'signup' && (
        <p className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 text-center text-xs text-muted">
          {t.readerNote}
        </p>
      )}
    </div>
  );
}
