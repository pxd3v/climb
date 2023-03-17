-- DropIndex
DROP INDEX "Candidate_eventId_key";

-- DropIndex
DROP INDEX "Candidate_userId_key";

-- CreateTable
CREATE TABLE "Boulder" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "flashScore" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Boulder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "boulderId" INTEGER NOT NULL,
    "tries" INTEGER NOT NULL,
    "sent" BOOLEAN NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boulder" ADD CONSTRAINT "Boulder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES "Boulder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
