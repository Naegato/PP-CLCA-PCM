# API Endpoints Mapping

Ce document présente le mapping complet de tous les endpoints API avec leurs use cases et controllers associés.

## Table des matières

- [API Endpoints Mapping](#api-endpoints-mapping)
  - [Table des matières](#table-des-matières)
  - [App](#app)
  - [Advisor](#advisor)
    - [Advisor Auth](#advisor-auth)
    - [Advisor Messages](#advisor-messages)
    - [Advisor Loans](#advisor-loans)
  - [Client](#client)
    - [Client Auth](#client-auth)
    - [Client Accounts](#client-accounts)
    - [Client Messages](#client-messages)
    - [Client Loans](#client-loans)
    - [Client Notifications](#client-notifications)
    - [Client Stock Orders](#client-stock-orders)
    - [Client Transactions](#client-transactions)
    - [Client Stocks](#client-stocks)
    - [Client Portfolio](#client-portfolio)
  - [Director](#director)
    - [Director Auth](#director-auth)
    - [Director Stocks](#director-stocks)
    - [Director Companies](#director-companies)
    - [Director Clients](#director-clients)
    - [Director Savings](#director-savings)
  - [Statistiques](#statistiques)
  - [Fichiers de Tests](#fichiers-de-tests)
  - [Notes](#notes)

---

## App

**Controller**: `apps/api/nest-js/src/app.controller.ts`
**Test File**: `apps/api/nest-js/test/app.e2e-spec.ts`

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/` | N/A | Health check endpoint |
| GET | `/test` | `ClientLogin` | Test endpoint |

---

## Advisor

### Advisor Auth

**Controller**: `apps/api/nest-js/src/modules/advisor/controllers/auth.controller.ts`
**Test File**: `apps/api/nest-js/test/advisor/auth.e2e-spec.ts`

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/advisor/auth/login` | `AdvisorLogin` | Login avec email et password |
| POST | `/advisor/auth/register` | `AdvisorRegistration` | Créer un nouveau compte advisor |

### Advisor Messages

**Controller**: `apps/api/nest-js/src/modules/advisor/controllers/messages.controller.ts`
**Test File**: `apps/api/nest-js/test/advisor/messages.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: advisor)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/advisor/discussions/:id/reply` | `AdvisorReplyMessage` | Répondre dans une discussion |
| POST | `/advisor/discussions/:id/close` | `AdvisorCloseChat` | Fermer une discussion |
| POST | `/advisor/discussions/:id/transfer` | `AdvisorTransferChat` | Transférer une discussion à un autre advisor |

### Advisor Loans

**Controller**: `apps/api/nest-js/src/modules/advisor/controllers/loans.controller.ts`
**Test File**: `apps/api/nest-js/test/advisor/loans.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: advisor)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/advisor/loans/pending` | `AdvisorGetPendingLoans` | Récupérer les demandes de prêt en attente |
| POST | `/advisor/loans/:id/grant` | `AdvisorGrantLoan` | Approuver une demande de prêt |
| POST | `/advisor/loans/:id/reject` | `AdvisorRejectLoan` | Rejeter une demande de prêt |

---

## Client

### Client Auth

**Controller**: `apps/api/nest-js/src/modules/client/controllers/auth.controller.ts`
**Test File**: `apps/api/nest-js/test/client/auth.e2e-spec.ts`

| Method | Endpoint | Use Case | Guards | Description |
|--------|----------|----------|--------|-------------|
| POST | `/client/auth/login` | `ClientLogin` | None | Login avec email et password |
| POST | `/client/auth/register` | `ClientRegistration` | None | Créer un nouveau compte client |
| POST | `/client/auth/logout` | `ClientLogout` | AuthGuard, RolesGuard (client) | Déconnexion |
| POST | `/client/auth/password-reset/request` | `ClientRequestPasswordReset` | None | Demander la réinitialisation du mot de passe |
| POST | `/client/auth/password-reset/confirm` | `ClientResetPassword` | None | Confirmer la réinitialisation avec le token |

### Client Accounts

**Controller**: `apps/api/nest-js/src/modules/client/controllers/accounts.controller.ts`
**Test File**: `apps/api/nest-js/test/client/accounts.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/client/accounts` | `ClientCreateAccount` | Créer un nouveau compte normal |
| POST | `/client/accounts/savings` | `ClientSavingAccountCreate` | Créer un nouveau compte épargne |
| GET | `/client/accounts/:id` | `ClientGetAccount` | Récupérer un compte par son ID |
| GET | `/client/accounts/:id/balance` | `ClientGetBalanceAccount` | Récupérer le solde d'un compte |
| PATCH | `/client/accounts/:id` | `ClientUpdateNameAccount` | Modifier le nom d'un compte |
| DELETE | `/client/accounts/:id` | `ClientDeleteAccount` | Supprimer un compte |

### Client Messages

**Controller**: `apps/api/nest-js/src/modules/client/controllers/messages.controller.ts`
**Test File**: `apps/api/nest-js/test/client/messages.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/client/messages` | `ClientSendMessage` | Envoyer un message à un advisor |

### Client Loans

**Controller**: `apps/api/nest-js/src/modules/client/controllers/loans.controller.ts`
**Test File**: `apps/api/nest-js/test/client/loans.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/client/loans` | `ClientGetLoans` | Récupérer tous les prêts du client |
| POST | `/client/loans/request` | `ClientRequestLoan` | Demander un nouveau prêt |
| POST | `/client/loans/simulate` | `ClientSimulateLoan` | Simuler un prêt (calcul des mensualités) |
| POST | `/client/loans/repay` | `ClientRepayLoan` | Rembourser un prêt |

### Client Notifications

**Controller**: `apps/api/nest-js/src/modules/client/controllers/notifications.controller.ts`
**Test File**: `apps/api/nest-js/test/client/notifications.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/client/notifications` | `ClientGetNotifications` | Récupérer toutes les notifications du client |

### Client Stock Orders

**Controller**: `apps/api/nest-js/src/modules/client/controllers/stock-orders.controller.ts`
**Test File**: `apps/api/nest-js/test/client/stock-orders.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/client/stock-orders` | `ClientGetStockOrders` | Récupérer tous les ordres du client |
| POST | `/client/stock-orders` | `ClientRegisterStockOrder` + `ClientMatchStockOrder` | Créer un nouvel ordre d'achat ou de vente |
| POST | `/client/stock-orders/:id/match` | `ClientMatchStockOrder` | Matcher un ordre avec les ordres existants |
| DELETE | `/client/stock-orders/:id` | `ClientCancelStockOrder` | Annuler un ordre |

### Client Transactions

**Controller**: `apps/api/nest-js/src/modules/client/controllers/transactions.controller.ts`
**Test File**: `apps/api/nest-js/test/client/transactions.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/client/transactions` | `ClientSendTransaction` | Envoyer de l'argent d'un compte à un autre |

### Client Stocks

**Controller**: `apps/api/nest-js/src/modules/client/controllers/stocks.controller.ts`
**Test File**: `apps/api/nest-js/test/client/stocks.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/client/stocks` | `ClientGetAvailableStocks` | Récupérer toutes les actions disponibles (listed) |
| GET | `/client/stocks/:id` | `ClientGetStockWithPrice` | Récupérer une action avec son prix de marché |

### Client Portfolio

**Controller**: `apps/api/nest-js/src/modules/client/controllers/portfolio.controller.ts`
**Test File**: `apps/api/nest-js/test/client/portfolio.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: client)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/client/portfolio` | `ClientCreatePortfolio` | Créer un nouveau portfolio pour un compte |
| GET | `/client/portfolio/:accountId` | `ClientGetPortfolio` | Récupérer le portfolio d'un compte |

---

## Director

### Director Auth

**Controller**: `apps/api/nest-js/src/modules/director/controllers/auth.controller.ts`
**Test File**: `apps/api/nest-js/test/director/auth.e2e-spec.ts`

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/director/auth/login` | `DirectorLogin` | Login avec email et password |
| POST | `/director/auth/register` | `DirectorRegistration` | Créer un nouveau compte director |

### Director Stocks

**Controller**: `apps/api/nest-js/src/modules/director/controllers/stocks.controller.ts`
**Test File**: `apps/api/nest-js/test/director/stocks.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: director)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| POST | `/director/stocks` | `DirectorCreateStock` | Créer une action |
| PATCH | `/director/stocks/:id` | `DirectorUpdateStock` | Modifier une action |
| DELETE | `/director/stocks/:id` | `DirectorDeleteStock` | Supprimer une action |
| POST | `/director/stocks/:id/toggle-listing` | `DirectorToggleStockListing` | Activer/désactiver le listing d'une action |

### Director Companies

**Controller**: `apps/api/nest-js/src/modules/director/controllers/companies.controller.ts`
**Test File**: `apps/api/nest-js/test/director/companies.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: director)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/director/companies` | `DirectorGetAllCompanies` | Récupérer toutes les entreprises |
| GET | `/director/companies/:id` | `DirectorGetCompany` | Récupérer une entreprise |
| POST | `/director/companies` | `DirectorCreateCompany` | Créer une entreprise |
| PATCH | `/director/companies/:id` | `DirectorUpdateCompany` | Modifier une entreprise |
| DELETE | `/director/companies/:id` | `DirectorDeleteCompany` | Supprimer une entreprise |

### Director Clients

**Controller**: `apps/api/nest-js/src/modules/director/controllers/clients.controller.ts`
**Test File**: `apps/api/nest-js/test/director/clients.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: director)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| GET | `/director/clients` | `DirectorGetAllClients` | Récupérer tous les clients |
| GET | `/director/clients/:id/accounts` | `DirectorGetClientAccounts` | Récupérer les comptes d'un client |
| POST | `/director/clients` | `DirectorManageCreate` | Créer un nouveau client |
| PATCH | `/director/clients/:id` | `DirectorManageUpdate` | Modifier un client |
| DELETE | `/director/clients/:id` | `DirectorManageDelete` | Supprimer un client |
| POST | `/director/clients/:id/ban` | `DirectorManageBan` | Bannir un client |

### Director Savings

**Controller**: `apps/api/nest-js/src/modules/director/controllers/savings.controller.ts`
**Test File**: `apps/api/nest-js/test/director/savings.e2e-spec.ts`
**Guards**: AuthGuard, RolesGuard (role: director)

| Method | Endpoint | Use Case | Description |
|--------|----------|----------|-------------|
| PATCH | `/director/savings/rate` | `DirectorChangeSavingRate` | Modifier le taux d'épargne d'un type de compte |

---

## Statistiques

- **Total endpoints**: 54
- **App**: 2 endpoints
- **Advisor**: 8 endpoints (2 auth, 3 messages, 3 loans)
- **Client**: 34 endpoints (5 auth, 6 accounts, 1 messages, 4 loans, 1 notifications, 4 stock orders, 1 transactions, 2 stocks, 2 portfolio)
- **Director**: 10 endpoints (2 auth, 4 stocks, 5 companies, 6 clients, 1 savings)

## Fichiers de Tests

Tous les tests E2E sont organisés dans `apps/api/nest-js/test/` selon la structure suivante:

```
test/
├── app.e2e-spec.ts
├── advisor/
│   ├── auth.e2e-spec.ts
│   ├── messages.e2e-spec.ts
│   └── loans.e2e-spec.ts
├── client/
│   ├── auth.e2e-spec.ts
│   ├── accounts.e2e-spec.ts
│   ├── messages.e2e-spec.ts
│   ├── loans.e2e-spec.ts
│   ├── notifications.e2e-spec.ts
│   ├── stock-orders.e2e-spec.ts
│   ├── transactions.e2e-spec.ts
│   ├── stocks.e2e-spec.ts
│   └── portfolio.e2e-spec.ts
└── director/
    ├── auth.e2e-spec.ts
    ├── stocks.e2e-spec.ts
    ├── companies.e2e-spec.ts
    ├── clients.e2e-spec.ts
    └── savings.e2e-spec.ts
```

**Commande pour lancer les tests**: `make api-test`

## Notes

- Tous les endpoints protégés utilisent `AuthGuard` et `RolesGuard`
- Tous les controllers utilisent `ErrorInterceptor` pour la gestion des erreurs
- Les use cases sont importés depuis `@pp-clca-pcm/application`
- Les repositories et services sont injectés via dependency injection NestJS
- Chaque module possède son propre fichier de test E2E
