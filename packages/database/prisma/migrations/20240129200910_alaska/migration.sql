/*
  Warnings:

  - You are about to drop the `MoexSecurities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cashout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deposit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cashout" DROP CONSTRAINT "cashout_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "deal" DROP CONSTRAINT "deal_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "deposit" DROP CONSTRAINT "deposit_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "portfolio" DROP CONSTRAINT "portfolio_userId_fkey";

-- DropTable
DROP TABLE "MoexSecurities";

-- DropTable
DROP TABLE "cashout";

-- DropTable
DROP TABLE "deal";

-- DropTable
DROP TABLE "deposit";

-- DropTable
DROP TABLE "portfolio";

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "DealType";

-- DropEnum
DROP TYPE "Exchange";

-- DropEnum
DROP TYPE "MoexBoard";

-- DropEnum
DROP TYPE "MoexEngine";

-- DropEnum
DROP TYPE "MoexMarket";

-- DropEnum
DROP TYPE "MoexStockType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "StockType";

-- CreateTable
CREATE TABLE "deals" (
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "exchange" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "securityId" INTEGER NOT NULL,
    "securityType" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experts" (
    "avatarUrl" TEXT,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moex_bonds" (
    "board" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,

    CONSTRAINT "moex_bonds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moex_currencies" (
    "board" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,

    CONSTRAINT "moex_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moex_shares" (
    "board" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,

    CONSTRAINT "moex_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opinions" (
    "date" DATE NOT NULL,
    "exchange" TEXT NOT NULL,
    "expertId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "securityType" TEXT NOT NULL,
    "securityId" INTEGER NOT NULL,
    "sourceLink" TEXT,
    "targetPrice" DOUBLE PRECISION,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "opinions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "compound" BOOLEAN NOT NULL DEFAULT false,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "amount" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,
    "exchange" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "securityId" INTEGER NOT NULL,
    "securityType" TEXT NOT NULL,
    "tradeSaldo" INTEGER NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'INVESTOR',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "moex_bonds_ticker_key" ON "moex_bonds"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "moex_currencies_ticker_key" ON "moex_currencies"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "moex_shares_ticker_key" ON "moex_shares"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opinions" ADD CONSTRAINT "opinions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opinions" ADD CONSTRAINT "opinions_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "experts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
