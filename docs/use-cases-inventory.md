# Inventaire des Use Cases - PP-CLCA-PCM

Ce document liste tous les 56 use cases de l'application, organisés par rôle.

## Table des matières

- [Client (26 use cases)](#client-use-cases)
- [Advisor (8 use cases)](#advisor-use-cases)
- [Director (19 use cases)](#director-use-cases)
- [Engine (2 use cases)](#engine-use-cases)
- [Shared (2 use cases)](#shared-use-cases)

---

## Client Use Cases

### Authentication (5 use cases)

#### 1. ClientLogin
**Fichier**: `src/application/usecases/client/auth/client-login.ts`
**Description**: Authentification d'un client avec email/password
**Dépendances**: UserRepository, PasswordService, TokenService
**Input**: `LoginRequest { email, password }`
**Output**: `LoginResponse { token }` | `LoginInvalidCredentialsError` | `UserNotFoundByEmailError`

#### 2. ClientRegistration
**Fichier**: `src/application/usecases/client/auth/client-registration.ts`
**Description**: Création d'un nouveau compte client
**Dépendances**: UserRepository, AccountRepository, AccountTypeRepository
**Input**: `firstname, lastname, email, password`
**Output**: `User` | `Error`

#### 3. ClientLogout
**Fichier**: `src/application/usecases/client/auth/client-logout.ts`
**Description**: Déconnexion d'un client
**Dépendances**: LogoutService, Security
**Input**: None (utilise Security.getCurrentUser())
**Output**: `void` | `NotClient`

#### 4. ClientRequestPasswordReset
**Fichier**: `src/application/usecases/client/auth/client-request-password-reset.ts`
**Description**: Demande de réinitialisation de mot de passe
**Dépendances**: UserRepository, TokenService
**Input**: `RequestPasswordResetRequest { email }`
**Output**: `RequestPasswordResetResponse` | `UserNotFoundByEmailError`

#### 5. ClientResetPassword
**Fichier**: `src/application/usecases/client/auth/client-reset-password.ts`
**Description**: Réinitialisation du mot de passe avec token
**Dépendances**: UserRepository, TokenService, PasswordService
**Input**: `ResetPasswordRequest { token, newPassword }`
**Output**: `ResetPasswordResponse` | `UserNotFoundByIdError` | `InvalidResetTokenError` | `Error`

---

### Accounts Management (6 use cases)

#### 6. ClientCreateAccount
**Fichier**: `src/application/usecases/client/accounts/client-create-account.ts`
**Description**: Créer un nouveau compte bancaire
**Dépendances**: AccountRepository, AccountType (defaultAccountType)
**Input**: `user: User, name: string`
**Output**: `Account` | `AccountCreateError`

#### 7. ClientDeleteAccount
**Fichier**: `src/application/usecases/client/accounts/client-delete-account.ts`
**Description**: Supprimer un compte bancaire
**Dépendances**: AccountRepository, UserRepository
**Input**: `account: Account`
**Output**: `null` | `AccountDeleteError`

#### 8. ClientGetAccount
**Fichier**: `src/application/usecases/client/accounts/client-get-account.ts`
**Description**: Récupérer un compte par son ID
**Dépendances**: AccountRepository
**Input**: `accountId: string`
**Output**: `Account` | `ClientGetAccountError`

#### 9. ClientGetBalanceAccount
**Fichier**: `src/application/usecases/client/accounts/client-get-balance-account.ts`
**Description**: Récupérer le solde d'un compte
**Dépendances**: AccountRepository
**Input**: `accountId: string`
**Output**: `number` (balance) | `ClientGetBalanceAccountError` | `Error`

#### 10. ClientSavingAccountCreate
**Fichier**: `src/application/usecases/client/accounts/client-saving-account-create.ts`
**Description**: Créer un compte épargne
**Dépendances**: AccountRepository, AccountType (savingsAccountType)
**Input**: `user: User, name: string`
**Output**: `Account` | `AccountCreateError`

#### 11. ClientUpdateNameAccount
**Fichier**: `src/application/usecases/client/accounts/client-update-name-account.ts`
**Description**: Modifier le nom d'un compte
**Dépendances**: AccountRepository
**Input**: `account: Account, newName: string`
**Output**: `Account` | `Error`

---

### Loans Management (4 use cases)

#### 12. ClientGetLoans
**Fichier**: `src/application/usecases/client/loans/client-get-loans.ts`
**Description**: Récupérer la liste des prêts du client
**Dépendances**: LoanRepository
**Input**: `client: User`
**Output**: `Loan[]`

#### 13. ClientRepayLoan
**Fichier**: `src/application/usecases/client/loans/client-repay-loan.ts`
**Description**: Rembourser un prêt
**Dépendances**: TransactionRepository
**Input**: `account: Account, loan: Loan, amount: number`
**Output**: `Transaction[]` | `TransactionError[]`

#### 14. ClientRequestLoan
**Fichier**: `src/application/usecases/client/loans/client-request-loan.ts`
**Description**: Demander un nouveau prêt
**Dépendances**: LoanRequestRepository
**Input**: `client: User, amount: number`
**Output**: `LoanRequest` | `Error`

#### 15. ClientSimulateLoan
**Fichier**: `src/application/usecases/client/loans/client-simulate-loan.ts`
**Description**: Simuler les mensualités d'un prêt
**Dépendances**: None
**Input**: `principal: number, interestRate: number, durationMonths: number`
**Output**: `SimulatedLoan` | `SimulatedLoanError`

---

### Transactions (1 use case)

#### 16. ClientSendTransaction
**Fichier**: `src/application/usecases/client/transactions/client-send-transaction.ts`
**Description**: Envoyer de l'argent à un autre compte
**Dépendances**: AccountRepository
**Input**: `senderAccount: Account, receiverAccount: Account, amount: number`
**Output**: `number` (new balance) | `TransactionError`

---

### Stocks (2 use cases)

#### 17. ClientGetAvailableStocks
**Fichier**: `src/application/usecases/client/stocks/client-get-available-stocks.ts`
**Description**: Récupérer la liste des actions disponibles
**Dépendances**: StockRepository
**Input**: None
**Output**: `Stock[]`

#### 18. ClientGetStockWithPrice
**Fichier**: `src/application/usecases/client/stocks/client-get-stock-with-price.ts`
**Description**: Récupérer le prix actuel d'une action
**Dépendances**: StockRepository, MarketService
**Input**: `stockId: string`
**Output**: `StockWithPrice` | `ClientGetStockWithPriceError`

---

### Stock Orders (4 use cases)

#### 19. ClientCancelStockOrder
**Fichier**: `src/application/usecases/client/stocks-orders/client-cancel-stock-order.ts`
**Description**: Annuler un ordre d'achat/vente
**Dépendances**: StockOrderRepository
**Input**: `orderId: string, user: User`
**Output**: `void` | `ClientCancelStockOrderError` | `Error`

#### 20. ClientGetStockOrders
**Fichier**: `src/application/usecases/client/stocks-orders/client-get-stock-orders.ts`
**Description**: Récupérer les ordres du client
**Dépendances**: StockOrderRepository
**Input**: `user: User`
**Output**: `StockOrder[]` | `ClientGetStockOrdersError`

#### 21. ClientMatchStockOrder
**Fichier**: `src/application/usecases/client/stocks-orders/client-match-stock-order.ts`
**Description**: Matcher un ordre avec d'autres ordres
**Dépendances**: StockOrderRepository, AccountRepository, PortfolioRepository
**Input**: `order: StockOrder`
**Output**: `number` (matched quantity) | `MatchStockOrderError` | `InvalidIbanError`

#### 22. ClientRegisterStockOrder
**Fichier**: `src/application/usecases/client/stocks-orders/client-register-stock-order.ts`
**Description**: Créer un nouvel ordre d'achat/vente
**Dépendances**: StockOrderRepository, StockRepository, ClientMatchStockOrder
**Input**: `account: Account, stockId: string, side: OrderSide, price: number, quantity: number`
**Output**: `StockOrder` | `ClientRegisterStockOrderError`

---

### Portfolio (2 use cases)

#### 23. ClientCreatePortfolio
**Fichier**: `src/application/usecases/client/portfolio/client-create-portfolio.ts`
**Description**: Créer un portfolio pour un compte
**Dépendances**: PortfolioRepository, AccountRepository
**Input**: `accountId: string`
**Output**: `Portfolio` | `ClientCreatePortfolioError` | `Error`

#### 24. ClientGetPortfolio
**Fichier**: `src/application/usecases/client/portfolio/client-get-portfolio.ts`
**Description**: Récupérer le portfolio d'un compte
**Dépendances**: PortfolioRepository, AccountRepository
**Input**: `accountId: string`
**Output**: `Portfolio` | `ClientGetPortfolioError`

---

### Messages (1 use case)

#### 25. ClientSendMessage
**Fichier**: `src/application/usecases/client/messages/client-send-message.ts`
**Description**: Envoyer un message à un advisor
**Dépendances**: MessageRepository, DiscussionRepository, Security
**Input**: `discussionId: string | null, text: string`
**Output**: `Message` | `NotClient` | `DiscussionNotFoundError`

---

### Notifications (1 use case)

#### 26. ClientGetNotifications
**Fichier**: `src/application/usecases/client/notifications/client-get-notifications.ts`
**Description**: Récupérer les notifications du client
**Dépendances**: NotificationRepository, Security
**Input**: None (utilise Security.getCurrentUser())
**Output**: `Notification[]` | `NotClient`

---

## Advisor Use Cases

### Authentication (2 use cases)

#### 27. AdvisorLogin
**Fichier**: `src/application/usecases/advisor/auth/advisor-login.ts`
**Description**: Authentification d'un advisor
**Dépendances**: UserRepository, PasswordService, TokenService
**Input**: `LoginRequest { email, password }`
**Output**: `LoginResponse` | `LoginInvalidCredentialsError` | `UserNotFoundByEmailError`

#### 28. AdvisorRegistration
**Fichier**: `src/application/usecases/advisor/auth/advisor-registration.ts`
**Description**: Création d'un compte advisor
**Dépendances**: UserRepository
**Input**: `firstname, lastname, email, password`
**Output**: `User` | `Error`

---

### Loan Management (3 use cases)

#### 29. AdvisorGetPendingLoans
**Fichier**: `src/application/usecases/advisor/loans/advisor-get-pending-loans.ts`
**Description**: Récupérer les demandes de prêts en attente
**Dépendances**: LoanRequestRepository, Security
**Input**: None (utilise Security.getCurrentUser())
**Output**: `LoanRequest[]` | `NotAdvisor`

#### 30. AdvisorGrantLoan
**Fichier**: `src/application/usecases/advisor/loans/advisor-grant-loan.ts`
**Description**: Approuver une demande de prêt
**Dépendances**: LoanRequestRepository, LoanRepository, Security
**Input**: `loanRequestId: string`
**Output**: `Loan` | `NotAdvisor` | `null`

#### 31. AdvisorRejectLoan
**Fichier**: `src/application/usecases/advisor/loans/advisor-reject-loan.ts`
**Description**: Rejeter une demande de prêt
**Dépendances**: LoanRequestRepository, Security
**Input**: `loanRequestId: string`
**Output**: `LoanRequest` | `NotAdvisor` | `null`

---

### Messages Management (3 use cases)

#### 32. AdvisorCloseChat
**Fichier**: `src/application/usecases/advisor/messages/advisor-close-chat.ts`
**Description**: Fermer une discussion avec un client
**Dépendances**: DiscussionRepository, Security
**Input**: `discussionId: string`
**Output**: `Discussion` | `NotAdvisor` | `DiscussionNotFoundError`

#### 33. AdvisorReplyMessage
**Fichier**: `src/application/usecases/advisor/messages/advisor-reply-message.ts`
**Description**: Répondre à un message client
**Dépendances**: MessageRepository, Security
**Input**: `message: Message, text: string`
**Output**: `Message` | `NotAdvisor`

#### 34. AdvisorTransferChat
**Fichier**: `src/application/usecases/advisor/messages/advisor-transfer-chat.ts`
**Description**: Transférer une discussion à un autre advisor
**Dépendances**: DiscussionRepository, Security
**Input**: `discussion: Discussion, newAdvisor: User`
**Output**: `Discussion` | `NotAdvisor`

---

## Director Use Cases

### Authentication (2 use cases)

#### 35. DirectorLogin
**Fichier**: `src/application/usecases/director/auth/director-login.ts`
**Description**: Authentification d'un director
**Dépendances**: UserRepository, PasswordService, TokenService
**Input**: `LoginRequest { email, password }`
**Output**: `LoginResponse` | `LoginInvalidCredentialsError` | `UserNotFoundByEmailError`

#### 36. DirectorRegistration
**Fichier**: `src/application/usecases/director/auth/director-registration.ts`
**Description**: Création d'un compte director
**Dépendances**: UserRepository
**Input**: `firstname, lastname, email, password`
**Output**: `User` | `Error`

---

### Client Management (6 use cases)

#### 37. DirectorGetAllClients
**Fichier**: `src/application/usecases/director/clients/director-get-all-clients.ts`
**Description**: Récupérer la liste de tous les clients
**Dépendances**: UserRepository
**Input**: None
**Output**: `User[]`

#### 38. DirectorGetClientAccount
**Fichier**: `src/application/usecases/director/clients/director-get-client-accounts.ts`
**Description**: Récupérer les comptes d'un client
**Dépendances**: UserRepository
**Input**: `client: User`
**Output**: `Account[]` | `Error`

#### 39. DirectorManageBan
**Fichier**: `src/application/usecases/director/clients/director-manage-ban.ts`
**Description**: Bannir un utilisateur
**Dépendances**: UserRepository, BanRepository, Security
**Input**: `userId: string, reason: string, endDate?: Date`
**Output**: `Ban` | `NotDirector` | `UserNotFoundByIdError`

#### 40. DirectorManageCreate
**Fichier**: `src/application/usecases/director/clients/director-manage-create.ts`
**Description**: Créer un nouvel utilisateur
**Dépendances**: UserRepository, Security
**Input**: `firstname, lastname, email, password`
**Output**: `User` | `NotDirector` | `Error`

#### 41. DirectorManageDelete
**Fichier**: `src/application/usecases/director/clients/director-manage-delete.ts`
**Description**: Supprimer un utilisateur
**Dépendances**: UserRepository, Security
**Input**: `userId: string`
**Output**: `void` | `NotDirector` | `UserNotFoundByIdError`

#### 42. DirectorManageUpdate
**Fichier**: `src/application/usecases/director/clients/director-manage-update.ts`
**Description**: Modifier un utilisateur
**Dépendances**: UserRepository, Security
**Input**: `userId: string, props: UpdateUserProps`
**Output**: `User` | `NotDirector` | `UserNotFoundByIdError` | `Error`

---

### Company Management (5 use cases)

#### 43. DirectorCreateCompany
**Fichier**: `src/application/usecases/director/companies/director-create-company.ts`
**Description**: Créer une nouvelle entreprise
**Dépendances**: CompanyRepository
**Input**: `name: string`
**Output**: `Company` | `DirectorCreateCompanyError`

#### 44. DirectorDeleteCompany
**Fichier**: `src/application/usecases/director/companies/director-delete-company.ts`
**Description**: Supprimer une entreprise
**Dépendances**: CompanyRepository, StockRepository
**Input**: `id: string`
**Output**: `void` | `DirectorDeleteCompanyError`

#### 45. DirectorGetAllCompanies
**Fichier**: `src/application/usecases/director/companies/director-get-all-companies.ts`
**Description**: Récupérer la liste des entreprises
**Dépendances**: CompanyRepository
**Input**: None
**Output**: `Company[]`

#### 46. DirectorGetCompany
**Fichier**: `src/application/usecases/director/companies/director-get-company.ts`
**Description**: Récupérer une entreprise par ID
**Dépendances**: CompanyRepository
**Input**: `id: string`
**Output**: `Company` | `DirectorGetCompanyError`

#### 47. DirectorUpdateCompany
**Fichier**: `src/application/usecases/director/companies/director-update-company.ts`
**Description**: Modifier une entreprise
**Dépendances**: CompanyRepository
**Input**: `id: string, name: string`
**Output**: `Company` | `DirectorUpdateCompanyError`

---

### Stock Management (5 use cases)

#### 48. DirectorCreateStock
**Fichier**: `src/application/usecases/director/stocks/director-create-stock.ts`
**Description**: Créer une nouvelle action
**Dépendances**: StockRepository, CompanyRepository
**Input**: `symbol: string, name: string, companyId: string`
**Output**: `Stock` | `DirectorCreateStockError`

#### 49. DirectorDeleteStock
**Fichier**: `src/application/usecases/director/stocks/director-delete-stock.ts`
**Description**: Supprimer une action
**Dépendances**: StockRepository, PortfolioRepository, StockOrderRepository
**Input**: `stockId: string`
**Output**: `void` | `DirectorDeleteStockError`

#### 50. DirectorToggleStockListing
**Fichier**: `src/application/usecases/director/stocks/director-toggle-stock-listing.ts`
**Description**: Activer/désactiver le listing d'une action
**Dépendances**: StockRepository
**Input**: `stockId: string`
**Output**: `Stock` | `DirectorToggleStockListingError`

#### 51. DirectorUpdateStock
**Fichier**: `src/application/usecases/director/stocks/director-update-stock.ts`
**Description**: Modifier une action
**Dépendances**: StockRepository, CompanyRepository
**Input**: `stockId: string, name?: string, symbol?: string, isListed?: boolean, companyId?: string`
**Output**: `Stock` | `DirectorUpdateStockError`

---

### Savings Management (1 use case)

#### 52. DirectorChangeSavingRate
**Fichier**: `src/application/usecases/director/savings/director-change-saving-rate.ts`
**Description**: Modifier le taux d'épargne
**Dépendances**: AccountTypeRepository
**Input**: `name: AccountTypeName, rate: number`
**Output**: `AccountType` | `AccountTypeAlreadyExistError` | `AccountTypeDoesNotExistError`

---

## Engine Use Cases

### Background Jobs (2 use cases)

#### 53. GenerateDailyInterest
**Fichier**: `src/application/usecases/engine/generate-daily-interest.ts`
**Description**: Génération quotidienne des intérêts (cron job)
**Dépendances**: AccountRepository
**Input**: None
**Output**: `{ totalAccountsProcessed: number }` | `GenerateDailyInterestError`

#### 54. NotifyLoanToPay
**Fichier**: `src/application/usecases/engine/notify-loan-to-pay.ts`
**Description**: Notification des prêts à payer (cron job)
**Dépendances**: LoanRepository, Notifier
**Input**: None
**Output**: `void`

---

## Shared Use Cases

### Notifications (2 use cases)

#### 55. NotifyClientSavingRateChange
**Fichier**: `src/application/usecases/shared/notifications/notify-client-saving-rate-change.ts`
**Description**: Notifier les clients du changement de taux d'épargne
**Dépendances**: NotificationRepository, Notifier, UserRepository
**Input**: `newRate: number`
**Output**: `void`

#### 56. NotifyLoanStatus
**Fichier**: `src/application/usecases/shared/notifications/notify-loan-status.ts`
**Description**: Notifier le statut d'une demande de prêt
**Dépendances**: NotificationRepository, Notifier
**Input**: `loan: Loan | LoanRequest, status: string`
**Output**: `Notification`

---

## Statistiques

### Répartition par catégorie
- Authentication: 9 use cases (16%)
- Account Management: 6 use cases (11%)
- Loan Management: 8 use cases (14%)
- Stock Trading: 11 use cases (20%)
- Client Management: 6 use cases (11%)
- Company Management: 5 use cases (9%)
- Messages: 4 use cases (7%)
- Background Jobs: 2 use cases (4%)
- Notifications: 3 use cases (5%)
- Transactions: 1 use case (2%)

### Répartition par rôle
- Client: 26 use cases (46%)
- Director: 19 use cases (34%)
- Advisor: 8 use cases (14%)
- Engine: 2 use cases (4%)
- Shared: 2 use cases (4%)

---

**Total**: 56 use cases
**Dernière mise à jour**: 2026-01-06
