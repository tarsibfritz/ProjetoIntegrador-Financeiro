const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

// Rotas
router.get('/', simulationController.getAllSimulations);
router.get('/:id', simulationController.getSimulationById);
router.post('/', simulationController.createSimulation);
router.put('/:id', simulationController.updateSimulation);
router.delete('/:id', simulationController.deleteSimulation);

module.exports = router;