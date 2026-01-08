'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoanRequest {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export function PendingLoanList() {
  const t = useTranslations('PendingLoanList');
  const tForm = useTranslations('Forms');
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const response = await getApi().fetch('/advisor/loans/pending');
      const data = await response.json();
      if (data && !data.error) {
        setLoans(data.loans || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(loanId: string, action: 'grant' | 'reject') {
    try {
      const response = await getApi().fetch(`/advisor/loans/${loanId}/${action}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t(`${action}Success`));
      fetchLoans();
    } catch (e) {
      const error = e as Error;
      toast.error(tForm.has(`errors.${error.message}`)
        ? tForm(`errors.${error.message}`)
        : tForm('errors.default'));
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      {loans.length === 0 ? (
        <p className="text-muted-foreground">{t('noLoans')}</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{loan.clientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(loan.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(loan.amount)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(loan.id, 'reject')}
                  >
                    {t('reject')}
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(loan.id, 'grant')}
                  >
                    {t('approve')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
