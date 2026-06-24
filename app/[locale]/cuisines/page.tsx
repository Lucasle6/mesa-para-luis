import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCuisines, getRecipesByCuisine } from '@/lib/data';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { Reveal, RevealGroup } from '@/components/Reveal';
import { ArrowUpRight } from '@/components/icons';
import { notFound } from 'next/navigation';

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
    title: dict.ui.nav.cuisines,
    description: dict.ui.cuisinesPage.lede,
  };
}

export default async function CuisinesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = await getDictionary(locale);
  const cuisines = getCuisines(dict);

  return (
    <div className="shell pt-32">
      <header className="max-w-3xl">
        <span className="eyebrow">{dict.ui.cuisinesPage.eyebrow}</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] text-ink">
          {dict.ui.cuisinesPage.titleA}{' '}
          <span className="italic text-ember">
            {dict.ui.cuisinesPage.titleB}
          </span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {dict.ui.cuisinesPage.lede}
        </p>
      </header>

      <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2">
        {cuisines.map((c, i) => {
          const count = getRecipesByCuisine(dict, c.slug).length;
          return (
            <Reveal as="div" key={c.slug}>
              <Link
                href={`/${locale}/cuisines/${c.slug}`}
                className="group relative flex aspect-[16/11] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-line bg-line p-7"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i < 2}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] uppercase tracking-label text-paper/70">
                      {c.region} · {count} {dict.ui.cuisinesPage.recipesWord}
                    </span>
                    <ArrowUpRight className="h-6 w-6 text-paper transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <h2 className="mt-2 font-display text-4xl text-paper">
                    {c.name}
                  </h2>
                  <p className="mt-1 font-display text-lg italic text-paper/80">
                    {c.tagline}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </RevealGroup>
    </div>
  );
}
