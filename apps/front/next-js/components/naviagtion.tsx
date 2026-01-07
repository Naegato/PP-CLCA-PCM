import { LocaleSwitcher } from '@/components/locale-switcher';
import NavigationLink from '@/components/navigation-link';
import {useTranslations} from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Navigation');

  return (
    <div className="bg-slate-850">
      <nav className="container flex justify-between p-2 text-white">
        <div>
          <NavigationLink href="/">{t('home')}</NavigationLink>
          <NavigationLink href="/login">{t('login')}</NavigationLink>
        </div>
        <LocaleSwitcher />
      </nav>
    </div>
  );
}