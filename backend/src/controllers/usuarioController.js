const prisma = require('../lib/prisma');

const bcrypt = require('bcrypt');

module.exports = {

  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário não condiz' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) },
        select: {
          id:true,
          nome: true,
          email: true
        }
      });

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async createUser(req, res) {
    try {

      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const newUser = await prisma.usuario.create({
        data: {
          nome: nome.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          senha: senhaHash,
        },
      });

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        usuario: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Este e-mail já está cadastrado!'
        });
      }

      return res.status(500).json({
        error: 'Erro ao cadastrar usuário'
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário não condiz' });
      }

      const usuario = await prisma.usuario.delete({
        where: { id }
      });

      res.status(200).json({message: 'Conta excluída com sucesso.'});
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  },

  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);

      const { nome, email, senha } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário não condiz' });
      }

      if (!id || !nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      const senhaHash = await bcrypt.hash(senha, 10);

      const userUpdate = await prisma.usuario.update({
        where: { id },
        data: {
          nome: nome.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          senha: senhaHash,
        },
        select: {
           id: true,
            nome: true,
            email: true
        }
      });

      res.status(200).json({message: 'Usuário atualizado com sucesso.'});
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
}