/**
 * geminiService.js
 * ================
 * Shared Gemini AI service for the AI Career Mentor backend.
 *
 * Uses the official @google/genai SDK (v2.x).
 * API key is read exclusively from process.env.GEMINI_API_KEY.
 * The key is NEVER logged, printed, or returned to the client.
 *
 * Exports:
 *   generateCareerRoadmap(studentData)  → structured roadmap object
 *   analyzeResume(resumeText, targetRole) → structured analysis object
 *
 * ACADEMIC DISCLAIMER:
 *   This is an academic prototype. AI-generated roadmaps and resume
 *   analysis are suggestions only and do not guarantee placement outcomes.
 */

const { GoogleGenAI } = require('@google/genai');

// ── Initialise the Gemini client once at module load ──────────────────────────
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set in the environment. ' +
      'Add it to backend/.env and restart the server.'
    );
  }
  return new GoogleGenAI({ apiKey });
}

// Candidate models in order of preference (supports automatic fallback on 503 / high demand)
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
];

/**
 * Call Gemini with automatic fallback across available candidate models
 * to ensure resilience against transient 503 high-demand spikes.
 */
async function generateWithFallback(ai, prompt) {
  let lastError;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      lastError = err;
      const status = err.status || (err.error && err.error.code);
      const msg = (err.message || '').toLowerCase();
      // Fallback on 503 (overload), 429 (rate limit), 404 (model deprecated), or demand/unavailable errors
      if (
        status === 503 ||
        status === 429 ||
        status === 404 ||
        msg.includes('503') ||
        msg.includes('429') ||
        msg.includes('404') ||
        msg.includes('unavailable') ||
        msg.includes('high demand') ||
        msg.includes('resource_exhausted') ||
        msg.includes('not_found')
      ) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/**
 * Helper: parse JSON from a Gemini text response.
 * Gemini sometimes wraps JSON in markdown fences (```json ... ```).
 * This strips the fences and parses safely.
 *
 * @param {string} text - Raw text from Gemini
 * @returns {Object} Parsed JSON object
 * @throws {Error} If the text cannot be parsed as JSON
 */
function parseGeminiJSON(text) {
  // Strip optional markdown code fences
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // If JSON parse fails, return as a plain text wrapper so the caller
    // still gets a usable response
    return { raw: cleaned };
  }
}

// ── 1. CAREER ROADMAP ────────────────────────────────────────────────────────

/**
 * Generate a personalised career roadmap using Gemini.
 *
 * @param {Object} studentData
 *   {
 *     targetRole, cgpa, backlogs, coding, sql, aptitude,
 *     communication, projects, certifications, internships, skillGaps
 *   }
 * @returns {Promise<Object>} Structured roadmap JSON
 */
async function generateCareerRoadmap(studentData) {
  const {
    targetRole      = 'Software Engineer',
    cgpa            = 0,
    backlogs        = 0,
    coding          = 0,
    sql             = 0,
    aptitude        = 0,
    communication   = 0,
    projects        = 0,
    certifications  = 0,
    internships     = 0,
    skillGaps       = [],
  } = studentData;

  const skillGapsList = Array.isArray(skillGaps) && skillGaps.length
    ? skillGaps.join(', ')
    : 'Not specified';

  const prompt = `
You are a career counsellor for engineering students in India.
A student wants to become a ${targetRole}.

Student Profile:
- CGPA: ${cgpa}/10
- Backlogs: ${backlogs}
- DSA/Coding Score: ${coding}/100
- SQL/DBMS Score: ${sql}/100
- Aptitude Score: ${aptitude}/100
- Communication Score: ${communication}/100
- Projects Completed: ${projects}
- Certifications: ${certifications}
- Internships: ${internships}
- Identified Skill Gaps: ${skillGapsList}

Generate a detailed, practical, personalised career roadmap.

Respond ONLY with a valid JSON object in this exact structure (no markdown, no extra text):
{
  "currentLevel": "string describing current readiness level",
  "targetRole": "${targetRole}",
  "summary": "2-3 sentence personalised summary",
  "majorSkillGaps": ["gap1", "gap2", "gap3"],
  "recommendedSkills": ["skill1", "skill2", "skill3"],
  "learningSequence": [
    { "step": 1, "topic": "...", "reason": "...", "duration": "..." }
  ],
  "weeklyPlan": {
    "week1to4": "...",
    "week5to8": "...",
    "week9to12": "..."
  },
  "monthlyGoals": {
    "month1": "...",
    "month2": "...",
    "month3": "..."
  },
  "projectSuggestions": [
    { "title": "...", "description": "...", "skills": ["..."] }
  ],
  "dsaPreparation": {
    "topics": ["..."],
    "resources": ["..."],
    "practiceGoal": "..."
  },
  "sqlPreparation": {
    "topics": ["..."],
    "resources": ["..."],
    "practiceGoal": "..."
  },
  "aptitudePreparation": {
    "topics": ["..."],
    "resources": ["..."],
    "practiceGoal": "..."
  },
  "interviewPreparation": {
    "technical": ["..."],
    "hr": ["..."],
    "tips": ["..."]
  },
  "placementPreparation": {
    "companyTypes": ["..."],
    "timeline": "...",
    "keyActions": ["..."]
  },
  "disclaimer": "This roadmap is AI-generated as an academic prototype and does not guarantee placement outcomes."
}
`.trim();

  const ai = getGeminiClient();
  const text = await generateWithFallback(ai, prompt);
  return parseGeminiJSON(text);
}

// ── 2. RESUME ANALYZER ───────────────────────────────────────────────────────

/**
 * Analyse a resume text using Gemini.
 *
 * @param {string} resumeText - Plain text content of the resume
 * @param {string} targetRole - The role the student is applying for
 * @returns {Promise<Object>} Structured resume analysis JSON
 */
async function analyzeResume(resumeText, targetRole = 'Software Engineer') {
  const prompt = `
You are an expert technical recruiter and ATS specialist reviewing resumes for Indian engineering placement.

Target Role: ${targetRole}

Resume Text:
"""
${resumeText}
"""

Analyse this resume thoroughly and respond ONLY with a valid JSON object in this exact structure (no markdown, no extra text):
{
  "overallScore": 75,
  "targetRole": "${targetRole}",
  "summary": "2-3 sentence overall assessment",
  "strengths": ["strength1", "strength2", "strength3"],
  "missingSkills": ["skill1", "skill2"],
  "technicalSkillRelevance": {
    "score": 70,
    "present": ["..."],
    "missing": ["..."],
    "comment": "..."
  },
  "projectQuality": {
    "score": 65,
    "feedback": "...",
    "suggestions": ["..."]
  },
  "certifications": {
    "present": ["..."],
    "recommended": ["..."],
    "comment": "..."
  },
  "experience": {
    "internships": "...",
    "workExperience": "...",
    "comment": "..."
  },
  "atsKeywords": {
    "present": ["..."],
    "missing": ["..."],
    "score": 60
  },
  "contentImprovements": ["improvement1", "improvement2"],
  "formattingSuggestions": ["suggestion1", "suggestion2"],
  "targetRoleRelevance": {
    "score": 70,
    "comment": "..."
  },
  "topPriorityActions": ["action1", "action2", "action3"],
  "disclaimer": "This analysis is AI-generated as an academic prototype. Results may not reflect actual recruiter decisions."
}
`.trim();

  const ai = getGeminiClient();
  const text = await generateWithFallback(ai, prompt);
  return parseGeminiJSON(text);
}

module.exports = {
  generateCareerRoadmap,
  analyzeResume,
};
