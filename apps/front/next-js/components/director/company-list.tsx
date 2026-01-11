'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';
import { CompanyCreateForm } from './company-create-form';

interface Company {
  id: string;
  name: string;
  stockCount: number;
  createdAt: string;
}

export function CompanyList() {
  const t = useTranslations('CompanyList');
  const tForm = useTranslations('Forms');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const response = await getApi().fetch('/director/companies');
      const data = await response.json();
      if (data && !data.error) {
        setCompanies(data.companies || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(companyId: string) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await getApi().fetch(`/director/companies/${companyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('deleteSuccess'));
      fetchCompanies();
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
        <CompanyCreateForm
          onSuccess={() => {
            setShowCreate(false);
            fetchCompanies();
          }}
        />
      )}

      {companies.length === 0 ? (
        <p className="text-muted-foreground">{t('noCompanies')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/companies/${company.id}`}>{t('edit')}</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(company.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {company.stockCount} {t('stocks')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
