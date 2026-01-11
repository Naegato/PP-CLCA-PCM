'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';
import { StockCreateForm } from './stock-create-form';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  companyName: string;
  isListed: boolean;
  price: number;
}

export function DirectorStockList() {
  const t = useTranslations('DirectorStockList');
  const tForm = useTranslations('Forms');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  async function fetchStocks() {
    try {
      const response = await getApi().fetch('/director/stocks');
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

  async function handleToggle(stockId: string) {
    try {
      const response = await getApi().fetch(`/director/stocks/${stockId}/toggle`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('toggleSuccess'));
      fetchStocks();
    } catch (e) {
      const error = e as Error;
      toast.error(tForm.has(`errors.${error.message}`)
        ? tForm(`errors.${error.message}`)
        : tForm('errors.default'));
    }
  }

  async function handleDelete(stockId: string) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await getApi().fetch(`/director/stocks/${stockId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('deleteSuccess'));
      fetchStocks();
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? t('cancel') : t('create')}
        </Button>
      </div>

      {showCreate && (
        <StockCreateForm
          onSuccess={() => {
            setShowCreate(false);
            fetchStocks();
          }}
        />
      )}

      {stocks.length === 0 ? (
        <p className="text-muted-foreground">{t('noStocks')}</p>
      ) : (
        <div className="space-y-4">
          {stocks.map((stock) => (
            <Card key={stock.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      {stock.symbol} - {stock.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        stock.isListed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {stock.isListed ? t('listed') : t('unlisted')}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleToggle(stock.id)}>
                      {stock.isListed ? t('unlist') : t('list')}
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/stocks/${stock.id}`}>{t('edit')}</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(stock.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(stock.price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
