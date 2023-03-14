/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId,category]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_eventId_category_key" ON "Candidate"("userId", "eventId", "category");
