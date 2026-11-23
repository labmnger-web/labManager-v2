/*
  Warnings:

  - Added the required column `capacidade` to the `produto_quimico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `produto_quimico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "produto_quimico" ADD COLUMN     "capacidade" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "material" TEXT NOT NULL;
