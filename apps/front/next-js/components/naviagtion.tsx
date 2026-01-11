'use client';

import { LocaleSwitcher } from '@/components/locale-switcher';
import NavigationLink from '@/components/navigation-link';
import { useAuth } from '@/contexts/auth-context';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const { isAuthenticated, role, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="bg-slate-800">
      <nav className="container flex justify-between items-center p-2 text-white">
        <div className="flex items-center gap-4">
          <NavigationLink href="/">{t('home')}</NavigationLink>

          {!isAuthenticated && (
            <>
              <NavigationLink href="/login">{t('login')}</NavigationLink>
              <NavigationLink href="/register">{t('register')}</NavigationLink>
              <span className="text-slate-500">|</span>
              <NavigationLink href="/advisor/login">{t('advisorLogin')}</NavigationLink>
              <NavigationLink href="/admin/login">{t('adminLogin')}</NavigationLink>
            </>
          )}

          {isAuthenticated && role === 'client' && (
            <>
              <NavigationLink href="/account">{t('account')}</NavigationLink>
              <NavigationLink href="/loans">{t('loans')}</NavigationLink>
              <NavigationLink href="/stocks">{t('stocks')}</NavigationLink>
              <NavigationLink href="/portfolio">{t('portfolio')}</NavigationLink>
              <NavigationLink href="/orders">{t('orders')}</NavigationLink>
              <NavigationLink href="/messages">{t('messages')}</NavigationLink>
              <NavigationLink href="/notifications">{t('notifications')}</NavigationLink>
            </>
          )}

          {isAuthenticated && role === 'advisor' && (
            <>
              <NavigationLink href="/advisor/loans">{t('pendingLoans')}</NavigationLink>
              <NavigationLink href="/advisor/messages">{t('messages')}</NavigationLink>
            </>
          )}

          {isAuthenticated && role === 'director' && (
            <>
              <NavigationLink href="/admin/users">{t('clients')}</NavigationLink>
              <NavigationLink href="/admin/companies">{t('companies')}</NavigationLink>
              <NavigationLink href="/admin/stocks">{t('stocks')}</NavigationLink>
              <NavigationLink href="/admin/settings">{t('settings')}</NavigationLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">
                {user?.firstname} {user?.lastname}
              </span>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </div>
          )}
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );
}
