const express = require('express');
const router = express.Router();
const {
  getProblems,
  recordAttempt,
  getStats,
  getHistory,
} = require('../controllers/codingController');
const { protect } = require('../middleware/authMiddleware');

// Public: Get problems list
router.get('/problems', getProblems);

// Protected routes (requires authentication)
router.use(protect);

router.post('/attempt', recordAttempt);
router.get('/stats', getStats);
router.get('/history', getHistory);

module.exports = router;
