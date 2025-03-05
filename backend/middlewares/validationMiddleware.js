const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter'),
  
  body('role')
    .isIn(['student', 'organizer']).withMessage('Invalid role selected'),
  
  body('course')
    .not().isEmpty().withMessage('Course is required'),
  
  body('department')
    .not().isEmpty().withMessage('Department is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateEvent = [
  body('name')
    .trim()
    .not().isEmpty().withMessage('Event name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Event name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .not().isEmpty().withMessage('Event description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('conductedDates.start')
    .isISO8601().toDate().withMessage('Invalid start date'),
  
  body('conductedDates.end')
    .isISO8601().toDate().withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.conductedDates.start)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('maximumStudents')
    .optional()
    .isInt({ min: 1 }).withMessage('Maximum students must be a positive number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegistration, validateEvent };
