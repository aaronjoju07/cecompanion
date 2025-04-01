const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbotService');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user._id;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    const response = await chatbotService.processQuestion(userId, question);
    res.json(response);
  } catch (error) {
    console.error('Chatbot route error:', error);
    res.status(500).json({ message: 'Error processing question', error: error.message });
  }
});
module.exports = router;