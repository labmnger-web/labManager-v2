const prisma = require('../lib/prisma');

module.exports = {
    async getAllSchedules(req, res) {
        try {
            const agendamentos = await prisma.agendamento.findMany({
                include: {
                    usuario: {
                        select: { id: true, nome: true }
                    }
                },
                orderBy: { data: 'asc' }
            });
            res.status(200).json(agendamentos);
        } catch (error) {
            console.error('Erro ao listar agendamentos:', error);
            res.status(500).json({ error: 'Erro ao listar agendamentos' });
        }
    },

    async getScheduleById(req, res) {
        try {
            const { id } = req.params;

            const agendamento = await prisma.agendamento.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    usuario: {
                        select: { id: true, nome: true }
                    }
                }
            });

            if (!agendamento) {
                return res.status(500).json({
                    error: 'agendamento não encontrado'
                });
            }

            return res.status(200).json(agendamento);

        } catch (error) {
            console.error('Erro ao buscar agendamento:', error);

            return res.status(500).json({
                error: 'Erro ao buscar agendamento'
            });
        }
    },

    async searchSchedules(req, res) {
        try {
            const { q } = req.query;

            // Busca todos os agendamentos trazendo o nome do usuário
            const todosAgendamentos = await prisma.agendamento.findMany({
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                },
                orderBy: {
                    data: 'desc'
                }
            });

            // Se não houver termo de pesquisa, retorna todos
            if (!q || !q.trim()) {
                return res.json(todosAgendamentos);
            }

            const termo = q.trim().toLowerCase();

            const filtrados = todosAgendamentos.filter((ag) => {
                // Formata a data para DD/MM/AAAA (ajuste timeZone: 'UTC' para não voltar 1 dia)
                const dataFormatada = new Date(ag.data).toLocaleDateString('pt-BR', {
                    timeZone: 'UTC'
                });

                return (
                    String(ag.id).includes(termo) ||
                    dataFormatada.includes(termo) ||
                    (ag.descricao && ag.descricao.toLowerCase().includes(termo)) ||
                    (ag.turno && ag.turno.toLowerCase().includes(termo)) ||
                    (ag.usuario?.nome && ag.usuario.nome.toLowerCase().includes(termo))
                );
            });

            return res.json(filtrados);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
        }
    },

    async createSchedule(req, res) {
        try {

            const { data, turno, descricao } = req.body;
            const id_usuario = req.userId.id;

            if (!data || !turno) {
                return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
            }

            const newSchedule = await prisma.agendamento.create({
                data: {
                    data: new Date(data),
                    descricao: descricao?.trim().toLowerCase() || null,
                    turno,
                    id_usuario: parseInt(id_usuario)
                },
                include: {
                    usuario: {
                        select: { id: true, nome: true }
                    }
                }
            });

            return res.status(200).json({
                message: 'agendamento cadastrado com sucesso!', agendamento: newSchedule
            });
        } catch (error) {
            console.error('Erro ao cadastrar agendamento:', error);

            return res.status(500).json({
                error: 'Erro ao cadastrar agendamento'
            });
        }
    },

    async deleteSchedule(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do agendamento é obrigatório' });
            }

            const agendamento = await prisma.agendamento.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).json(agendamento);
        } catch (error) {
            console.error('Erro ao deletar produtosquimico:', error);
            res.status(500).json({ error: 'Erro ao deletar produtosquimico' });
        }
    },

    async updateSchedule(req, res) {
        try {
            const { id } = req.params;
            const { data, turno, descricao } = req.body;

            if (!data || !turno) {
                return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
            }

            const ScheduleUpdate = await prisma.agendamento.update({
                where: { id: parseInt(id) },
                data: {
                    data: new Date(data),
                    descricao: descricao?.trim().toLowerCase() || null,
                    turno
                }
            });

            res.status(200).json(ScheduleUpdate);
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            res.status(500).json({ error: 'Erro ao atualizar agendamento' });
        }
    }
}