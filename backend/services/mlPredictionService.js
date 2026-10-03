/**
 * mlPredictionService.js
 * ======================
 * ML Integration Service — AI Career Mentor
 *
 * Bridges the Node.js/Express backend to the Python ML model.
 *
 * Architecture:
 *   Node/Express controller
 *       ↓  (calls)
 *   mlPredictionService.runPrediction(features)
 *       ↓  (spawns child_process)
 *   ml/predict_bridge.py   ← reads JSON from stdin
 *       ↓  (loads)
 *   ml/models/placement_model.joblib
 *       ↓  (writes JSON to stdout)
 *   Node receives prediction result
 *
 * No new npm packages are required — Node's built-in `child_process` is used.
 *
 * ACADEMIC DISCLAIMER:
 *   The underlying ML model is trained on SYNTHETIC data and is an academic
 *   prototype. Predictions must NOT be used for real-world placement decisions.
 */

const { spawn }   = require('child_process');
const path        = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────────
// Resolve the bridge script path relative to this file (backend/services/ → ml/)
const ML_DIR           = path.resolve(__dirname, '..', '..', 'ml');
const BRIDGE_SCRIPT    = path.join(ML_DIR, 'predict_bridge.py');
const VENV_PYTHON      = path.join(ML_DIR, 'venv', 'bin', 'python3');
const SYSTEM_PYTHON    = process.env.ML_PYTHON || 'python3';

// ── Helper: pick the Python interpreter ───────────────────────────────────────
const fs = require('fs');

function getPythonExecutable() {
  // Prefer the project's venv python if it exists; fall back to system python3
  if (fs.existsSync(VENV_PYTHON)) {
    return VENV_PYTHON;
  }
  return SYSTEM_PYTHON;
}

/**
 * Run the ML placement prediction for a given student feature set.
 *
 * @param {Object} features - Student input data:
 *   { cgpa, backlogs, coding, sql, aptitude, communication,
 *     projects, certifications, internships }
 *
 * @returns {Promise<{ success: boolean, score: number, label: string }>}
 *
 * @throws {Error} If the Python process fails or returns an error payload.
 */
function runPrediction(features) {
  return new Promise((resolve, reject) => {
    const pythonExe = getPythonExecutable();
    const inputJSON = JSON.stringify(features);

    // Spawn the bridge script
    const process = spawn(pythonExe, [BRIDGE_SCRIPT]);

    let stdout = '';
    let stderr = '';

    // Collect stdout (JSON result)
    process.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    // Collect stderr (Python tracebacks) — never forwarded to the browser
    process.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    // Handle process close
    process.on('close', (code) => {
      if (stderr) {
        // Log internally only — never expose to client
        console.error('[ML Service] Python stderr:', stderr.trim());
      }

      try {
        const result = JSON.parse(stdout.trim());

        if (!result.success) {
          // Bridge reported a known error (e.g. missing model file)
          return reject(new Error(result.error || 'ML prediction failed'));
        }

        resolve(result);
      } catch {
        // stdout was not valid JSON — Python crashed before writing output
        const detail = stderr ? stderr.slice(0, 200) : '(no stderr captured)';
        reject(
          new Error(
            `ML bridge returned invalid output (exit code ${code}). ` +
            `Internal detail: ${detail}`
          )
        );
      }
    });

    // Handle spawn errors (e.g. python3 not found)
    process.on('error', (err) => {
      reject(
        new Error(
          `Failed to start Python ML process: ${err.message}. ` +
          `Ensure Python 3 is installed and the ml/ virtualenv is set up.`
        )
      );
    });

    // Send input JSON to the bridge script via stdin, then close it
    process.stdin.write(inputJSON);
    process.stdin.end();
  });
}

module.exports = { runPrediction };
