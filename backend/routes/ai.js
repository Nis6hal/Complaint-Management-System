/**
 * Express AI Routes: POST /api/ai/chat, GET /api/ai/analytics, POST /api/ai/confirm-ticket
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/chat', aiController.handleChat);
router.get('/analytics', aiController.getAIAnalytics);
router.post('/confirm-ticket', aiController.confirmAIChatTicket);

module.exports = router;
