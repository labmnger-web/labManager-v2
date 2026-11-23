const express = require('express');
const equipamentoController = require('../controllers/equipamentoController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, equipamentoController.getAllEquipments);
router.get('/search', authMiddleware, equipamentoController.searchEquipments);
router.get('/:id', authMiddleware, equipamentoController.getEquipmentById);
router.post('/', authMiddleware, equipamentoController.createEquipment);
router.delete('/:id', authMiddleware, equipamentoController.deleteEquipment);
router.put('/:id', authMiddleware, equipamentoController.updateEquipment);

module.exports = router;