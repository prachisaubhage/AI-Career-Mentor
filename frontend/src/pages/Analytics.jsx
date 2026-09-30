import Layout from "../components/Layout";
import { getCurrentUserEmail, getCodingStats, getAptitudeStats } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Analytics() {
  const navigate = useNavigate();
  const email = getCurrentUserEmail();
  const codingStats = getCodingStats(email);
  const aptitudeStats = getAptitudeStats(email);

  const hasProgressData = Boolean(
    codingStats.attempted > 0 || aptitudeStats.attempted > 0
  );

  const totalAttempted = codingStats.attempted + aptitudeStats.attempted;
  const totalCorrect = codingStats.solved + aptitudeStats.correct;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">PROGRESS TRACKING</p>
          <h1>Progress Analytics</h1>
          <p>
            Track your placement readiness and preparation progress.
          </p>
        </div>
      </div>

      {!hasProgressData ? (
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
              <h2>{codingStats.solved}</h2>
              <small>{codingStats.attempted} attempted</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Aptitude Questions</span>
                <span>✓</span>
              </div>
              <h2>{aptitudeStats.correct}</h2>
              <small>{aptitudeStats.attempted} attempted</small>
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

          {/* READINESS PROGRESS */}
          <div className="dashboard-card">
            <div className="card-heading">
              <div>
                <h3>Placement Activity Progress</h3>
                <p>Tracked activity summary</p>
              </div>
            </div>

            <div className="analytics-list">
              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Coding Solved</span>
                  <strong>{codingStats.solved}</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: `${Math.min(codingStats.solved * 10, 100)}%` }}></div>
                </div>
              </div>

              <div className="analytics-row">
                <div className="analytics-info">
                  <span>Aptitude Accuracy</span>
                  <strong>{aptitudeStats.attempted > 0 ? `${Math.round((aptitudeStats.correct / aptitudeStats.attempted) * 100)}%` : "0%"}</strong>
                </div>
                <div className="analytics-track">
                  <div style={{ width: aptitudeStats.attempted > 0 ? `${Math.round((aptitudeStats.correct / aptitudeStats.attempted) * 100)}%` : "0%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Analytics;