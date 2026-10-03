"""
predict.py
==========
Loads the trained DecisionTreeRegressor model and predicts a
Placement Readiness Score (0–100) for a given student profile.

Usage:
    python predict.py

Prerequisite:
    Run train_model.py first to generate placement_model.joblib.

NOTE: This is an academic prototype using a model trained on SYNTHETIC data.
      Predictions should NOT be used for real-world placement decisions.
"""

import os
import sys

import joblib
import numpy as np
import pandas as pd

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "placement_model.joblib")

# ── Feature order must match train_model.py exactly ───────────────────────────
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

# ── Sample student profile (edit these values to test different students) ──────
STUDENT_PROFILE = {
    "cgpa":           8.2,
    "backlogs":       0,
    "coding":         75,
    "sql":            65,
    "aptitude":       80,
    "communication":  78,
    "projects":       3,
    "certifications": 2,
    "internships":    1,
}


def load_model(path: str):
    """Load the saved joblib model, with a helpful error if not found."""
    if not os.path.exists(path):
        sys.exit(
            "[ERROR] Model file not found.\n"
            "        Please run  'python train_model.py'  first to generate it.\n"
            f"        Expected path: {path}"
        )
    model = joblib.load(path)
    print(f"[INFO]  Model loaded from: {path}")
    return model


def predict(model, profile: dict) -> float:
    """Build a feature DataFrame from the profile dict and return a clipped prediction."""
    # Use a DataFrame so sklearn recognises the feature names (no warnings)
    X = pd.DataFrame([profile], columns=FEATURE_COLS)

    raw_score = model.predict(X)[0]

    # Clamp to [0, 100] as a safety measure
    score = float(np.clip(raw_score, 0.0, 100.0))
    return score


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("  AI Career Mentor — Placement Readiness Predictor")
    print("  PROTOTYPE · SYNTHETIC DATA MODEL")
    print("=" * 50 + "\n")

    # Print input profile
    print("  Student Profile:")
    print("  " + "-" * 40)
    for feature, value in STUDENT_PROFILE.items():
        print(f"    {feature:<18}: {value}")
    print("  " + "-" * 40 + "\n")

    # Load model and predict
    model = load_model(MODEL_PATH)
    score = predict(model, STUDENT_PROFILE)

    print("\n" + "=" * 50)
    print(f"  Placement Readiness Prediction : {score:.1f}%")
    print("=" * 50)

    # Contextual label
    if score >= 85:
        label = "Excellent — Highly placement ready!"
    elif score >= 70:
        label = "Good — Placement ready with minor gaps."
    elif score >= 50:
        label = "Average — Needs focused improvement."
    else:
        label = "Needs Work — Significant skill gaps present."

    print(f"  Status : {label}")
    print("\n[NOTE]  This prediction is based on SYNTHETIC training data.")
    print("        Do NOT use this for real placement decisions.\n")
