/**
 * Express AI Routes: POST /api/ai/chat, GET /api/ai/analytics, POST /api/ai/confirm-ticket
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, optionalProtect } = require('../middleware/auth');

router.post('/chat', optionalProtect, aiController.handleChat);
router.get('/analytics', protect, aiController.getAIAnalytics);
router.post('/confirm-ticket', protect, aiController.confirmAIChatTicket);

module.exports = router;
