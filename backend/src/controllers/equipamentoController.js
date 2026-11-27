const prisma = require('../lib/prisma');
const registrarHistorico = require('../utils/registrarHistorico');

module.exports = {
  async getAllEquipments(req, res) {
    try {
      const equipamentos = await prisma.equipamento.findMany();
      res.status(200).json(equipamentos);
    } catch (error) {
      console.error('Erro ao listar equipamentos:', error);
      res.status(500).json({ error: 'Erro ao listar equipamentos' });
    }
  },

  async getEquipmentById(req, res) {
    try {
      const { id } = req.params;

      const equipamento = await prisma.equipamento.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (!equipamento) {
        return res.status(500).json({
          error: 'Equipamento não encontrado'
        });
      }

      return res.status(200).json(equipamento);

    } catch (error) {
      console.error('Erro ao buscar equipamento:', error);

      return res.status(500).json({
        error: 'Erro ao buscar equipamento'
      });
    }
  },

  async searchEquipments(req, res) {
    try {
      const search = req.body;
      const equipamentos = await prisma.equipamento.findMany({
        where: {
          nome: {
            contains: search,
            mode: 'insensitive'
          }
        }
      });
      return res.status(201).json(equipamentos);
    } catch (error) {
      console.error('Erro ao procurar equipamento:', error);

      return res.status(500).json({
        error: 'Erro ao procurar equipamento'
      });
    }
  },

  async createEquipment(req, res) {
    try {

      const { nome, descricao, material } = req.body;

      if (!nome || !material) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const newEquipment = await prisma.equipamento.create({
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase()
        }
      });

      await registrarHistorico({
        acao: 'CRIOU',
        categoria: 'EQUIPAMENTO',
        item_nome: newEquipment.nome,
        id_usuario: req.userId.id
      });


      return res.status(201).json({
        message: 'Equipamento cadastrado com sucesso!', equipamento: newEquipment
      });
    } catch (error) {
      console.error('Erro ao cadastrar equipamento:', error);

      return res.status(500).json({
        error: 'Erro ao cadastrar equipamento'
      });
    }
  },


  async deleteEquipment(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do equipamento é obrigatório' });
      }

      const equipment = await prisma.equipamento.findUnique({
        where: { id: parseInt(id) }
      });

      const equipamento = await prisma.equipamento.delete({
        where: { id: parseInt(id) }
      });

      await registrarHistorico({
        acao: 'DELETOU',
        categoria: 'EQUIPAMENTO',
        item_nome: equipment.nome,
        id_usuario: req.userId.id
      });

      res.status(200).json(equipamento);
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error);
      res.status(500).json({ error: 'Erro ao deletar equipamento' });
    }
  },

  async updateEquipment(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, material } = req.body;

      if (!nome || !material) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const equipmentUpdate = await prisma.equipamento.update({
        where: { id: parseInt(id) },
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase()
        }
      });

      await registrarHistorico({
        acao: 'EDITOU',
        categoria: 'EQUIPAMENTO',
        item_nome: equipmentUpdate.nome,
        id_usuario: req.userId.id
      });

      res.status(200).json(equipmentUpdate);
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error);
      res.status(500).json({ error: 'Erro ao atualizar equipamento' });
    }
  }
}