'use client';

import { getApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageForm } from './message-form';

interface Message {
  id: string;
  text: string;
  fromAdvisor: boolean;
  createdAt: string;
}

interface Discussion {
  id: string;
  status: string;
  messages: Message[];
  createdAt: string;
}

export function MessageList() {
  const t = useTranslations('MessageList');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  async function fetchDiscussions() {
    try {
      const response = await getApi().fetch('/client/discussions');
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

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setShowNewMessage(true)}>{t('newMessage')}</Button>
      </div>

      {showNewMessage && (
        <MessageForm
          onSuccess={() => {
            setShowNewMessage(false);
            fetchDiscussions();
          }}
          onCancel={() => setShowNewMessage(false)}
        />
      )}

      {discussions.length === 0 ? (
        <p className="text-muted-foreground">{t('noDiscussions')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            {discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={`cursor-pointer transition-colors ${
                  selectedDiscussion?.id === discussion.id
                    ? 'border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDiscussion(discussion)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      {t('discussion')} #{discussion.id.slice(0, 8)}
                    </CardTitle>
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
                  <p className="text-xs text-muted-foreground">
                    {discussion.messages.length} {t('messages')}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          {selectedDiscussion && (
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('conversation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedDiscussion.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded ${
                        message.fromAdvisor
                          ? 'bg-muted ml-8'
                          : 'bg-primary/10 mr-8'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {message.fromAdvisor ? t('advisor') : t('you')}
                      </p>
                      <p>{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </CardContent>
                {selectedDiscussion.status === 'open' && (
                  <div className="p-4 border-t">
                    <MessageForm
                      discussionId={selectedDiscussion.id}
                      onSuccess={() => fetchDiscussions()}
                      compact
                    />
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
