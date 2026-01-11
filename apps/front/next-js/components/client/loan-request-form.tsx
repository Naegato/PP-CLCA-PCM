'use client';

import { getApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  amount: z.coerce.number().positive().min(1000),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoanRequestForm() {
  const t = useTranslations('LoanRequestForm');
  const tForm = useTranslations('Forms');
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10000,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/client/loans/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t('success'));
      router.push('/loans');
    } catch (e) {
      const error = e as Error;
      const hasMessage = tForm.has(`errors.${error.message}`);
      toast.error(hasMessage ? tForm(`errors.${error.message}`) : tForm('errors.default'));
    }
  };

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-loan-request" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-loan-request-amount">
                    {t('fields.amount.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="form-loan-request-amount"
                    placeholder={t('fields.amount.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-loan-request" className="w-full">
          {t('submit')}
        </Button>
      </CardFooter>
    </Card>
  );
}
