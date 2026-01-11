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
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  receiverIban: z.string().min(15),
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface TransactionFormProps {
  accountId: string;
  onSuccess?: () => void;
}

export function TransactionForm({ accountId, onSuccess }: TransactionFormProps) {
  const t = useTranslations('TransactionForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverIban: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/client/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAccountId: accountId,
          receiverIban: data.receiverIban,
          amount: data.amount,
          description: data.description,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-transaction" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="receiverIban"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-transaction-receiverIban">
                    {t('fields.receiverIban.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-transaction-receiverIban"
                    placeholder={t('fields.receiverIban.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-transaction-amount">
                    {t('fields.amount.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    id="form-transaction-amount"
                    placeholder={t('fields.amount.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-transaction-description">
                    {t('fields.description.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-transaction-description"
                    placeholder={t('fields.description.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-4">
            <Button type="submit">{tForm('submit')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
