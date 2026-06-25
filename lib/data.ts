import type { Cuisine, Level, LevelValue, Recipe, RecipeBase } from './types';
import type { Dictionary } from './dictionary';
import type { DbRecipe } from './supabase/types';

const img = (id: string, w = 1600, q = 72) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/** Order of cuisines across the site. Names/descriptions come from the dictionary. */
export const CUISINE_BASE: { slug: string; image: string }[] = [
  { slug: 'japanese', image: img('1540189549336-e6e99c3679fe') },
  { slug: 'mexican', image: img('1565958011703-44f9829ba187') },
  { slug: 'italian', image: img('1551782450-a2132b4ba21d') },
  { slug: 'indian', image: img('1432139555190-58524dae6a55') },
  { slug: 'french', image: img('1476718406336-bb5a9690ee2a') },
  { slug: 'thai', image: img('1414235077428-338989a2e8c0') },
];

export const LEVEL_VALUES: LevelValue[] = [1, 2, 3, 4, 5];

/** Language-neutral recipe facts. Translatable text lives in messages/<locale>.json */
export const RECIPE_BASE: RecipeBase[] = [
  { slug: 'yatai-yakisoba', cuisine: 'japanese', level: 1, timeMins: 25, servings: 2, difficulty: 'Easy', image: img('1569718212165-3a8278d5f624'), featured: true },
  { slug: 'silken-chawanmushi', cuisine: 'japanese', level: 4, timeMins: 45, servings: 4, difficulty: 'Hard', image: img('1585032226651-759b368d7246'), featured: true },
  { slug: 'tacos-al-pastor', cuisine: 'mexican', level: 1, timeMins: 40, servings: 4, difficulty: 'Medium', image: img('1565299624946-b28f40a0ae38'), featured: true },
  { slug: 'aguachile-verde', cuisine: 'mexican', level: 4, timeMins: 20, servings: 4, difficulty: 'Medium', image: img('1604908176997-125f25cc6f3d') },
  { slug: 'cacio-e-pepe', cuisine: 'italian', level: 2, timeMins: 20, servings: 2, difficulty: 'Medium', image: img('1473093295043-cdd812d0e601'), featured: true },
  { slug: 'risotto-al-limone', cuisine: 'italian', level: 4, timeMins: 40, servings: 4, difficulty: 'Hard', image: img('1606787366850-de6330128bfc') },
  { slug: 'pani-puri', cuisine: 'indian', level: 1, timeMins: 35, servings: 4, difficulty: 'Medium', image: img('1567620905732-2d1ec7ab7445') },
  { slug: 'murgh-makhani', cuisine: 'indian', level: 3, timeMins: 60, servings: 4, difficulty: 'Medium', image: img('1551183053-bf91a1d81141'), featured: true },
  { slug: 'steak-frites', cuisine: 'french', level: 3, timeMins: 50, servings: 2, difficulty: 'Medium', image: img('1555939594-58d7cb561ad1') },
  { slug: 'souffle-au-fromage', cuisine: 'french', level: 5, timeMins: 55, servings: 4, difficulty: 'Expert', image: img('1559847844-5315695dadae') },
  { slug: 'pad-kra-pao', cuisine: 'thai', level: 1, timeMins: 15, servings: 2, difficulty: 'Easy', image: img('1455619452474-d2be8b1e70cd'), featured: true },
  { slug: 'massaman-curry', cuisine: 'thai', level: 3, timeMins: 90, servings: 4, difficulty: 'Medium', image: img('1512621776951-a57141f2eefd') },
];

/* --------- structural lookups (locale-independent, for static params) ----- */

export const recipeSlugs = () => RECIPE_BASE.map((r) => r.slug);
export const cuisineSlugs = () => CUISINE_BASE.map((c) => c.slug);
export const recipeBaseBySlug = (slug: string) =>
  RECIPE_BASE.find((r) => r.slug === slug);

/* ----------------------- localized builders ------------------------------- */

export function getLevels(dict: Dictionary): Level[] {
  return LEVEL_VALUES.map((value) => ({
    value,
    label: dict.ui.levels[String(value)]?.label ?? `Level ${value}`,
    blurb: dict.ui.levels[String(value)]?.blurb ?? '',
  }));
}

export function getCuisines(dict: Dictionary): Cuisine[] {
  return CUISINE_BASE.map((base) => {
    const t = dict.cuisines[base.slug];
    return {
      slug: base.slug,
      image: base.image,
      name: t?.name ?? base.slug,
      region: t?.region ?? '',
      tagline: t?.tagline ?? '',
      description: t?.description ?? '',
      accentDish: t?.accentDish ?? '',
    };
  });
}

export function getCuisine(dict: Dictionary, slug: string): Cuisine | undefined {
  return getCuisines(dict).find((c) => c.slug === slug);
}

function buildRecipe(dict: Dictionary, base: RecipeBase): Recipe | null {
  const t = dict.recipes[base.slug];
  if (!t) return null;
  return {
    ...base,
    ...t,
    cuisineName: dict.cuisines[base.cuisine]?.name ?? base.cuisine,
  };
}

export function getRecipes(dict: Dictionary): Recipe[] {
  return RECIPE_BASE.map((b) => buildRecipe(dict, b)).filter(
    (r): r is Recipe => r !== null,
  );
}

export function getRecipe(dict: Dictionary, slug: string): Recipe | undefined {
  const base = recipeBaseBySlug(slug);
  if (!base) return undefined;
  return buildRecipe(dict, base) ?? undefined;
}

export function getRecipesByCuisine(
  dict: Dictionary,
  cuisineSlug: string,
): Recipe[] {
  return getRecipes(dict).filter((r) => r.cuisine === cuisineSlug);
}

export function getFeatured(dict: Dictionary): Recipe[] {
  return getRecipes(dict).filter((r) => r.featured);
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=72';

/** Map a database recipe into the shape the public recipe pages render. */
export function dbToRecipe(dict: Dictionary, r: DbRecipe): Recipe {
  const cuisineName = dict.cuisines[r.cuisine ?? '']?.name ?? r.cuisine ?? '';
  const region = dict.cuisines[r.cuisine ?? '']?.region ?? '';
  const intro = r.intro
    ? r.intro.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];
  return {
    slug: r.slug,
    cuisine: r.cuisine ?? '',
    level: (Math.min(5, Math.max(1, r.level)) as LevelValue),
    timeMins: r.time_mins,
    servings: r.servings,
    difficulty: r.difficulty,
    image: r.image || FALLBACK_IMAGE,
    title: r.title,
    course: cuisineName,
    origin: region,
    excerpt: r.excerpt ?? '',
    intro: intro.length ? intro : r.excerpt ? [r.excerpt] : [],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    steps: Array.isArray(r.steps) ? r.steps : [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    cuisineName,
  };
}

export function getRelated(
  dict: Dictionary,
  recipe: Recipe,
  count = 3,
): Recipe[] {
  const all = getRecipes(dict);
  const sameCuisine = all.filter(
    (r) => r.slug !== recipe.slug && r.cuisine === recipe.cuisine,
  );
  const others = all.filter(
    (r) => r.slug !== recipe.slug && r.cuisine !== recipe.cuisine,
  );
  return [...sameCuisine, ...others].slice(0, count);
}
