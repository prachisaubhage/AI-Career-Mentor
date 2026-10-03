/**
 * roadmapRoutes.js
 * ================
 * Route definitions for the AI Career Roadmap feature.
 *
 * Mounted at: /api/roadmap  (registered in server.js)
 *
 * Endpoints:
 *   POST /api/roadmap/generate
 *     - Protected by JWT (existing `protect` middleware)
 *     - Body: { targetRole, cgpa, backlogs, coding, sql, aptitude,
 *               communication, projects, certifications, internships,
 *               skillGaps[] }
 *     - Returns: { success, roadmap }
 */

const express             = require('express');
const router              = express.Router();
const { protect }         = require('../middleware/authMiddleware');
const { generateRoadmap } = require('../controllers/roadmapController');

// All roadmap routes require authentication
router.use(protect);

// POST /api/roadmap/generate
router.post('/generate', generateRoadmap);

module.exports = router;
