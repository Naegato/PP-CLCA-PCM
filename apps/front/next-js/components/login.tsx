'use client';

import { useAuth } from '@/contexts/auth-context';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type FormSchema = z.infer<typeof formSchema>;

export function Login() {
  const t = useTranslations('LoginForm');
  const tForm = useTranslations('Forms');
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await login(data.email, data.password, 'client');
      toast.success(t('success'));
      router.push('/account');
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
      <CardFooter className="flex-col gap-4">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {tForm('reset')}
          </Button>
          <Button type="submit" form="form-login">
            {tForm('submit')}
          </Button>
        </Field>
        <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
          {t('forgotPassword')}
        </Link>
      </CardFooter>
    </Card>
  );
}
