/*
  Warnings:

  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "senderId",
ADD COLUMN     "reporterId" UUID,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "reporters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
