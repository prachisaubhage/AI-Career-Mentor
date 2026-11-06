const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitTest,
  recordAttempt,
  getStats,
  getHistory,
} = require('../controllers/aptitudeController');
const { protect } = require('../middleware/authMiddleware');

// Public: Get sanitized questions list
router.get('/questions', getQuestions);

// Protected routes (requires authentication)
router.use(protect);

router.post('/submit', submitTest);
router.post('/attempt', recordAttempt);
router.get('/stats', getStats);
router.get('/history', getHistory);

module.exports = router;
