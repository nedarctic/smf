/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Logo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Logo_companyId_key" ON "Logo"("companyId");
