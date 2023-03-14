/*
  Warnings:

  - Added the required column `sector` to the `Boulder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boulder" ADD COLUMN     "sector" TEXT NOT NULL;
