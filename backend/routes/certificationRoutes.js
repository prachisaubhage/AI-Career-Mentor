const express = require('express');
const router = express.Router();
const {
  createCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { certificationUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getCertifications)
  .post(certificationUpload.single('file'), createCertification);

router.route('/:id')
  .get(getCertificationById)
  .put(certificationUpload.single('file'), updateCertification)
  .delete(deleteCertification);

module.exports = router;
