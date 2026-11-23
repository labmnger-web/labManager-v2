const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, usuarioController.getUserById);
router.post('/', usuarioController.createUser);
router.delete('/:id', authMiddleware, usuarioController.deleteUser);
router.put('/:id', authMiddleware, usuarioController.updateUser);

module.exports = router;
