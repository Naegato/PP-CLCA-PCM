'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  companyName: string;
}

export function StockList() {
  const t = useTranslations('StockList');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await getApi().fetch('/client/stocks');
        const data = await response.json();
        if (data && !data.error) {
          setStocks(data.stocks || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      {stocks.length === 0 ? (
        <p className="text-muted-foreground">{t('noStocks')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => (
            <Link key={stock.id} href={`/stocks/${stock.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                    <span
                      className={`text-sm font-medium ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}
                      {stock.change?.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(stock.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
