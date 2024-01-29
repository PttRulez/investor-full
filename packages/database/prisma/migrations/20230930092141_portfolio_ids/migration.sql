/*
  Warnings:

  - Added the required column `portfolioId` to the `cashout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolioId` to the `deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cashout" ADD COLUMN     "portfolioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "deposit" ADD COLUMN     "portfolioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "deposit" ADD CONSTRAINT "deposit_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashout" ADD CONSTRAINT "cashout_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
