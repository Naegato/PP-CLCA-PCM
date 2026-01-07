import dotenv from "dotenv";
import path from "path";
import express from 'express';

import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';

import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { RedisAccountRepository } from '@pp-clca-pcm/adapters/repositories/redis/account/account';

import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { RedisAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/redis/account/type';

import { DiscussionRepository } from "@pp-clca-pcm/application/repositories/discussion/discussion";
import { RedisDiscussionRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/discussion';

import { MessageRepository } from "@pp-clca-pcm/application/repositories/discussion/message";
import { RedisMessageRepository } from '@pp-clca-pcm/adapters/repositories/redis/discussion/message';

import { AdvisorRepository } from "@pp-clca-pcm/application/repositories/advisor";
import { RedisAdvisorRepository } from '@pp-clca-pcm/adapters/repositories/redis/advisor';

import { RedisLoanRepository } from '@pp-clca-pcm/adapters/repositories/redis/loan';
import { RedisLoanRequestRepository } from '@pp-clca-pcm/adapters/repositories/redis/request-loan';
import { RedisTransactionRepository } from '@pp-clca-pcm/adapters/repositories/redis/transaction';
import { RedisUserRepository } from '@pp-clca-pcm/adapters/repositories/redis/user';

import { connectRedis, getRedisClient } from '@pp-clca-pcm/adapters/repositories/redis/client';

import { AdvisorLogin } from "@pp-clca-pcm/application/usecases/advisor/auth/advisor-login";
import { AdvisorRegistration } from "@pp-clca-pcm/application/usecases/advisor/auth/advisor-registration";

import { AdvisorGetPendingLoans } from "@pp-clca-pcm/application/usecases/advisor/loans/advisor-get-pending-loans";

import { AdvisorGrantLoan } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-grant-loan';

import { AdvisorRejectLoan } from '@pp-clca-pcm/application/usecases/advisor/loans/advisor-reject-loan';

import { AdvisorCloseChat } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-close-chat';

import { AdvisorReplyMessage } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-reply-message';

import { AdvisorTransferChat } from '@pp-clca-pcm/application/usecases/advisor/messages/advisor-transfer-chat';

// Client usecases
import { ClientCreateAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-create-account';
import { ClientDeleteAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-delete-account';
import { ClientGetAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-get-account';
import { ClientGetBalanceAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-get-balance-account';
import { ClientSavingAccountCreate } from '@pp-clca-pcm/application/usecases/client/accounts/client-saving-account-create';
import { ClientUpdateNameAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-update-name-account';

import { ClientLogin } from '@pp-clca-pcm/application/usecases/client/auth/client-login';
import { ClientRegistration } from '@pp-clca-pcm/application/usecases/client/auth/client-registration';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application/usecases/client/auth/client-request-password-reset';
import { ClientResetPassword } from '@pp-clca-pcm/application/usecases/client/auth/client-reset-password';

import { ClientGetLoans } from '@pp-clca-pcm/application/usecases/client/loans/client-get-loans';
import { ClientRepayLoan } from '@pp-clca-pcm/application/usecases/client/loans/client-repay-loan';
import { ClientRequestLoan } from '@pp-clca-pcm/application/usecases/client/loans/client-request-loan';
import { ClientSimulateLoan } from '@pp-clca-pcm/application/usecases/client/loans/client-simulate-loan';

import { ClientSendMessage } from '@pp-clca-pcm/application/usecases/client/messages/client-send-message';

import { ClientGetNotifications } from '@pp-clca-pcm/application/usecases/client/notifications/client-get-notifications';

import { ClientCreatePortfolio } from '@pp-clca-pcm/application/usecases/client/portfolio/client-create-portfolio';
import { ClientGetPortfolio } from '@pp-clca-pcm/application/usecases/client/portfolio/client-get-portfolio';

import { PortfolioRepository } from "@pp-clca-pcm/application/repositories/portfolio";
import { RedisPortfolioRepository } from '@pp-clca-pcm/adapters/repositories/redis/portfolio';

import { CompanyRepository } from "@pp-clca-pcm/application/repositories/company";
import { RedisCompanyRepository } from '@pp-clca-pcm/adapters/repositories/redis/company';
import { StockRepository } from "@pp-clca-pcm/application/repositories/stock";
import { RedisStockRepository } from '@pp-clca-pcm/adapters/repositories/redis/stock';

import { ClientGetAvailableStocks } from '@pp-clca-pcm/application/usecases/client/stocks/client-get-available-stocks';
import { ClientGetStockWithPrice } from '@pp-clca-pcm/application/usecases/client/stocks/client-get-stock-with-price';

import { ClientCancelStockOrder } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-cancel-stock-order';
import { ClientGetStockOrders } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-get-stock-orders';
import { ClientMatchStockOrder } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-match-stock-order';
import { ClientRegisterStockOrder } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-register-stock-order';

import { ClientSendTransaction } from '@pp-clca-pcm/application/usecases/client/transactions/client-send-transaction';

// Director usecases
import { DirectorLogin } from '@pp-clca-pcm/application/usecases/director/auth/director-login';
import { DirectorRegistration } from '@pp-clca-pcm/application/usecases/director/auth/director-registration';

import { DirectorGetAllClients } from '@pp-clca-pcm/application/usecases/director/clients/director-get-all-clients';
import { DirectorGetClientAccounts } from '@pp-clca-pcm/application/usecases/director/clients/director-get-client-accounts';
import { DirectorManageBan } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-ban';
import { DirectorManageCreate } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-create';
import { DirectorManageDelete } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-delete';
import { DirectorManageUpdate } from '@pp-clca-pcm/application/usecases/director/clients/director-manage-update';

import { DirectorCreateCompany } from '@pp-clca-pcm/application/usecases/director/companies/director-create-company';
import { DirectorDeleteCompany } from '@pp-clca-pcm/application/usecases/director/companies/director-delete-company';
import { DirectorGetAllCompanies } from '@pp-clca-pcm/application/usecases/director/companies/director-get-all-companies';
import { DirectorGetCompany } from '@pp-clca-pcm/application/usecases/director/companies/director-get-company';
import { DirectorUpdateCompany } from '@pp-clca-pcm/application/usecases/director/companies/director-update-company';

import { DirectorChangeSavingRate } from '@pp-clca-pcm/application/usecases/director/savings/director-change-saving-rate';

import { DirectorCreateStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-create-stock';
import { DirectorDeleteStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-delete-stock';
import { DirectorToggleStockListing } from '@pp-clca-pcm/application/usecases/director/stocks/director-toggle-stock-listing';
import { DirectorUpdateStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-update-stock';

// Engine
import { GenerateDailyInterest } from '@pp-clca-pcm/application/usecases/engine/generate-daily-interest';
import { NotifyLoanToPay } from '@pp-clca-pcm/application/usecases/engine/notify-loan-to-pay';

// Shared notifications
import { NotifyClientSavingRateChange } from '@pp-clca-pcm/application/usecases/shared/notifications/notify-client-saving-rate-change';
import { NotifyLoanStatus } from '@pp-clca-pcm/application/usecases/shared/notifications/notify-loan-status';

import { Argon2PasswordService } from "@pp-clca-pcm/adapters/services/argon2-password";
import { JwtTokenService } from "@pp-clca-pcm/adapters/services/jwt-token";
import { JwtSecurityService } from "@pp-clca-pcm/adapters/services/jwt-security";

dotenv.config({
  path: path.resolve(__dirname, "../../../../../.env"),
});

const app = express()
const port = 3000

// Init repositories

const databaseProvider = process.env.DB_PROVIDER;

let redisClient: any = null;

let accountRepository: AccountRepository|null = null;
let accountTypeRepository: AccountTypeRepository|null = null;

let discussionRepository: DiscussionRepository|null = null;
let messageRepository: MessageRepository|null = null;

let advisorRepository: AdvisorRepository|null = null;
let loanRepository: any = null;
let loanRequestRepository: any = null;
let transactionRepository: any = null;
let userRepository: any = null;
let portfolioRepository: PortfolioRepository|null = null;
let stockRepository: StockRepository|null = null;
let companyRepository: CompanyRepository|null = null;

if (databaseProvider === "postgresql") {
} else if (databaseProvider === "redis") {
  connectRedis();
  redisClient = getRedisClient();

  accountRepository = new RedisAccountRepository(redisClient);
  accountTypeRepository = new RedisAccountTypeRepository(redisClient);

  discussionRepository = new RedisDiscussionRepository(redisClient);
  messageRepository = new RedisMessageRepository(redisClient);

  advisorRepository = new RedisAdvisorRepository(redisClient);
  loanRepository = new RedisLoanRepository(redisClient);
  loanRequestRepository = new RedisLoanRequestRepository(redisClient);
  transactionRepository = new RedisTransactionRepository(redisClient);
  userRepository = new RedisUserRepository(redisClient);
  portfolioRepository = new RedisPortfolioRepository(redisClient);
  stockRepository = new RedisStockRepository(redisClient);
  companyRepository = new RedisCompanyRepository(redisClient);
}

// Init service
const passwordService = new Argon2PasswordService();
const tokenService = new JwtTokenService();
const security = new JwtSecurityService(tokenService, userRepository);

// Middleware for authentication
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  (req as any).user = null;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const isAuthenticated = await security.authenticate(token);
        if (isAuthenticated) {
          (req as any).user = security.getCurrentUser();
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }
  }
  next();
});

type UserRole = 'client' | 'advisor' | 'director';

const requireRole = (requiredRole: UserRole) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = (req as any).user as User;

    let hasRole = false;
    switch (requiredRole) {
      case 'client':
        hasRole = user.isClient();
        break;
      case 'advisor':
        hasRole = user.isAdvisor();
        break;
      case 'director':
        hasRole = user.isDirector();
        break;
    }

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};

import { StockOrderRepository } from "@pp-clca-pcm/application/repositories/stockOrder";
import { Notifier } from "@pp-clca-pcm/application/services/notifier";
import { NotificationRepository } from "@pp-clca-pcm/application/repositories/notification";
import { BanRepository } from "@pp-clca-pcm/application/repositories/ban";

// TEMP STUBS
const stockOrderRepositoryStub: StockOrderRepository = {
  save: async (order) => order,
  allByStock: async (stockId) => [],
  findOpenBuyOrders: async (stockId, price) => [],
  findOpenSellOrders: async (stockId, price) => [],
  getCommittedSellQuantity: async (accountId, stockId) => 0,
  findById: async (orderId) => null,
  findAllByOwnerId: async (ownerId) => [],
  delete: async (orderId) => {},
  findAllByStockId: async (stockId) => [],
  deleteMany: async (orderIds) => {},
};
const notifierStub: Notifier = {
  notifierAllUsers: async (message) => {},
  notiferUser: async (user, message) => {},
};
const notificationRepositoryStub: NotificationRepository = {
  save: async (notification) => notification,
  findByRecipient: async (recipient) => [],
  findUnreadByRecipient: async (recipient) => [],
  markAsRead: async (notificationId) => null,
};
const banRepositoryStub: BanRepository = {
  save: async (ban) => ban,
  findByUser: async (user) => [],
  findActiveByUser: async (user) => null,
  findAll: async () => [],
};

// Init use cases
const advisorLogin = new AdvisorLogin(
  userRepository,
  passwordService,
  tokenService
);

const advisorRegistration = new AdvisorRegistration(
  userRepository as any,
  passwordService,
);

const advisorGetPendingLoans = new AdvisorGetPendingLoans(
  loanRequestRepository,
  security,
);

const advisorGrantLoan = new AdvisorGrantLoan(
  loanRequestRepository,
  loanRepository,
  security,
);

const advisorRejectLoan = new AdvisorRejectLoan(
  loanRequestRepository,
  security
);

const advisorCloseChat = new AdvisorCloseChat(
  discussionRepository,
  security,
);

const advisorReplyMessage = new AdvisorReplyMessage(
  messageRepository,
  security,
);

const advisorTransferChat = new AdvisorTransferChat(
  security,
  discussionRepository,
);

// Client

const clientCreateAccount = new ClientCreateAccount(
  AccountType.create(
	'temp',
	22,
  ),
  accountRepository,
);

// Additional client use case instances (use available repos where possible, fallback to `any`)
const clientDeleteAccount = new ClientDeleteAccount(accountRepository, userRepository);
const clientGetAccount = new ClientGetAccount(accountRepository);
const clientGetBalanceAccount = new ClientGetBalanceAccount(accountRepository);
const clientSavingAccountCreate = new ClientSavingAccountCreate(AccountType.create('savings', 5), accountRepository);
const clientUpdateNameAccount = new ClientUpdateNameAccount(accountRepository);
const clientLogin = new ClientLogin(userRepository, passwordService, tokenService);
const clientRegistration = new ClientRegistration(userRepository, accountRepository, accountTypeRepository, passwordService);
const clientRequestPasswordReset = new ClientRequestPasswordReset(userRepository, tokenService);
const clientResetPassword = new ClientResetPassword(userRepository, tokenService, passwordService);
const clientGetLoans = new ClientGetLoans(loanRepository);
const clientRepayLoan = new ClientRepayLoan(transactionRepository);
const clientRequestLoan = new ClientRequestLoan(loanRequestRepository);
const clientSimulateLoan = new ClientSimulateLoan();

const clientSendMessage = new ClientSendMessage(messageRepository, discussionRepository, security);

const clientGetNotifications = new ClientGetNotifications(notificationRepositoryStub, security);

const clientCreatePortfolio = new ClientCreatePortfolio(portfolioRepository, accountRepository);
const clientGetPortfolio = new ClientGetPortfolio(portfolioRepository, accountRepository);

const clientGetAvailableStocks = new ClientGetAvailableStocks(stockRepository);
const clientGetStockWithPrice = new ClientGetStockWithPrice(stockRepository, null as any);
const clientCancelStockOrder = new ClientCancelStockOrder(stockOrderRepositoryStub, security);
const clientGetStockOrders = new ClientGetStockOrders(stockOrderRepositoryStub);
const clientMatchStockOrder = new ClientMatchStockOrder(stockOrderRepositoryStub, stockRepository, portfolioRepository);
const clientRegisterStockOrder = new ClientRegisterStockOrder(stockOrderRepositoryStub, stockRepository, clientMatchStockOrder);

const clientSendTransaction = new ClientSendTransaction(transactionRepository);

// Director usecases
const directorLogin = new DirectorLogin(userRepository, passwordService, tokenService);
const directorRegistration = new DirectorRegistration(userRepository, passwordService);

const directorGetAllClients = new DirectorGetAllClients(userRepository);
const directorGetClientAccounts = new DirectorGetClientAccounts(accountRepository);
const directorManageBan = new DirectorManageBan(userRepository, banRepositoryStub, security);
const directorManageCreate = new DirectorManageCreate(userRepository, security);
const directorManageDelete = new DirectorManageDelete(userRepository, security);
const directorManageUpdate = new DirectorManageUpdate(userRepository, security);

const directorCreateCompany = new DirectorCreateCompany(companyRepository);
const directorDeleteCompany = new DirectorDeleteCompany(companyRepository, stockRepository);
const directorGetAllCompanies = new DirectorGetAllCompanies(companyRepository);
const directorGetCompany = new DirectorGetCompany(companyRepository);
const directorUpdateCompany = new DirectorUpdateCompany(companyRepository);

const directorChangeSavingRate = new DirectorChangeSavingRate(accountTypeRepository);

const directorCreateStock = new DirectorCreateStock(stockRepository, companyRepository);
const directorDeleteStock = new DirectorDeleteStock(stockRepository, portfolioRepository as any, stockOrderRepositoryStub);
const directorToggleStockListing = new DirectorToggleStockListing(stockRepository);
const directorUpdateStock = new DirectorUpdateStock(stockRepository, companyRepository);

// Engine
const generateDailyInterest = new GenerateDailyInterest(accountRepository);
const notifyLoanToPay = new NotifyLoanToPay(loanRepository, notifierStub);

// Shared notifications
const notifyClientSavingRateChange = new NotifyClientSavingRateChange(notificationRepositoryStub, notifierStub, userRepository);
const notifyLoanStatus = new NotifyLoanStatus(notificationRepositoryStub, notifierStub);

app.use(express.json());

app.use((req, res, next) => {
  const originalJson = (res as any).json.bind(res);
  (res as any).json = (body: any) => {
    try {
      if (body instanceof Error) {
        return res.status(400).send({ error: body.constructor.name, message: body.message });
      }

      if (Array.isArray(body) && body.some((b) => b instanceof Error)) {
        const errors = body
          .filter((b) => b instanceof Error)
          .map((e: Error) => ({ error: e.constructor.name, message: e.message }));
        return res.status(400).send({ errors });
      }

      return originalJson(body);
    } catch (e) {
      return originalJson(body);
    }
  };
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ============ ADVISOR ROUTES ============
app.post("/advisor/login", async (req, res) => {
  const result = await advisorLogin.execute({ email: req.body.email, password: req.body.password });
  res.json(result);
});

app.post("/advisor/register", async (req, res) => {
  const result = await advisorRegistration.execute(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
  res.json(result);
});

app.get("/advisor/loans/pending", requireRole('advisor'), async (req, res) => {
  const result = await advisorGetPendingLoans.execute();
  res.json(result);
});

app.post("/advisor/loans/:id/grant", requireRole('advisor'), async (req, res) => {
  const result = await advisorGrantLoan.execute(req.params.id);
  res.json(result);
});

app.post("/advisor/loans/:id/reject", requireRole('advisor'), async (req, res) => {
  const result = await advisorRejectLoan.execute(req.params.id);
  res.json(result);
});

app.post("/advisor/discussions/:id/close", requireRole('advisor'), async (req, res) => {
  const result = await advisorCloseChat.execute(req.params.id);
  res.json(result);
});

app.post("/advisor/messages/:id/reply", requireRole('advisor'), async (req, res) => {
  const result = await advisorReplyMessage.execute(req.params.id, req.body.text);
  res.json(result);
});

app.post("/advisor/discussions/:id/transfer", requireRole('advisor'), async (req, res) => {
  const result = await advisorTransferChat.execute(req.params.id, req.body.advisorId);
  res.json(result);
});

// ============ CLIENT ACCOUNT ROUTES ============
app.post("/client/accounts", requireRole('client'), async (req, res) => {
  const result = await clientCreateAccount.execute(req.body.user, req.body.name);
  res.json(result);
});

app.delete("/client/accounts/:id", requireRole('client'), async (req, res) => {
  const result = await clientDeleteAccount.execute(req.body.account);
  res.json(result);
});

app.get("/client/accounts/:id", requireRole('client'), async (req, res) => {
  const result = await clientGetAccount.execute(req.params.id);
  res.json(result);
});

app.get("/client/accounts/:id/balance", requireRole('client'), async (req, res) => {
  const result = await clientGetBalanceAccount.execute(req.params.id);
  res.json(result);
});

app.post("/client/accounts/savings", requireRole('client'), async (req, res) => {
  const result = await clientSavingAccountCreate.execute(req.body.user, req.body.name);
  res.json(result);
});

app.put("/client/accounts/:id/name", requireRole('client'), async (req, res) => {
  const result = await clientUpdateNameAccount.execute(req.params.id, req.body.name);
  res.json(result);
});

// ============ CLIENT AUTH ROUTES ============
app.post("/client/login", async (req, res) => {
  const result = await clientLogin.execute({ email: req.body.email, password: req.body.password });
  res.json(result);
});

app.post("/client/register", async (req, res) => {
  const result = await clientRegistration.execute(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
  res.json(result);
});

app.post("/client/password/request-reset", async (req, res) => {
  const result = await clientRequestPasswordReset.execute(req.body);
  res.json(result);
});

app.post("/client/password/reset", async (req, res) => {
  const result = await clientResetPassword.execute(req.body);
  res.json(result);
});

// ============ CLIENT LOAN ROUTES ============
app.get("/client/loans", requireRole('client'), async (req, res) => {
  const result = await clientGetLoans.execute(security.getCurrentUser());
  res.json(result);
});

app.post("/client/loans/:id/repay", requireRole('client'), async (req, res) => {
  const result = await clientRepayLoan.execute(req.body.account, req.body.loan, req.body.amount);
  res.json(result);
});

app.post("/client/loans/request", requireRole('client'), async (req, res) => {
  const result = await clientRequestLoan.execute(security.getCurrentUser(), req.body.amount);
  res.json(result);
});

app.post("/client/loans/simulate", requireRole('client'), async (req, res) => {
  const result = await clientSimulateLoan.execute(req.body.principal, req.body.interestRate, req.body.durationMonths);
  res.json(result);
});

// ============ CLIENT MESSAGE ROUTES ============
app.post("/client/messages", requireRole('client'), async (req, res) => {
  const result = await clientSendMessage.execute(req.body.discussionId, req.body.text);
  res.json(result);
});

// ============ CLIENT NOTIFICATION ROUTES ============
app.get("/client/notifications", requireRole('client'), async (req, res) => {
  const result = await clientGetNotifications.execute();
  res.json(result);
});

// ============ CLIENT PORTFOLIO ROUTES ============
app.post("/client/portfolios", requireRole('client'), async (req, res) => {
  const result = await clientCreatePortfolio.execute(req.body.accountId);
  res.json(result);
});

app.get("/client/portfolios/:id", requireRole('client'), async (req, res) => {
  const result = await clientGetPortfolio.execute(req.params.id);
  res.json(result);
});

// ============ CLIENT STOCK ROUTES ============
app.get("/client/stocks/available", requireRole('client'), async (req, res) => {
  const result = await clientGetAvailableStocks.execute();
  res.json(result);
});

app.get("/client/stocks/:id/price", requireRole('client'), async (req, res) => {
  const result = await clientGetStockWithPrice.execute(req.params.id);
  res.json(result);
});

// ============ CLIENT STOCK ORDER ROUTES ============
app.delete("/client/stock-orders/:id", requireRole('client'), async (req, res) => {
  const result = await clientCancelStockOrder.execute(req.params.id);
  res.json(result);
});

app.get("/client/stock-orders", requireRole('client'), async (req, res) => {
  const result = await clientGetStockOrders.execute(security.getCurrentUser());
  res.json(result);
});

app.post("/client/stock-orders/match", requireRole('client'), async (req, res) => {
  const result = await clientMatchStockOrder.execute(req.body.orderId);
  res.json(result);
});

app.post("/client/stock-orders", requireRole('client'), async (req, res) => {
  const result = await clientRegisterStockOrder.execute(req.body.account, req.body.stockId, req.body.side, req.body.price, req.body.quantity);
  res.json(result);
});

// ============ CLIENT TRANSACTION ROUTES ============
app.post("/client/transactions", requireRole('client'), async (req, res) => {
  const result = await clientSendTransaction.execute(req.body.fromAccountId, req.body.toAccountId, req.body.amount);
  res.json(result);
});

// ============ DIRECTOR AUTH ROUTES ============
app.post("/director/login", async (req, res) => {
  const result = await directorLogin.execute({ email: req.body.email, password: req.body.password });
  res.json(result);
});

app.post("/director/register", async (req, res) => {
  const result = await directorRegistration.execute(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
  res.json(result);
});

// ============ DIRECTOR CLIENT ROUTES ============
app.get("/director/clients", requireRole('director'), async (req, res) => {
  const result = await directorGetAllClients.execute();
  res.json(result);
});

app.get("/director/clients/:id/accounts", requireRole('director'), async (req, res) => {
  const result = await directorGetClientAccounts.execute(req.params.id);
  res.json(result);
});

app.post("/director/clients/:id/ban", requireRole('director'), async (req, res) => {
  const result = await directorManageBan.execute(req.params.id, req.body.reason, req.body.endDate);
  res.json(result);
});

app.post("/director/clients", requireRole('director'), async (req, res) => {
  const result = await directorManageCreate.execute(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
  res.json(result);
});

app.delete("/director/clients/:id", requireRole('director'), async (req, res) => {
  const result = await directorManageDelete.execute(req.params.id);
  res.json(result);
});

app.put("/director/clients/:id", requireRole('director'), async (req, res) => {
  const result = await directorManageUpdate.execute(req.params.id, req.body);
  res.json(result);
});

// ============ DIRECTOR COMPANY ROUTES ============
app.post("/director/companies", requireRole('director'), async (req, res) => {
  const result = await directorCreateCompany.execute(req.body.name);
  res.json(result);
});

app.delete("/director/companies/:id", requireRole('director'), async (req, res) => {
  const result = await directorDeleteCompany.execute(req.params.id);
  res.json(result);
});

app.get("/director/companies", requireRole('director'), async (req, res) => {
  const result = await directorGetAllCompanies.execute();
  res.json(result);
});

app.get("/director/companies/:id", requireRole('director'), async (req, res) => {
  const result = await directorGetCompany.execute(req.params.id);
  res.json(result);
});

app.put("/director/companies/:id", requireRole('director'), async (req, res) => {
  const result = await directorUpdateCompany.execute(req.params.id, req.body);
  res.json(result);
});

// ============ DIRECTOR SAVINGS ROUTES ============
app.post("/director/savings/rate", requireRole('director'), async (req, res) => {
  const result = await directorChangeSavingRate.execute(req.body.accountTypeName, req.body.rate);
  res.json(result);
});

// ============ DIRECTOR STOCK ROUTES ============
app.post("/director/stocks", requireRole('director'), async (req, res) => {
  const result = await directorCreateStock.execute(req.body.symbol, req.body.name, req.body.companyId);
  res.json(result);
});

app.delete("/director/stocks/:id", requireRole('director'), async (req, res) => {
  const result = await directorDeleteStock.execute(req.params.id);
  res.json(result);
});

app.put("/director/stocks/:id/listing", requireRole('director'), async (req, res) => {
  const result = await directorToggleStockListing.execute(req.params.id);
  res.json(result);
});

app.put("/director/stocks/:id", requireRole('director'), async (req, res) => {
  const result = await directorUpdateStock.execute(req.params.id, req.body);
  res.json(result);
});

// ============ ENGINE ROUTES ============
app.post("/engine/interest/daily", async (req, res) => {
  const result = await generateDailyInterest.execute();
  res.json(result);
});

app.post("/engine/loans/notify-to-pay", async (req, res) => {
  const result = await notifyLoanToPay.execute();
  res.json(result);
});

// ============ SHARED NOTIFICATION ROUTES ============
app.post("/notifications/savings-rate-change", async (req, res) => {
  const result = await notifyClientSavingRateChange.execute(req.body.newRate);
  res.json(result);
});

app.post("/notifications/loan-status", async (req, res) => {
  const result = await notifyLoanStatus.execute(req.body.loan, req.body.status);
  res.json(result);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
