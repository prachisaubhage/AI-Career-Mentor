import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "./Roadmap.css";

function Roadmap() {
  const navigate = useNavigate();

  const profile = (() => {
    try {
      const raw = localStorage.getItem("careerMentorProfile");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const targetRole = profile.targetRole || "";
  const hasRoadmap = Boolean(targetRole && targetRole.trim() !== "");

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">PERSONALIZED GUIDANCE</p>
          <h1>Personalized Career Roadmap</h1>
          <p>
            Customized learning and preparation path based on your target role.
          </p>
        </div>
      </div>

      {!hasRoadmap ? (
        <div className="dashboard-card" style={{ textAlign: "center", padding: "44px 20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#374151", marginBottom: "8px" }}>
            No roadmap generated yet.
          </h2>
          <p style={{ color: "#6b7280", maxWidth: "520px", margin: "0 auto 24px", lineHeight: "1.6" }}>
            Complete your profile to generate your personalized career roadmap.
          </p>
          <button className="primary-btn small-btn" onClick={() => navigate("/profile")}>
            Complete Profile →
          </button>
        </div>
      ) : (
        <>
          <div className="roadmap-banner">
            <div>
              <p className="eyebrow">TARGET ROLE</p>
              <h2>{targetRole}</h2>
              <p>
                Roadmap generated from your target role requirements and current preparation level.
              </p>
            </div>
          </div>

          <div className="roadmap-container">
            <RoadmapItem
              week="Step 1"
              title="Strengthen Core Fundamentals"
              status="Current Focus"
              items={[
                "Review core domain fundamentals",
                "Practice fundamental problem solving",
                "Complete target topic assessments"
              ]}
            />
            <RoadmapItem
              week="Step 2"
              title="Domain & Practical Projects"
              status="Upcoming"
              items={[
                "Build practical project for target role",
                "Add code repository to profile",
                "Practice technical queries"
              ]}
            />
            <RoadmapItem
              week="Step 3"
              title="Advanced Preparation"
              status="Upcoming"
              items={[
                "Advanced data structures & algorithms",
                "System design & database optimization",
                "Mock interview practice"
              ]}
            />
            <RoadmapItem
              week="Step 4"
              title="Placement Readiness"
              status="Upcoming"
              items={[
                "Resume optimization",
                "Aptitude speed tests",
                "Company specific prep"
              ]}
            />
          </div>
        </>
      )}
    </Layout>
  );
}

function RoadmapItem({ week, title, status, items }) {
  return (
    <div className="roadmap-card">
      <div className="roadmap-header">
        <span className="roadmap-week">{week}</span>
        <span className="roadmap-status">{status}</span>
      </div>
      <h3>{title}</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Roadmap;