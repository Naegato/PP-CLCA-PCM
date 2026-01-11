import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-8">{t('description')}</p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
