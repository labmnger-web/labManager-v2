const prisma = require('../lib/prisma');
const registrarHistorico = async ({ acao, categoria, item_nome, descricao, id_usuario }) => {
    try {
        await prisma.historico.create({
            data: {
                acao,
                categoria,
                item_nome,
                id_usuario: parseInt(id_usuario)
            }
        });
    } catch (error) {
        console.error('Erro ao registrar histórico:', error);
    }
};

module.exports = registrarHistorico;