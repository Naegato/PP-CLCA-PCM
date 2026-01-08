'use client';

import { getApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  rate: z.coerce.number().min(0).max(100),
});

type FormSchema = z.infer<typeof formSchema>;

export function SavingsRateForm() {
  const t = useTranslations('SavingsRateForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate: 2.5,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/director/savings/rate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'savings', rate: data.rate }),
      });

      const result = await response.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t('success'));
    } catch (e) {
      const error = e as Error;
      const hasMessage = tForm.has(`errors.${error.message}`);
      toast.error(hasMessage ? tForm(`errors.${error.message}`) : tForm('errors.default'));
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-savings-rate" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="rate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-savings-rate-rate">
                    {t('fields.rate.label')}
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      id="form-savings-rate-rate"
                      placeholder={t('fields.rate.placeholder')}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
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
