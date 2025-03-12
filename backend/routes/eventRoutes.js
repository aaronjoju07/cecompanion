// /routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  optimizeEventScheduling,
  getMyEvents
} = require('../controllers/eventController');
const { 
  authMiddleware, 
  roleMiddleware 
} = require('../middlewares/authMiddleware');
const { 
  validateEvent 
} = require('../middlewares/validationMiddleware');

// Public Routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected Routes for Organizers
router.get('/organizer/my-events', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  getMyEvents
);

router.post('/', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  validateEvent, 
  createEvent
);

router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  updateEvent
);

router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  deleteEvent
);

// Event Scheduling Route
router.post('/optimize-scheduling', 
  authMiddleware, 
  roleMiddleware(['organizer']), 
  optimizeEventScheduling
);

module.exports = router;