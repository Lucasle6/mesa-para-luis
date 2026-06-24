import type { IngredientGroup, Step } from './types';

export interface CuisineText {
  name: string;
  region: string;
  tagline: string;
  description: string;
  accentDish: string;
}

export interface RecipeTextEntry {
  title: string;
  course: string;
  origin: string;
  excerpt: string;
  intro: string[];
  ingredients: IngredientGroup[];
  steps: Step[];
  tips?: string[];
  tags: string[];
}

export interface LevelText {
  label: string;
  blurb: string;
}

export interface UIDict {
  meta: {
    siteDescription: string;
  };
  nav: {
    cuisines: string;
    recipes: string;
    about: string;
    start: string;
    home: string;
    open: string;
    close: string;
    language: string;
    skip: string;
  };
  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lede: string;
    browse: string;
    cuisines: string;
    quote: string;
    stats: string;
  };
  home: {
    mapEyebrow: string;
    mapTitle: string;
    allCuisines: string;
    explore: string;
    roadEyebrow: string;
    roadTitle: string;
    roadLede: string;
    roadCta: string;
    featuredEyebrow: string;
    featuredTitle: string;
    everyRecipe: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBtn: string;
  };
  levels: Record<string, LevelText>;
  heat: Record<'Easy' | 'Medium' | 'Hard' | 'Expert', string>;
  spec: { time: string; heat: string; origin: string; course: string };
  techniqueLevel: string;
  recipe: {
    ingredients: string;
    method: string;
    gathered: string;
    done: string;
    fromPass: string;
    keepCooking: string;
    print: string;
    fewer: string;
    more: string;
    serving: string;
    servings: string;
    min: string;
    allRecipes: string;
    breadcrumb: string;
  };
  explorer: {
    searchPlaceholder: string;
    cuisine: string;
    level: string;
    any: string;
    all: string;
    sort: string;
    sortFeatured: string;
    sortQuick: string;
    sortLevelAsc: string;
    sortLevelDesc: string;
    clear: string;
    resultOne: string;
    resultMany: string;
    emptyTitle: string;
    emptyBody: string;
    reset: string;
  };
  footer: {
    tagline: string;
    cuisinesHeading: string;
    journalHeading: string;
    allRecipes: string;
    browseCuisines: string;
    about: string;
    rights: string;
    madeWith: string;
    newsletterLabel: string;
    newsletterPlaceholder: string;
    join: string;
    newsletterDone: string;
    newsletterError: string;
  };
  about: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    lede1: string;
    lede2: string;
    quote: string;
    quoteAttr: string;
    statsCuisines: string;
    statsRecipes: string;
    statsLevels: string;
    statsPans: string;
    believe: string;
    principles: { title: string; body: string }[];
    ctaTitle: string;
    ctaBtn: string;
  };
  cuisinesPage: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lede: string;
    recipesWord: string;
  };
  cuisinePage: {
    breadcrumb: string;
    tableTitle: string;
    runs: string;
    allRecipes: string;
  };
  recipesPage: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lede: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    btn: string;
  };
}

export interface Dictionary {
  ui: UIDict;
  cuisines: Record<string, CuisineText>;
  recipes: Record<string, RecipeTextEntry>;
}
