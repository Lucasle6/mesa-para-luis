import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { AuthForm } from '@/components/AuthForm';

export const dynamic = 'force-dynamic';

export default function LoginPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return (
    <div className="shell flex min-h-[80vh] items-center justify-center py-32">
      <AuthForm locale={params.locale} />
    </div>
  );
}
