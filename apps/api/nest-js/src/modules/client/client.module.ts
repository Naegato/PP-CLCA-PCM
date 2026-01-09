import { Module } from '@nestjs/common';
import { RepositoriesModule, REPOSITORY_TOKENS } from '../../config/repositories.module';
import { ServicesModule } from '../../config/services.module';

// Controllers
import { ClientAuthController } from './controllers/auth.controller';
import { ClientAccountsController } from './controllers/accounts.controller';
import { ClientTransactionsController } from './controllers/transactions.controller';
import { ClientNotificationsController } from './controllers/notifications.controller';
import { ClientLoansController } from './controllers/loans.controller';
import { ClientStocksController } from './controllers/stocks.controller';
import { ClientStockOrdersController } from './controllers/stock-orders.controller';
import { ClientPortfolioController } from './controllers/portfolio.controller';
import { ClientMessagesController } from './controllers/messages.controller';

// Use cases - Authentication
import { ClientLogin } from '@pp-clca-pcm/application';
import { ClientRegistration } from '@pp-clca-pcm/application';
import { ClientLogout } from '@pp-clca-pcm/application';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application';
import { ClientResetPassword } from '@pp-clca-pcm/application';

// Use cases - Accounts
import { ClientCreateAccount } from '@pp-clca-pcm/application';
import { ClientSavingAccountCreate } from '@pp-clca-pcm/application';
import { ClientGetAccount } from '@pp-clca-pcm/application';
import { ClientGetBalanceAccount } from '@pp-clca-pcm/application';
import { ClientUpdateNameAccount } from '@pp-clca-pcm/application';
import { ClientDeleteAccount } from '@pp-clca-pcm/application';

// Use cases - Transactions
import { ClientSendTransaction } from '@pp-clca-pcm/application';

// Use cases - Notifications
import { ClientGetNotifications } from '@pp-clca-pcm/application';

// Use cases - Loans
import { ClientGetLoans } from '@pp-clca-pcm/application';
import { ClientRequestLoan } from '@pp-clca-pcm/application';
import { ClientSimulateLoan } from '@pp-clca-pcm/application';
import { ClientRepayLoan } from '@pp-clca-pcm/application';

// Use cases - Stocks
import { ClientGetAvailableStocks } from '@pp-clca-pcm/application';
import { ClientGetStockWithPrice } from '@pp-clca-pcm/application';

// Use cases - Stock Orders
import { ClientGetStockOrders } from '@pp-clca-pcm/application';
import { ClientRegisterStockOrder } from '@pp-clca-pcm/application';
import { ClientCancelStockOrder } from '@pp-clca-pcm/application';
import { ClientMatchStockOrder } from '@pp-clca-pcm/application';

// Use cases - Portfolio
import { ClientCreatePortfolio } from '@pp-clca-pcm/application';
import { ClientGetPortfolio } from '@pp-clca-pcm/application';

// Use cases - Messages
import { ClientSendMessage } from '@pp-clca-pcm/application';

// Domain entities
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain';

// Service interfaces
import type { UserRepository } from '@pp-clca-pcm/application';
import type { AccountRepository } from '@pp-clca-pcm/application';
import type { AccountTypeRepository } from '@pp-clca-pcm/application';
import type { NotificationRepository } from '@pp-clca-pcm/application';
import type { LoanRepository } from '@pp-clca-pcm/application';
import type { LoanRequestRepository } from '@pp-clca-pcm/application';
import type { TransactionRepository } from '@pp-clca-pcm/application';
import type { StockRepository } from '@pp-clca-pcm/application';
import type { StockOrderRepository } from '@pp-clca-pcm/application';
import type { PortfolioRepository } from '@pp-clca-pcm/application';
import type { MessageRepository } from '@pp-clca-pcm/application';
import type { DiscussionRepository } from '@pp-clca-pcm/application';
import type { PasswordService } from '@pp-clca-pcm/application';
import type { TokenService } from '@pp-clca-pcm/application';
import type { LogoutService } from '@pp-clca-pcm/application';
import type { Security } from '@pp-clca-pcm/application';
import type { MarketService } from '@pp-clca-pcm/application';

/**
 * ClientModule
 *
 * Module qui gère toutes les fonctionnalités client.
 * Implémenté:
 * - Authentication (5 use cases)
 * - Accounts (6 use cases)
 * - Transactions (1 use case)
 * - Notifications (1 use case)
 * - Loans (4 use cases)
 * - Stocks (2 use cases)
 * - Stock Orders (4 use cases)
 * - Portfolio (2 use cases)
 * - Messages (1 use case)
 *
 * Total: 26 use cases client - 100% complété ✅
 */
@Module({
  imports: [RepositoriesModule, ServicesModule],
  controllers: [
    ClientAuthController,
    ClientAccountsController,
    ClientTransactionsController,
    ClientNotificationsController,
    ClientLoansController,
    ClientStocksController,
    ClientStockOrdersController,
    ClientPortfolioController,
    ClientMessagesController,
  ],
  providers: [
    // Authentication use cases
    {
      provide: ClientLogin,
      useFactory: (
        userRepository: UserRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new ClientLogin(userRepository, passwordService, tokenService),
      inject: [REPOSITORY_TOKENS.USER, 'PasswordService', 'TokenService'],
    },
    {
      provide: ClientRegistration,
      useFactory: (
        userRepository: UserRepository,
        accountRepository: AccountRepository,
        accountTypeRepository: AccountTypeRepository,
        passwordService: PasswordService,
      ) => new ClientRegistration(userRepository, accountRepository, accountTypeRepository, passwordService),
      inject: [
        REPOSITORY_TOKENS.USER,
        REPOSITORY_TOKENS.ACCOUNT,
        REPOSITORY_TOKENS.ACCOUNT_TYPE,
      ],
    },
    {
      provide: ClientLogout,
      useFactory: (logoutService: LogoutService, security: Security) =>
        new ClientLogout(logoutService, security),
      inject: ['LogoutService', 'Security'],
    },
    {
      provide: ClientRequestPasswordReset,
      useFactory: (userRepository: UserRepository, tokenService: TokenService) =>
        new ClientRequestPasswordReset(userRepository, tokenService),
      inject: [REPOSITORY_TOKENS.USER, 'TokenService'],
    },
    {
      provide: ClientResetPassword,
      useFactory: (
        userRepository: UserRepository,
        tokenService: TokenService,
        passwordService: PasswordService,
      ) => new ClientResetPassword(userRepository, tokenService, passwordService),
      inject: [REPOSITORY_TOKENS.USER, 'TokenService', 'PasswordService'],
    },

    // Accounts use cases
    {
      provide: ClientCreateAccount,
      useFactory: async (
        accountTypeRepository: AccountTypeRepository,
        accountRepository: AccountRepository,
      ) => {
        // Charger ou créer le type de compte par défaut
        const defaultType = await accountTypeRepository.getOrSave(
          AccountTypeNameEnum.DEFAULT,
          AccountType.create(AccountTypeNameEnum.DEFAULT, 0),
        );
        return new ClientCreateAccount(defaultType, accountRepository);
      },
      inject: [REPOSITORY_TOKENS.ACCOUNT_TYPE, REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientSavingAccountCreate,
      useFactory: async (
        accountTypeRepository: AccountTypeRepository,
        accountRepository: AccountRepository,
      ) => {
        // Charger ou créer le type de compte épargne (avec un taux de 2% par défaut)
        const savingsType = await accountTypeRepository.getOrSave(
          AccountTypeNameEnum.SAVINGS,
          AccountType.create(AccountTypeNameEnum.SAVINGS, 2),
        );
        return new ClientSavingAccountCreate(savingsType, accountRepository);
      },
      inject: [REPOSITORY_TOKENS.ACCOUNT_TYPE, REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientGetAccount,
      useFactory: (accountRepository: AccountRepository) =>
        new ClientGetAccount(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientGetBalanceAccount,
      useFactory: (accountRepository: AccountRepository) =>
        new ClientGetBalanceAccount(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientUpdateNameAccount,
      useFactory: (accountRepository: AccountRepository) =>
        new ClientUpdateNameAccount(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientDeleteAccount,
      useFactory: (
        accountRepository: AccountRepository,
        userRepository: UserRepository,
      ) => new ClientDeleteAccount(accountRepository, userRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT, REPOSITORY_TOKENS.USER],
    },

    // Transactions use case
    {
      provide: ClientSendTransaction,
      useFactory: (accountRepository: AccountRepository) =>
        new ClientSendTransaction(accountRepository),
      inject: [REPOSITORY_TOKENS.ACCOUNT],
    },

    // Notifications use case
    {
      provide: ClientGetNotifications,
      useFactory: (
        notificationRepository: NotificationRepository,
        security: Security,
      ) => new ClientGetNotifications(notificationRepository, security),
      inject: [REPOSITORY_TOKENS.NOTIFICATION, 'Security'],
    },

    // Loans use cases
    {
      provide: ClientGetLoans,
      useFactory: (loanRepository: LoanRepository) => new ClientGetLoans(loanRepository),
      inject: [REPOSITORY_TOKENS.LOAN],
    },
    {
      provide: ClientRequestLoan,
      useFactory: (loanRequestRepository: LoanRequestRepository) =>
        new ClientRequestLoan(loanRequestRepository),
      inject: [REPOSITORY_TOKENS.LOAN_REQUEST],
    },
    {
      provide: ClientSimulateLoan,
      useFactory: () => new ClientSimulateLoan(),
      inject: [],
    },
    {
      provide: ClientRepayLoan,
      useFactory: (transactionRepository: TransactionRepository) =>
        new ClientRepayLoan(transactionRepository),
      inject: [REPOSITORY_TOKENS.TRANSACTION],
    },

    // Stocks use cases
    {
      provide: ClientGetAvailableStocks,
      useFactory: (stockRepository: StockRepository) =>
        new ClientGetAvailableStocks(stockRepository),
      inject: [REPOSITORY_TOKENS.STOCK],
    },
    {
      provide: ClientGetStockWithPrice,
      useFactory: (stockRepository: StockRepository, marketService: MarketService) =>
        new ClientGetStockWithPrice(stockRepository, marketService),
      inject: [REPOSITORY_TOKENS.STOCK, 'MarketService'],
    },

    // Stock Orders use cases
    {
      provide: ClientGetStockOrders,
      useFactory: (stockOrderRepository: StockOrderRepository) =>
        new ClientGetStockOrders(stockOrderRepository),
      inject: [REPOSITORY_TOKENS.STOCK_ORDER],
    },
    {
      provide: ClientRegisterStockOrder,
      useFactory: (
        stockOrderRepository: StockOrderRepository,
        stockRepository: StockRepository,
        matchStockOrder: ClientMatchStockOrder,
      ) => new ClientRegisterStockOrder(stockOrderRepository, stockRepository, matchStockOrder),
      inject: [REPOSITORY_TOKENS.STOCK_ORDER, REPOSITORY_TOKENS.STOCK, ClientMatchStockOrder],
    },
    {
      provide: ClientCancelStockOrder,
      useFactory: (stockOrderRepository: StockOrderRepository) =>
        new ClientCancelStockOrder(stockOrderRepository),
      inject: [REPOSITORY_TOKENS.STOCK_ORDER],
    },
    {
      provide: ClientMatchStockOrder,
      useFactory: (
        stockOrderRepository: StockOrderRepository,
        accountRepository: AccountRepository,
        portfolioRepository: PortfolioRepository,
      ) =>
        new ClientMatchStockOrder(stockOrderRepository, accountRepository, portfolioRepository),
      inject: [REPOSITORY_TOKENS.STOCK_ORDER, REPOSITORY_TOKENS.ACCOUNT, REPOSITORY_TOKENS.PORTFOLIO],
    },

    // Portfolio use cases
    {
      provide: ClientCreatePortfolio,
      useFactory: (
        portfolioRepository: PortfolioRepository,
        accountRepository: AccountRepository,
      ) => new ClientCreatePortfolio(portfolioRepository, accountRepository),
      inject: [REPOSITORY_TOKENS.PORTFOLIO, REPOSITORY_TOKENS.ACCOUNT],
    },
    {
      provide: ClientGetPortfolio,
      useFactory: (
        portfolioRepository: PortfolioRepository,
        accountRepository: AccountRepository,
      ) => new ClientGetPortfolio(portfolioRepository, accountRepository),
      inject: [REPOSITORY_TOKENS.PORTFOLIO, REPOSITORY_TOKENS.ACCOUNT],
    },

    // Messages use case
    {
      provide: ClientSendMessage,
      useFactory: (
        messageRepository: MessageRepository,
        discussionRepository: DiscussionRepository,
        security: Security,
      ) => new ClientSendMessage(messageRepository, discussionRepository, security),
      inject: [REPOSITORY_TOKENS.MESSAGE, REPOSITORY_TOKENS.DISCUSSION, 'Security'],
    },
  ],
})
export class ClientModule {}
