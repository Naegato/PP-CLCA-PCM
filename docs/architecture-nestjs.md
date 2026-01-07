# Architecture NestJS - PP-CLCA-PCM API

Ce document décrit l'architecture détaillée de l'API NestJS implémentant les 56 use cases du projet PP-CLCA-PCM.

## Principes architecturaux

### Clean Architecture

L'application respecte les principes de Clean Architecture avec une séparation claire des responsabilités:

```
┌─────────────────────────────────────────────────────────┐
│                    NestJS API                            │
│  (Infrastructure Layer - Dépend de Application)          │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Application Layer                       │    │
│  │  (Use Cases - Dépend de Domain uniquement)     │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────┐     │    │
│  │  │      Domain Layer                     │     │    │
│  │  │  (Entities, Value Objects - Pure)    │     │    │
│  │  └──────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Règles de dépendance**:
- Domain ne dépend de rien
- Application dépend de Domain uniquement
- Infrastructure (NestJS) dépend de Application et Domain
- Les dépendances pointent **toujours vers l'intérieur**

### Error-as-Value Pattern

Les use cases retournent `Result | Error` au lieu de throw des exceptions:

```typescript
// Use case
async execute(email: string): Promise<User | UserNotFoundByEmailError> {
  const user = await this.repository.findByEmail(email);
  if (user instanceof Error) {
    return user;
  }
  return user;
}

// Controller
async getUser(@Param('email') email: string) {
  const result = await this.useCase.execute(email);
  // L'interceptor convertit automatiquement les Errors en HttpException
  return result;
}
```

L'`ErrorInterceptor` se charge de convertir les erreurs en exceptions HTTP appropriées.

## Structure des dossiers

```
apps/api/nest-js/
├── src/
│   ├── main.ts                    # Bootstrap de l'application
│   ├── app.module.ts              # Module racine
│   │
│   ├── config/                    # Modules d'infrastructure
│   │   ├── database.module.ts     # PrismaClient et RedisClient
│   │   ├── repositories.module.ts # Mapping dynamique repositories
│   │   └── services.module.ts     # Services providers
│   │
│   ├── common/                    # Utilitaires partagés
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # Vérification JWT
│   │   │   └── roles.guard.ts     # Vérification rôles
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts # Error-as-Value → HTTP
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   │   └── roles.decorator.ts        # @Roles()
│   │   └── interfaces/
│   │       └── request-with-user.interface.ts
│   │
│   └── modules/                   # Feature modules (par rôle)
│       ├── client/                # 26 use cases
│       │   ├── client.module.ts
│       │   ├── controllers/       # 9 controllers
│       │   │   ├── auth.controller.ts
│       │   │   ├── accounts.controller.ts
│       │   │   ├── loans.controller.ts
│       │   │   ├── transactions.controller.ts
│       │   │   ├── stocks.controller.ts
│       │   │   ├── stock-orders.controller.ts
│       │   │   ├── portfolio.controller.ts
│       │   │   ├── messages.controller.ts
│       │   │   └── notifications.controller.ts
│       │   └── dto/               # DTOs par domaine
│       │       ├── auth/
│       │       ├── accounts/
│       │       ├── loans/
│       │       ├── transactions/
│       │       ├── stock-orders/
│       │       ├── portfolio/
│       │       └── messages/
│       │
│       ├── advisor/               # 8 use cases
│       │   ├── advisor.module.ts
│       │   ├── controllers/       # 3 controllers
│       │   │   ├── auth.controller.ts
│       │   │   ├── loans.controller.ts
│       │   │   └── messages.controller.ts
│       │   └── dto/
│       │       ├── auth/
│       │       ├── loans/
│       │       └── messages/
│       │
│       ├── director/              # 19 use cases
│       │   ├── director.module.ts
│       │   ├── controllers/       # 5 controllers
│       │   │   ├── auth.controller.ts
│       │   │   ├── clients.controller.ts
│       │   │   ├── companies.controller.ts
│       │   │   ├── stocks.controller.ts
│       │   │   └── savings.controller.ts
│       │   └── dto/
│       │       ├── auth/
│       │       ├── clients/
│       │       ├── companies/
│       │       ├── stocks/
│       │       └── savings/
│       │
│       ├── engine/                # 2 use cases (cron jobs)
│       │   ├── engine.module.ts
│       │   └── services/
│       │       ├── daily-interest.service.ts
│       │       └── loan-notification.service.ts
│       │
│       └── shared/                # 2 use cases
│           ├── shared.module.ts
│           └── services/
│               └── notification.service.ts
│
└── test/
    └── e2e/                       # Tests E2E
        ├── client-auth.e2e-spec.ts
        ├── client-accounts.e2e-spec.ts
        └── ...
```

## Modules Infrastructure

### DatabaseModule

Fournit les clients de base de données (Prisma et Redis).

```typescript
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const dbProviderConfig = configService.get<string>('DB_PROVIDER', 'postgresql');
        const dbProvider = dbProviderConfig === 'redis' ? 'redis' : 'prisma';

        if (dbProvider !== 'prisma') {
          return null;
        }

        const prisma = new PrismaClient({
          datasources: {
            db: {
              url: configService.get<string>('DB_URL'),
            },
          },
        });

        await prisma.$connect();
        return prisma;
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<RedisClientType | null> => {
        const redisUrl = configService.get<string>('REDIS_URL', 'redis://localhost:6379');
        const client = createClient({ url: redisUrl }) as RedisClientType;

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

### RepositoriesModule

Système de mapping dynamique des repositories avec fallback automatique.

**Voir**: [repositories-mapping.md](./repositories-mapping.md) pour les détails complets.

```typescript
@Global()
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    ...Object.values(REPOSITORY_TOKENS).map(createRepositoryProvider),
  ],
  exports: Object.values(REPOSITORY_TOKENS),
})
export class RepositoriesModule {}

function createRepositoryProvider(token: string): Provider {
  return {
    provide: token,
    useFactory: (configService: ConfigService, prismaClient, redisClient) => {
      const dbProvider = configService.get<string>('DB_PROVIDER', 'prisma');

      const primaryMapping = REPOSITORY_MAPPING[dbProvider];
      const fallbackMapping = dbProvider === 'prisma'
        ? REPOSITORY_MAPPING.redis
        : REPOSITORY_MAPPING.prisma;

      const RepoClass = primaryMapping[token] || fallbackMapping[token];

      if (!RepoClass) {
        throw new Error(`No repository implementation found for ${token}`);
      }

      const isPrismaRepo = primaryMapping[token] !== null;
      const client = isPrismaRepo ? prismaClient : redisClient;

      return new RepoClass(client);
    },
    inject: [ConfigService, 'PRISMA_CLIENT', 'REDIS_CLIENT'],
  };
}
```

### ServicesModule

Fournit les services métier (PasswordService, TokenService, etc.).

```typescript
@Global()
@Module({
  imports: [RepositoriesModule],
  providers: [
    {
      provide: 'PasswordService',
      useClass: Argon2PasswordService,
    },
    {
      provide: 'TokenService',
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return new JwtTokenService(secret);
      },
      inject: [ConfigService],
    },
    {
      provide: 'MarketService',
      useFactory: (stockOrderRepository: StockOrderRepository) => {
        return new MarketService(stockOrderRepository);
      },
      inject: [REPOSITORY_TOKENS.STOCK_ORDER],
    },
    {
      provide: 'Notifier',
      useClass: ConsoleNotifierService,
    },
    {
      provide: 'Security',
      scope: Scope.REQUEST,
      useClass: NestJsSecurityService,
    },
  ],
  exports: ['PasswordService', 'TokenService', 'MarketService', 'Notifier', 'Security'],
})
export class ServicesModule {}
```

## Guards

### AuthGuard

Vérifie le JWT et charge l'utilisateur depuis le repository.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      const payload = jwt.verify(token, secret) as { userId: string };
      const userOrError = await this.userRepository.findById(payload.userId);

      if (userOrError instanceof Error) {
        throw new UnauthorizedException('Invalid token: user not found');
      }

      request.user = userOrError;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
```

### RolesGuard

Vérifie que l'utilisateur a le rôle requis.

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some(role => {
      switch (role) {
        case 'client':
          return user.isClient();
        case 'advisor':
          return user.isAdvisor();
        case 'director':
          return user.isDirector();
        default:
          return false;
      }
    });

    if (!hasRole) {
      throw new ForbiddenException(`User must have one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
```

## ErrorInterceptor

Convertit les erreurs Error-as-Value en exceptions HTTP.

```typescript
const ERROR_STATUS_MAP: Record<string, HttpStatus> = {
  LoginInvalidCredentialsError: HttpStatus.UNAUTHORIZED,
  UserNotFoundByEmailError: HttpStatus.NOT_FOUND,
  UserNotFoundByIdError: HttpStatus.NOT_FOUND,
  EmailAlreadyExistError: HttpStatus.CONFLICT,
  AccountCreateError: HttpStatus.BAD_REQUEST,
  NotClient: HttpStatus.FORBIDDEN,
  NotAdvisor: HttpStatus.FORBIDDEN,
  NotDirector: HttpStatus.FORBIDDEN,
  DEFAULT: HttpStatus.BAD_REQUEST,
};

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data instanceof Error) {
          const errorName = data.constructor.name;
          const statusCode = ERROR_STATUS_MAP[errorName] || ERROR_STATUS_MAP.DEFAULT;

          throw new HttpException(
            {
              statusCode,
              message: data.message,
              error: errorName,
            },
            statusCode,
          );
        }

        return data;
      }),
    );
  }
}
```

## Feature Modules

### Pattern de module

Chaque module (Client, Advisor, Director) suit le même pattern:

```typescript
@Module({
  imports: [RepositoriesModule, ServicesModule],
  controllers: [
    ClientAuthController,
    ClientAccountsController,
    // ... autres controllers
  ],
  providers: [
    // Use cases providers
    {
      provide: ClientLogin,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new ClientLogin(userRepository, passwordService, tokenService),
      inject: [
        REPOSITORY_TOKENS.USER,
        'PasswordService',
        'TokenService',
      ],
    },
    // ... autres use cases
  ],
})
export class ClientModule {}
```

### Pattern de controller

```typescript
@Controller('client/accounts')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientAccountsController {
  constructor(
    private readonly createAccount: ClientCreateAccount,
    private readonly getAccount: ClientGetAccount,
    private readonly deleteAccount: ClientDeleteAccount,
    private readonly updateAccount: ClientUpdateNameAccount,
    private readonly getBalance: ClientGetBalanceAccount,
    private readonly createSavings: ClientSavingAccountCreate,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateAccountDto,
  ) {
    return this.createAccount.execute(user, dto.name);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.getAccount.execute(id);
  }

  @Get(':id/balance')
  async getBalance(@Param('id') id: string) {
    return this.getBalance.execute(id);
  }

  @Patch(':id')
  async updateName(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    const account = await this.getAccount.execute(id);
    if (account instanceof Error) return account;
    return this.updateAccount.execute(account, dto.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const account = await this.getAccount.execute(id);
    if (account instanceof Error) return account;
    return this.deleteAccount.execute(account);
  }

  @Post('savings')
  async createSavings(
    @CurrentUser() user: User,
    @Body() dto: CreateAccountDto,
  ) {
    return this.createSavings.execute(user, dto.name);
  }
}
```

### Pattern de DTO

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

## Module Engine (Cron Jobs)

Pour les tâches planifiées, utilisation de `@nestjs/schedule`:

```typescript
@Module({
  imports: [ScheduleModule.forRoot(), RepositoriesModule, ServicesModule],
  providers: [
    DailyInterestService,
    LoanNotificationService,
    {
      provide: GenerateDailyInterest,
      useFactory: (accountRepository: AccountRepository) =>
        new GenerateDailyInterest(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: NotifyLoanToPay,
      useFactory: (loanRepository: LoanRepository, notifier: Notifier) =>
        new NotifyLoanToPay(loanRepository, notifier),
      inject: [REPOSITORY_TOKENS.LOAN, 'Notifier'],
    },
  ],
})
export class EngineModule {}
```

Service avec cron:

```typescript
@Injectable()
export class DailyInterestService {
  constructor(private readonly generateDailyInterest: GenerateDailyInterest) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyInterest() {
    console.log('[CRON] Generating daily interest...');
    const result = await this.generateDailyInterest.execute();
    console.log(`[CRON] Processed ${result.totalAccountsProcessed} accounts`);
  }
}
```

## Configuration

### Variables d'environnement

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DB_PROVIDER=prisma
DB_URL=postgresql://user:password@localhost:5432/database
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Logging
LOG_LEVEL=info
```

### app.module.ts

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RepositoriesModule,
    ServicesModule,
    ClientModule,
    AdvisorModule,
    DirectorModule,
    EngineModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Guard global
    },
  ],
})
export class AppModule {}
```

### main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation automatique des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Port
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`[NestJS] API running on http://localhost:${port}`);
}
bootstrap();
```

## Endpoints API

### Client Endpoints

**Authentication**
- POST `/client/auth/login` - Login
- POST `/client/auth/register` - Register
- POST `/client/auth/logout` - Logout
- POST `/client/auth/password-reset/request` - Request password reset
- POST `/client/auth/password-reset/confirm` - Confirm password reset

**Accounts**
- POST `/client/accounts` - Create account
- GET `/client/accounts/:id` - Get account
- GET `/client/accounts/:id/balance` - Get balance
- PATCH `/client/accounts/:id` - Update account name
- DELETE `/client/accounts/:id` - Delete account
- POST `/client/accounts/savings` - Create savings account

**Loans**
- GET `/client/loans` - List loans
- POST `/client/loans/request` - Request loan
- POST `/client/loans/simulate` - Simulate loan
- POST `/client/loans/:id/repay` - Repay loan

**Transactions**
- POST `/client/transactions` - Send transaction

**Stocks**
- GET `/client/stocks` - List available stocks
- GET `/client/stocks/:id` - Get stock with price

**Stock Orders**
- GET `/client/stock-orders` - List orders
- POST `/client/stock-orders` - Register order
- POST `/client/stock-orders/:id/cancel` - Cancel order
- POST `/client/stock-orders/:id/match` - Match order

**Portfolio**
- POST `/client/portfolio` - Create portfolio
- GET `/client/portfolio/:accountId` - Get portfolio

**Messages**
- POST `/client/messages` - Send message

**Notifications**
- GET `/client/notifications` - List notifications

### Advisor Endpoints

**Authentication**
- POST `/advisor/auth/login` - Login
- POST `/advisor/auth/register` - Register

**Loans**
- GET `/advisor/loans/pending` - List pending loan requests
- POST `/advisor/loans/:id/grant` - Grant loan
- POST `/advisor/loans/:id/reject` - Reject loan

**Messages**
- POST `/advisor/messages/:id/reply` - Reply to message
- POST `/advisor/discussions/:id/close` - Close discussion
- POST `/advisor/discussions/:id/transfer` - Transfer discussion

### Director Endpoints

**Authentication**
- POST `/director/auth/login` - Login
- POST `/director/auth/register` - Register

**Clients**
- GET `/director/clients` - List all clients
- GET `/director/clients/:id/accounts` - Get client accounts
- POST `/director/clients` - Create client
- PATCH `/director/clients/:id` - Update client
- DELETE `/director/clients/:id` - Delete client
- POST `/director/clients/:id/ban` - Ban client

**Companies**
- GET `/director/companies` - List companies
- GET `/director/companies/:id` - Get company
- POST `/director/companies` - Create company
- PATCH `/director/companies/:id` - Update company
- DELETE `/director/companies/:id` - Delete company

**Stocks**
- POST `/director/stocks` - Create stock
- PATCH `/director/stocks/:id` - Update stock
- DELETE `/director/stocks/:id` - Delete stock
- POST `/director/stocks/:id/toggle-listing` - Toggle stock listing

**Savings**
- PATCH `/director/savings/rate` - Change saving rate

---

**Total endpoints**: ~62
**Dernière mise à jour**: 2026-01-06
