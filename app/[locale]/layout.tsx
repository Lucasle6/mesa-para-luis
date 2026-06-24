import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import {
  BRAND,
  getDictionary,
  isLocale,
  locales,
  type Locale,
} from '@/lib/i18n';
import { getCuisines } from '@/lib/data';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

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
    metadataBase: new URL('https://mesa-para-luis.example'),
    title: {
      default: `${BRAND} — ${dict.ui.hero.titleA} ${dict.ui.hero.titleB}`,
      template: `%s · ${BRAND}`,
    },
    description: dict.ui.meta.siteDescription,
    openGraph: {
      title: BRAND,
      description: dict.ui.meta.siteDescription,
      type: 'website',
      siteName: BRAND,
      locale: params.locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = await getDictionary(locale);
  const cuisines = getCuisines(dict);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">
        <a
          href="#main"
          className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-label focus:text-paper"
        >
          {dict.ui.nav.skip}
        </a>
        <Nav locale={locale} ui={dict.ui} />
        <main id="main">{children}</main>
        <Footer locale={locale} ui={dict.ui} cuisines={cuisines} />
      </body>
    </html>
  );
}
