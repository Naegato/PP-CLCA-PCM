'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';

interface Loan {
  id: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  status: string;
  createdAt: string;
}

export function LoanList() {
  const t = useTranslations('LoanList');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await getApi().fetch('/client/loans');
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
    fetchLoans();
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
            <Link href="/loans/simulate">{t('simulate')}</Link>
          </Button>
          <Button asChild>
            <Link href="/loans/request">{t('request')}</Link>
          </Button>
        </div>
      </div>

      {loans.length === 0 ? (
        <p className="text-muted-foreground">{t('noLoans')}</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Link key={loan.id} href={`/loans/${loan.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(loan.amount)}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        loan.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t(`status.${loan.status}`)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('remaining')}:{' '}
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(loan.remainingAmount)}
                    </span>
                    <span className="text-muted-foreground">
                      {t('rate')}: {loan.interestRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
