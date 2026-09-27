const express = require('express');
const router = express.Router();
const {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const { achievementUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getAchievements)
  .post(achievementUpload.single('file'), createAchievement);

router.route('/:id')
  .get(getAchievementById)
  .put(achievementUpload.single('file'), updateAchievement)
  .delete(deleteAchievement);

module.exports = router;
