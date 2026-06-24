import type { Dictionary } from './dictionary';

export const locales = ['es', 'en', 'tr', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

/** The blog's name stays in Spanish across every language version. */
export const BRAND = 'Mesa para Luis';

/** Endonyms — language names shown in their own language, never translated. */
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  es: () => import('@/messages/es.json'),
  en: () => import('@/messages/en.json'),
  tr: () => import('@/messages/tr.json'),
  de: () => import('@/messages/de.json'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders[defaultLocale];
  const mod = await load();
  return mod.default as Dictionary;
}

/** Minimal {token} interpolation for strings with dynamic values. */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}
