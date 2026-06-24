import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { extra } from '@/lib/uiText';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import type { Post } from '@/lib/supabase/types';
import { ArrowRight } from '@/components/icons';

export const dynamic = 'force-dynamic';

async function getPost(slug: string): Promise<Post | null> {
  if (!supabaseConfigured) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  return (data as Post) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_image ? { images: [post.cover_image] } : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = extra(locale).blog;

  const post = await getPost(params.slug);
  // Only published posts are visible to non-admins (RLS); guard the rest.
  if (!post || !post.published) notFound();

  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="pt-32">
      <div className="shell max-w-prose">
        <Link
          href={`/${locale}/blog`}
          className="font-mono text-[0.68rem] uppercase tracking-label text-muted hover:text-ink"
        >
          ← {t.back}
        </Link>
        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-label text-muted">
          {new Date(post.created_at).toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] text-ink">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        )}
      </div>

      {post.cover_image && (
        <div className="shell mt-10">
          <div className="relative aspect-[2.2/1] overflow-hidden rounded-3xl border border-line bg-line">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="shell mt-12 max-w-prose">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={`text-lg leading-relaxed text-ink/90 ${i > 0 ? 'mt-5' : ''}`}
          >
            {para}
          </p>
        ))}

        <div className="mt-14 border-t border-line pt-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-muted hover:text-ink"
          >
            {t.back}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
