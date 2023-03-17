/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Candidate_userId_eventId_category_key";

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_eventId_key" ON "Candidate"("userId", "eventId");
