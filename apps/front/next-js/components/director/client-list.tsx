'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Client {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isBanned: boolean;
  createdAt: string;
}

export function ClientList() {
  const t = useTranslations('ClientList');
  const tForm = useTranslations('Forms');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await getApi().fetch('/director/clients');
      const data = await response.json();
      if (data && !data.error) {
        setClients(data.clients || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(clientId: string) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await getApi().fetch(`/director/clients/${clientId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('deleteSuccess'));
      fetchClients();
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
        <Button asChild>
          <Link href="/admin/users/create">{t('create')}</Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <p className="text-muted-foreground">{t('noClients')}</p>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      {client.firstname} {client.lastname}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {client.isBanned && (
                      <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
                        {t('banned')}
                      </span>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${client.id}`}>{t('view')}</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('createdAt')}: {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
