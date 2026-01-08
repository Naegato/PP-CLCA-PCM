'use client';

import { getApi } from '@/lib/api';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type FormSchema = z.infer<typeof formSchema>;

export function Login() {
  const t = useTranslations('LoginForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'test@test.test',
      password: 'testtesttest',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
    try {
      const response = await getApi().fetch('/client/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const awaited: { token?: string; error?: string } = await response.json();

      if (awaited?.error) {
        throw new Error(awaited?.error);
      } else {
        toast.success(t('success'));
      }
    } catch (e) {
      const error = e as Error;
      const asMessage = tForm.has(`errors.${error.message}`);

      if (asMessage) {
        toast.error(tForm(`errors.${error.message}`));
      } else {
        toast.error(error.message);
        toast.error(tForm('errors.default'));
      }
    }
  };

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-login-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-login-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-login-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id={`form-login-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {tForm('reset')}
          </Button>
          <Button type="submit" form="form-login">
            {tForm('submit')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
