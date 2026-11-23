const prisma = require('../lib/prisma');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {  
  
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          error: 'E-mail e senha são obrigatórios'
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: {
          email: email.trim().toLowerCase()
        }
      });

      if (!usuario) {
        return res.status(401).json({
          error: 'E-mail ou senha incorretos'
        });
      }

      const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaValida) {
        return res.status(401).json({
          error: 'E-mail ou senha incorretos'
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      );

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        token
      });

    } catch (error) {
      console.error('Erro ao realizar login:', error);

      return res.status(500).json({
        error: 'Erro ao realizar login'
      });
    }
  }
}