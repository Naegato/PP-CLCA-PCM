'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';

interface Position {
  id: string;
  stockId: string;
  stockSymbol: string;
  stockName: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
}

interface Portfolio {
  id: string;
  totalValue: number;
  positions: Position[];
}

export function PortfolioView() {
  const t = useTranslations('PortfolioView');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await getApi().fetch('/client/portfolio');
        const data = await response.json();
        if (data && !data.error) {
          setPortfolio(data.portfolio || data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  if (!portfolio) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">{t('noPortfolio')}</p>
            <Button asChild>
              <Link href="/stocks">{t('browseStocks')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/orders">{t('viewOrders')}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('totalValue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold">{t('positions')}</h2>

      {portfolio.positions.length === 0 ? (
        <p className="text-muted-foreground">{t('noPositions')}</p>
      ) : (
        <div className="space-y-4">
          {portfolio.positions.map((position) => (
            <Card key={position.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{position.stockSymbol}</CardTitle>
                    <p className="text-sm text-muted-foreground">{position.stockName}</p>
                  </div>
                  <Link href={`/stocks/${position.stockId}`}>
                    <Button variant="outline" size="sm">
                      {t('trade')}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('quantity')}</p>
                    <p className="font-medium">{position.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('avgPrice')}</p>
                    <p className="font-medium">{formatCurrency(position.averagePrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('currentPrice')}</p>
                    <p className="font-medium">{formatCurrency(position.currentPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('profitLoss')}</p>
                    <p
                      className={`font-medium ${
                        position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {position.profitLoss >= 0 ? '+' : ''}
                      {formatCurrency(position.profitLoss)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
