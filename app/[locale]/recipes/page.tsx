import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dbToRecipe, getCuisines, getLevels, getRecipes } from '@/lib/data';
import { getDictionary, isLocale } from '@/lib/i18n';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import type { DbRecipe } from '@/lib/supabase/types';
import type { Recipe } from '@/lib/types';
import { RecipeExplorer } from '@/components/RecipeExplorer';

export const dynamic = 'force-dynamic';

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

  // Database recipes (admin-created, published) first, then the built-in ones.
  let dbRecipes: Recipe[] = [];
  if (supabaseConfigured) {
    const supabase = createClient();
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .eq('published', true)
      .eq('locale', locale)
      .order('created_at', { ascending: false });
    dbRecipes = ((data as DbRecipe[]) ?? []).map((r) => dbToRecipe(dict, r));
  }
  const recipes = [...dbRecipes, ...getRecipes(dict)];

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
