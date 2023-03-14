-- CreateEnum
CREATE TYPE "BoulderGrade" AS ENUM ('roxo', 'branco', 'amarelo', 'verde', 'azul', 'vermelho', 'preto');

-- AlterTable
ALTER TABLE "Boulder" ADD COLUMN     "color" "BoulderGrade" NOT NULL DEFAULT 'verde';
