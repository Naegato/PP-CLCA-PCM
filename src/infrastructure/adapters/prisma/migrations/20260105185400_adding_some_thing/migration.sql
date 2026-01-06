-- CreateTable
CREATE TABLE "users" (
    "identifier" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "clientProps" TEXT,
    "advisorProps" TEXT,
    "directorProps" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "accounts" (
    "identifier" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "bans" (
    "identifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "reason" TEXT NOT NULL,

    CONSTRAINT "bans_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "companies" (
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "stocks" (
    "identifier" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isListed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "identifier" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "identifier" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "stock_orders" (
    "identifier" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "remainingQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_orders_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "notifications" (
    "identifier" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "transactions" (
    "identifier" TEXT NOT NULL,
    "emitterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_iban_key" ON "accounts"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_key" ON "stocks"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_accountId_key" ON "portfolios"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_items_portfolioId_stockId_key" ON "portfolio_items"("portfolioId", "stockId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "account_types"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("identifier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_orders" ADD CONSTRAINT "stock_orders_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_orders" ADD CONSTRAINT "stock_orders_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "accounts"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "accounts"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
