import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { extra } from '@/lib/uiText';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import type { Post } from '@/lib/supabase/types';
import { ArrowUpRight } from '@/components/icons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = extra(params.locale).blog;
  return { title: t.title, description: t.lede };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = extra(locale).blog;

  let posts: Post[] = [];
  if (supabaseConfigured) {
    const supabase = createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .eq('locale', locale)
      .order('created_at', { ascending: false });
    posts = (data as Post[]) ?? [];
  }

  return (
    <div className="shell pt-32">
      <header className="max-w-3xl">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-ink">
          {t.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{t.lede}</p>
      </header>

      {posts.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-line bg-surface py-20 text-center">
          <p className="font-display text-2xl text-ink">{t.empty}</p>
        </div>
      ) : (
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-line">
                {post.cover_image && (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-label text-muted">
                  {new Date(post.created_at).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="mt-2 font-display text-xl leading-snug text-ink">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[0.68rem] uppercase tracking-label text-ember">
                  {t.readMore}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
