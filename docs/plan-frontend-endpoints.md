# Plan d'implémentation des endpoints Frontend

## Résumé

Implémentation de tous les endpoints API (use cases) dans le frontend Next.js avec:
- React Hook Form + Zod pour les formulaires
- Internationalisation FR/EN
- Style sobre
- Maximum de SSR et cache

**Déjà implémenté:** Login Client, Registration Client

---

## Phase 1: Infrastructure (Priorité haute)

### 1.1 Contexte d'authentification
- Créer `contexts/auth-context.tsx`
- Stocker le token JWT, user info, rôle
- Exposer: `login()`, `logout()`, `isAuthenticated`, `user`, `role`

### 1.2 Protection des routes
- Créer `components/protected-route.tsx`
- Redirection si non authentifié
- Vérification du rôle (client/advisor/director)

### 1.3 Pages d'erreur
- `src/app/[locale]/not-found.tsx` - Page 404
- `src/app/[locale]/error.tsx` - Page 500

### 1.4 SEO & Sitemap
- Metadata sur page d'accueil
- `src/app/sitemap.ts` - Génération sitemap.xml

---

## Phase 2: Espace Client (18 endpoints)

### 2.1 Authentification (3 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /client/auth/logout` | - | `auth-context.tsx` |
| `POST /client/auth/request-password-reset` | `/forgot-password` | `forgot-password.tsx` |
| `POST /client/auth/reset-password` | `/reset-password` | `reset-password.tsx` |

### 2.2 Comptes (6 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /client/accounts` | `/account` | `account-list.tsx` |
| `GET /client/accounts/:id` | `/account/:id` | `account-detail.tsx` |
| `GET /client/accounts/:id/balance` | `/account/:id` | Intégré |
| `POST /client/accounts` | `/account` | `account-create-form.tsx` |
| `POST /client/accounts/savings` | `/account` | `savings-create-form.tsx` |
| `PUT /client/accounts/:id/name` | `/account/:id` | `account-rename-form.tsx` |
| `DELETE /client/accounts/:id` | `/account/:id` | Bouton supprimer |

### 2.3 Transactions (1 endpoint)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /client/transactions` | `/account/:id` | `transaction-form.tsx` |

### 2.4 Prêts (4 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /client/loans` | `/loans` | `loan-list.tsx` |
| `POST /client/loans/request` | `/loans` | `loan-request-form.tsx` |
| `POST /client/loans/simulate` | `/loans` | `loan-simulator.tsx` |
| `POST /client/loans/:id/repay` | `/loans/:id` | `loan-repay-form.tsx` |

### 2.5 Messages (1 endpoint)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /client/messages` | `/messages` | `message-form.tsx` |
| `GET /client/discussions` | `/messages` | `discussion-list.tsx` |

### 2.6 Notifications (1 endpoint)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /client/notifications` | `/notifications` | `notification-list.tsx` |

### 2.7 Portfolio & Stocks (6 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /client/stocks` | `/stocks` | `stock-list.tsx` |
| `GET /client/stocks/:id` | `/stocks/:id` | `stock-detail.tsx` |
| `GET /client/portfolio` | `/portfolio` | `portfolio-view.tsx` |
| `POST /client/portfolio` | `/portfolio` | `portfolio-create.tsx` |
| `GET /client/orders` | `/orders` | `order-list.tsx` |
| `POST /client/orders` | `/stocks/:id` | `order-form.tsx` |
| `DELETE /client/orders/:id` | `/orders` | Bouton annuler |

---

## Phase 3: Espace Conseiller (8 endpoints)

### 3.1 Authentification (2 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /advisor/auth/login` | `/advisor/login` | `advisor-login.tsx` |
| `POST /advisor/auth/register` | `/advisor/register` | `advisor-register.tsx` |

### 3.2 Prêts (3 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /advisor/loans/pending` | `/advisor/loans` | `pending-loan-list.tsx` |
| `POST /advisor/loans/:id/grant` | `/advisor/loans` | Bouton approuver |
| `POST /advisor/loans/:id/reject` | `/advisor/loans` | Bouton rejeter |

### 3.3 Messages (3 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /advisor/messages/:id/reply` | `/advisor/messages` | `message-reply-form.tsx` |
| `POST /advisor/discussions/:id/close` | `/advisor/messages` | Bouton fermer |
| `POST /advisor/discussions/:id/transfer` | `/advisor/messages` | `transfer-chat-form.tsx` |

---

## Phase 4: Espace Directeur (17 endpoints)

### 4.1 Authentification (2 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /director/auth/login` | `/admin/login` | `director-login.tsx` |
| `POST /director/auth/register` | `/admin/register` | `director-register.tsx` |

### 4.2 Gestion Clients (6 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /director/clients` | `/admin/users` | `client-list.tsx` |
| `GET /director/clients/:id/accounts` | `/admin/users/:id` | `client-accounts.tsx` |
| `POST /director/clients` | `/admin/users` | `client-create-form.tsx` |
| `PUT /director/clients/:id` | `/admin/users/:id` | `client-edit-form.tsx` |
| `DELETE /director/clients/:id` | `/admin/users/:id` | Bouton supprimer |
| `POST /director/clients/:id/ban` | `/admin/users/:id` | `ban-form.tsx` |

### 4.3 Gestion Entreprises (5 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `GET /director/companies` | `/admin/companies` | `company-list.tsx` |
| `GET /director/companies/:id` | `/admin/companies/:id` | `company-detail.tsx` |
| `POST /director/companies` | `/admin/companies` | `company-create-form.tsx` |
| `PUT /director/companies/:id` | `/admin/companies/:id` | `company-edit-form.tsx` |
| `DELETE /director/companies/:id` | `/admin/companies/:id` | Bouton supprimer |

### 4.4 Gestion Stocks (4 endpoints)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `POST /director/stocks` | `/admin/stocks` | `stock-create-form.tsx` |
| `PUT /director/stocks/:id` | `/admin/stocks/:id` | `stock-edit-form.tsx` |
| `DELETE /director/stocks/:id` | `/admin/stocks/:id` | Bouton supprimer |
| `POST /director/stocks/:id/toggle` | `/admin/stocks/:id` | Bouton toggle |

### 4.5 Taux d'épargne (1 endpoint)
| Endpoint | Route | Composant |
|----------|-------|-----------|
| `PUT /director/savings/rate` | `/admin/settings` | `savings-rate-form.tsx` |

---

## Phase 5: Routes i18n

Ajouter dans `src/i18n/routing.ts`:

```typescript
// Client
'/forgot-password': { en: '/forgot-password', fr: '/mot-de-passe-oublie' },
'/reset-password': { en: '/reset-password', fr: '/reinitialiser-mot-de-passe' },
'/stocks': { en: '/stocks', fr: '/actions' },
'/stocks/[id]': { en: '/stocks/[id]', fr: '/actions/[id]' },
'/portfolio': { en: '/portfolio', fr: '/portefeuille' },
'/orders': { en: '/orders', fr: '/ordres' },
'/loans/[id]': { en: '/loans/[id]', fr: '/emprunts/[id]' },
'/account/[id]': { en: '/account/[id]', fr: '/compte/[id]' },

// Advisor
'/advisor/login': { en: '/advisor/login', fr: '/conseiller/connexion' },
'/advisor/register': { en: '/advisor/register', fr: '/conseiller/inscription' },
'/advisor/loans': { en: '/advisor/loans', fr: '/conseiller/emprunts' },
'/advisor/messages': { en: '/advisor/messages', fr: '/conseiller/messages' },

// Director
'/admin/login': { en: '/admin/login', fr: '/admin/connexion' },
'/admin/register': { en: '/admin/register', fr: '/admin/inscription' },
'/admin/companies': { en: '/admin/companies', fr: '/admin/entreprises' },
'/admin/stocks': { en: '/admin/stocks', fr: '/admin/actions' },
'/admin/settings': { en: '/admin/settings', fr: '/admin/parametres' },
```

---

## Stratégie d'implémentation: Parallèle

Implémenter les 3 espaces simultanément, en commençant par l'infrastructure commune.

### Étape 1: Infrastructure commune
- Auth context avec gestion multi-rôle
- Routes protégées par rôle
- Pages 404/500
- Sitemap
- Navigation dynamique

### Étape 2: Authentification (tous rôles en parallèle)
- Client: logout, forgot/reset password
- Advisor: login, register
- Director: login, register

### Étape 3: Fonctionnalités principales (en parallèle)
- **Client**: Comptes, Transactions, Prêts, Messages, Notifications, Stocks
- **Advisor**: Gestion prêts, Messages
- **Director**: Gestion clients, Entreprises, Stocks, Paramètres

---

## Fichiers critiques à modifier

- `src/i18n/routing.ts` - Nouvelles routes
- `messages/fr.json` - Traductions FR
- `messages/en.json` - Traductions EN
- `components/naviagtion.tsx` - Navigation dynamique selon rôle
- `lib/api.ts` - Ajout headers auth

## Nouveaux fichiers à créer

- `contexts/auth-context.tsx`
- `components/protected-route.tsx`
- `src/app/[locale]/not-found.tsx`
- `src/app/[locale]/error.tsx`
- `src/app/sitemap.ts`
- ~40 composants de formulaires/listes
- ~15 nouvelles pages

---

## Contraintes respectées

- [x] Atomic design (composants UI réutilisables)
- [x] Context pour états partagés (auth)
- [x] React Hook Form + Zod
- [x] Pages 404/500
- [x] i18n FR/EN
- [x] sitemap.xml
- [x] SEO metadata
- [x] SSR maximum
- [x] Cache applicatif

## Hors scope (bonus)

- [ ] Cache Redis
- [ ] Animations
- [ ] Drag'n'Drop
