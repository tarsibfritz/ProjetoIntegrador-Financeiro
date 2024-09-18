const express = require('express');
const router = express.Router();
const launchController = require('../controllers/launchController');

// Rotas para Lançamento
router.post('/', launchController.createLaunch);
router.get('/', launchController.getAllLaunches);
router.get('/:id', launchController.getLaunchById);
router.put('/:id', launchController.updateLaunch);
router.delete('/:id', launchController.deleteLaunch);

module.exports = router;