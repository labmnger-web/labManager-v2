const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, agendamentoController.getAllSchedules);
router.get('/search', authMiddleware, agendamentoController.searchSchedules);
router.get('/:id', authMiddleware, agendamentoController.getScheduleById);
router.post('/', authMiddleware, agendamentoController.createSchedule);
router.delete('/:id', authMiddleware, agendamentoController.deleteSchedule);
router.put('/:id', authMiddleware, agendamentoController.updateSchedule);

module.exports = router;