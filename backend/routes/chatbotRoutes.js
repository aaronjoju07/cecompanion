// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const ChatbotService = require('../services/chatbotService');

// Initialize chatbot service
const chatbotService = new ChatbotService();

router.post('/chat', 
  authMiddleware,
  roleMiddleware(['student']),
  async (req, res) => {
    try {
      const { question } = req.body;
      const userId = req.user._id;

      const response = await chatbotService.processQuestion(userId, question);
      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error processing chatbot request', 
        error: error.message 
      });
    }
  }
);

module.exports = router;