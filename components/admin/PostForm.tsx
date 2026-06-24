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

export function PostForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [postLocale, setPostLocale] = useState<Locale>(locale);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('posts').insert({
      slug: slug || slugify(title),
      locale: postLocale,
      title,
      excerpt,
      body,
      cover_image: cover,
      published,
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
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Idioma</label>
          <select
            value={postLocale}
            onChange={(e) => setPostLocale(e.target.value as Locale)}
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
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          className={`${field} font-mono text-sm`}
        />
      </div>

      <div>
        <label className={label}>Extracto</label>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={field}
          placeholder="Una o dos frases que resuman la entrada"
        />
      </div>

      <div>
        <label className={label}>Contenido</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className={`${field} leading-relaxed`}
          placeholder="Escribe la entrada. Separa los párrafos con una línea en blanco."
        />
      </div>

      <div>
        <label className={label}>Imagen de portada</label>
        <ImageUpload value={cover} onChange={setCover} />
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-[#BF3B2B]"
        />
        <span className="text-sm text-ink">Publicar (visible para todos)</span>
      </label>

      {error && <p className="text-sm text-ember">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember disabled:opacity-50"
        >
          {busy ? 'Guardando…' : 'Guardar entrada'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin`)}
          className="cursor-pointer rounded-full border border-line bg-surface px-6 py-3 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:border-ink/40"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
