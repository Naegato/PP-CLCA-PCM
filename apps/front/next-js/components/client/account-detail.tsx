'use client';

import { getApi } from '@/lib/api';
import { Account } from '@pp-clca-pcm/domain';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/i18n/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionForm } from './transaction-form';
import { AccountRenameForm } from './account-rename-form';

interface AccountDetailProps {
  account: Account;
}

export function AccountDetail({ account }: AccountDetailProps) {
  const t = useTranslations('AccountDetail');
  const tForm = useTranslations('Forms');
  const router = useRouter();
  const [accountState, setAccount] = useState<Account>(account);
  const transactions = useMemo(() => {
    return [...(accountState.emittedTransactions || []), ...(accountState.receivedTransactions || [])];
  }, [accountState.emittedTransactions, accountState.receivedTransactions]);
  const accountId = useMemo(() => accountState.identifier!, [accountState.identifier]);
  const [showRename, setShowRename] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await getApi().fetch(`/client/accounts/${accountId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('deleteSuccess'));
      router.push('/account');
    } catch (e) {
      const error = e as Error;
      toast.error(tForm.has(`errors.${error.message}`)
        ? tForm(`errors.${error.message}`)
        : tForm('errors.default'));
    }
  };

  if (!accountState) {
    return <div className="text-muted-foreground">{t('notFound')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{accountState.name}</h1>
          <p className="text-muted-foreground">{accountState.iban.value}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setShowRename(!showRename)}>
            {t('rename')}
          </Button>
          <Button variant="outline" onClick={() => setShowTransfer(!showTransfer)}>
            {t('transfer')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('balance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(accountState.balance || 0)}
          </p>
        </CardContent>
      </Card>

      {showRename && (
        <AccountRenameForm
          accountId={accountId}
          currentName={account.name || ''}
          onSuccess={(newName) => {
            setAccount({ ...accountState, name: newName } as Account);
            setShowRename(false);
          }}
        />
      )}

      {showTransfer && (
        <TransactionForm
          accountId={accountId}
          onSuccess={() => {
            setShowTransfer(false);
            router.refresh();
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('transactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">{t('noTransactions')}</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.identifier}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
