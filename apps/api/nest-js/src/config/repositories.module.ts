import { Module, Global, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database.module';

// Prisma implementations
import { PrismaUserRepository } from '@pp-clca-pcm/adapters';
import { PrismaAccountRepository } from '@pp-clca-pcm/adapters';
import { PrismaAccountTypeRepository } from '@pp-clca-pcm/adapters';
import { PrismaBanRepository } from '@pp-clca-pcm/adapters';
import { PrismaCompanyRepository } from '@pp-clca-pcm/adapters';
import { PrismaNotificationRepository } from '@pp-clca-pcm/adapters';
import { PrismaPortfolioRepository } from '@pp-clca-pcm/adapters';
import { PrismaStockRepository } from '@pp-clca-pcm/adapters';
import { PrismaStockOrderRepository } from '@pp-clca-pcm/adapters';

// Redis implementations
import { RedisUserRepository } from '@pp-clca-pcm/adapters';
import { RedisAccountRepository } from '@pp-clca-pcm/adapters';
import { RedisAccountTypeRepository } from '@pp-clca-pcm/adapters';
import { RedisAdvisorRepository } from '@pp-clca-pcm/adapters';
import { RedisDiscussionRepository } from '@pp-clca-pcm/adapters';
import { RedisMessageRepository } from '@pp-clca-pcm/adapters';
import { RedisLoanRepository } from '@pp-clca-pcm/adapters';
import { RedisLoanRequestRepository } from '@pp-clca-pcm/adapters';
import { RedisTransactionRepository } from '@pp-clca-pcm/adapters';

/**
 * Tokens d'injection pour les repositories
 */
export const REPOSITORY_TOKENS = {
  USER: 'UserRepository',
  ACCOUNT: 'AccountRepository',
  ACCOUNT_TYPE: 'AccountTypeRepository',
  LOAN: 'LoanRepository',
  LOAN_REQUEST: 'LoanRequestRepository',
  TRANSACTION: 'TransactionRepository',
  STOCK: 'StockRepository',
  STOCK_ORDER: 'StockOrderRepository',
  PORTFOLIO: 'PortfolioRepository',
  COMPANY: 'CompanyRepository',
  BAN: 'BanRepository',
  NOTIFICATION: 'NotificationRepository',
  DISCUSSION: 'DiscussionRepository',
  MESSAGE: 'MessageRepository',
  ADVISOR: 'AdvisorRepository',
} as const;

/**
 * Mapping des implémentations de repositories par provider
 */
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
    // TODO: Implémenter les versions Prisma de ces repositories
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
    // TODO: Implémenter les versions Redis de ces repositories
    [REPOSITORY_TOKENS.STOCK]: null,
    [REPOSITORY_TOKENS.STOCK_ORDER]: null,
    [REPOSITORY_TOKENS.PORTFOLIO]: null,
    [REPOSITORY_TOKENS.COMPANY]: null,
    [REPOSITORY_TOKENS.BAN]: null,
    [REPOSITORY_TOKENS.NOTIFICATION]: null,
  },
};

/**
 * Factory function pour créer un provider de repository avec fallback automatique
 */
function createRepositoryProvider(token: string): Provider {
  return {
    provide: token,
    useFactory: (configService: ConfigService, prismaClient, redisClient) => {
      const dbProviderConfig = configService.get<string>('DB_PROVIDER', 'postgresql');
      const dbProvider = dbProviderConfig === 'redis' ? 'redis' : 'prisma';

      // Essayer le provider principal
      const primaryMapping = REPOSITORY_MAPPING[dbProvider];
      const fallbackMapping =
        dbProvider === 'prisma' ? REPOSITORY_MAPPING.redis : REPOSITORY_MAPPING.prisma;

      // Sélectionner l'implémentation (avec fallback)
      const RepoClass = primaryMapping[token] || fallbackMapping[token];

      if (!RepoClass) {
        throw new Error(
          `[RepositoriesModule] No repository implementation found for ${token}. ` +
            `Primary: ${dbProvider}, Fallback also unavailable.`,
        );
      }

      // Déterminer quel client utiliser
      const isPrismaRepo = primaryMapping[token] !== null;
      const client = isPrismaRepo ? prismaClient : redisClient;

      if (!client) {
        throw new Error(
          `[RepositoriesModule] Database client not available for ${token}. ` +
            `Provider: ${dbProvider}, Using: ${isPrismaRepo ? 'Prisma' : 'Redis'}`,
        );
      }

      // Log pour debug
      const usingFallback = primaryMapping[token] === null;
      const logPrefix = usingFallback ? '⚠️  Fallback' : '✅';
      console.log(
        `[RepositoriesModule] ${logPrefix} ${token} -> ${RepoClass.name} (${dbProvider})`,
      );

      return new RepoClass(client);
    },
    inject: [ConfigService, 'PRISMA_CLIENT', 'REDIS_CLIENT'],
  };
}

/**
 * RepositoriesModule
 *
 * Module global qui fournit tous les repositories avec un système de mapping dynamique
 * basé sur la variable d'environnement DB_PROVIDER (prisma/redis).
 *
 * Le module implémente une stratégie de fallback automatique:
 * - Si DB_PROVIDER=prisma et qu'un repository Prisma n'existe pas → utilise Redis
 * - Si DB_PROVIDER=redis et qu'un repository Redis n'existe pas → utilise Prisma
 */
@Global()
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [...Object.values(REPOSITORY_TOKENS).map(createRepositoryProvider)],
  exports: Object.values(REPOSITORY_TOKENS),
})
export class RepositoriesModule {}
