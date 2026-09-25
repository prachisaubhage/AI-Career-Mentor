const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { resumeUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getResume)
  .post(resumeUpload.single('resume'), uploadResume)
  .delete(deleteResume);

module.exports = router;
