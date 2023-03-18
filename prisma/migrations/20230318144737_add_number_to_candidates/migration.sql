/*
  Warnings:

  - A unique constraint covering the columns `[number,eventId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_number_eventId_key" ON "Candidate"("number", "eventId");
