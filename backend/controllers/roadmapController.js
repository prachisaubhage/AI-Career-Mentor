/**
 * roadmapController.js
 * ====================
 * Controller for the AI-generated Career Roadmap endpoint.
 *
 * Route: POST /api/roadmap/generate
 * Access: Private (requires JWT via `protect` middleware)
 *
 * Accepts student profile data, calls Gemini to generate a personalised
 * career roadmap, and returns structured JSON.
 *
 * ACADEMIC DISCLAIMER:
 *   Roadmaps are AI-generated on synthetic/real student data and are
 *   an academic prototype. They do not guarantee placement outcomes.
 */

const { generateCareerRoadmap } = require('../services/geminiService');

/**
 * @desc    Generate AI career roadmap using Gemini
 * @route   POST /api/roadmap/generate
 * @access  Private
 */
const generateRoadmap = async (req, res, next) => {
  try {
    // ── Check API key is configured ────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message:
          'AI service is not configured. Contact the administrator to set up the GEMINI_API_KEY.',
      });
    }

    // ── Destructure and validate inputs ────────────────────────────────────
    const {
      targetRole,
      cgpa,
      backlogs,
      coding,
      sql,
      aptitude,
      communication,
      projects,
      certifications,
      internships,
      skillGaps,
    } = req.body;

    if (!targetRole || typeof targetRole !== 'string' || targetRole.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'targetRole is required and must be a non-empty string.',
      });
    }

    // ── Build student data object with safe numeric defaults ───────────────
    const studentData = {
      targetRole:     targetRole.trim(),
      cgpa:           Number(cgpa)            || 0,
      backlogs:       Number(backlogs)        || 0,
      coding:         Number(coding)          || 0,
      sql:            Number(sql)             || 0,
      aptitude:       Number(aptitude)        || 0,
      communication:  Number(communication)   || 0,
      projects:       Number(projects)        || 0,
      certifications: Number(certifications)  || 0,
      internships:    Number(internships)     || 0,
      skillGaps:      Array.isArray(skillGaps) ? skillGaps : [],
    };

    // ── Call Gemini service ────────────────────────────────────────────────
    const roadmap = await generateCareerRoadmap(studentData);

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    // Log internally — never expose API key or full stack to client
    console.error('[Roadmap Controller] Gemini error:', error.message);

    // Distinguish between API key errors and other failures
    const isKeyError = error.message && error.message.includes('GEMINI_API_KEY');
    if (isKeyError) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please contact the administrator.',
      });
    }

    return res.status(502).json({
      success: false,
      message:
        'The AI roadmap service encountered an error. Please try again in a moment.',
    });
  }
};

module.exports = { generateRoadmap };
