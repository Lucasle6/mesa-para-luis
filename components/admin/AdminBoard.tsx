'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface Item {
  id: string;
  slug: string;
  title: string;
  locale: string;
  published: boolean;
}

type Kind = 'posts' | 'recipes';

function List({
  kind,
  items,
  locale,
  viewBase,
}: {
  kind: Kind;
  items: Item[];
  locale: Locale;
  viewBase: string;
}) {
  const [rows, setRows] = useState(items);
  const [busy, setBusy] = useState<string | null>(null);

  async function togglePublish(item: Item) {
    setBusy(item.id);
    const supabase = createClient();
    const { error } = await supabase
      .from(kind)
      .update({ published: !item.published })
      .eq('id', item.id);
    setBusy(null);
    if (!error) {
      setRows((r) =>
        r.map((x) => (x.id === item.id ? { ...x, published: !x.published } : x)),
      );
    }
  }

  async function remove(item: Item) {
    if (!confirm(`¿Eliminar "${item.title}"? No se puede deshacer.`)) return;
    setBusy(item.id);
    const supabase = createClient();
    const { error } = await supabase.from(kind).delete().eq('id', item.id);
    setBusy(null);
    if (!error) setRows((r) => r.filter((x) => x.id !== item.id));
  }

  if (rows.length === 0) {
    return <p className="text-sm text-muted">Todavía no hay nada aquí.</p>;
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {rows.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-label ${
              item.published ? 'bg-ember/10 text-ember' : 'bg-line text-muted'
            }`}
          >
            {item.published ? 'Publicado' : 'Borrador'}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-label text-muted">
            {item.locale}
          </span>
          <span className="min-w-0 flex-1 truncate font-display text-lg text-ink">
            {item.title}
          </span>
          <div className="flex items-center gap-3">
            {item.published && (
              <Link
                href={`/${locale}/${viewBase}/${item.slug}`}
                className="font-mono text-[0.65rem] uppercase tracking-label text-muted hover:text-ink"
              >
                Ver
              </Link>
            )}
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => togglePublish(item)}
              className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-label text-muted hover:text-ink disabled:opacity-40"
            >
              {item.published ? 'Ocultar' : 'Publicar'}
            </button>
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => remove(item)}
              className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-label text-ember hover:text-ember-dark disabled:opacity-40"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AdminBoard({
  posts,
  recipes,
  locale,
}: {
  posts: Item[];
  recipes: Item[];
  locale: Locale;
}) {
  return (
    <div className="mt-12 space-y-12">
      <section>
        <h2 className="mb-4 font-display text-2xl text-ink">Recetas</h2>
        <List kind="recipes" items={recipes} locale={locale} viewBase="recipes" />
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl text-ink">Entradas de blog</h2>
        <List kind="posts" items={posts} locale={locale} viewBase="blog" />
      </section>
    </div>
  );
}
