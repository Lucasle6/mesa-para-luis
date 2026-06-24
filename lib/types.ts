export type LevelValue = 1 | 2 | 3 | 4 | 5;

export interface Level {
  value: LevelValue;
  label: string;
  blurb: string;
}

export interface Cuisine {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  accentDish: string;
}

export interface Ingredient {
  /** Numeric quantity for the base serving count. Omit for "to taste" items. */
  qty?: number;
  unit?: string;
  name: string;
  note?: string;
}

export interface IngredientGroup {
  title?: string;
  items: Ingredient[];
}

export interface Step {
  title?: string;
  body: string;
  /** Optional active-time in minutes, surfaced as an inline timer hint. */
  minutes?: number;
}

/** Language-neutral facts about a recipe — shared across every locale. */
export interface RecipeBase {
  slug: string;
  cuisine: string; // cuisine slug
  level: LevelValue;
  timeMins: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  image: string;
  featured?: boolean;
}

/** The translatable half of a recipe, stored per-locale in messages/<locale>.json */
export interface RecipeText {
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

/** A fully localized recipe: structural base + translated text. */
export interface Recipe extends RecipeBase, RecipeText {
  cuisineName: string;
}
