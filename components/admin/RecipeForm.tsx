'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { locales, type Locale } from '@/lib/i18n';
import { slugify } from '@/lib/slug';
import { ImageUpload } from './ImageUpload';

const field =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-ink/40';
const label = 'eyebrow mb-1.5 block';

const CUISINES: [string, string][] = [
  ['japanese', 'Japonesa'],
  ['mexican', 'Mexicana'],
  ['italian', 'Italiana'],
  ['indian', 'India'],
  ['french', 'Francesa'],
  ['thai', 'Tailandesa'],
];
const LEVELS: [number, string][] = [
  [1, 'Calle'],
  [2, 'Casa'],
  [3, 'Bistró'],
  [4, 'Refinada'],
  [5, 'Pase'],
];
const DIFFICULTIES: [string, string][] = [
  ['Easy', 'Fácil'],
  ['Medium', 'Media'],
  ['Hard', 'Difícil'],
  ['Expert', 'Experta'],
];

export function RecipeForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [f, setF] = useState({
    title: '',
    slug: '',
    recLocale: locale as Locale,
    cuisine: 'japanese',
    level: 2,
    time_mins: 30,
    servings: 2,
    difficulty: 'Medium',
    excerpt: '',
    intro: '',
    ingredients: '',
    steps: '',
    tags: '',
    published: true,
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const ingredients = f.ingredients
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
    const steps = f.steps
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((body) => ({ body }));
    const tags = f.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('recipes').insert({
      slug: f.slug || slugify(f.title),
      locale: f.recLocale,
      cuisine: f.cuisine,
      level: f.level,
      time_mins: f.time_mins,
      servings: f.servings,
      difficulty: f.difficulty,
      image,
      title: f.title,
      excerpt: f.excerpt,
      intro: f.intro,
      ingredients: ingredients.length ? [{ items: ingredients }] : [],
      steps,
      tags,
      published: f.published,
      author_id: auth.user?.id ?? null,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <label className={label}>Título</label>
          <input
            required
            value={f.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!slugTouched) set('slug', slugify(e.target.value));
            }}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Idioma</label>
          <select
            value={f.recLocale}
            onChange={(e) => set('recLocale', e.target.value as Locale)}
            className={`${field} cursor-pointer`}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Slug (URL)</label>
        <input
          value={f.slug}
          onChange={(e) => {
            set('slug', slugify(e.target.value));
            setSlugTouched(true);
          }}
          className={`${field} font-mono text-sm`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={label}>Cocina</label>
          <select value={f.cuisine} onChange={(e) => set('cuisine', e.target.value)} className={`${field} cursor-pointer`}>
            {CUISINES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Nivel de técnica</label>
          <select value={f.level} onChange={(e) => set('level', Number(e.target.value))} className={`${field} cursor-pointer`}>
            {LEVELS.map(([v, l]) => (
              <option key={v} value={v}>{v} · {l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Dificultad</label>
          <select value={f.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={`${field} cursor-pointer`}>
            {DIFFICULTIES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Min</label>
            <input type="number" min={1} value={f.time_mins} onChange={(e) => set('time_mins', Number(e.target.value))} className={field} />
          </div>
          <div>
            <label className={label}>Raciones</label>
            <input type="number" min={1} value={f.servings} onChange={(e) => set('servings', Number(e.target.value))} className={field} />
          </div>
        </div>
      </div>

      <div>
        <label className={label}>Extracto</label>
        <input value={f.excerpt} onChange={(e) => set('excerpt', e.target.value)} className={field} placeholder="Frase corta que describa el plato" />
      </div>

      <div>
        <label className={label}>Introducción</label>
        <textarea value={f.intro} onChange={(e) => set('intro', e.target.value)} rows={4} className={`${field} leading-relaxed`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={label}>Ingredientes (uno por línea)</label>
          <textarea required value={f.ingredients} onChange={(e) => set('ingredients', e.target.value)} rows={8} className={`${field} leading-relaxed`} placeholder={'200 g harina\n3 huevos\nSal, al gusto'} />
        </div>
        <div>
          <label className={label}>Pasos (uno por línea)</label>
          <textarea required value={f.steps} onChange={(e) => set('steps', e.target.value)} rows={8} className={`${field} leading-relaxed`} placeholder={'Mezcla los secos.\nAñade los huevos.\nHornea 20 min.'} />
        </div>
      </div>

      <div>
        <label className={label}>Etiquetas (separadas por comas)</label>
        <input value={f.tags} onChange={(e) => set('tags', e.target.value)} className={field} placeholder="rápido, vegetariano, horno" />
      </div>

      <div>
        <label className={label}>Imagen</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={f.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-[#BF3B2B]" />
        <span className="text-sm text-ink">Publicar (visible para todos)</span>
      </label>

      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="cursor-pointer rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember disabled:opacity-50">
          {busy ? 'Guardando…' : 'Guardar receta'}
        </button>
        <button type="button" onClick={() => router.push(`/${locale}/admin`)} className="cursor-pointer rounded-full border border-line bg-surface px-6 py-3 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:border-ink/40">
          Cancelar
        </button>
      </div>
    </form>
  );
}
