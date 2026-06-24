import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCuisine,
  getLevels,
  getRecipe,
  getRelated,
  recipeSlugs,
} from '@/lib/data';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { SpecStrip } from '@/components/SpecStrip';
import { TechniqueScale } from '@/components/TechniqueScale';
import { Ingredients } from '@/components/Ingredients';
import { Steps } from '@/components/Steps';
import { PrintButton } from '@/components/PrintButton';
import { RecipeCard } from '@/components/RecipeCard';
import { Reveal } from '@/components/Reveal';
import { ArrowRight, Knife, Sparkle } from '@/components/icons';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    recipeSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  const recipe = getRecipe(dict, params.slug);
  if (!recipe) return { title: 'Not found' };
  return {
    title: recipe.title,
    description: recipe.excerpt,
    openGraph: {
      title: recipe.title,
      description: recipe.excerpt,
      images: [recipe.image],
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = await getDictionary(locale);

  const recipe = getRecipe(dict, params.slug);
  if (!recipe) notFound();

  const cuisine = getCuisine(dict, recipe.cuisine);
  const levels = getLevels(dict);
  const related = getRelated(dict, recipe);

  return (
    <article className="pt-28">
      <div className="shell">
        <nav className="no-print flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-label text-muted">
          <Link href={`/${locale}/recipes`} className="hover:text-ink">
            {dict.ui.recipe.breadcrumb}
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/${locale}/cuisines/${recipe.cuisine}`}
            className="hover:text-ink"
          >
            {cuisine?.name}
          </Link>
        </nav>

        <header className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="eyebrow text-ember">{recipe.course}</span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.96] text-ink">
              {recipe.title}
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
              {recipe.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <PrintButton label={dict.ui.recipe.print} />
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.62rem] uppercase tracking-label text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-6">
            <TechniqueScale
              value={recipe.level}
              levels={levels}
              variant="full"
              title={dict.ui.techniqueLevel}
            />
          </div>
        </header>

        <Reveal className="mt-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-line sm:aspect-[2.2/1]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-6">
          <SpecStrip recipe={recipe} ui={dict.ui} />
        </div>

        <div className="mt-14 max-w-prose">
          {recipe.intro.map((para, i) => (
            <p
              key={i}
              className={`text-lg leading-relaxed text-ink/90 ${
                i === 0
                  ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-ember'
                  : 'mt-5'
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="shell mt-16">
        <div className="print-full grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-7">
              <Ingredients recipe={recipe} ui={dict.ui} />
            </div>
          </aside>

          <div>
            <Steps steps={recipe.steps} ui={dict.ui} />

            {recipe.tips && recipe.tips.length > 0 && (
              <div className="mt-10 rounded-3xl border border-ember/30 bg-ember/[0.04] p-6 sm:p-7">
                <h2 className="flex items-center gap-2 font-display text-xl text-ink">
                  <Knife className="h-5 w-5 text-ember" />
                  {dict.ui.recipe.fromPass}
                </h2>
                <ul className="mt-4 space-y-3">
                  {recipe.tips.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-[0.95rem] text-ink/90">
                      <Sparkle className="mt-1 h-4 w-4 shrink-0 text-ember" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="no-print shell mt-24">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
            {dict.ui.recipe.keepCooking}
          </h2>
          <Link
            href={`/${locale}/recipes`}
            className="link-underline flex items-center gap-2 font-mono text-xs uppercase tracking-label text-muted hover:text-ink"
          >
            {dict.ui.recipe.allRecipes}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <RecipeCard
              key={r.slug}
              recipe={r}
              locale={locale}
              levels={levels}
              ui={dict.ui}
            />
          ))}
        </div>
      </section>
    </article>
  );
}
