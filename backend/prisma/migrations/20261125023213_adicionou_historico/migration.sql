-- CreateEnum
CREATE TYPE "Acao" AS ENUM ('CRIOU', 'DELETOU', 'EDITOU');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('ACESSORIO', 'EQUIPAMENTO', 'REAGENTE', 'VIDRARIA');

-- CreateTable
CREATE TABLE "historico" (
    "id" SERIAL NOT NULL,
    "acao" "Acao" NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "item_nome" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
