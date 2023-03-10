/*
  Warnings:

  - You are about to drop the column `content` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "content",
DROP COLUMN "published",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
