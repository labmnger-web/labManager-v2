const express = require('express');
const historicoController = require('../controllers/historicoController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, historicoController.getAll);

module.exports = router;