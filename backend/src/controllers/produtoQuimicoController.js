const prisma = require('../lib/prisma');
module.exports = {
  async getAllChemicals(req, res) {
    try {
      const produtos_quimicos = await prisma.produto_quimico.findMany();
      res.status(200).json(produtos_quimicos);
    } catch (error) {
      console.error('Erro ao listar produtos quimicos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos quimicos' });
    }
  },

  async getChemicalById(req, res) {
    try {
      const { id } = req.params;

      const produto_quimico = await prisma.produto_quimico.findUnique({
        where: {
          id: parseInt(id)
        }
      });

      if (!produto_quimico) {
        return res.status(500).json({
          error: 'produto_quimico não encontrado'
        });
      }

      return res.status(200).json(produto_quimico);

    } catch (error) {
      console.error('Erro ao buscar produto quimico:', error);

      return res.status(500).json({
        error: 'Erro ao buscar produto quimico'
      });
    }
  },

  async searchChemicals(req, res) {
    try {
      const search = req.body;
      const produtos_quimicos = await prisma.produto_quimico.findMany({
        where: {
          nome: {
            contains: search,
            mode: 'insensitive'
          }
        }
      });
      return res.status(201).json(produtos_quimicos);
    } catch (error) {
      console.error('Erro ao procurar produto quimico:', error);

      return res.status(500).json({
        error: 'Erro ao procurar produto quimico'
      });
    }
  },

  async createChemical(req, res) {
    try {

      const { nome, descricao, unidade_medida, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !unidade_medida || !local_armazenamento || quantidade == null || quantidade_minima == null) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const newChemical = await prisma.produto_quimico.create({
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          unidade_medida: parseFloat(unidade_medida),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      await registrarHistorico({
        acao: 'CRIOU',
        categoria: 'REAGENTE',
        item_nome: newChemical.nome,
        id_usuario: req.userId
      });

      return res.status(201).json({
        message: 'produto quimico cadastrado com sucesso!', produto_quimico: newChemical
      });
    } catch (error) {
      console.error('Erro ao cadastrar produto quimico:', error);

      return res.status(500).json({
        error: 'Erro ao cadastrar produto quimico'
      });
    }
  },


  async deleteChemical(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do produto quimico é obrigatório' });
      }

      const chemical = await prisma.produto_quimico.findUnique({
        where: { id: parseInt(id) }
      });

      const produto_quimico = await prisma.produto_quimico.delete({
        where: { id: parseInt(id) }
      });

      await registrarHistorico({
        acao: 'DELETOU',
        categoria: 'REAGENTE',
        item_nome: chemical.nome,
        id_usuario: req.userId
      });

      res.status(200).json(produto_quimico);
    } catch (error) {
      console.error('Erro ao deletar produtosquimico:', error);
      res.status(500).json({ error: 'Erro ao deletar produtosquimico' });
    }
  },

  async updateChemical(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, unidade_medida, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !unidade_medida || !local_armazenamento || quantidade == null || quantidade_minima == null) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const ChemicalUpdate = await prisma.produto_quimico.update({
        where: { id: parseInt(id) },
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          unidade_medida: unidade_medida.trim().toLowerCase(),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      await registrarHistorico({
        acao: 'EDITOU',
        categoria: 'REAGENTE',
        item_nome: ChemicalUpdate.nome,
        id_usuario: req.userId
      });

      res.status(200).json(ChemicalUpdate);
    } catch (error) {
      console.error('Erro ao atualizar produto quimico:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto quimico' });
    }
  }
}