const User = require('../models/User');
const fs = require('fs');

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete resume file at ${filePath}:`, err.message);
    }
  }
};

/**
 * @desc    Upload or replace user resume
 * @route   POST /api/resume
 * @access  Private
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file to upload (PDF, DOC, DOCX)',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If an existing resume file exists, delete it from disk
    if (user.resume && user.resume.path) {
      safeUnlink(user.resume.path);
    }

    // Set new resume information
    user.resume = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    user.profileLastUpdated = Date.now();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: user.resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's current resume
 * @route   GET /api/resume
 * @access  Private
 */
const getResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('resume');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      resume: user.resume || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user's resume
 * @route   DELETE /api/resume
 * @access  Private
 */
const deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.resume && user.resume.path) {
      safeUnlink(user.resume.path);
    }

    user.resume = {
      filename: '',
      originalName: '',
      path: '',
      fileUrl: '',
      size: 0,
      uploadedAt: null,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Resume removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
};
