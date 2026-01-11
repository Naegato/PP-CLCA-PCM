'use client';

import { getApi } from '@/lib/api';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormSchema = z.infer<typeof formSchema>;

export function ResetPassword() {
  const t = useTranslations('ResetPasswordForm');
  const tForm = useTranslations('Forms');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (!token) {
      toast.error(t('noToken'));
      return;
    }

    try {
      const response = await getApi().fetch('/client/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await response.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t('success'));
      router.push('/login');
    } catch (e) {
      const error = e as Error;
      const hasMessage = tForm.has(`errors.${error.message}`);
      toast.error(hasMessage ? tForm(`errors.${error.message}`) : tForm('errors.default'));
    }
  };

  if (!token) {
    return (
      <Card className="w-full sm:max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('noToken')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-reset-password" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-reset-password-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id={`form-reset-password-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-reset-password-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id={`form-reset-password-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="form-reset-password" className="w-full">
          {tForm('submit')}
        </Button>
      </CardFooter>
    </Card>
  );
}
