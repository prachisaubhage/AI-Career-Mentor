import Layout from "../components/Layout";
import { getCurrentUserEmail, getCodingStats } from "../utils/auth";

function Coding() {
  const email = getCurrentUserEmail();
  const codingStats = getCodingStats(email);

  // Accuracy: avoid division by zero
  const accuracy =
    codingStats.attempted > 0
      ? Math.round((codingStats.solved / codingStats.attempted) * 100)
      : 0;

  return (
    <Layout>

      <div className="page-header">

        <div>
          <p className="eyebrow">BASE PAPER MODULE</p>
          <h1>Coding Practice</h1>
          <p>
            Technical problem-solving preparation.
          </p>
        </div>

      </div>


      <div className="dashboard-card">

        <div className="card-heading">

          <div>
            <h3>Your Coding Statistics</h3>
            <p>Actual activity — resets only when you solve or attempt problems</p>
          </div>

          <span className="score-pill">
            {accuracy}%
          </span>

        </div>


        <div className="coding-stats">

          <div>
            <strong id="coding-solved-count">{codingStats.solved}</strong>
            <span>Problems Solved</span>
          </div>

          <div>
            <strong id="coding-attempted-count">{codingStats.attempted}</strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>

          <div>
            <strong style={{ color: "#10b981" }}>{codingStats.easy}</strong>
            <span>Easy</span>
          </div>

          <div>
            <strong style={{ color: "#f59e0b" }}>{codingStats.medium}</strong>
            <span>Medium</span>
          </div>

          <div>
            <strong style={{ color: "#ef4444" }}>{codingStats.hard}</strong>
            <span>Hard</span>
          </div>

        </div>

        {codingStats.attempted === 0 && (
          <p className="zero-stat-note">
            No coding attempts yet. Start coding practice to track your performance.
          </p>
        )}

      </div>


      <div className="dashboard-card">

        <h3>Recommended Topics</h3>

        <div className="topic-tags">

          <span>Arrays</span>
          <span>Strings</span>
          <span>Linked Lists</span>
          <span>Stacks</span>
          <span>Queues</span>
          <span>Trees</span>

        </div>

        <button className="primary-btn">
          Start Coding Practice →
        </button>

      </div>

    </Layout>
  );
}

export default Coding;