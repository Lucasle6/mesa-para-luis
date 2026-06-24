import Link from 'next/link';
import { BRAND, type Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import type { Cuisine } from '@/lib/types';
import { Newsletter } from './Newsletter';

export function Footer({
  locale,
  ui,
  cuisines,
}: {
  locale: Locale;
  ui: UIDict;
  cuisines: Cuisine[];
}) {
  const year = new Date().getFullYear();

  const journalLinks = [
    { href: `/${locale}/recipes`, label: ui.footer.allRecipes },
    { href: `/${locale}/cuisines`, label: ui.footer.browseCuisines },
    { href: `/${locale}/about`, label: ui.footer.about },
  ];

  return (
    <footer className="no-print mt-24 border-t border-line bg-ink text-paper">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href={`/${locale}`}
              className="font-display text-3xl font-semibold tracking-tight"
            >
              {BRAND}
              <span className="text-ember">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              {ui.footer.tagline}
            </p>
            <div className="mt-8">
              <div className="[&_label]:text-paper/50 [&_input]:text-paper [&>form>div]:border-paper/20 [&>form>div]:bg-paper/5 [&_input::placeholder]:text-paper/40">
                <Newsletter
                  labels={{
                    label: ui.footer.newsletterLabel,
                    placeholder: ui.footer.newsletterPlaceholder,
                    join: ui.footer.join,
                    done: ui.footer.newsletterDone,
                    error: ui.footer.newsletterError,
                  }}
                />
              </div>
            </div>
          </div>

          <nav aria-label={ui.footer.cuisinesHeading}>
            <h2 className="font-mono text-[0.7rem] uppercase tracking-label text-paper/40">
              {ui.footer.cuisinesHeading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {cuisines.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${locale}/cuisines/${c.slug}`}
                    className="link-underline text-sm text-paper/80 hover:text-paper"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={ui.footer.journalHeading}>
            <h2 className="font-mono text-[0.7rem] uppercase tracking-label text-paper/40">
              {ui.footer.journalHeading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {journalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-sm text-paper/80 hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-label">
            © {year} {BRAND}
          </p>
          <p>{ui.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
