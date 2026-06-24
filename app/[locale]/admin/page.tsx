import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/lib/i18n';
import {
  createClient,
  requireAdmin,
  supabaseConfigured,
} from '@/lib/supabase/server';
import { AdminBoard } from '@/components/admin/AdminBoard';
import { ArrowRight } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  await requireAdmin(locale);

  let posts: any[] = [];
  let recipes: any[] = [];
  if (supabaseConfigured) {
    const supabase = createClient();
    const [p, r] = await Promise.all([
      supabase.from('posts').select('id,slug,title,locale,published').order('created_at', { ascending: false }),
      supabase.from('recipes').select('id,slug,title,locale,published').order('created_at', { ascending: false }),
    ]);
    posts = p.data ?? [];
    recipes = r.data ?? [];
  }

  return (
    <div className="shell pt-32">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow text-ember">Panel de admin</span>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] text-ink">
            Tu cocina, editable.
          </h1>
          <p className="mt-3 max-w-prose text-muted">
            Crea y gestiona recetas y entradas de blog. Solo tú (admin) puedes
            editar; las demás cuentas son de solo lectura.
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/${locale}/admin/recipes/new`}
          className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-ink/30"
        >
          <div>
            <h2 className="font-display text-2xl text-ink">Nueva receta</h2>
            <p className="mt-1 text-sm text-muted">Añade un plato con su técnica, ingredientes e imagen.</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ember" />
        </Link>
        <Link
          href={`/${locale}/admin/posts/new`}
          className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-ink/30"
        >
          <div>
            <h2 className="font-display text-2xl text-ink">Nueva entrada</h2>
            <p className="mt-1 text-sm text-muted">Escribe una entrada de blog con portada.</p>
          </div>
          <ArrowRight className="h-6 w-6 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ember" />
        </Link>
      </div>

      <AdminBoard posts={posts} recipes={recipes} locale={locale} />
    </div>
  );
}
