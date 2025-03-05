const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const { 
  authMiddleware, 
  roleMiddleware 
} = require('../middlewares/authMiddleware');

// Protected Routes for Students
router.post('/', 
  authMiddleware, 
  roleMiddleware(['student']), 
  registerForEvent
);

router.get('/my-registrations', 
  authMiddleware, 
  roleMiddleware(['student']), 
  getUserRegistrations
);

router.delete('/:registrationId', 
  authMiddleware, 
  roleMiddleware(['student']), 
  cancelRegistration
);

module.exports = router;