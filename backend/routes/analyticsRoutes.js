const express = require('express');
const router = express.Router();
const {
  getTopPerformingStudents,
  getEventParticipationAnalytics,
  generateOverallEventInsights
} = require('../controllers/analyticsController');
const { 
  authMiddleware, 
  roleMiddleware 
} = require('../middlewares/authMiddleware');

// Protected Routes
router.get('/top-students', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  getTopPerformingStudents
);

router.get('/event-participation/:eventId', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  getEventParticipationAnalytics
);

router.get('/overall-insights', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  generateOverallEventInsights
);

module.exports = router;