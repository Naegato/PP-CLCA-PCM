'use client';

import { getApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  text: z.string().min(1).max(1000),
});

type FormSchema = z.infer<typeof formSchema>;

interface MessageFormProps {
  discussionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

export function MessageForm({ discussionId, onSuccess, onCancel, compact }: MessageFormProps) {
  const t = useTranslations('MessageForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/client/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discussionId: discussionId || null,
          text: data.text,
        }),
      });

      const result = await response.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t('success'));
      form.reset();
      onSuccess?.();
    } catch (e) {
      const error = e as Error;
      const hasMessage = tForm.has(`errors.${error.message}`);
      toast.error(hasMessage ? tForm(`errors.${error.message}`) : tForm('errors.default'));
    }
  };

  if (compact) {
    return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <Controller
          name="text"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={t('fields.text.placeholder')}
              className="flex-1"
              rows={1}
            />
          )}
        />
        <Button type="submit">{t('send')}</Button>
      </form>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-message" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="text"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-message-text">
                    {t('fields.text.label')}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-message-text"
                    placeholder={t('fields.text.placeholder')}
                    rows={4}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-4 flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {tForm('reset')}
              </Button>
            )}
            <Button type="submit">{t('send')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
