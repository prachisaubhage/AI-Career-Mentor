const express = require('express');
const router = express.Router();
const {
  recordAttempt,
  getStats,
  getHistory,
} = require('../controllers/codingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/attempt', recordAttempt);
router.get('/stats', getStats);
router.get('/history', getHistory);

module.exports = router;
