# Guide d'Implémentation : Endpoint Formulaire Next.js

Ce document décrit les étapes pour implémenter un nouvel endpoint de formulaire dans le frontend Next.js avec validation, internationalisation (i18n) et communication API.

## Structure des Fichiers

```
apps/front/next-js/
├── src/
│   ├── app/[locale]/<route>/page.tsx    # Page de route
│   └── i18n/routing.ts                   # Configuration i18n des routes
├── components/
│   ├── <form-name>.tsx                   # Composant formulaire
│   └── ui/                               # Composants UI réutilisables
├── lib/
│   └── api.ts                            # Utilitaire API
└── messages/
    ├── fr.json                           # Traductions FR
    └── en.json                           # Traductions EN
```

---

## Étape 1 : Configuration i18n des Routes

**Fichier** : `src/i18n/routing.ts`

Ajouter le mapping des chemins localisés pour la nouvelle route :

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  pathnames: {
    // ... routes existantes
    '/ma-route': {
      en: '/my-route',
      fr: '/ma-route'
    }
  }
});
```

---

## Étape 2 : Création du Composant Formulaire

**Fichier** : `components/<form-name>.tsx`

### Template de base

```typescript
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

// 1. Définir le schéma Zod
const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // ... autres champs
});

type FormSchema = z.infer<typeof formSchema>;

export function MonFormulaire() {
  // 2. Hooks de traduction
  const t = useTranslations('MonFormulaire');
  const tForm = useTranslations('Forms');

  // 3. Initialiser react-hook-form avec zodResolver
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 4. Handler de soumission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await getApi().fetch('/mon/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t('success'));
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

  // 5. Rendu du formulaire
  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-mon-formulaire" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Champ avec Controller */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-mon-formulaire-${field.name}`}>
                    {t(`fields.${field.name}.label`)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`form-mon-formulaire-${field.name}`}
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
            {/* Répéter pour chaque champ */}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {tForm('reset')}
          </Button>
          <Button type="submit" form="form-mon-formulaire">
            {tForm('submit')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
```

---

## Étape 3 : Création de la Page de Route

**Fichier** : `src/app/[locale]/<route>/page.tsx`

```typescript
import { MonFormulaire } from '@/components/mon-formulaire';

export default function MaPage() {
  return <MonFormulaire />;
}
```

---

## Étape 4 : Ajout des Traductions

### Fichier FR : `messages/fr.json`

```json
{
  "MonFormulaire": {
    "title": "Titre du formulaire",
    "description": "Description du formulaire.",
    "success": "Action réussie !",
    "fields": {
      "email": {
        "label": "Email",
        "placeholder": "Entrez votre email"
      },
      "password": {
        "label": "Mot de passe",
        "placeholder": "Entrez votre mot de passe"
      }
    }
  }
}
```

### Fichier EN : `messages/en.json`

```json
{
  "MonFormulaire": {
    "title": "Form Title",
    "description": "Form description.",
    "success": "Action successful!",
    "fields": {
      "email": {
        "label": "Email",
        "placeholder": "Enter your email"
      },
      "password": {
        "label": "Password",
        "placeholder": "Enter your password"
      }
    }
  }
}
```

---

## Étape 5 : Navigation (optionnel)

**Fichier** : `components/naviagtion.tsx`

Ajouter le lien dans la barre de navigation si nécessaire :

```typescript
<NavigationLink href="/ma-route">
  {t('maRoute')}
</NavigationLink>
```

Et dans les messages :

```json
{
  "Navigation": {
    "maRoute": "Ma Route"
  }
}
```

---

## Utilitaire API

**Fichier** : `lib/api.ts`

```typescript
class Api {
  constructor(private url: string) {}

  fetch(path: string, options?: RequestInit) {
    return fetch(`${this.url}${path}`, options);
  }
}

export const getApi = () => new Api(process.env.NEXT_PUBLIC_API_URL!);
```

---

## Composants UI Disponibles

| Composant | Import | Usage |
|-----------|--------|-------|
| Card | `@/components/ui/card` | Conteneur du formulaire |
| Input | `@/components/ui/input` | Champs de saisie texte |
| Button | `@/components/ui/button` | Boutons (submit, reset) |
| Field | `@/components/ui/field` | Wrapper champ + label + erreur |
| Label | `@/components/ui/label` | Labels accessibles |
| Textarea | `@/components/ui/textarea` | Zone de texte multi-lignes |

---

## Dépendances Requises

```bash
pnpm add react-hook-form zod @hookform/resolvers sonner next-intl
```

---

## Variables d'Environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

---

## Checklist d'Implémentation

- [ ] Route i18n configurée dans `routing.ts`
- [ ] Composant formulaire créé avec :
  - [ ] Schéma Zod défini
  - [ ] `useForm` avec `zodResolver`
  - [ ] Champs `Controller` pour chaque input
  - [ ] Handler `onSubmit` avec appel API
  - [ ] Gestion des erreurs avec toast
- [ ] Page de route créée
- [ ] Traductions FR ajoutées
- [ ] Traductions EN ajoutées
- [ ] Lien navigation ajouté (si applicable)

---

## Exemples Implémentés

### Register (`/register` | `/inscription`)

- **Composant** : `components/register.tsx`
- **Page** : `src/app/[locale]/register/page.tsx`
- **Endpoint API** : `POST /client/auth/register`
- **Champs** : firstname, lastname, email, password

### Login (`/login` | `/connexion`)

- **Composant** : `components/login.tsx`
- **Page** : `src/app/[locale]/login/page.tsx`
- **Endpoint API** : `POST /client/auth/login`
- **Champs** : email, password

---

## Bonnes Pratiques

1. **Nommage cohérent** : Utiliser le même identifiant pour form id, traductions, et composant
2. **Validation côté client** : Zod pour validation immédiate avant envoi
3. **Accessibilité** : `aria-invalid`, `htmlFor`, `autoComplete` appropriés
4. **Gestion d'erreurs** : Fallback sur message par défaut si traduction absente
5. **Type safety** : Inférer le type depuis le schéma Zod avec `z.infer<typeof formSchema>`

---

**Dernière mise à jour** : 2026-01-08
