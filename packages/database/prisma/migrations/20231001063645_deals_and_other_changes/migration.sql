/*
  Warnings:

  - You are about to drop the column `board` on the `deal` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeName` on the `deal` table. All the data in the column will be lost.
  - You are about to drop the column `ticker` on the `deal` table. All the data in the column will be lost.
  - Added the required column `exchange` to the `deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityId` to the `deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `deal` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `stockType` on the `deal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('SHARE', 'BOND');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('MOEX');

-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "MoexEngine" AS ENUM ('stock', 'currency');

-- CreateEnum
CREATE TYPE "MoexMarket" AS ENUM ('shares', 'bonds');

-- CreateEnum
CREATE TYPE "MoexBoard" AS ENUM ('TQBR');

-- CreateEnum
CREATE TYPE "MoexStockType" AS ENUM ('stock_index_if', 'common_share', 'preferred_share', 'exchange_bond', 'corporate_bond', 'ofz_bond', 'futures', 'public_ppif', 'exchange_ppif', 'stock_index');

-- AlterTable
ALTER TABLE "deal" DROP COLUMN "board",
DROP COLUMN "exchangeName",
DROP COLUMN "ticker",
ADD COLUMN     "exchange" "Exchange" NOT NULL,
ADD COLUMN     "securityId" INTEGER NOT NULL,
ADD COLUMN     "type" "DealType" NOT NULL,
DROP COLUMN "stockType",
ADD COLUMN     "stockType" "StockType" NOT NULL;

-- CreateTable
CREATE TABLE "MoexSecurities" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "engine" "MoexEngine" NOT NULL,
    "market" "MoexMarket" NOT NULL,
    "board" "MoexBoard" NOT NULL,
    "type" "MoexStockType" NOT NULL,

    CONSTRAINT "MoexSecurities_pkey" PRIMARY KEY ("id")
);
