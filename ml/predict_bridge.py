"""
predict_bridge.py
=================
ML prediction bridge for the AI Career Mentor backend.

The Node.js backend (backend/services/mlPredictionService.js) spawns this
script as a child process. It:
  1. Reads a single JSON object from stdin.
  2. Loads the pre-trained DecisionTreeRegressor (placement_model.joblib).
  3. Predicts the placement readiness score (0–100).
  4. Writes a single JSON object to stdout.
  5. Exits with code 0 on success, 1 on error.

Input  (stdin)  – JSON:
    {
      "cgpa": 8.2, "backlogs": 0, "coding": 75, "sql": 65,
      "aptitude": 80, "communication": 78,
      "projects": 3, "certifications": 2, "internships": 1
    }

Output (stdout) – JSON:
    {"success": true, "score": 78.5, "label": "Good – Placement ready with minor gaps."}

Error  (stdout) – JSON:
    {"success": false, "error": "<message>"}

ACADEMIC DISCLAIMER:
    This model is trained on SYNTHETIC data and is an academic prototype.
    Predictions must NOT be used for real-world placement decisions.
"""

import json
import os
import sys

import joblib
import numpy as np
import pandas as pd

# ── Absolute path to the trained model ────────────────────────────────────────
# This file lives in ml/ so models/ is a sibling directory.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(SCRIPT_DIR, "models", "placement_model.joblib")

# ── Feature column order (must match train_model.py exactly) ──────────────────
FEATURE_COLS = [
    "cgpa",
    "backlogs",
    "coding",
    "sql",
    "aptitude",
    "communication",
    "projects",
    "certifications",
    "internships",
]


def get_label(score: float) -> str:
    """Return a human-readable readiness label for the given score."""
    if score >= 85:
        return "Excellent – Highly placement ready."
    if score >= 70:
        return "Good – Placement ready with minor gaps."
    if score >= 50:
        return "Average – Needs focused improvement."
    return "Needs Work – Significant skill gaps present."


def load_model():
    """Load the joblib model; exit with error JSON if file is missing."""
    if not os.path.exists(MODEL_PATH):
        _error_exit(
            f"Model file not found at: {MODEL_PATH}. "
            "Run 'python train_model.py' inside the ml/ directory first."
        )
    return joblib.load(MODEL_PATH)


def _error_exit(message: str):
    """Write a JSON error to stdout and exit with code 1."""
    print(json.dumps({"success": False, "error": message}), flush=True)
    sys.exit(1)


def main():
    # ── Read JSON from stdin ───────────────────────────────────────────────────
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError) as exc:
        _error_exit(f"Invalid JSON input: {exc}")

    # ── Validate all required features are present ────────────────────────────
    missing = [col for col in FEATURE_COLS if col not in data]
    if missing:
        _error_exit(f"Missing required input features: {missing}")

    # ── Build feature DataFrame ────────────────────────────────────────────────
    try:
        profile = {col: float(data[col]) for col in FEATURE_COLS}
        X = pd.DataFrame([profile], columns=FEATURE_COLS)
    except (TypeError, ValueError) as exc:
        _error_exit(f"Feature value conversion error: {exc}")

    # ── Load model and predict ────────────────────────────────────────────────
    model = load_model()

    try:
        raw_score = model.predict(X)[0]
        score     = float(np.clip(raw_score, 0.0, 100.0))
    except Exception as exc:  # noqa: BLE001 – surface any sklearn error safely
        _error_exit(f"Prediction failed: {exc}")

    # ── Write success JSON to stdout ──────────────────────────────────────────
    result = {
        "success": True,
        "score":   round(score, 2),
        "label":   get_label(score),
    }
    print(json.dumps(result), flush=True)


if __name__ == "__main__":
    main()
