/*
  Warnings:

  - You are about to drop the column `eventId` on the `Entry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_eventId_fkey";

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "eventId";
