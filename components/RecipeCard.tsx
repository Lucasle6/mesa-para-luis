import Image from 'next/image';
import Link from 'next/link';
import type { Level, Recipe } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { TechniqueScale } from './TechniqueScale';
import { Clock, ArrowUpRight } from './icons';

export function RecipeCard({
  recipe,
  locale,
  levels,
  ui,
  priority = false,
}: {
  recipe: Recipe;
  locale: Locale;
  levels: Level[];
  ui: UIDict;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/recipes/${recipe.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-ink/30"
    >
      {/* Fixed-ratio frame so the zoom never shifts layout */}
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-label text-ink backdrop-blur">
          {recipe.cuisineName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink">
            {recipe.title}
          </h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted">{recipe.excerpt}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <TechniqueScale value={recipe.level} levels={levels} />
          <span className="flex items-center gap-1.5 font-mono text-[0.68rem] text-muted">
            <Clock className="h-3.5 w-3.5" />
            {recipe.timeMins} {ui.recipe.min}
          </span>
        </div>
      </div>
    </Link>
  );
}
