'use client';

import { getApi } from '@/lib/api';
import { ClientRegistration } from '@pp-clca-pcm/application';
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
  firstname: z.string(),
  lastname: z.string(),
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type FormSchema = z.infer<typeof formSchema>;

export function Register() {
  const t = useTranslations('RegisterForm');
  const tForm = useTranslations('Forms');

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: 'test',
      lastname: 'test',
      email: 'test@test.test',
      password: 'testtesttest',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
    try {
      const response = await getApi().fetch('/client/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const awaited: Exclude<
        Awaited<ReturnType<ClientRegistration['execute']>>,
        Error
      > | { error: string } = await response.json();

      if (awaited?.error) {
        throw new Error(awaited?.error);
      } else {
        toast.success('Registration successful!');
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

    // toast('You submitted the following values:', {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: 'bottom-right',
    //   classNames: {
    //     content: 'flex flex-col gap-2',
    //   },
    //   style: {
    //     '--border-radius': 'calc(var(--radius)  + 4px)',
    //   } as React.CSSProperties,
    // });
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="firstname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-register-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-register-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[ fieldState.error ]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-register-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-register-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[ fieldState.error ]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-register-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-register-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[ fieldState.error ]}/>
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-register-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-register-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={t(`fields.${field.name}.placeholder`)}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[ fieldState.error ]}/>
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
          <Button type="submit" form="form-register">
            {tForm('submit')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
