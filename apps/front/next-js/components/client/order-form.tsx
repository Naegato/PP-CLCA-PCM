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
  side: z.enum(['buy', 'sell']),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
});

type FormSchema = z.infer<typeof formSchema>;

interface OrderFormProps {
  stockId: string;
  currentPrice: number;
  onSuccess?: () => void;
}

export function OrderForm({ stockId, currentPrice, onSuccess }: OrderFormProps) {
  const t = useTranslations('OrderForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      side: 'buy',
      quantity: 1,
      price: currentPrice,
    },
  });

  const side = form.watch('side');

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await getApi().fetch('/client/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockId,
          ...data,
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
        <form id="form-order" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={side === 'buy' ? 'default' : 'outline'}
                className={side === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => form.setValue('side', 'buy')}
              >
                {t('buy')}
              </Button>
              <Button
                type="button"
                variant={side === 'sell' ? 'default' : 'outline'}
                className={side === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => form.setValue('side', 'sell')}
              >
                {t('sell')}
              </Button>
            </div>

            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-order-quantity">
                    {t('fields.quantity.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="form-order-quantity"
                    placeholder={t('fields.quantity.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-order-price">
                    {t('fields.price.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    id="form-order-price"
                    placeholder={t('fields.price.placeholder')}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="mt-4">
            <Button
              type="submit"
              className={`w-full ${
                side === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {side === 'buy' ? t('placeBuyOrder') : t('placeSellOrder')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
