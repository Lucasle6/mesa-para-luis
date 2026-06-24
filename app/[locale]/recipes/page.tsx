import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCuisines, getLevels, getRecipes } from '@/lib/data';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { RecipeExplorer } from '@/components/RecipeExplorer';

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
    title: dict.ui.nav.recipes,
    description: dict.ui.recipesPage.lede,
  };
}

export default async function RecipesPage({
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

  return (
    <div className="shell pt-32">
      <header className="max-w-3xl">
        <span className="eyebrow">{dict.ui.recipesPage.eyebrow}</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-ink">
          {dict.ui.recipesPage.titleA}{' '}
          <span className="italic text-ember">{dict.ui.recipesPage.titleB}</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {dict.ui.recipesPage.lede}
        </p>
      </header>

      <div className="mt-12">
        <RecipeExplorer
          recipes={recipes}
          cuisines={cuisines}
          levels={levels}
          locale={locale}
          ui={dict.ui}
        />
      </div>
    </div>
  );
}
