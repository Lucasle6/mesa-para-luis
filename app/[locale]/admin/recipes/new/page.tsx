import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/i18n';
import { requireAdmin } from '@/lib/supabase/server';
import { RecipeForm } from '@/components/admin/RecipeForm';

export const dynamic = 'force-dynamic';

export default async function NewRecipePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  await requireAdmin(locale);

  return (
    <div className="shell max-w-4xl pt-32">
      <Link
        href={`/${locale}/admin`}
        className="font-mono text-[0.68rem] uppercase tracking-label text-muted hover:text-ink"
      >
        ← Panel de admin
      </Link>
      <h1 className="mb-8 mt-4 font-display text-4xl text-ink">Nueva receta</h1>
      <RecipeForm locale={locale} />
    </div>
  );
}
