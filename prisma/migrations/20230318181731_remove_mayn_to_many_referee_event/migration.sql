/*
  Warnings:

  - You are about to drop the `_EventToReferee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToReferee" DROP CONSTRAINT "_EventToReferee_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToReferee" DROP CONSTRAINT "_EventToReferee_B_fkey";

-- DropTable
DROP TABLE "_EventToReferee";

-- AddForeignKey
ALTER TABLE "Referee" ADD CONSTRAINT "Referee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
