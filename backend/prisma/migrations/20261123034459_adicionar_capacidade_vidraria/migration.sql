/*
  Warnings:

  - You are about to drop the column `capacidade` on the `produto_quimico` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `produto_quimico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `vidraria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capacidade` to the `vidraria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade_medida` to the `vidraria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "produto_quimico" DROP COLUMN "capacidade",
DROP COLUMN "material";

-- AlterTable
ALTER TABLE "vidraria" ADD COLUMN     "capacidade" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unidade_medida" TEXT NOT NULL,
ALTER COLUMN "quantidade" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "quantidade_minima" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "vidraria_nome_key" ON "vidraria"("nome");
