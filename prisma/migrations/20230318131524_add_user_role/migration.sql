-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'referee', 'athlete');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'athlete';
