const prisma = require('../lib/prisma');
const registrarHistorico = async ({ acao, categoria, nome, detalhes, id_usuario }) => {
    try {
        await prisma.historico.create({
            data: {
                acao,
                categoria,
                item_nome,
                detalhes: detalhes || null,
                id_usuario: Number(id_usuario)
            }
        });
    } catch (error) {
        console.error('Erro ao registrar histórico:', error);
    }
};

module.exports = registrarHistorico;