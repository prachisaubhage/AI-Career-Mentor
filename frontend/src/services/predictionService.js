import { API_ENDPOINTS } from "../utils/api";
import {
  getCurrentUserEmail,
  getProjects,
  getCertifications,
  getInternships,
} from "../utils/auth";

const PREDICTION_STORAGE_KEY = "careerMentorPrediction";

/**
 * Extract the exact 9 prediction inputs from the authenticated student profile and records.
 * CGPA, backlogs, coding, sql/dbms, aptitude, communication, projects, certifications, internships.
 */
export function getPredictionInputs(profile, email) {
  const userEmail = email || getCurrentUserEmail();
  const currentProfile =
    profile ||
    (() => {
      try {
        const raw = localStorage.getItem("careerMentorProfile");
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

  const userProjects = getProjects(userEmail);
  const userCerts = getCertifications(userEmail);
  const userInternships = getInternships(userEmail);

  const cgpa = Number(currentProfile.cgpa || 0);
  const backlogs = Number(currentProfile.backlogs || 0);
  const coding = Number(currentProfile.coding || currentProfile.dsaCoding || 0);
  const sql = Number(currentProfile.sql || currentProfile.sqlDbms || 0);
  const aptitude = Number(currentProfile.aptitude || 0);
  const communication = Number(currentProfile.communication || 0);
  const projects = Number(
    currentProfile.projects !== undefined && currentProfile.projects !== ""
      ? currentProfile.projects
      : userProjects.length || 0
  );
  const certifications = Number(
    currentProfile.certifications !== undefined && currentProfile.certifications !== ""
      ? currentProfile.certifications
      : userCerts.length || 0
  );
  const internships = Number(
    currentProfile.internships !== undefined && currentProfile.internships !== ""
      ? currentProfile.internships
      : userInternships.length || 0
  );

  return {
    cgpa,
    backlogs,
    coding,
    sql,
    aptitude,
    communication,
    projects,
    certifications,
    internships,
  };
}

/**
 * Helper to retrieve stored prediction result produced by the ML prediction pipeline.
 */
export function getStoredPrediction() {
  try {
    const raw = localStorage.getItem(PREDICTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Helper to store the ML prediction result.
 */
export function saveStoredPrediction(prediction) {
  try {
    if (prediction) {
      localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(prediction));
      window.dispatchEvent(
        new CustomEvent("careerMentorPredictionUpdated", { detail: prediction })
      );
    }
  } catch (err) {
    console.error("Failed to save prediction to localStorage:", err);
  }
}

/**
 * Package conversion logic (shared fallback matching backend prediction controller).
 */
export function calculatePackageBand(score) {
  const s = Number(score || 0);
  if (s >= 80) return "₹8–12 LPA";
  if (s >= 70) return "₹6–8 LPA";
  if (s >= 60) return "₹5–7 LPA";
  return "₹3–5 LPA";
}

/**
 * Calls the existing ML placement prediction pipeline (/api/prediction/predict)
 * and returns the exact predicted result.
 */
export async function getPlacementPrediction(profile, email) {
  const inputs = getPredictionInputs(profile, email);
  const token = localStorage.getItem("careerMentorToken");

  try {
    const response = await fetch(API_ENDPOINTS.PREDICTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(inputs),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success) {
        const packageBand =
          data.packageBand || data.package || calculatePackageBand(data.score);
        const result = {
          score: data.score,
          label: data.label,
          packageBand,
          package: packageBand,
          disclaimer: data.disclaimer,
          inputs,
          updatedAt: Date.now(),
        };
        saveStoredPrediction(result);
        return result;
      }
    }
  } catch (err) {
    console.error("ML prediction pipeline fetch error:", err);
  }

  // Fallback to existing stored prediction if available
  const stored = getStoredPrediction();
  if (stored) {
    return stored;
  }

  return null;
}
