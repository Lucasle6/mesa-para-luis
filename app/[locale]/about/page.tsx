import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCuisines, getRecipes } from '@/lib/data';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=75';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: dict.ui.nav.about,
    description: dict.ui.about.lede1,
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = await getDictionary(locale);
  const a = dict.ui.about;

  const stats = [
    { n: getCuisines(dict).length, l: a.statsCuisines },
    { n: getRecipes(dict).length, l: a.statsRecipes },
    { n: 5, l: a.statsLevels },
    { n: '∞', l: a.statsPans },
  ];

  return (
    <div className="pt-32">
      <section className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-ink">
              {a.titleA} <span className="italic text-ember">{a.titleB}</span>{' '}
              {a.titleC}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {a.lede1}
            </p>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
              {a.lede2}
            </p>
          </div>

          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-line">
              <Image
                src={ABOUT_IMAGE}
                alt={a.quote}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-paper/90 px-5 py-4 backdrop-blur">
                <p className="font-display text-lg italic text-ink">
                  “{a.quote}”
                </p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-label text-muted">
                  {a.quoteAttr}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-surface px-6 py-10 text-center">
              <div className="font-display text-5xl text-ink">{s.n}</div>
              <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-label text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <span className="eyebrow">{a.believe}</span>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {a.principles.map((p, i) => (
            <Reveal as="div" key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-line bg-surface p-7">
                <span className="font-mono text-sm text-ember">0{i + 1}</span>
                <h2 className="mt-4 font-display text-2xl text-ink">{p.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-ink px-8 py-16 text-center">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.05] text-paper">
            {a.ctaTitle}
          </h2>
          <Link
            href={`/${locale}/recipes`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:bg-ember hover:text-paper"
          >
            {a.ctaBtn}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
