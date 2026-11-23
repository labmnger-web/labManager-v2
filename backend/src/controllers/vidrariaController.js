const prisma = require('../lib/prisma');

module.exports = {
  async getAllGlassware(req, res) {
    try {
      const vidrarias = await prisma.vidraria.findMany();
      res.status(200).json(vidrarias);
    } catch (error) {
      console.error('Erro ao listar vidrarias:', error);
      res.status(500).json({ error: 'Erro ao listar vidrarias' });
    }
  },

  async getGlasswareById(req, res) {
    try {
        const { id } = req.params;

        const vidraria = await prisma.vidraria.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!vidraria) {
            return res.status(500).json({
                error: 'Vidraria não encontrada'
            });
        }

        return res.status(200).json(vidraria);

    } catch (error) {
        console.error('Erro ao buscar vidraria:', error);

        return res.status(500).json({
            error: 'Erro ao buscar vidraria'
        });
    }
},

  async searchGlassware(req, res) {
    try {
      const search = req.query.nome;
      const vidrarias = await prisma.vidraria.findMany({
        where: {
          nome: {
            contains: search,
            mode: 'insensitive'
          }
        }
      });
      return res.status(200).json(vidrarias);
    } catch (error) {
      console.error('Erro ao procurar vidraria:', error);

      return res.status(500).json({
        error: 'Erro ao procurar vidraria'
      });
    }
  },

  async createGlassware(req, res) {
    try {
      const { nome, descricao, material, capacidade, unidade_medida, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !material || !capacidade || !unidade_medida || !local_armazenamento || !quantidade || !quantidade_minima) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const newGlassware = await prisma.vidraria.create({
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase(),
          capacidade: parseInt(capacidade),
          unidade_medida: unidade_medida.trim().toLowerCase(),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      return res.status(201).json({
        message: 'vidraria cadastrada com sucesso!', vidraria: newGlassware
      });
    } catch (error) {
      console.error('Erro ao cadastrar vidraria:', error);

      return res.status(500).json({
        error: 'Erro ao cadastrar vidraria'
      });
    }
  },


  async deleteGlassware(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID da vidraria é obrigatório' });
      }

      const vidraria = await prisma.vidraria.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json(vidraria);
    } catch (error) {
      console.error('Erro ao deletar vidraria:', error);
      res.status(500).json({ error: 'Erro ao deletar vidraria' });
    }
  },

  async updateGlassware(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, material, capacidade, unidade_medida, local_armazenamento, quantidade, quantidade_minima } = req.body;

      if (!nome || !material || !capacidade || !unidade_medida || !local_armazenamento || !quantidade || !quantidade_minima) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios' });
      }

      const GlasswareUpdate = await prisma.vidraria.update({
        where: {
          id: parseInt(id)
        },
        data: {
          nome: nome.trim().toLowerCase(),
          descricao: descricao?.trim().toLowerCase() || null,
          material: material.trim().toLowerCase(),
          capacidade: parseInt(capacidade),
          unidade_medida: unidade_medida.trim().toLowerCase(),
          local_armazenamento: local_armazenamento.trim().toLowerCase(),
          quantidade: parseInt(quantidade),
          quantidade_minima: parseInt(quantidade_minima)
        }
      });

      res.status(200).json(GlasswareUpdate);
    } catch (error) {
      console.error('Erro ao atualizar vidraria:', error);
      res.status(500).json({ error: 'Erro ao atualizar vidraria' });
    }
  }
}