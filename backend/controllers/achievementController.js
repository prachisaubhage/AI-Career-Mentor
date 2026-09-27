const Achievement = require('../models/Achievement');
const fs = require('fs');

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err.message);
    }
  }
};

const formatAchievementFile = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: file.path,
  fileUrl: `/uploads/achievements/${file.filename}`,
  mimetype: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
});

/**
 * @desc    Create a new achievement
 * @route   POST /api/achievements
 * @access  Private
 */
const createAchievement = async (req, res, next) => {
  try {
    const { title, description, date, type } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Achievement title is required',
      });
    }

    const file = req.file ? formatAchievementFile(req.file) : {};

    const achievement = await Achievement.create({
      userId: req.user._id,
      title: title.trim(),
      description: description || '',
      date: date || '',
      type: type || 'General',
      file,
    });

    return res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all achievements for user
 * @route   GET /api/achievements
 * @access  Private
 */
const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single achievement by ID
 * @route   GET /api/achievements/:id
 * @access  Private
 */
const getAchievementById = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update achievement by ID
 * @route   PUT /api/achievements/:id
 * @access  Private
 */
const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found or unauthorized',
      });
    }

    const { title, description, date, type } = req.body;

    if (title !== undefined) achievement.title = title.trim();
    if (description !== undefined) achievement.description = description;
    if (date !== undefined) achievement.date = date;
    if (type !== undefined) achievement.type = type;

    if (req.file) {
      if (achievement.file && achievement.file.path) {
        safeUnlink(achievement.file.path);
      }
      achievement.file = formatAchievementFile(req.file);
    }

    const updated = await achievement.save();

    return res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      achievement: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete achievement by ID
 * @route   DELETE /api/achievements/:id
 * @access  Private
 */
const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found or unauthorized',
      });
    }

    if (achievement.file && achievement.file.path) {
      safeUnlink(achievement.file.path);
    }

    await Achievement.deleteOne({ _id: achievement._id });

    return res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
};
