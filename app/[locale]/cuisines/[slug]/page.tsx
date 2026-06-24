import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  cuisineSlugs,
  getCuisine,
  getLevels,
  getRecipesByCuisine,
} from '@/lib/data';
import { getDictionary, interpolate, isLocale, locales } from '@/lib/i18n';
import { RecipeCard } from '@/components/RecipeCard';
import { Reveal, RevealGroup } from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    cuisineSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  const cuisine = getCuisine(dict, params.slug);
  if (!cuisine) return { title: 'Not found' };
  return {
    title: cuisine.name,
    description: cuisine.description,
    openGraph: {
      title: `${cuisine.name} · ${cuisine.tagline}`,
      description: cuisine.description,
      images: [cuisine.image],
    },
  };
}

export default async function CuisinePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = await getDictionary(locale);

  const cuisine = getCuisine(dict, params.slug);
  if (!cuisine) notFound();

  const recipes = getRecipesByCuisine(dict, cuisine.slug);
  const levels = getLevels(dict);
  const span = recipes.map((r) => r.level).sort((a, b) => a - b);
  const lowest = levels.find((l) => l.value === span[0]);
  const highest = levels.find((l) => l.value === span[span.length - 1]);

  return (
    <div className="pt-28">
      <section className="shell">
        <nav className="font-mono text-[0.68rem] uppercase tracking-label text-muted">
          <Link href={`/${locale}/cuisines`} className="hover:text-ink">
            {dict.ui.cuisinePage.breadcrumb}
          </Link>
          <span aria-hidden> / {cuisine.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow text-ember">{cuisine.tagline}</span>
            <h1 className="mt-3 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.94] text-ink">
              {cuisine.name}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {cuisine.description}
            </p>
            {lowest && highest && (
              <p className="mt-6 font-mono text-xs uppercase tracking-label text-muted">
                {dict.ui.cuisinePage.runs}{' '}
                <span className="text-ember">{lowest.label}</span> →{' '}
                <span className="text-ember">{highest.label}</span>
              </p>
            )}
          </div>

          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-line">
              <Image
                src={cuisine.image}
                alt={cuisine.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell mt-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
            {interpolate(dict.ui.cuisinePage.tableTitle, { name: cuisine.name })}
          </h2>
          <Link
            href={`/${locale}/recipes`}
            className="link-underline flex items-center gap-2 font-mono text-xs uppercase tracking-label text-muted hover:text-ink"
          >
            {dict.ui.cuisinePage.allRecipes}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r, i) => (
            <Reveal as="div" key={r.slug}>
              <RecipeCard
                recipe={r}
                locale={locale}
                levels={levels}
                ui={dict.ui}
                priority={i < 3}
              />
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
