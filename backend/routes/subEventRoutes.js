const express = require('express');
const router = express.Router();
const subEventController = require('../controllers/subEventController');

router.post('/rounds', subEventController.createRound);
router.post('/scores', subEventController.submitScores);
router.get('/:eventId/:subEventId/results', subEventController.calculateFinalResult);

module.exports = router;