const vm = require('vm');
const CodingAttempt = require('../models/CodingAttempt');
const { getCodingStatsForUser } = require('../services/dashboardService');
const codingProblems = require('../data/codingProblems');

/**
 * @desc    Get all 15 coding problems (with optional topic & difficulty filters)
 * @route   GET /api/coding/problems
 * @access  Private
 */
const getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.query;
    let list = codingProblems;
    if (topic && topic !== 'All') {
      list = list.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
    }
    if (difficulty && difficulty !== 'All') {
      list = list.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      problems: list,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a coding attempt with sandboxed test case evaluation
 * @route   POST /api/coding/attempt
 * @access  Private
 */
const recordAttempt = async (req, res, next) => {
  try {
    const { questionId, problemId, code, language = 'javascript' } = req.body;
    const targetId = questionId || problemId;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID / Question ID is required',
      });
    }

    const problem = codingProblems.find((p) => p.id === targetId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found in problem bank',
      });
    }

    // Direct correctness override (if explicit boolean provided)
    if (req.body.correct !== undefined && !code) {
      const isCorrect = Boolean(req.body.correct);
      const attempt = await CodingAttempt.create({
        userId: req.user._id,
        questionId: String(targetId),
        topic: problem.topic,
        difficulty: problem.difficulty,
        selectedAnswer: req.body.selectedAnswer || null,
        correct: isCorrect,
        score: isCorrect
          ? problem.difficulty === 'Hard'
            ? 30
            : problem.difficulty === 'Medium'
            ? 20
            : 10
          : 0,
        date: new Date(),
      });

      const stats = await getCodingStatsForUser(req.user._id);
      return res.status(201).json({
        success: true,
        message: 'Coding attempt recorded successfully',
        attempt,
        stats,
      });
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Code implementation is required for evaluation',
      });
    }

    // Safe Sandboxed Test Case Evaluation
    const testResults = [];
    let allPassed = true;

    // Detect function name from problem starter code
    let functionName = 'solution';
    const match = problem.starterCode.javascript.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match) {
      functionName = match[1];
    }

    if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      for (let idx = 0; idx < problem.testCases.length; idx++) {
        const tc = problem.testCases[idx];
        const inputKeys = Object.keys(tc.input);
        const argsStr = inputKeys.join(', ');

        const sandbox = {
          ...tc.input,
          console: { log: () => {} },
          result: undefined,
        };

        try {
          const runScript = `
            ${code}
            result = ${functionName}(${argsStr});
          `;
          vm.createContext(sandbox);
          vm.runInContext(runScript, sandbox, { timeout: 1000 });

          const actual = sandbox.result;
          const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);

          if (!passed) allPassed = false;

          testResults.push({
            testCase: idx + 1,
            input: tc.input,
            expected: tc.expected,
            actual,
            passed,
          });
        } catch (evalErr) {
          allPassed = false;
          testResults.push({
            testCase: idx + 1,
            input: tc.input,
            expected: tc.expected,
            actual: null,
            error: evalErr.message,
            passed: false,
          });
        }
      }
    } else if (['cpp', 'c', 'python'].includes(language.toLowerCase())) {
      // C++, C, and Python require an isolated compiler/interpreter environment.
      // This server only supports sandboxed JavaScript evaluation.
      // Submissions in these languages are stored but not executed or evaluated.
      allPassed = false;
      testResults.push({
        testCase: 1,
        message: `${language.toUpperCase()} code received and stored. Automated test-case evaluation for C++, C, and Python requires a containerised judge service (e.g., Judge0) which is not yet configured on this server. Only JavaScript submissions are evaluated against test cases.`,
        passed: false,
        language: language,
        note: 'NOT_EXECUTED',
      });
    } else {
      allPassed = false;
      testResults.push({
        testCase: 1,
        message: `Unsupported language: ${language}. Supported languages for evaluation: javascript. Supported for storage only: cpp, c, python.`,
        passed: false,
      });
    }

    const score = allPassed
      ? problem.difficulty === 'Hard'
        ? 30
        : problem.difficulty === 'Medium'
        ? 20
        : 10
      : 0;

    const attempt = await CodingAttempt.create({
      userId: req.user._id,
      questionId: String(targetId),
      topic: problem.topic,
      difficulty: problem.difficulty,
      selectedAnswer: { code, language },
      correct: allPassed,
      score,
      date: new Date(),
    });

    const stats = await getCodingStatsForUser(req.user._id);

    return res.status(201).json({
      success: true,
      passed: allPassed,
      correct: allPassed,
      score,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      topic: problem.topic,
      testResults,
      attempt,
      stats,
      data: {
        passed: allPassed,
        correct: allPassed,
        score,
        testResults,
        attempt,
        stats,
      },
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
      data: stats,
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
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  recordAttempt,
  getStats,
  getHistory,
};
