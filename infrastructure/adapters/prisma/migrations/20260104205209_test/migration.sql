-- CreateTable
CREATE TABLE "users" (
    "identifier" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "advisorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "client_props" (
    "identifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "client_props_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "advisor_props" (
    "identifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "advisor_props_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "director_props" (
    "identifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "director_props_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "accounts" (
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_props_userId_key" ON "client_props"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "advisor_props_userId_key" ON "advisor_props"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "director_props_userId_key" ON "director_props"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_iban_key" ON "accounts"("iban");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("identifier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_props" ADD CONSTRAINT "client_props_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("identifier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisor_props" ADD CONSTRAINT "advisor_props_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("identifier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director_props" ADD CONSTRAINT "director_props_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("identifier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "account_types"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
