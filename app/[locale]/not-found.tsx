import Link from 'next/link';
import { getDictionary, defaultLocale } from '@/lib/i18n';
import { ArrowRight } from '@/components/icons';

// Rendered without locale params, so we fall back to the default language.
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);
  const nf = dict.ui.notFound;

  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="eyebrow text-ember">{nf.eyebrow}</span>
      <h1 className="mt-5 font-display text-[clamp(3rem,12vw,8rem)] leading-none text-ink">
        {nf.title}
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted">{nf.body}</p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember"
      >
        {nf.btn}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
