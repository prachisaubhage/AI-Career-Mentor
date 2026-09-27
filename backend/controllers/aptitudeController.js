const AptitudeAttempt = require('../models/AptitudeAttempt');
const { getAptitudeStatsForUser } = require('../services/dashboardService');

/**
 * @desc    Record an aptitude attempt
 * @route   POST /api/aptitude/attempt
 * @access  Private
 */
const recordAttempt = async (req, res, next) => {
  try {
    const { questionId, topic, selectedAnswer, correct, score } = req.body;

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

    const attempt = await AptitudeAttempt.create({
      userId: req.user._id,
      questionId: String(questionId),
      topic: topic || 'General',
      selectedAnswer,
      correct: Boolean(correct),
      score: Number(score) || 0,
      date: new Date(),
    });

    const stats = await getAptitudeStatsForUser(req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Aptitude attempt recorded successfully',
      attempt,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aptitude statistics for user (zeros for new user)
 * @route   GET /api/aptitude/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await getAptitudeStatsForUser(req.user._id);
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aptitude attempt history
 * @route   GET /api/aptitude/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await AptitudeAttempt.find({ userId: req.user._id })
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
