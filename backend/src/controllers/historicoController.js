const prisma = require('../lib/prisma');

module.exports = {
        async getAll(req, res) {
            try {
                const registros = await prisma.historico.findMany({
                    include: {
                        usuario: {
                            select: { id: true, nome: true }
                        }
                    }
                });

                return res.status(200).json(registros);
            } catch (error) {
                console.error('Erro ao buscar histórico:', error);
                return res.status(500).json({ error: 'Erro ao buscar histórico geral.' });
            }
        }
}
