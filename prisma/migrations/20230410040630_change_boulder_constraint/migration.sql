/*
  Warnings:

  - A unique constraint covering the columns `[number,eventId]` on the table `Boulder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Boulder_number_eventId_key" ON "Boulder"("number", "eventId");
