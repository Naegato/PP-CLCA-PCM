'use client';

import { getApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  symbol: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  companyId: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

interface Company {
  id: string;
  name: string;
}

interface StockCreateFormProps {
  onSuccess?: () => void;
}

export function StockCreateForm({ onSuccess }: StockCreateFormProps) {
  const t = useTranslations('StockCreateForm');
  const tForm = useTranslations('Forms');
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await getApi().fetch('/director/companies');
        const data = await response.json();
        if (data && !data.error) {
          setCompanies(data.companies || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    }
    fetchCompanies();
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
      name: '',
      companyId: '',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/director/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
        <form id="form-stock-create" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="symbol"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-stock-create-symbol">
                    {t('fields.symbol.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-stock-create-symbol"
                    placeholder={t('fields.symbol.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-stock-create-name">
                    {t('fields.name.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-stock-create-name"
                    placeholder={t('fields.name.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="companyId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-stock-create-companyId">
                    {t('fields.company.label')}
                  </FieldLabel>
                  <select
                    {...field}
                    id="form-stock-create-companyId"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">{t('fields.company.placeholder')}</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
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
