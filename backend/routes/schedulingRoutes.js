const express = require('express');
const router = express.Router();
const {
  optimizeEventSchedule,
  getEventSchedule,
  rescheduleEvent,
  editSubEventSchedule // Ensure this is imported
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

router.put('/edit/:scheduleId', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  editSubEventSchedule // Use the imported function directly
);

module.exports = router;