import type { IngredientGroup, Step } from '@/lib/types';

export type Role = 'admin' | 'reader';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRecipe {
  id: string;
  slug: string;
  locale: string;
  cuisine: string | null;
  level: number;
  time_mins: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  image: string | null;
  title: string;
  excerpt: string | null;
  intro: string | null;
  ingredients: IngredientGroup[];
  steps: Step[];
  tags: string[];
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}
