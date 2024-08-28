const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

// Rotas para Simulations
router.get('/', simulationController.getAllSimulations);
router.get('/:id', simulationController.getSimulationById);
router.post('/', simulationController.createSimulation);
router.put('/:id', simulationController.updateSimulation);
router.delete('/:id', simulationController.deleteSimulation);

// Rotas para Progress
router.get('/progress', simulationController.getProgressBySimulationId); // Ajuste para incluir o simulationId no path
router.put('/progress/:id', simulationController.updateProgress); // Ajuste para incluir o simulationId no path

module.exports = router;