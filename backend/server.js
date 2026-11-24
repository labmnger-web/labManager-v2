
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use(express.json());

app.use(express.json());

const authRoutes = require('./src/routes/authRoutes.js');
const usuarioRoutes = require('./src/routes/usuarioRoutes.js');
const equipamentoRoutes = require('./src/routes/equipamentoRoutes.js');
const produtoQuimicoRoutes = require('./src/routes/produtoQuimicoRoutes.js');
const acessorioRoutes = require('./src/routes/acessorioRoutes.js');
const vidrariaRoutes = require('./src/routes/vidrariaRoutes.js');

app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/equipamento', equipamentoRoutes);
app.use('/reagente', produtoQuimicoRoutes);
app.use('/acessorio', acessorioRoutes);
app.use('/vidraria', vidrariaRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0,0,0,0', () => {
  console.log(`Servidor LabManager rodando na porta ${PORT}`);
});
