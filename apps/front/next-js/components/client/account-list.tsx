'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Account {
  id: string;
  name: string;
  iban: string;
  balance: number;
  type: string;
}

export function AccountList() {
  const t = useTranslations('AccountList');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await getApi().fetch('/client/accounts');
        const data = await response.json();
        if (data && !data.error) {
          setAccounts(data.accounts || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link href="/account/create">{t('createAccount')}</Link>
          </Button>
          <Button asChild>
            <Link href="/account/savings/create">{t('createSavings')}</Link>
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <p className="text-muted-foreground">{t('noAccounts')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Link key={account.id} href={`/account/${account.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{account.iban}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(account.balance)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
