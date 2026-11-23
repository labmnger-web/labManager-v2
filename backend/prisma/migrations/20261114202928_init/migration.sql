-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('MANHA', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'COMPRADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "acessorio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "material" TEXT NOT NULL,
    "local_armazenamento" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_minima" INTEGER NOT NULL,

    CONSTRAINT "acessorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "turno" "Turno" NOT NULL,
    "descricao" TEXT,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "material" TEXT NOT NULL,

    CONSTRAINT "equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_acessorio" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_acessorio" INTEGER NOT NULL,

    CONSTRAINT "pedido_acessorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_equipamento" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_equipamento" INTEGER NOT NULL,

    CONSTRAINT "pedido_equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_produto_quimico" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_produto_quimico" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pedido_produto_quimico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_vidraria" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_vidraria" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "pedido_vidraria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimento" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "data" DATE NOT NULL,

    CONSTRAINT "procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimento_acessorio" (
    "id" SERIAL NOT NULL,
    "id_procedimento" INTEGER NOT NULL,
    "id_acessorio" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "procedimento_acessorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimento_equipamento" (
    "id" SERIAL NOT NULL,
    "id_procedimento" INTEGER NOT NULL,
    "id_equipamento" INTEGER NOT NULL,

    CONSTRAINT "procedimento_equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimento_produto_quimico" (
    "id" SERIAL NOT NULL,
    "id_produto_quimico" INTEGER NOT NULL,
    "id_procedimento" INTEGER NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "procedimento_produto_quimico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimento_vidraria" (
    "id" SERIAL NOT NULL,
    "id_procedimento" INTEGER NOT NULL,
    "id_vidraria" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "procedimento_vidraria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_quimico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "unidade_medida" TEXT NOT NULL,
    "local_armazenamento" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "quantidade_minima" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "produto_quimico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vidraria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "descricao" TEXT,
    "local_armazenamento" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_minima" INTEGER NOT NULL,

    CONSTRAINT "vidraria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produto_quimico_nome_key" ON "produto_quimico"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_acessorio" ADD CONSTRAINT "pedido_acessorio_id_acessorio_fkey" FOREIGN KEY ("id_acessorio") REFERENCES "acessorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_acessorio" ADD CONSTRAINT "pedido_acessorio_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_equipamento" ADD CONSTRAINT "pedido_equipamento_id_equipamento_fkey" FOREIGN KEY ("id_equipamento") REFERENCES "equipamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_equipamento" ADD CONSTRAINT "pedido_equipamento_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_produto_quimico" ADD CONSTRAINT "pedido_produto_quimico_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_produto_quimico" ADD CONSTRAINT "pedido_produto_quimico_id_produto_quimico_fkey" FOREIGN KEY ("id_produto_quimico") REFERENCES "produto_quimico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_vidraria" ADD CONSTRAINT "pedido_vidraria_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_vidraria" ADD CONSTRAINT "pedido_vidraria_id_vidraria_fkey" FOREIGN KEY ("id_vidraria") REFERENCES "vidraria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento" ADD CONSTRAINT "procedimento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_acessorio" ADD CONSTRAINT "procedimento_acessorio_id_acessorio_fkey" FOREIGN KEY ("id_acessorio") REFERENCES "acessorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_acessorio" ADD CONSTRAINT "procedimento_acessorio_id_procedimento_fkey" FOREIGN KEY ("id_procedimento") REFERENCES "procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_equipamento" ADD CONSTRAINT "procedimento_equipamento_id_equipamento_fkey" FOREIGN KEY ("id_equipamento") REFERENCES "equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_equipamento" ADD CONSTRAINT "procedimento_equipamento_id_procedimento_fkey" FOREIGN KEY ("id_procedimento") REFERENCES "procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_produto_quimico" ADD CONSTRAINT "procedimento_produto_quimico_id_procedimento_fkey" FOREIGN KEY ("id_procedimento") REFERENCES "procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_produto_quimico" ADD CONSTRAINT "procedimento_produto_quimico_id_produto_quimico_fkey" FOREIGN KEY ("id_produto_quimico") REFERENCES "produto_quimico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_vidraria" ADD CONSTRAINT "procedimento_vidraria_id_procedimento_fkey" FOREIGN KEY ("id_procedimento") REFERENCES "procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimento_vidraria" ADD CONSTRAINT "procedimento_vidraria_id_vidraria_fkey" FOREIGN KEY ("id_vidraria") REFERENCES "vidraria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
