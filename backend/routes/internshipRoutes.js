const express = require('express');
const router = express.Router();
const {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect } = require('../middleware/authMiddleware');
const { internshipUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getInternships)
  .post(internshipUpload.array('files', 10), createInternship);

router.route('/:id')
  .get(getInternshipById)
  .put(internshipUpload.array('files', 10), updateInternship)
  .delete(deleteInternship);

module.exports = router;
