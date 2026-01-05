-- CreateTable
CREATE TABLE "account_types" (
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "limitByClient" INTEGER,
    "description" TEXT,

    CONSTRAINT "account_types_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_types_name_key" ON "account_types"("name");