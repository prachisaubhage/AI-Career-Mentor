import Layout from "../components/Layout";
import { getCurrentUserEmail, getAptitudeStats } from "../utils/auth";

function Aptitude() {
  const email = getCurrentUserEmail();
  const aptitudeStats = getAptitudeStats(email);

  // Accuracy percentages per category (prototype — only overall is real)
  const overallAccuracy =
    aptitudeStats.attempted > 0
      ? Math.round((aptitudeStats.correct / aptitudeStats.attempted) * 100)
      : 0;

  return (
    <Layout>

      <div className="page-header">

        <div>
          <p className="eyebrow">BASE PAPER MODULE</p>
          <h1>Aptitude Practice</h1>
          <p>
            Quantitative, logical and verbal aptitude preparation.
          </p>
        </div>

      </div>


      {/* OVERALL STATS */}

      <div className="dashboard-card">

        <div className="card-heading">
          <div>
            <h3>Your Aptitude Statistics</h3>
            <p>Actual activity — updates as you practice</p>
          </div>
          <span className="score-pill">{overallAccuracy}%</span>
        </div>

        <div className="coding-stats">

          <div>
            <strong id="apt-attempted-count">{aptitudeStats.attempted}</strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>{aptitudeStats.completed}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong style={{ color: "#10b981" }}>{aptitudeStats.correct}</strong>
            <span>Correct</span>
          </div>

          <div>
            <strong style={{ color: "#ef4444" }}>{aptitudeStats.incorrect}</strong>
            <span>Incorrect</span>
          </div>

          <div>
            <strong>{overallAccuracy}%</strong>
            <span>Accuracy</span>
          </div>

        </div>

        {aptitudeStats.attempted === 0 && (
          <p className="zero-stat-note">
            No attempts yet. Start an aptitude test to track your performance.
          </p>
        )}

      </div>


      {/* CATEGORY BREAKDOWN (prototype – shown as 0 for new users) */}

      <div className="module-dashboard-grid">

        <div className="dashboard-card">

          <span className="module-label">QUANTITATIVE</span>

          <h2>
            {aptitudeStats.attempted > 0 ? `${overallAccuracy}%` : "0%"}
          </h2>

          <p>Current accuracy</p>

          <div className="progress-bar">
            <div style={{ width: aptitudeStats.attempted > 0 ? `${overallAccuracy}%` : "0%" }}></div>
          </div>

        </div>


        <div className="dashboard-card">

          <span className="module-label">LOGICAL</span>

          <h2>0%</h2>

          <p>Current accuracy</p>

          <div className="progress-bar">
            <div style={{ width: "0%" }}></div>
          </div>

        </div>


        <div className="dashboard-card">

          <span className="module-label">VERBAL</span>

          <h2>0%</h2>

          <p>Current accuracy</p>

          <div className="progress-bar">
            <div style={{ width: "0%" }}></div>
          </div>

        </div>

      </div>


      <div className="dashboard-card">

        <h3>Adaptive Practice</h3>

        <p>
          The base-paper foundation includes adaptive aptitude practice.
          The complete adaptive engine will be connected during backend
          implementation.
        </p>

        <button className="primary-btn">
          Start Practice →
        </button>

      </div>

    </Layout>
  );
}

export default Aptitude;