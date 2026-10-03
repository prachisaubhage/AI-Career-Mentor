"""
train_model.py
==============
Trains a DecisionTreeRegressor on a SAMPLE/SYNTHETIC dataset to predict
a student's Placement Readiness Score (0–100).

NOTE: This is an academic prototype using synthetic data.
      Do NOT use the resulting model for real-world placement decisions
      without replacing the dataset with genuine, validated data.

Usage:
    python train_model.py
"""

import os
import sys

import joblib
import pandas as pd
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(SCRIPT_DIR, "data", "sample_placement_data.csv")
MODEL_DIR  = os.path.join(SCRIPT_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "placement_model.joblib")

# ── Required columns ───────────────────────────────────────────────────────────
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
TARGET_COL = "placement_readiness"

RANDOM_STATE = 42  # Fixed seed for reproducibility

# ── Main ───────────────────────────────────────────────────────────────────────

def load_and_validate(path: str) -> pd.DataFrame:
    """Load CSV and validate that all required columns are present."""
    if not os.path.exists(path):
        sys.exit(f"[ERROR] Dataset not found at: {path}")

    df = pd.read_csv(path)

    required = FEATURE_COLS + [TARGET_COL]
    missing  = [col for col in required if col not in df.columns]
    if missing:
        sys.exit(f"[ERROR] Missing columns in dataset: {missing}")

    print(f"[INFO]  Dataset loaded successfully  →  {len(df)} rows, {len(df.columns)} columns")
    return df


def train(df: pd.DataFrame):
    """Split data, train a DecisionTreeRegressor, evaluate, and save the model."""
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    # ── Train / test split ──────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )
    print(f"[INFO]  Training samples : {len(X_train)}")
    print(f"[INFO]  Testing  samples : {len(X_test)}")

    # ── Model ───────────────────────────────────────────────────────────────
    model = DecisionTreeRegressor(
        max_depth=5,          # Keep shallow → avoid overfitting on small dataset
        random_state=RANDOM_STATE,
    )
    model.fit(X_train, y_train)
    print("[INFO]  Model training complete.")

    # ── Evaluation ──────────────────────────────────────────────────────────
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    r2  = r2_score(y_test, y_pred)

    print("\n" + "=" * 45)
    print("  Model Evaluation (Test Set)")
    print("=" * 45)
    print(f"  Mean Absolute Error (MAE) : {mae:.2f}")
    print(f"  R² Score                  : {r2:.4f}")
    print("=" * 45)
    print("\n[NOTE]  These metrics are based on SYNTHETIC data.")
    print("        They do NOT reflect real-world placement prediction accuracy.")

    # ── Save ────────────────────────────────────────────────────────────────
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\n[INFO]  Trained model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    print("\n" + "=" * 45)
    print("  AI Career Mentor — ML Training Script")
    print("  PROTOTYPE · SYNTHETIC DATA")
    print("=" * 45 + "\n")

    df = load_and_validate(DATA_PATH)
    train(df)

    print("\n[DONE]  Run predict.py to test a sample prediction.\n")
