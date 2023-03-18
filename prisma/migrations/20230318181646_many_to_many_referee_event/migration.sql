-- DropForeignKey
ALTER TABLE "Referee" DROP CONSTRAINT "Referee_eventId_fkey";

-- CreateTable
CREATE TABLE "_EventToReferee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToReferee_AB_unique" ON "_EventToReferee"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToReferee_B_index" ON "_EventToReferee"("B");

-- AddForeignKey
ALTER TABLE "_EventToReferee" ADD CONSTRAINT "_EventToReferee_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToReferee" ADD CONSTRAINT "_EventToReferee_B_fkey" FOREIGN KEY ("B") REFERENCES "Referee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
