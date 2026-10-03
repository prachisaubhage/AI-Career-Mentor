/**
 * resumeAiController.js
 * =====================
 * Controller for the AI-powered Resume Analyzer endpoint.
 *
 * Route: POST /api/resume/analyze-ai
 * Access: Private (requires JWT via `protect` middleware)
 *
 * Accepts resume text + target role, calls Gemini to analyse the resume,
 * and returns structured feedback JSON.
 *
 * This controller REUSES the existing /api/resume route system.
 * It is a new endpoint added to the existing resumeRoutes.js.
 *
 * ACADEMIC DISCLAIMER:
 *   Resume analysis is AI-generated and is an academic prototype.
 *   Results may not reflect actual recruiter or ATS decisions.
 */

const { analyzeResume } = require('../services/geminiService');

/**
 * @desc    Analyse resume text using Gemini AI
 * @route   POST /api/resume/analyze-ai
 * @access  Private
 */
const analyzeResumeWithAI = async (req, res, next) => {
  try {
    // ── Check API key is configured ────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message:
          'AI service is not configured. Contact the administrator to set up the GEMINI_API_KEY.',
      });
    }

    // ── Validate inputs ────────────────────────────────────────────────────
    const { resumeText, targetRole } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'resumeText is required and must be a non-empty string.',
      });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          'resumeText is too short. Please provide the full text content of the resume (minimum 50 characters).',
      });
    }

    const role = (targetRole && targetRole.trim()) || 'Software Engineer';

    // ── Call Gemini service ────────────────────────────────────────────────
    const analysis = await analyzeResume(resumeText.trim(), role);

    return res.status(200).json({
      success: true,
      targetRole: role,
      analysis,
    });
  } catch (error) {
    // Log internally — never expose API key or stack trace to client
    console.error('[Resume AI Controller] Gemini error:', error.message);

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
        'The AI resume analysis service encountered an error. Please try again in a moment.',
    });
  }
};

module.exports = { analyzeResumeWithAI };
