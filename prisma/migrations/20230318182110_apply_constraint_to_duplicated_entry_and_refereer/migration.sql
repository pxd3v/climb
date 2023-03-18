/*
  Warnings:

  - A unique constraint covering the columns `[candidateId,boulderId,eventId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,userId]` on the table `Referee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entry_candidateId_boulderId_eventId_key" ON "Entry"("candidateId", "boulderId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Referee_eventId_userId_key" ON "Referee"("eventId", "userId");
