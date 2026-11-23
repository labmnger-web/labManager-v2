const express = require('express');
const produtoQuimicoController = require('../controllers/produtoQuimicoController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, produtoQuimicoController.getAllChemicals);
router.get('/search', authMiddleware, produtoQuimicoController.searchChemicals);
router.get('/:id', authMiddleware, produtoQuimicoController.getChemicalById);
router.post('/', authMiddleware, produtoQuimicoController.createChemical);
router.delete('/:id', authMiddleware, produtoQuimicoController.deleteChemical);
router.put('/:id', authMiddleware, produtoQuimicoController.updateChemical);

module.exports = router;