'use client';

import { Account } from '@pp-clca-pcm/domain';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';

type AccountListProps = {
  accounts: Account[];
}

export function AccountList({
  accounts,
}: AccountListProps) {
  const t = useTranslations('AccountList');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link href={{
              pathname: '/account/create',
            }}>{t('createAccount')}</Link>
          </Button>
          <Button asChild>
            <Link href={{
              pathname: '/account/savings/create',
            }}>{t('createSavings')}</Link>
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <p className="text-muted-foreground">{t('noAccounts')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Link key={account.identifier} href={{
              pathname: '/account/[id]',
              params: { id: account.identifier! },
            }}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{account.iban.value}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(account.balance || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{account.type.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
