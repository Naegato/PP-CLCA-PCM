'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionForm } from './transaction-form';
import { AccountRenameForm } from './account-rename-form';

interface Account {
  id: string;
  name: string;
  iban: string;
  balance: number;
  type: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  description?: string;
}

interface AccountDetailProps {
  accountId: string;
}

export function AccountDetail({ accountId }: AccountDetailProps) {
  const t = useTranslations('AccountDetail');
  const tForm = useTranslations('Forms');
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRename, setShowRename] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const response = await getApi().fetch(`/client/accounts/${accountId}`);
        const data = await response.json();
        if (data && !data.error) {
          setAccount(data.account || data);
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch account:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, [accountId]);

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

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  if (!account) {
    return <div className="text-muted-foreground">{t('notFound')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{account.name}</h1>
          <p className="text-muted-foreground">{account.iban}</p>
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
            }).format(account.balance)}
          </p>
        </CardContent>
      </Card>

      {showRename && (
        <AccountRenameForm
          accountId={accountId}
          currentName={account.name}
          onSuccess={(newName) => {
            setAccount({ ...account, name: newName });
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
                  key={tx.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">{tx.description || tx.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
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
