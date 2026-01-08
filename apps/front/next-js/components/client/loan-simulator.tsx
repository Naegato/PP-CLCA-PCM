'use client';

import { getApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  principal: z.coerce.number().positive().min(1000),
  interestRate: z.coerce.number().positive().max(30),
  durationMonths: z.coerce.number().int().positive().min(6).max(360),
});

type FormSchema = z.infer<typeof formSchema>;

interface SimulationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function LoanSimulator() {
  const t = useTranslations('LoanSimulator');
  const tForm = useTranslations('Forms');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 10000,
      interestRate: 5,
      durationMonths: 60,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/client/loans/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const simulation = await response.json();

      if (simulation?.error) {
        throw new Error(simulation.error);
      }

      setResult(simulation);
    } catch (error) {
      console.error('Simulation failed:', error);
      // Calculate locally as fallback
      const { principal, interestRate, durationMonths } = data;
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
        (Math.pow(1 + monthlyRate, durationMonths) - 1);
      const totalPayment = monthlyPayment * durationMonths;
      const totalInterest = totalPayment - principal;

      setResult({ monthlyPayment, totalPayment, totalInterest });
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <div className="space-y-6">
      <Card className="w-full sm:max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-loan-simulator" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="principal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-loan-simulator-principal">
                      {t('fields.principal.label')}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="form-loan-simulator-principal"
                      placeholder={t('fields.principal.placeholder')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="interestRate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-loan-simulator-interestRate">
                      {t('fields.interestRate.label')}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      id="form-loan-simulator-interestRate"
                      placeholder={t('fields.interestRate.placeholder')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="durationMonths"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-loan-simulator-durationMonths">
                      {t('fields.durationMonths.label')}
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="form-loan-simulator-durationMonths"
                      placeholder={t('fields.durationMonths.placeholder')}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="mt-4">
              <Button type="submit" className="w-full">
                {t('calculate')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="w-full sm:max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t('result.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('result.monthlyPayment')}</span>
              <span className="font-bold">{formatCurrency(result.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('result.totalPayment')}</span>
              <span className="font-bold">{formatCurrency(result.totalPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('result.totalInterest')}</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(result.totalInterest)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
