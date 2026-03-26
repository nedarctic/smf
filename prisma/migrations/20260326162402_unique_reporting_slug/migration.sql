/*
  Warnings:

  - A unique constraint covering the columns `[reportingPageUrl]` on the table `reporting_pages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reporting_pages_reportingPageUrl_key" ON "reporting_pages"("reportingPageUrl");
