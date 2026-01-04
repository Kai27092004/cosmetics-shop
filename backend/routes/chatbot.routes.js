const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// POST /api/chatbot/chat - Gửi tin nhắn đến chatbot
router.post('/chat', chatbotController.chat);

// GET /api/chatbot/history/:sessionId - Lấy lịch sử chat
router.get('/history/:sessionId', chatbotController.getChatHistory);

module.exports = router;
