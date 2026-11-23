const express = require('express');
const vidrariaController = require('../controllers/vidrariaController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, vidrariaController.getAllGlassware);
router.get('/:id', authMiddleware, vidrariaController.getGlasswareById);
router.get('/search', authMiddleware, vidrariaController.searchGlassware);
router.post('/', authMiddleware, vidrariaController.createGlassware);
router.delete('/:id', authMiddleware, vidrariaController.deleteGlassware);
router.put('/:id', authMiddleware, vidrariaController.updateGlassware);

module.exports = router;