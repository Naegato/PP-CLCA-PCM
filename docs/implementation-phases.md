# Phases d'Implémentation Détaillées

Ce document détaille les 10 phases d'implémentation avec les tâches concrètes, fichiers à créer, et critères de validation.

## Phase 1: Infrastructure Foundation ⭐ PRIORITÉ CRITIQUE

**Durée estimée**: 3-4 jours
**Objectif**: Créer toute la base technique nécessaire pour les features

### Tâches

#### 1.1 - DatabaseModule
**Fichier**: `apps/api/nest-js/src/config/database.module.ts`

**Responsabilités**:
- Créer le provider `PRISMA_CLIENT`
- Créer le provider `REDIS_CLIENT`
- Gérer la connexion asynchrone
- Lire la configuration depuis ConfigService

**Code à implémenter**:
```typescript
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const dbProvider = configService.get<string>('DB_PROVIDER', 'prisma');
        if (dbProvider !== 'prisma') return null;

        const prisma = new PrismaClient({
          datasources: { db: { url: configService.get<string>('DB_URL') }}
        });

        await prisma.$connect();
        console.log('[DatabaseModule] Prisma connected');
        return prisma;
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL', 'redis://localhost:6379');
        const client = createClient({ url: redisUrl });
        await client.connect();
        console.log('[DatabaseModule] Redis connected');
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PRISMA_CLIENT', 'REDIS_CLIENT'],
})
export class DatabaseModule {}
```

**Validation**:
- [ ] PrismaClient se connecte correctement
- [ ] RedisClient se connecte correctement
- [ ] Les providers sont exportés

---

#### 1.2 - RepositoriesModule
**Fichier**: `apps/api/nest-js/src/config/repositories.module.ts`

**Responsabilités**:
- Créer les 15 repository providers
- Implémenter le système de mapping dynamique
- Gérer le fallback automatique Prisma/Redis

**Code à implémenter**:
- `REPOSITORY_TOKENS` constant
- `REPOSITORY_MAPPING` configuration
- `createRepositoryProvider()` factory function
- Module avec tous les providers

**Validation**:
- [ ] Les 15 repositories sont injectables
- [ ] Le mapping fonctionne selon DB_PROVIDER
- [ ] Le fallback fonctionne correctement
- [ ] Logs de debug affichent les résolutions

---

#### 1.3 - ServicesModule
**Fichier**: `apps/api/nest-js/src/config/services.module.ts`

**Responsabilités**:
- Provider `PasswordService` → Argon2PasswordService
- Provider `TokenService` → JwtTokenService (avec JWT_SECRET)
- Provider `MarketService`
- Provider `Notifier` → ConsoleNotifierService
- Provider `Security` → NestJsSecurityService (REQUEST scope)

**Services supplémentaires à créer**:
- `ConsoleNotifierService` (implémente Notifier)
- `NestJsSecurityService` (implémente Security)

**Validation**:
- [ ] Tous les services sont injectables
- [ ] JWT_SECRET est lu depuis la config
- [ ] Security est request-scoped

---

#### 1.4 - AuthGuard
**Fichier**: `apps/api/nest-js/src/common/guards/auth.guard.ts`

**Responsabilités**:
- Extraire le JWT du header `Authorization: Bearer <token>`
- Vérifier la signature avec JWT_SECRET
- Charger le user depuis UserRepository
- Attacher `user` à la request

**Validation**:
- [ ] Token valide → passe
- [ ] Token invalide → 401
- [ ] Token expiré → 401
- [ ] Pas de token → 401
- [ ] User attaché à request.user

---

#### 1.5 - RolesGuard
**Fichier**: `apps/api/nest-js/src/common/guards/roles.guard.ts`

**Responsabilités**:
- Lire metadata `roles` du handler
- Vérifier user.isClient()/isAdvisor()/isDirector()
- Rejeter si rôle non autorisé (403)

**Validation**:
- [ ] @Roles('client') → accepte les clients uniquement
- [ ] @Roles('advisor') → accepte les advisors uniquement
- [ ] @Roles('director') → accepte les directors uniquement
- [ ] Pas de @Roles → accepte tout le monde

---

#### 1.6 - ErrorInterceptor
**Fichier**: `apps/api/nest-js/src/common/interceptors/error.interceptor.ts`

**Responsabilités**:
- Détecter `instanceof Error` dans le résultat
- Mapper le nom de l'erreur → HTTP status code
- Throw HttpException avec le status approprié

**Mapping des erreurs**:
```typescript
const ERROR_STATUS_MAP = {
  LoginInvalidCredentialsError: 401,
  UserNotFoundByEmailError: 404,
  UserNotFoundByIdError: 404,
  EmailAlreadyExistError: 409,
  NotClient: 403,
  NotAdvisor: 403,
  NotDirector: 403,
  DEFAULT: 400,
};
```

**Validation**:
- [ ] Error converti en HttpException
- [ ] Status code correct pour chaque type d'erreur
- [ ] Success cases passent sans modification

---

#### 1.7 - Decorators
**Fichiers**:
- `apps/api/nest-js/src/common/decorators/current-user.decorator.ts`
- `apps/api/nest-js/src/common/decorators/roles.decorator.ts`

**@CurrentUser()**:
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
```

**@Roles()**:
```typescript
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

**Validation**:
- [ ] @CurrentUser() retourne le user de la request
- [ ] @Roles() définit les metadata correctement

---

#### 1.8 - Interfaces
**Fichier**: `apps/api/nest-js/src/common/interfaces/request-with-user.interface.ts`

```typescript
export interface RequestWithUser extends Request {
  user?: User;
}
```

**Validation**:
- [ ] Interface compilable
- [ ] Utilisable dans guards et decorators

---

#### 1.9 - Dépendances NPM
**Commande**:
```bash
cd apps/api/nest-js
npm install --save @nestjs/config class-validator class-transformer
npm install --save redis jsonwebtoken argon2
npm install --save @types/jsonwebtoken --save-dev
```

**Validation**:
- [ ] Toutes les dépendances installées
- [ ] Pas d'erreurs de compilation

---

### Tests de Phase 1

#### Test 1: Repository Injection
Créer un endpoint de test pour vérifier l'injection:

```typescript
@Controller('test')
export class TestController {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepo: UserRepository,
  ) {}

  @Get('repo')
  async testRepo() {
    return {
      repoType: this.userRepo.constructor.name,
      message: 'Repository injection works!'
    };
  }
}
```

**Validation**:
- [ ] GET /test/repo retourne le nom du repository
- [ ] Le nom correspond au DB_PROVIDER configuré

#### Test 2: Authentication Flow
Créer un endpoint protégé:

```typescript
@Controller('test')
export class TestController {
  @Get('protected')
  @UseGuards(AuthGuard)
  async testAuth(@CurrentUser() user: User) {
    return {
      userId: user.identifier,
      email: user.email.value,
      message: 'Auth works!'
    };
  }
}
```

**Validation**:
- [ ] Sans token → 401
- [ ] Avec token valide → 200 + user data
- [ ] Avec token invalide → 401

#### Test 3: Role Guard
```typescript
@Controller('test')
export class TestController {
  @Get('client-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('client')
  async testClientRole(@CurrentUser() user: User) {
    return { message: 'You are a client!' };
  }
}
```

**Validation**:
- [ ] Client authentifié → 200
- [ ] Advisor authentifié → 403
- [ ] Director authentifié → 403

---

## Phase 2: Authentication ⭐ PRIORITÉ HAUTE

**Durée estimée**: 2-3 jours
**Objectif**: Implémenter l'authentification pour les 3 rôles

### 2.1 - Client Authentication

**Module**: `apps/api/nest-js/src/modules/client/client.module.ts`
**Controller**: `apps/api/nest-js/src/modules/client/controllers/auth.controller.ts`

**Use cases à provider**:
1. ClientLogin
2. ClientRegistration
3. ClientLogout
4. ClientRequestPasswordReset
5. ClientResetPassword

**DTOs à créer**:
- `dto/auth/login.dto.ts`
- `dto/auth/register.dto.ts`
- `dto/auth/reset-password.dto.ts`
- `dto/auth/request-password-reset.dto.ts`

**Endpoints**:
```typescript
POST /client/auth/login
POST /client/auth/register
POST /client/auth/logout (protégé)
POST /client/auth/password-reset/request
POST /client/auth/password-reset/confirm
```

**Validation**:
- [ ] Login avec credentials valides → token JWT
- [ ] Login avec credentials invalides → 401
- [ ] Register avec email existant → 409
- [ ] Register avec données valides → user créé
- [ ] Logout avec token valide → 200
- [ ] Password reset flow complet fonctionne

---

### 2.2 - Advisor Authentication

**Module**: `apps/api/nest-js/src/modules/advisor/advisor.module.ts`
**Controller**: `apps/api/nest-js/src/modules/advisor/controllers/auth.controller.ts`

**Use cases**:
1. AdvisorLogin
2. AdvisorRegistration

**DTOs**:
- `dto/auth/login.dto.ts`
- `dto/auth/register.dto.ts`

**Endpoints**:
```typescript
POST /advisor/auth/login
POST /advisor/auth/register
```

**Validation**:
- [ ] Login advisor fonctionne
- [ ] Register advisor fonctionne
- [ ] Token JWT généré correctement

---

### 2.3 - Director Authentication

**Module**: `apps/api/nest-js/src/modules/director/director.module.ts`
**Controller**: `apps/api/nest-js/src/modules/director/controllers/auth.controller.ts`

**Use cases**:
1. DirectorLogin
2. DirectorRegistration

**Endpoints**:
```typescript
POST /director/auth/login
POST /director/auth/register
```

**Validation**:
- [ ] Login director fonctionne
- [ ] Register director fonctionne

---

## Phase 3: Client Core Features 🔵

**Durée estimée**: 3-4 jours

### 3.1 - Accounts Management

**Controller**: `modules/client/controllers/accounts.controller.ts`

**Use cases (6)**:
- ClientCreateAccount
- ClientDeleteAccount
- ClientGetAccount
- ClientGetBalanceAccount
- ClientSavingAccountCreate
- ClientUpdateNameAccount

**Endpoints**:
```
POST   /client/accounts           (create)
GET    /client/accounts/:id       (get)
GET    /client/accounts/:id/balance (balance)
PATCH  /client/accounts/:id       (update name)
DELETE /client/accounts/:id       (delete)
POST   /client/accounts/savings   (create savings)
```

**Validation**:
- [ ] Créer un compte fonctionne
- [ ] Récupérer solde fonctionne
- [ ] Modifier nom fonctionne
- [ ] Supprimer compte fonctionne
- [ ] Créer compte épargne fonctionne

---

### 3.2 - Transactions

**Controller**: `modules/client/controllers/transactions.controller.ts`

**Use cases (1)**:
- ClientSendTransaction

**Endpoints**:
```
POST /client/transactions (send)
```

**Validation**:
- [ ] Envoyer transaction fonctionne
- [ ] Soldes mis à jour correctement
- [ ] Montant insuffisant → erreur

---

### 3.3 - Notifications

**Controller**: `modules/client/controllers/notifications.controller.ts`

**Use cases (1)**:
- ClientGetNotifications

**Endpoints**:
```
GET /client/notifications
```

**Validation**:
- [ ] Liste des notifications retournée
- [ ] Filtrée par utilisateur courant

---

## Phase 4: Client Loans 🔵

**Durée estimée**: 2 jours

**Controller**: `modules/client/controllers/loans.controller.ts`

**Use cases (4)**:
- ClientGetLoans
- ClientRequestLoan
- ClientSimulateLoan
- ClientRepayLoan

**Endpoints**:
```
GET  /client/loans           (list)
POST /client/loans/request   (request)
POST /client/loans/simulate  (simulate)
POST /client/loans/:id/repay (repay)
```

**Validation**:
- [ ] Simulation de prêt fonctionne
- [ ] Demande de prêt créée
- [ ] Liste des prêts retournée
- [ ] Remboursement fonctionne

---

## Phase 5: Stock Trading System 🟢

**Durée estimée**: 4 jours

### 5.1 - Stocks Viewing

**Controller**: `modules/client/controllers/stocks.controller.ts`

**Use cases (2)**:
- ClientGetAvailableStocks
- ClientGetStockWithPrice

**Endpoints**:
```
GET /client/stocks      (available)
GET /client/stocks/:id  (with price)
```

---

### 5.2 - Stock Orders

**Controller**: `modules/client/controllers/stock-orders.controller.ts`

**Use cases (4)**:
- ClientGetStockOrders
- ClientRegisterStockOrder
- ClientCancelStockOrder
- ClientMatchStockOrder

**Endpoints**:
```
GET  /client/stock-orders          (list)
POST /client/stock-orders          (register)
POST /client/stock-orders/:id/cancel (cancel)
POST /client/stock-orders/:id/match  (match)
```

---

### 5.3 - Portfolio

**Controller**: `modules/client/controllers/portfolio.controller.ts`

**Use cases (2)**:
- ClientCreatePortfolio
- ClientGetPortfolio

**Endpoints**:
```
POST /client/portfolio              (create)
GET  /client/portfolio/:accountId   (get)
```

**Validation Phase 5**:
- [ ] Consulter actions disponibles
- [ ] Créer ordre d'achat
- [ ] Annuler ordre
- [ ] Matcher ordre
- [ ] Portfolio affiché correctement

---

## Phase 6: Client Messages 🟢

**Durée estimée**: 1 jour

**Controller**: `modules/client/controllers/messages.controller.ts`

**Use cases (1)**:
- ClientSendMessage

**Endpoints**:
```
POST /client/messages
```

**Validation**:
- [ ] Message envoyé à advisor
- [ ] Discussion créée si nécessaire

---

## Phase 7: Advisor Features 🔵

**Durée estimée**: 2-3 jours

### 7.1 - Loan Management

**Controller**: `modules/advisor/controllers/loans.controller.ts`

**Use cases (3)**:
- AdvisorGetPendingLoans
- AdvisorGrantLoan
- AdvisorRejectLoan

**Endpoints**:
```
GET  /advisor/loans/pending   (pending)
POST /advisor/loans/:id/grant (grant)
POST /advisor/loans/:id/reject (reject)
```

---

### 7.2 - Messages

**Controller**: `modules/advisor/controllers/messages.controller.ts`

**Use cases (3)**:
- AdvisorReplyMessage
- AdvisorCloseChat
- AdvisorTransferChat

**Endpoints**:
```
POST /advisor/messages/:id/reply      (reply)
POST /advisor/discussions/:id/close   (close)
POST /advisor/discussions/:id/transfer (transfer)
```

**Validation Phase 7**:
- [ ] Advisor voit demandes de prêts
- [ ] Approuver prêt fonctionne
- [ ] Rejeter prêt fonctionne
- [ ] Répondre à message fonctionne
- [ ] Fermer discussion fonctionne

---

## Phase 8: Director Features 🔵

**Durée estimée**: 4-5 jours

### 8.1 - Client Management

**Controller**: `modules/director/controllers/clients.controller.ts`

**Use cases (6)**:
- DirectorGetAllClients
- DirectorGetClientAccount
- DirectorManageBan
- DirectorManageCreate
- DirectorManageDelete
- DirectorManageUpdate

**Endpoints**:
```
GET    /director/clients              (all)
GET    /director/clients/:id/accounts (accounts)
POST   /director/clients              (create)
PATCH  /director/clients/:id          (update)
DELETE /director/clients/:id          (delete)
POST   /director/clients/:id/ban      (ban)
```

---

### 8.2 - Company Management

**Controller**: `modules/director/controllers/companies.controller.ts`

**Use cases (5)**:
- DirectorGetAllCompanies
- DirectorGetCompany
- DirectorCreateCompany
- DirectorUpdateCompany
- DirectorDeleteCompany

**Endpoints**:
```
GET    /director/companies     (all)
GET    /director/companies/:id (get)
POST   /director/companies     (create)
PATCH  /director/companies/:id (update)
DELETE /director/companies/:id (delete)
```

---

### 8.3 - Stock Management

**Controller**: `modules/director/controllers/stocks.controller.ts`

**Use cases (4)**:
- DirectorCreateStock
- DirectorUpdateStock
- DirectorDeleteStock
- DirectorToggleStockListing

**Endpoints**:
```
POST   /director/stocks                     (create)
PATCH  /director/stocks/:id                 (update)
DELETE /director/stocks/:id                 (delete)
POST   /director/stocks/:id/toggle-listing  (toggle)
```

---

### 8.4 - Savings Rate

**Controller**: `modules/director/controllers/savings.controller.ts`

**Use cases (1)**:
- DirectorChangeSavingRate

**Endpoints**:
```
PATCH /director/savings/rate
```

**Validation Phase 8**:
- [ ] CRUD clients fonctionne
- [ ] CRUD companies fonctionne
- [ ] CRUD stocks fonctionne
- [ ] Bannir utilisateur fonctionne
- [ ] Changer taux d'épargne fonctionne

---

## Phase 9: Engine & Background Jobs 🟢

**Durée estimée**: 2 jours

**Module**: `modules/engine/engine.module.ts`

**Services cron**:
- `services/daily-interest.service.ts`
- `services/loan-notification.service.ts`

**Use cases**:
- GenerateDailyInterest
- NotifyLoanToPay

**Configuration**:
```typescript
@Injectable()
export class DailyInterestService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyInterest() {
    // ...
  }
}
```

**Validation**:
- [ ] Cron configuré correctement
- [ ] GenerateDailyInterest fonctionne
- [ ] NotifyLoanToPay fonctionne

---

## Phase 10: Shared Features 🟢

**Durée estimée**: 1 jour

**Module**: `modules/shared/shared.module.ts`

**Services**:
- `services/notification.service.ts`

**Use cases**:
- NotifyClientSavingRateChange
- NotifyLoanStatus

**Validation**:
- [ ] Notifications envoyées correctement

---

## Phase 11: Testing & Documentation 📝

**Durée estimée**: 3-4 jours

### 11.1 - Tests E2E

**Fichiers à créer**:
- `test/e2e/client-auth.e2e-spec.ts`
- `test/e2e/client-accounts.e2e-spec.ts`
- `test/e2e/client-loans.e2e-spec.ts`
- `test/e2e/advisor-loans.e2e-spec.ts`
- `test/e2e/director-clients.e2e-spec.ts`

**Validation**:
- [ ] Coverage > 70%
- [ ] Tous les endpoints critiques testés

---

### 11.2 - Documentation Swagger

**Configuration**:
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('PP-CLCA-PCM API')
  .setDescription('Banking API with Clean Architecture')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

**Validation**:
- [ ] Swagger accessible sur /api
- [ ] Tous les endpoints documentés
- [ ] Schémas DTOs visibles

---

### 11.3 - README

**Contenu**:
- Installation
- Configuration
- Scripts disponibles
- Architecture
- Tests
- Deployment

**Validation**:
- [ ] README complet
- [ ] Instructions claires

---

## Checklist Globale

### Infrastructure
- [ ] DatabaseModule
- [ ] RepositoriesModule (15 repos)
- [ ] ServicesModule
- [ ] AuthGuard
- [ ] RolesGuard
- [ ] ErrorInterceptor
- [ ] Decorators
- [ ] Interfaces

### Feature Modules
- [ ] Client (26 use cases, ~30 endpoints)
- [ ] Advisor (8 use cases, ~8 endpoints)
- [ ] Director (19 use cases, ~24 endpoints)
- [ ] Engine (2 use cases, 2 crons)
- [ ] Shared (2 use cases)

### Tests & Docs
- [ ] E2E tests
- [ ] Swagger documentation
- [ ] README

### Total
- [ ] **56/56 use cases implémentés**
- [ ] **~62 endpoints REST**
- [ ] **Tests E2E passent**
- [ ] **Documentation complète**

---

**Dernière mise à jour**: 2026-01-06
