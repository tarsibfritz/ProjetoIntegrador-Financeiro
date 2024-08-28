const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Rotas para Progresso
router.get('/', progressController.getProgressBySimulationId);
router.post('/', progressController.addProgress);

module.exports = router;