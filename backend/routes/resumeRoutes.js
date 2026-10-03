const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { resumeUpload } = require('../middleware/uploadMiddleware');
// AI resume analysis controller (Gemini-powered)
const { analyzeResumeWithAI } = require('../controllers/resumeAiController');

router.use(protect);

router.route('/')
  .get(getResume)
  .post(resumeUpload.single('resume'), uploadResume)
  .delete(deleteResume);

// POST /api/resume/analyze-ai — Gemini AI resume analysis
router.post('/analyze-ai', analyzeResumeWithAI);

module.exports = router;

