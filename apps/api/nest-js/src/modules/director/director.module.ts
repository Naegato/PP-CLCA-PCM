import { Module } from '@nestjs/common';
import { RepositoriesModule, REPOSITORY_TOKENS } from '../../config/repositories.module';
import { ServicesModule } from '../../config/services.module';

// Controllers
import { DirectorAuthController } from './controllers/auth.controller';
import { DirectorClientsController } from './controllers/clients.controller';
import { DirectorCompaniesController } from './controllers/companies.controller';
import { DirectorStocksController } from './controllers/stocks.controller';
import { DirectorSavingsController } from './controllers/savings.controller';

// Use cases - Authentication
import { DirectorLogin } from '@pp-clca-pcm/application';
import { DirectorRegistration } from '@pp-clca-pcm/application';

// Use cases - Client Management
import { DirectorGetAllClients } from '@pp-clca-pcm/application';
import { DirectorGetClientAccount } from '@pp-clca-pcm/application';
import { DirectorManageBan } from '@pp-clca-pcm/application';
import { DirectorManageCreate } from '@pp-clca-pcm/application';
import { DirectorManageUpdate } from '@pp-clca-pcm/application';
import { DirectorManageDelete } from '@pp-clca-pcm/application';

// Use cases - Company Management
import { DirectorCreateCompany } from '@pp-clca-pcm/application';
import { DirectorDeleteCompany } from '@pp-clca-pcm/application';
import { DirectorGetAllCompanies } from '@pp-clca-pcm/application';
import { DirectorGetCompany } from '@pp-clca-pcm/application';
import { DirectorUpdateCompany } from '@pp-clca-pcm/application';

// Use cases - Stock Management
import { DirectorCreateStock } from '@pp-clca-pcm/application';
import { DirectorDeleteStock } from '@pp-clca-pcm/application';
import { DirectorToggleStockListing } from '@pp-clca-pcm/application';
import { DirectorUpdateStock } from '@pp-clca-pcm/application';

// Use cases - Savings
import { DirectorChangeSavingRate } from '@pp-clca-pcm/application';

// Service interfaces
import type { UserRepository } from '@pp-clca-pcm/application';
import type { BanRepository } from '@pp-clca-pcm/application';
import type { CompanyRepository } from '@pp-clca-pcm/application';
import type { StockRepository } from '@pp-clca-pcm/application';
import type { PortfolioRepository } from '@pp-clca-pcm/application';
import type { StockOrderRepository } from '@pp-clca-pcm/application';
import type { AccountTypeRepository } from '@pp-clca-pcm/application';
import type { PasswordService } from '@pp-clca-pcm/application';
import type { TokenService } from '@pp-clca-pcm/application';
import type { Security } from '@pp-clca-pcm/application';

/**
 * DirectorModule
 *
 * Module qui gère toutes les fonctionnalités director.
 * Implémenté:
 * - Authentication (2 use cases)
 * - Client Management (6 use cases)
 * - Company Management (5 use cases)
 * - Stock Management (4 use cases)
 * - Savings (1 use case)
 *
 * Total: 18 use cases director - 100% complété ✅
 */
@Module({
  imports: [RepositoriesModule, ServicesModule],
  controllers: [
    DirectorAuthController,
    DirectorClientsController,
    DirectorCompaniesController,
    DirectorStocksController,
    DirectorSavingsController,
  ],
  providers: [
    // Authentication use cases
    {
      provide: DirectorLogin,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new DirectorLogin(userRepository, passwordService, tokenService),
      inject: [REPOSITORY_TOKENS.USER, 'PasswordService', 'TokenService'],
    },
    {
      provide: DirectorRegistration,
      useFactory: (userRepository: UserRepository, passwordService: PasswordService) => new DirectorRegistration(userRepository, passwordService),
      inject: [REPOSITORY_TOKENS.USER],
    },

    // Client Management use cases
    {
      provide: DirectorGetAllClients,
      useFactory: (userRepository: UserRepository) => new DirectorGetAllClients(userRepository),
      inject: [REPOSITORY_TOKENS.USER],
    },
    {
      provide: DirectorGetClientAccount,
      useFactory: (userRepository: UserRepository) => new DirectorGetClientAccount(userRepository),
      inject: [REPOSITORY_TOKENS.USER],
    },
    {
      provide: DirectorManageBan,
      useFactory: (userRepository: UserRepository, banRepository: BanRepository, security: Security) =>
        new DirectorManageBan(userRepository, banRepository, security),
      inject: [REPOSITORY_TOKENS.USER, REPOSITORY_TOKENS.BAN, 'Security'],
    },
    {
      provide: DirectorManageCreate,
      useFactory: (userRepository: UserRepository, security: Security) =>
        new DirectorManageCreate(userRepository, security),
      inject: [REPOSITORY_TOKENS.USER, 'Security'],
    },
    {
      provide: DirectorManageUpdate,
      useFactory: (userRepository: UserRepository, security: Security) =>
        new DirectorManageUpdate(userRepository, security),
      inject: [REPOSITORY_TOKENS.USER, 'Security'],
    },
    {
      provide: DirectorManageDelete,
      useFactory: (userRepository: UserRepository, security: Security) =>
        new DirectorManageDelete(userRepository, security),
      inject: [REPOSITORY_TOKENS.USER, 'Security'],
    },

    // Company Management use cases
    {
      provide: DirectorCreateCompany,
      useFactory: (companyRepository: CompanyRepository) => new DirectorCreateCompany(companyRepository),
      inject: [REPOSITORY_TOKENS.COMPANY],
    },
    {
      provide: DirectorDeleteCompany,
      useFactory: (companyRepository: CompanyRepository, stockRepository: StockRepository) =>
        new DirectorDeleteCompany(companyRepository, stockRepository),
      inject: [REPOSITORY_TOKENS.COMPANY, REPOSITORY_TOKENS.STOCK],
    },
    {
      provide: DirectorGetAllCompanies,
      useFactory: (companyRepository: CompanyRepository) => new DirectorGetAllCompanies(companyRepository),
      inject: [REPOSITORY_TOKENS.COMPANY],
    },
    {
      provide: DirectorGetCompany,
      useFactory: (companyRepository: CompanyRepository) => new DirectorGetCompany(companyRepository),
      inject: [REPOSITORY_TOKENS.COMPANY],
    },
    {
      provide: DirectorUpdateCompany,
      useFactory: (companyRepository: CompanyRepository) => new DirectorUpdateCompany(companyRepository),
      inject: [REPOSITORY_TOKENS.COMPANY],
    },

    // Stock Management use cases
    {
      provide: DirectorCreateStock,
      useFactory: (stockRepository: StockRepository, companyRepository: CompanyRepository) =>
        new DirectorCreateStock(stockRepository, companyRepository),
      inject: [REPOSITORY_TOKENS.STOCK, REPOSITORY_TOKENS.COMPANY],
    },
    {
      provide: DirectorDeleteStock,
      useFactory: (
        stockRepository: StockRepository,
        portfolioRepository: PortfolioRepository,
        stockOrderRepository: StockOrderRepository,
      ) => new DirectorDeleteStock(stockRepository, portfolioRepository, stockOrderRepository),
      inject: [REPOSITORY_TOKENS.STOCK, REPOSITORY_TOKENS.PORTFOLIO, REPOSITORY_TOKENS.STOCK_ORDER],
    },
    {
      provide: DirectorToggleStockListing,
      useFactory: (stockRepository: StockRepository) => new DirectorToggleStockListing(stockRepository),
      inject: [REPOSITORY_TOKENS.STOCK],
    },
    {
      provide: DirectorUpdateStock,
      useFactory: (stockRepository: StockRepository, companyRepository: CompanyRepository) =>
        new DirectorUpdateStock(stockRepository, companyRepository),
      inject: [REPOSITORY_TOKENS.STOCK, REPOSITORY_TOKENS.COMPANY],
    },

    // Savings use case
    {
      provide: DirectorChangeSavingRate,
      useFactory: (accountTypeRepository: AccountTypeRepository) =>
        new DirectorChangeSavingRate(accountTypeRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT_TYPE],
    },
  ],
})
export class DirectorModule {}
