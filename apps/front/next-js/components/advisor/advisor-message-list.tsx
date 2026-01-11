'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  text: string;
  fromAdvisor: boolean;
  createdAt: string;
}

interface Discussion {
  id: string;
  clientName: string;
  status: string;
  messages: Message[];
}

export function AdvisorMessageList() {
  const t = useTranslations('AdvisorMessageList');
  const tForm = useTranslations('Forms');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Discussion | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, []);

  async function fetchDiscussions() {
    try {
      const response = await getApi().fetch('/advisor/discussions');
      const data = await response.json();
      if (data && !data.error) {
        setDiscussions(data.discussions || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply() {
    if (!selected || !replyText.trim()) return;

    try {
      const lastMessage = selected.messages[selected.messages.length - 1];
      const response = await getApi().fetch(`/advisor/messages/${lastMessage.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText }),
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('replySuccess'));
      setReplyText('');
      fetchDiscussions();
    } catch (e) {
      const error = e as Error;
      toast.error(tForm.has(`errors.${error.message}`)
        ? tForm(`errors.${error.message}`)
        : tForm('errors.default'));
    }
  }

  async function handleClose() {
    if (!selected) return;

    try {
      const response = await getApi().fetch(`/advisor/discussions/${selected.id}/close`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(t('closeSuccess'));
      setSelected(null);
      fetchDiscussions();
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

      {discussions.length === 0 ? (
        <p className="text-muted-foreground">{t('noDiscussions')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            {discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={`cursor-pointer transition-colors ${
                  selected?.id === discussion.id ? 'border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelected(discussion)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">{discussion.clientName}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        discussion.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`status.${discussion.status}`)}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {selected && (
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selected.clientName}</CardTitle>
                    {selected.status === 'open' && (
                      <Button variant="outline" onClick={handleClose}>
                        {t('close')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {selected.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded ${
                        message.fromAdvisor ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {message.fromAdvisor ? t('you') : selected.clientName}
                      </p>
                      <p>{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </CardContent>
                {selected.status === 'open' && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t('replyPlaceholder')}
                        rows={2}
                        className="flex-1"
                      />
                      <Button onClick={handleReply}>{t('send')}</Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
