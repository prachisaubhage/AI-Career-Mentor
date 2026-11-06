const AptitudeAttempt = require('../models/AptitudeAttempt');
const { getAptitudeStatsForUser } = require('../services/dashboardService');
const aptitudeQuestions = require('../data/aptitudeQuestions');

/**
 * Helper to compute category-wise statistics from attempt documents
 */
const calculateCategoryStats = (attempts) => {
  const categories = {
    Quantitative: { attempted: 0, correct: 0, accuracy: 0 },
    Logical: { attempted: 0, correct: 0, accuracy: 0 },
    Verbal: { attempted: 0, correct: 0, accuracy: 0 },
  };

  const questionMap = new Map(aptitudeQuestions.map((q) => [q.id, q]));

  for (const att of attempts) {
    const q = questionMap.get(att.questionId);
    let cat = q ? q.category : null;
    if (!cat && att.topic) {
      if (att.topic.includes('Quant') || att.topic.includes('Math') || att.topic.includes('Work') || att.topic.includes('Speed')) cat = 'Quantitative';
      else if (att.topic.includes('Log') || att.topic.includes('Series') || att.topic.includes('Relation')) cat = 'Logical';
      else if (att.topic.includes('Verb') || att.topic.includes('Grammar') || att.topic.includes('Word')) cat = 'Verbal';
    }
    if (!cat) cat = 'Quantitative';

    if (categories[cat]) {
      categories[cat].attempted++;
      if (att.correct) categories[cat].correct++;
    }
  }

  for (const cat in categories) {
    const item = categories[cat];
    item.accuracy = item.attempted > 0 ? Math.round((item.correct / item.attempted) * 100) : 0;
  }

  return categories;
};

/**
 * @desc    Get aptitude questions (sanitized without correct answers or explanations)
 * @route   GET /api/aptitude/questions
 * @access  Private
 */
const getQuestions = async (req, res, next) => {
  try {
    const { category } = req.query;
    let list = aptitudeQuestions;
    if (category && category !== 'All') {
      list = list.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }

    // Never send correctAnswer or explanation to frontend before submission
    const sanitized = list.map((q) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      topic: q.topic,
      text: q.text,
      options: q.options,
    }));

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      questions: sanitized,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit complete aptitude test, score on backend, and save attempts
 * @route   POST /api/aptitude/submit
 * @access  Private
 */
const submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required and cannot be empty',
      });
    }

    const questionMap = new Map(aptitudeQuestions.map((q) => [q.id, q]));
    const results = [];
    const attemptDocs = [];

    let correctCount = 0;
    let totalScore = 0;

    for (const item of answers) {
      const q = questionMap.get(item.questionId);
      if (!q) continue;

      const isCorrect =
        item.selectedAnswer !== null &&
        item.selectedAnswer !== undefined &&
        String(item.selectedAnswer).trim() === String(q.correctAnswer).trim();

      const score = isCorrect ? 10 : 0;
      if (isCorrect) correctCount++;
      totalScore += score;

      attemptDocs.push({
        userId: req.user._id,
        questionId: q.id,
        topic: q.topic || q.category,
        selectedAnswer: item.selectedAnswer || null,
        correct: isCorrect,
        score,
        date: new Date(),
      });

      results.push({
        questionId: q.id,
        category: q.category,
        difficulty: q.difficulty,
        topic: q.topic,
        text: q.text,
        options: q.options,
        selectedAnswer: item.selectedAnswer || 'Not Answered',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    }

    if (attemptDocs.length > 0) {
      await AptitudeAttempt.insertMany(attemptDocs);
    }

    const allUserAttempts = await AptitudeAttempt.find({ userId: req.user._id });
    const stats = await getAptitudeStatsForUser(req.user._id);
    const categoryStats = calculateCategoryStats(allUserAttempts);

    return res.status(200).json({
      success: true,
      message: 'Test submitted and scored successfully',
      submission: {
        totalQuestions: answers.length,
        attempted: answers.filter((a) => a.selectedAnswer).length,
        correct: correctCount,
        incorrect: answers.length - correctCount,
        score: totalScore,
        accuracy: answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0,
      },
      results,
      stats,
      categoryStats,
      data: {
        score: totalScore,
        results,
        stats,
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record an individual aptitude attempt (backward compatibility)
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
    const allAttempts = await AptitudeAttempt.find({ userId: req.user._id });
    const categoryStats = calculateCategoryStats(allAttempts);

    return res.status(201).json({
      success: true,
      message: 'Aptitude attempt recorded successfully',
      attempt,
      stats,
      categoryStats,
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
    const allAttempts = await AptitudeAttempt.find({ userId: req.user._id });
    const categoryStats = calculateCategoryStats(allAttempts);

    return res.status(200).json({
      success: true,
      stats,
      categoryStats,
      data: {
        ...stats,
        categoryStats,
      },
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
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  submitTest,
  recordAttempt,
  getStats,
  getHistory,
};
