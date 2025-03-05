const express = require('express');
const router = express.Router();
const { 
  register, 
  login 
} = require('../controllers/authController');
const { validateRegistration } = require('../middlewares/validationMiddleware');

const { 
  authMiddleware,  
} = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', validateRegistration, register);
router.post('/login', login);

// Protected Routes
router.get('/profile', 
  authMiddleware, 
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = router;