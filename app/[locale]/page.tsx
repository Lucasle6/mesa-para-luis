import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCuisines,
  getFeatured,
  getLevels,
  getRecipes,
  getRecipesByCuisine,
} from '@/lib/data';
import { getDictionary, interpolate, isLocale } from '@/lib/i18n';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { CuisineTabs } from '@/components/CuisineTabs';
import { RecipeCard } from '@/components/RecipeCard';
import { Reveal, RevealGroup } from '@/components/Reveal';
import { ArrowRight } from '@/components/icons';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=75';

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = await getDictionary(locale);

  const cuisines = getCuisines(dict);
  const levels = getLevels(dict);
  const recipes = getRecipes(dict);
  const featured = getFeatured(dict);

  const recipeMap = Object.fromEntries(
    cuisines.map((c) => [c.slug, getRecipesByCuisine(dict, c.slug)]),
  );

  const tickerItems = cuisines.flatMap((c) => [c.name, c.accentDish]);
  const stats = interpolate(dict.ui.hero.stats, {
    c: cuisines.length,
    r: recipes.length,
  });

  return (
    <>
      <Hero image={HERO_IMAGE} locale={locale} ui={dict.ui} stats={stats} />

      <div className="mt-20">
        <Marquee items={tickerItems} />
      </div>

      {/* Explore by cuisine */}
      <section className="shell pt-24" aria-labelledby="cuisines-heading">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">{dict.ui.home.mapEyebrow}</span>
              <h2
                id="cuisines-heading"
                className="mt-3 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] text-ink"
              >
                {dict.ui.home.mapTitle}
              </h2>
            </div>
            <Link
              href={`/${locale}/cuisines`}
              className="link-underline hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-label text-muted hover:text-ink sm:flex"
            >
              {dict.ui.home.allCuisines}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12">
          <CuisineTabs
            cuisines={cuisines}
            recipesByCuisine={recipeMap}
            locale={locale}
            levels={levels}
            ui={dict.ui}
          />
        </div>
      </section>

      {/* The road from street to pass — the signature concept */}
      <section className="shell pt-28" aria-labelledby="road-heading">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">{dict.ui.home.roadEyebrow}</span>
            <h2
              id="road-heading"
              className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] text-ink"
            >
              {dict.ui.home.roadTitle}
            </h2>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
              {dict.ui.home.roadLede}
            </p>
            <Link
              href={`/${locale}/recipes`}
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember"
            >
              {dict.ui.home.roadCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <RevealGroup className="grid gap-3 sm:grid-cols-5">
            {levels.map((l) => (
              <Reveal
                key={l.value}
                as="div"
                className="flex flex-col rounded-2xl border border-line bg-surface p-5"
              >
                <span className="font-mono text-xs text-ember">0{l.value}</span>
                <div
                  className="mt-3 h-1.5 w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #BF3B2B ${
                      l.value * 20
                    }%, #E3DDD2 ${l.value * 20}%)`,
                  }}
                />
                <h3 className="mt-4 font-display text-xl text-ink">{l.label}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{l.blurb}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Featured */}
      <section className="shell pt-28" aria-labelledby="featured-heading">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">{dict.ui.home.featuredEyebrow}</span>
              <h2
                id="featured-heading"
                className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] text-ink"
              >
                {dict.ui.home.featuredTitle}
              </h2>
            </div>
            <Link
              href={`/${locale}/recipes`}
              className="link-underline hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-label text-muted hover:text-ink sm:flex"
            >
              {dict.ui.home.everyRecipe}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r, i) => (
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

      {/* Closing band */}
      <section className="shell pt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16 sm:py-24">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ember/20 blur-3xl"
              aria-hidden
            />
            <p className="eyebrow mx-auto text-paper/60">
              {dict.ui.home.ctaEyebrow}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.03] text-paper">
              {dict.ui.home.ctaTitle}
            </h2>
            <Link
              href={`/${locale}/recipes`}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:bg-ember hover:text-paper"
            >
              {dict.ui.home.ctaBtn}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
