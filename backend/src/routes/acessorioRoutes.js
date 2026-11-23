const express = require('express');
const acessorioController = require('../controllers/acessorioController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, acessorioController.getAllAccessories);
router.get('/:id', authMiddleware, acessorioController.getAccessoryById);
router.get('/search', authMiddleware, acessorioController.searchAccessories);
router.post('/', authMiddleware, acessorioController.createAccessory);
router.delete('/:id', authMiddleware, acessorioController.deleteAccessory);
router.put('/:id', authMiddleware, acessorioController.updateAccessory);

module.exports = router;