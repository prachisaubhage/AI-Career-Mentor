const CodingAttempt = require('../models/CodingAttempt');
const { getCodingStatsForUser } = require('../services/dashboardService');

/**
 * @desc    Record a coding attempt
 * @route   POST /api/coding/attempt
 * @access  Private
 */
const recordAttempt = async (req, res, next) => {
  try {
    const { questionId, topic, difficulty, selectedAnswer, correct, score } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: 'Question ID is required',
      });
    }

    if (correct === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Correctness status is required',
      });
    }

    const attempt = await CodingAttempt.create({
      userId: req.user._id,
      questionId: String(questionId),
      topic: topic || 'General',
      difficulty: difficulty || 'Easy',
      selectedAnswer,
      correct: Boolean(correct),
      score: Number(score) || 0,
      date: new Date(),
    });

    // Return updated stats along with recorded attempt
    const stats = await getCodingStatsForUser(req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Coding attempt recorded successfully',
      attempt,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get coding statistics for user (zeros for new user)
 * @route   GET /api/coding/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await getCodingStatsForUser(req.user._id);
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get coding attempt history
 * @route   GET /api/coding/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await CodingAttempt.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordAttempt,
  getStats,
  getHistory,
};
