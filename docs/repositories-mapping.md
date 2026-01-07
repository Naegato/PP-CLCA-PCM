# Système de Mapping des Repositories

Ce document décrit le système de mapping dynamique des repositories basé sur la variable d'environnement `DB_PROVIDER`.

## Vue d'ensemble

Le projet utilise **15 interfaces de repositories** avec plusieurs implémentations:
- **Prisma** (PostgreSQL/MariaDB)
- **Redis** (Cache/NoSQL)
- **Memory** (Tests uniquement)
- **MariaDB** (Certains cas spécifiques)

Le système de mapping permet de **basculer automatiquement** entre Prisma et Redis selon la configuration.

## Interfaces de Repositories

### Liste complète (15 repositories)

1. **UserRepository** - Gestion des utilisateurs
2. **AccountRepository** - Comptes bancaires
3. **AccountTypeRepository** - Types de comptes (courant, épargne)
4. **AdvisorRepository** - Repository spécifique advisors
5. **BanRepository** - Bannissements d'utilisateurs
6. **CompanyRepository** - Entreprises cotées
7. **DiscussionRepository** - Discussions client-advisor
8. **MessageRepository** - Messages dans les discussions
9. **LoanRepository** - Prêts accordés
10. **LoanRequestRepository** - Demandes de prêts
11. **NotificationRepository** - Notifications utilisateurs
12. **PortfolioRepository** - Portfolios d'actions
13. **StockRepository** - Actions disponibles
14. **StockOrderRepository** - Ordres d'achat/vente
15. **TransactionRepository** - Transactions bancaires

## Matrice d'implémentation

| Repository | Prisma | Redis | Memory | MariaDB | Recommandation |
|------------|--------|-------|--------|---------|----------------|
| **UserRepository** | ✅ | ✅ | ✅ | ❌ | Prisma (primaire) |
| **AccountRepository** | ✅ | ✅ | ✅ | ❌ | Prisma (primaire) |
| **AccountTypeRepository** | ✅ | ✅ | ✅ | ✅ | Prisma (primaire) |
| **BanRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **CompanyRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **NotificationRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **PortfolioRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **StockRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **StockOrderRepository** | ✅ | ❌ | ✅ | ❌ | Prisma (seule option) |
| **AdvisorRepository** | ❌ | ✅ | ❌ | ❌ | Redis (seule option) |
| **DiscussionRepository** | ❌ | ✅ | ⚠️ | ✅ | Redis (primaire) |
| **MessageRepository** | ❌ | ✅ | ⚠️ | ❌ | Redis (seule option) |
| **LoanRepository** | ❌ | ✅ | ⚠️ | ❌ | Redis (seule option) |
| **LoanRequestRepository** | ❌ | ✅ | ⚠️ | ❌ | Redis (seule option) |
| **TransactionRepository** | ❌ | ✅ | ⚠️ | ❌ | Redis (seule option) |

**Légende**:
- ✅ Implémentation complète
- ⚠️ Implémentation pour tests uniquement
- ❌ Non implémenté

## Stratégie de Fallback

### Quand DB_PROVIDER=prisma

Le système utilise Prisma comme provider principal avec fallback sur Redis pour les repositories manquants:

| Repository | Implémentation utilisée | Stratégie |
|------------|------------------------|-----------|
| UserRepository | **PrismaUserRepository** | Direct |
| AccountRepository | **PrismaAccountRepository** | Direct |
| AccountTypeRepository | **PrismaAccountTypeRepository** | Direct |
| BanRepository | **PrismaBanRepository** | Direct |
| CompanyRepository | **PrismaCompanyRepository** | Direct |
| NotificationRepository | **PrismaNotificationRepository** | Direct |
| PortfolioRepository | **PrismaPortfolioRepository** | Direct |
| StockRepository | **PrismaStockRepository** | Direct |
| StockOrderRepository | **PrismaStockOrderRepository** | Direct |
| **AdvisorRepository** | **RedisAdvisorRepository** | ⚠️ Fallback Redis |
| **DiscussionRepository** | **RedisDiscussionRepository** | ⚠️ Fallback Redis |
| **MessageRepository** | **RedisMessageRepository** | ⚠️ Fallback Redis |
| **LoanRepository** | **RedisLoanRepository** | ⚠️ Fallback Redis |
| **LoanRequestRepository** | **RedisLoanRequestRepository** | ⚠️ Fallback Redis |
| **TransactionRepository** | **RedisTransactionRepository** | ⚠️ Fallback Redis |

### Quand DB_PROVIDER=redis

Le système utilise Redis comme provider principal avec fallback sur Prisma:

| Repository | Implémentation utilisée | Stratégie |
|------------|------------------------|-----------|
| UserRepository | **RedisUserRepository** | Direct |
| AccountRepository | **RedisAccountRepository** | Direct |
| AccountTypeRepository | **RedisAccountTypeRepository** | Direct |
| AdvisorRepository | **RedisAdvisorRepository** | Direct |
| DiscussionRepository | **RedisDiscussionRepository** | Direct |
| MessageRepository | **RedisMessageRepository** | Direct |
| LoanRepository | **RedisLoanRepository** | Direct |
| LoanRequestRepository | **RedisLoanRequestRepository** | Direct |
| TransactionRepository | **RedisTransactionRepository** | Direct |
| **BanRepository** | **PrismaBanRepository** | ⚠️ Fallback Prisma |
| **CompanyRepository** | **PrismaCompanyRepository** | ⚠️ Fallback Prisma |
| **NotificationRepository** | **PrismaNotificationRepository** | ⚠️ Fallback Prisma |
| **PortfolioRepository** | **PrismaPortfolioRepository** | ⚠️ Fallback Prisma |
| **StockRepository** | **PrismaStockRepository** | ⚠️ Fallback Prisma |
| **StockOrderRepository** | **PrismaStockOrderRepository** | ⚠️ Fallback Prisma |

## Implémentation NestJS

### Tokens d'injection

```typescript
export const REPOSITORY_TOKENS = {
  USER: 'UserRepository',
  ACCOUNT: 'AccountRepository',
  ACCOUNT_TYPE: 'AccountTypeRepository',
  ADVISOR: 'AdvisorRepository',
  BAN: 'BanRepository',
  COMPANY: 'CompanyRepository',
  DISCUSSION: 'DiscussionRepository',
  MESSAGE: 'MessageRepository',
  LOAN: 'LoanRepository',
  LOAN_REQUEST: 'LoanRequestRepository',
  NOTIFICATION: 'NotificationRepository',
  PORTFOLIO: 'PortfolioRepository',
  STOCK: 'StockRepository',
  STOCK_ORDER: 'StockOrderRepository',
  TRANSACTION: 'TransactionRepository',
} as const;
```

### Mapping des implémentations

```typescript
const REPOSITORY_MAPPING = {
  prisma: {
    [REPOSITORY_TOKENS.USER]: PrismaUserRepository,
    [REPOSITORY_TOKENS.ACCOUNT]: PrismaAccountRepository,
    [REPOSITORY_TOKENS.ACCOUNT_TYPE]: PrismaAccountTypeRepository,
    [REPOSITORY_TOKENS.BAN]: PrismaBanRepository,
    [REPOSITORY_TOKENS.COMPANY]: PrismaCompanyRepository,
    [REPOSITORY_TOKENS.NOTIFICATION]: PrismaNotificationRepository,
    [REPOSITORY_TOKENS.PORTFOLIO]: PrismaPortfolioRepository,
    [REPOSITORY_TOKENS.STOCK]: PrismaStockRepository,
    [REPOSITORY_TOKENS.STOCK_ORDER]: PrismaStockOrderRepository,
    // Fallback sur Redis
    [REPOSITORY_TOKENS.LOAN]: null,
    [REPOSITORY_TOKENS.LOAN_REQUEST]: null,
    [REPOSITORY_TOKENS.TRANSACTION]: null,
    [REPOSITORY_TOKENS.DISCUSSION]: null,
    [REPOSITORY_TOKENS.MESSAGE]: null,
    [REPOSITORY_TOKENS.ADVISOR]: null,
  },
  redis: {
    [REPOSITORY_TOKENS.USER]: RedisUserRepository,
    [REPOSITORY_TOKENS.ACCOUNT]: RedisAccountRepository,
    [REPOSITORY_TOKENS.ACCOUNT_TYPE]: RedisAccountTypeRepository,
    [REPOSITORY_TOKENS.ADVISOR]: RedisAdvisorRepository,
    [REPOSITORY_TOKENS.DISCUSSION]: RedisDiscussionRepository,
    [REPOSITORY_TOKENS.MESSAGE]: RedisMessageRepository,
    [REPOSITORY_TOKENS.LOAN]: RedisLoanRepository,
    [REPOSITORY_TOKENS.LOAN_REQUEST]: RedisLoanRequestRepository,
    [REPOSITORY_TOKENS.TRANSACTION]: RedisTransactionRepository,
    // Fallback sur Prisma
    [REPOSITORY_TOKENS.STOCK]: null,
    [REPOSITORY_TOKENS.STOCK_ORDER]: null,
    [REPOSITORY_TOKENS.PORTFOLIO]: null,
    [REPOSITORY_TOKENS.COMPANY]: null,
    [REPOSITORY_TOKENS.BAN]: null,
    [REPOSITORY_TOKENS.NOTIFICATION]: null,
  },
};
```

### Factory avec fallback automatique

```typescript
function createRepositoryProvider(token: string): Provider {
  return {
    provide: token,
    useFactory: (configService: ConfigService, prismaClient, redisClient) => {
      const dbProvider = configService.get<string>('DB_PROVIDER', 'prisma');

      // Essayer le provider principal
      const primaryMapping = REPOSITORY_MAPPING[dbProvider];
      const fallbackMapping = dbProvider === 'prisma'
        ? REPOSITORY_MAPPING.redis
        : REPOSITORY_MAPPING.prisma;

      // Sélectionner l'implémentation (avec fallback)
      const RepoClass = primaryMapping[token] || fallbackMapping[token];

      if (!RepoClass) {
        throw new Error(
          `No repository implementation found for ${token}. ` +
          `Primary: ${dbProvider}, Fallback also unavailable.`
        );
      }

      // Déterminer quel client utiliser
      const isPrismaRepo = primaryMapping[token] !== null;
      const client = isPrismaRepo ? prismaClient : redisClient;

      // Log pour debug
      console.log(`[RepositoriesModule] ${token} -> ${RepoClass.name} (${dbProvider})`);

      return new RepoClass(client);
    },
    inject: [ConfigService, 'PRISMA_CLIENT', 'REDIS_CLIENT'],
  };
}
```

## Configuration

### Variables d'environnement

```env
# Provider principal (prisma ou redis)
DB_PROVIDER=prisma

# Connexion Prisma (PostgreSQL/MariaDB)
DB_URL=postgresql://user:password@localhost:5432/database

# Connexion Redis (pour fallback ou provider principal)
REDIS_URL=redis://localhost:6379
```

### Clients Database

Le `DatabaseModule` fournit les clients pour chaque provider:

```typescript
@Module({
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const dbProvider = configService.get('DB_PROVIDER', 'prisma');

        if (dbProvider !== 'prisma') {
          return null; // Pas nécessaire
        }

        const prisma = new PrismaClient({
          datasources: {
            db: { url: configService.get('DB_URL') }
          }
        });

        await prisma.$connect();
        return prisma;
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const dbProvider = configService.get('DB_PROVIDER', 'prisma');

        // Toujours créer le client Redis si fallback nécessaire
        const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
        const client = createClient({ url: redisUrl });

        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PRISMA_CLIENT', 'REDIS_CLIENT'],
})
export class DatabaseModule {}
```

## Gaps à combler (TODO)

### Prisma manquants

Ces repositories nécessitent une implémentation Prisma pour éviter le fallback Redis:

1. **AdvisorRepository**
   - Actuellement: Redis uniquement
   - TODO: Créer `PrismaAdvisorRepository`

2. **DiscussionRepository**
   - Actuellement: Redis ou MariaDB
   - TODO: Créer `PrismaDiscussionRepository`

3. **MessageRepository**
   - Actuellement: Redis uniquement
   - TODO: Créer `PrismaMessageRepository`

4. **LoanRepository**
   - Actuellement: Redis uniquement
   - TODO: Créer `PrismaLoanRepository`

5. **LoanRequestRepository**
   - Actuellement: Redis uniquement
   - TODO: Créer `PrismaLoanRequestRepository`

6. **TransactionRepository**
   - Actuellement: Redis uniquement
   - TODO: Créer `PrismaTransactionRepository`

### Redis manquants

Ces repositories nécessitent une implémentation Redis pour un cache performant:

1. **BanRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisBanRepository`

2. **CompanyRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisCompanyRepository`

3. **NotificationRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisNotificationRepository`

4. **PortfolioRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisPortfolioRepository`

5. **StockRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisStockRepository`

6. **StockOrderRepository**
   - Actuellement: Prisma uniquement
   - TODO: Créer `RedisStockOrderRepository`

## Patterns d'implémentation

### Prisma Repository

```typescript
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<User | UserNotFoundByIdError> {
    const user = await this.db.user.findUnique({
      where: { id }
    });

    if (!user) {
      return new UserNotFoundByIdError();
    }

    return User.createFromRaw(user);
  }

  async save(user: User): Promise<User | EmailAlreadyExistError> {
    try {
      const created = await this.db.user.create({
        data: {
          id: user.identifier!,
          email: user.email.value,
          password: user.password.value,
          // ...
        }
      });

      return User.createFromRaw(created);
    } catch (error) {
      if (error.code === 'P2002') {
        return new EmailAlreadyExistError();
      }
      throw error;
    }
  }
}
```

### Redis Repository

```typescript
import { RedisClientType } from 'redis';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';

export class RedisUserRepository implements UserRepository {
  private readonly prefix = 'user:';

  constructor(private readonly db: RedisClientType) {}

  async findById(id: string): Promise<User | UserNotFoundByIdError> {
    const key = `${this.prefix}${id}`;
    const data = await this.db.get(key);

    if (!data) {
      return new UserNotFoundByIdError();
    }

    return User.createFromRaw(JSON.parse(data));
  }

  async save(user: User): Promise<User | EmailAlreadyExistError> {
    const key = `${this.prefix}${user.identifier}`;
    const emailKey = `user:email:${user.email.value}`;

    // Vérifier email unique
    const existingId = await this.db.get(emailKey);
    if (existingId && existingId !== user.identifier) {
      return new EmailAlreadyExistError();
    }

    // Sauvegarder
    await this.db.set(key, JSON.stringify(user.toPrimitives()));
    await this.db.set(emailKey, user.identifier!);

    return user;
  }
}
```

## Utilisation dans les Use Cases

Les use cases utilisent les repositories via injection de dépendances:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ClientLogin } from '@pp-clca-pcm/application/usecases/client/auth/client-login';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { REPOSITORY_TOKENS } from '../../config/repositories.module';

@Module({
  providers: [
    {
      provide: ClientLogin,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new ClientLogin(userRepository, passwordService, tokenService),
      inject: [
        REPOSITORY_TOKENS.USER,  // Injection automatique avec mapping
        'PasswordService',
        'TokenService',
      ],
    },
  ],
})
export class ClientModule {}
```

Le système résout automatiquement:
- `REPOSITORY_TOKENS.USER` → `PrismaUserRepository` (si DB_PROVIDER=prisma)
- `REPOSITORY_TOKENS.USER` → `RedisUserRepository` (si DB_PROVIDER=redis)

## Avantages du système

1. **Flexibilité**: Basculer entre Prisma et Redis via configuration
2. **Fallback automatique**: Utilise l'autre provider si l'implémentation manque
3. **Type-safe**: Injection via tokens typés
4. **Transparent**: Les use cases ne connaissent que les interfaces
5. **Testable**: Facilite les tests avec Memory repositories
6. **Évolutif**: Ajouter un nouveau provider (MongoDB, etc.) facilement

## Monitoring et Debug

Pour faciliter le debug, le système log les résolutions:

```
[RepositoriesModule] UserRepository -> PrismaUserRepository (prisma)
[RepositoriesModule] LoanRepository -> RedisLoanRepository (fallback: redis)
```

---

**Dernière mise à jour**: 2026-01-06
**Configuration recommandée**: `DB_PROVIDER=prisma` avec Redis pour fallback
