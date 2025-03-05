const express = require('express');
const router = express.Router();
const {
  optimizeEventSchedule,
  getEventSchedule,
  rescheduleEvent
} = require('../controllers/schedulingController');
const { 
  authMiddleware, 
  roleMiddleware 
} = require('../middlewares/authMiddleware');

// Protected Routes for Organizers
router.post('/optimize', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  optimizeEventSchedule
);

router.get('/schedule', 
  authMiddleware, 
  getEventSchedule
);

router.put('/reschedule/:eventId', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  rescheduleEvent
);

module.exports = router;