/**
 * predictionRoutes.js
 * ===================
 * Route definitions for the ML Placement Prediction API.
 *
 * Mounted at: /api/prediction  (registered in server.js)
 *
 * Endpoints:
 *   POST /api/prediction/predict
 *     - Protected by JWT (existing `protect` middleware)
 *     - Body: { cgpa, backlogs, coding, sql, aptitude,
 *               communication, projects, certifications, internships }
 *     - Returns: { success, score, label, disclaimer }
 */

const express      = require('express');
const router       = express.Router();

const { protect }                  = require('../middleware/authMiddleware');
const { predictPlacementReadiness } = require('../controllers/predictionController');

// All prediction routes require authentication
router.use(protect);

// POST /api/prediction/predict
router.post('/predict', predictPlacementReadiness);

module.exports = router;
