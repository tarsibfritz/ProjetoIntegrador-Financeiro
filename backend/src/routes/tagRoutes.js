const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.post('/tags', tagController.createTag);
router.get('/tags', tagController.getTags);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

module.exports = router;