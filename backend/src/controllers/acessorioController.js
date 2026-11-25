const prisma = require('../lib/prisma');

const registrarHistorico = require('../utils/registrarHistorico');

module.exports = {
  async getAllAccessories(req, res) {
    try {
      const acessorios = await prisma.acessorio.findMany();
      res.status(200).json(acessorios);
    } catch (error) {
      console.error('Erro ao listar acessorios:', error);
      res.status(500).json({ error: 'Erro ao listar acessorios' });
    }
  },

  async getAccessoryById(req, res) {
    try {
      const { id } = req.params;

      const acessorio = await prisma.acessorio.findUnique({
        where: { id: parseInt(id) }
      });

      if (!acessorio) {
        return res.status(500).json({ error: 'Acessório não encontrado' });
      }

      return res.status(200).json(acessorio);
    } catch (error) {
      console.error('ERRO REAL AO BUSCAR ACESSÓRIO:', error);

      return res.status(500).json({
        error: error.message
      });
    }
  },


  async searchAccessories(req, res) {
    try {
      const search = req.query.nome || '';

      const acessorios = await prisma.acessorio.findMany({
        where: {
          nome: {
            contains: search,
            mode: 'insensitive'
          }
        }
      });

      return res.status(200).json(acessorios);

    } catch (error) {
      console.error('Erro ao procurar acessório:', error);

      return res.status(500).json({
        error: 'Erro ao procurar acessório'
      });
    }
  },


  async createAccessory(req, res) {
    try {

      const { nome, descricao, material, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !material || !local_armazenamento || quantidade == null || quantidade_minima == null) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const newAccessory = await prisma.acessorio.create({
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase(),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      await registrarHistorico({
        acao: 'CRIOU',
        categoria: 'ACESSORIO',
        item_nome: newAccessory.nome,
        detalhes: `Quantidade inicial: ${novoItem.quantidade ?? '-'}`,
        id_usuario: req.userId
      });

      return res.status(201).json({
        message: 'Acessório cadastrado com sucesso!', acessorio: newAccessory
      });
    } catch (error) {
      console.error('Erro ao cadastrar acessório:', error);

      return res.status(500).json({
        error: 'Erro ao cadastrar acessório'
      });
    }
  },


  async deleteAccessory(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do acessório é obrigatório' });
      }

      const accessory = await prisma.acessorio.findUnique({
            where: { id: Number(id) }
        });

      const acessorio = await prisma.acessorio.delete({
        where: { id: parseInt(id) }
      });

      await registrarHistorico({
        acao: 'DELETOU',
        categoria: 'ACESSORIO', 
        item_nome: accessory.nome,
        detalhes: `Quantidade inicial: ${novoItem.quantidade ?? '-'}`,
        id_usuario: req.userId
      });

      res.status(200).json(acessorio);
    } catch (error) {
      console.error('Erro ao deletar acessório:', error);
      res.status(500).json({ error: 'Erro ao deletar acessório' });
    }
  },

  async updateAccessory(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, material, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !material || !local_armazenamento || quantidade == null || quantidade_minima == null) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const accessoryUpdate = await prisma.acessorio.update({
        where: { id: parseInt(id) },
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase(),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      await registrarHistorico({
        acao: 'EDITOU',
        categoria: 'ACESSORIO',
        item_nome: accessoryUpdate.nome,
        id_usuario: req.userId
      });

      res.status(200).json(accessoryUpdate);
    } catch (error) {
      console.error('Erro ao atualizar acessório:', error);
      res.status(500).json({ error: 'Erro ao atualizar acessório' });
    }
  }
}