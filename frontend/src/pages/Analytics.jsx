import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCurrentUserEmail, getCodingStats, getAptitudeStats, saveCodingStats, saveAptitudeStats } from "../utils/auth";
import { API_ENDPOINTS } from "../utils/api";

function Analytics() {
  const navigate = useNavigate();
  const email = getCurrentUserEmail();
  const token = localStorage.getItem("careerMentorToken");

  const [codingStats, setCodingStats] = useState(() => getCodingStats(email));
  const [aptitudeStats, setAptitudeStats] = useState(() => getAptitudeStats(email));
  const [categoryStats, setCategoryStats] = useState({
    Quantitative: { attempted: 0, correct: 0, accuracy: 0 },
    Logical: { attempted: 0, correct: 0, accuracy: 0 },
    Verbal: { attempted: 0, correct: 0, accuracy: 0 },
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live stats and history from MongoDB on mount
  useEffect(() => {
    async function loadData() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [aptRes, codeRes, aptHistRes, codeHistRes] = await Promise.all([
          fetch(API_ENDPOINTS.APTITUDE.STATS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.CODING.STATS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.APTITUDE.HISTORY, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.CODING.HISTORY, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (aptRes.ok) {
          const aptData = await aptRes.json();
          if (aptData.stats) {
            setAptitudeStats(aptData.stats);
            saveAptitudeStats(email, aptData.stats);
          }
          if (aptData.categoryStats) {
            setCategoryStats(aptData.categoryStats);
          }
        }

        if (codeRes.ok) {
          const codeData = await codeRes.json();
          if (codeData.stats) {
            setCodingStats(codeData.stats);
            saveCodingStats(email, codeData.stats);
          }
        }

        const activities = [];
        if (aptHistRes.ok) {
          const aptHistData = await aptHistRes.json();
          if (Array.isArray(aptHistData.history)) {
            aptHistData.history.forEach((h) => {
              activities.push({
                id: h._id || Math.random(),
                type: "Aptitude",
                title: `${h.topic || "General"} Practice`,
                correct: h.correct,
                score: h.score,
                date: new Date(h.date || h.createdAt),
              });
            });
          }
        }

        if (codeHistRes.ok) {
          const codeHistData = await codeHistRes.json();
          if (Array.isArray(codeHistData.history)) {
            codeHistData.history.forEach((h) => {
              activities.push({
                id: h._id || Math.random(),
                type: "Coding",
                title: `${h.topic || "Problem"} (${h.difficulty || "Easy"})`,
                correct: h.correct,
                score: h.score,
                date: new Date(h.date || h.createdAt),
              });
            });
          }
        }

        activities.sort((a, b) => b.date - a.date);
        setRecentActivities(activities.slice(0, 8));
      } catch (err) {
        console.warn("Analytics fetch error, showing cached stats:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, email]);

  const hasProgressData = Boolean(
    codingStats.attempted > 0 || aptitudeStats.attempted > 0
  );

  const totalAttempted = (codingStats.attempted || 0) + (aptitudeStats.attempted || 0);
  const totalCorrect = (codingStats.solved || 0) + (aptitudeStats.correct || 0);
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">PROGRESS TRACKING</p>
          <h1>Progress Analytics</h1>
          <p>Track your placement readiness and preparation progress.</p>
        </div>
      </div>

      {!hasProgressData && !loading ? (
        <div className="dashboard-card" style={{ textAlign: "center", padding: "44px 20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151", marginBottom: "8px" }}>
            No progress data available yet.
          </h2>
          <p style={{ color: "#6b7280", maxWidth: "520px", margin: "0 auto 24px", lineHeight: "1.6" }}>
            Complete aptitude tests, coding practice, resume analysis, and other activities to start tracking your progress.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="primary-btn small-btn" onClick={() => navigate("/coding")}>
              Practice Coding →
            </button>
            <button className="primary-btn small-btn" onClick={() => navigate("/aptitude")}>
              Practice Aptitude →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* STATISTICS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Overall Accuracy</span>
                <span>✓</span>
              </div>
              <h2>{overallAccuracy}%</h2>
              <small>Based on total attempts</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Coding Problems</span>
                <span>↗</span>
              </div>
              <h2>{codingStats.solved || 0}</h2>
              <small>{codingStats.attempted || 0} attempted</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Aptitude Questions</span>
                <span>✓</span>
              </div>
              <h2>{aptitudeStats.correct || 0}</h2>
              <small>{aptitudeStats.attempted || 0} attempted</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Total Activities</span>
                <span>📊</span>
              </div>
              <h2>{totalAttempted}</h2>
              <small>Completed sessions</small>
            </div>
          </div>

          {/* READINESS PROGRESS & CATEGORY BREAKDOWN */}
          <div className="dashboard-card">
            <div className="card-heading">
              <div>
                <h3>Placement Activity Progress</h3>
                <p>Tracked activity summary from verified practice records</p>
              </div>
            </div>

            <div className="analytics-list">
              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Coding Solved</span>
                  <strong>{codingStats.solved || 0}</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: `${Math.min((codingStats.solved || 0) * 10, 100)}%` }}></div>
                </div>
              </div>

              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Aptitude Accuracy</span>
                  <strong>
                    {aptitudeStats.attempted > 0
                      ? `${Math.round(((aptitudeStats.correct || 0) / aptitudeStats.attempted) * 100)}%`
                      : "0%"}
                  </strong>
                </div>
                <div className="analytics-track">
                  <div
                    style={{
                      width:
                        aptitudeStats.attempted > 0
                          ? `${Math.round(((aptitudeStats.correct || 0) / aptitudeStats.attempted) * 100)}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>

              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Quantitative Aptitude Accuracy</span>
                  <strong>{categoryStats.Quantitative.accuracy}%</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: `${categoryStats.Quantitative.accuracy}%` }}></div>
                </div>
              </div>

              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Logical Reasoning Accuracy</span>
                  <strong>{categoryStats.Logical.accuracy}%</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: `${categoryStats.Logical.accuracy}%` }}></div>
                </div>
              </div>

              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Verbal Ability Accuracy</span>
                  <strong>{categoryStats.Verbal.accuracy}%</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: `${categoryStats.Verbal.accuracy}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* CODING DIFFICULTY BREAKDOWN */}
          <div className="dashboard-card">
            <div className="card-heading">
              <div>
                <h3>Coding Difficulty Distribution</h3>
                <p>Problems solved by difficulty level</p>
              </div>
            </div>

            <div className="coding-stats">
              <div>
                <strong style={{ color: "#10b981" }}>{codingStats.easy || 0}</strong>
                <span>Easy Solved</span>
              </div>
              <div>
                <strong style={{ color: "#f59e0b" }}>{codingStats.medium || 0}</strong>
                <span>Medium Solved</span>
              </div>
              <div>
                <strong style={{ color: "#ef4444" }}>{codingStats.hard || 0}</strong>
                <span>Hard Solved</span>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY LOG */}
          {recentActivities.length > 0 && (
            <div className="dashboard-card">
              <div className="card-heading">
                <div>
                  <h3>Recent Practice Activity</h3>
                  <p>Latest attempts and evaluation results</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "700",
                          background: act.type === "Coding" ? "#e0e7ff" : "#fef3c7",
                          color: act.type === "Coding" ? "#4338ca" : "#b45309",
                          marginRight: "8px",
                        }}
                      >
                        {act.type}
                      </span>
                      <strong style={{ fontSize: "13px", color: "#1f2937" }}>{act.title}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: act.correct ? "#10b981" : "#ef4444",
                        }}
                      >
                        {act.correct ? "✓ Success" : "✕ Needs Work"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        {act.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default Analytics;