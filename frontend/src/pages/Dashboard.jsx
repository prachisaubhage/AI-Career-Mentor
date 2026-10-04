import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getCurrentUser,
  getCurrentUserEmail,
  getProjects,
  getCertifications,
  getInternships,
  getAchievements,
  getCodingStats,
  getAptitudeStats,
  calcProfileCompletion,
  getResume,
} from "../utils/auth";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // ---- Identity ----
  const user = getCurrentUser();
  const studentFullName =
    user.fullName && user.fullName.trim() ? user.fullName.trim() : "Student";
  const email = getCurrentUserEmail();

  // ---- Load actual profile data ----
  const profile = (() => {
    try {
      const raw = localStorage.getItem("careerMentorProfile");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  // ---- Load actual per-user records ----
  const projects = getProjects(email);
  const certifications = getCertifications(email);
  const internships = getInternships(email);
  const achievements = getAchievements(email);
  const resume = getResume(email);
  const codingStats = getCodingStats(email);
  const aptitudeStats = getAptitudeStats(email);

  // ---- Dynamic profile completion ----
  const profileCompletion = calcProfileCompletion(
    profile,
    projects,
    certifications,
    internships,
    achievements,
    resume
  );

  // ---- Actual counts (from real records) ----
  const projectCount = projects.length;
  const certCount = certifications.length;
  const internshipCount = internships.length;
  const achievementCount = achievements.length;

  // ---- Target role from profile ----
  const targetRole = profile.targetRole || "";

  // ---- Real analysis status check ----
  const hasRealData = Boolean(
    (profile.cgpa && profile.cgpa.trim() !== "") ||
    (profile.coding && Number(profile.coding) > 0) ||
    (profile.dsaCoding && Number(profile.dsaCoding) > 0) ||
    codingStats.attempted > 0 ||
    aptitudeStats.attempted > 0 ||
    projectCount > 0 ||
    certCount > 0
  );

  // ---- Calculate actual readiness metrics if user has data ----
  const cgpaVal = Number(profile.cgpa || 0);
  const codingVal = Number(profile.coding || profile.dsaCoding || 0);
  const sqlVal = Number(profile.sql || profile.sqlDbms || 0);
  const aptitudeVal = Number(profile.aptitude || 0);
  const commVal = Number(profile.communication || 0);

  let calculatedReadiness = 0;
  if (hasRealData) {
    calculatedReadiness = Math.min(
      100,
      Math.round(
        (cgpaVal / 10) * 25 +
        (codingVal > 0 ? codingVal * 0.25 : codingStats.solved * 5) +
        (sqlVal > 0 ? sqlVal * 0.2 : 0) +
        (aptitudeVal > 0 ? aptitudeVal * 0.15 : aptitudeStats.correct * 5) +
        (commVal > 0 ? commVal * 0.15 : 0) +
        projectCount * 5 +
        certCount * 5
      )
    );
  }

  let readinessLabel = "Needs Improvement";
  if (calculatedReadiness >= 75) {
    readinessLabel = "High Readiness";
  } else if (calculatedReadiness >= 60) {
    readinessLabel = "Moderate Readiness";
  }

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
          <p className="eyebrow">AI CAREER MENTOR</p>
          <h1 id="dashboard-welcome-heading">Welcome, {studentFullName} 👋</h1>
          <p>
            Your AI-powered placement readiness and career guidance dashboard.
          </p>
        </div>
        <button
          className="primary-btn small-btn"
          onClick={() => navigate("/profile")}
        >
          Update Profile
        </button>
      </div>

      {/* ================= TOP STATISTICS ================= */}
      <div className="stats-grid dashboard-top-stats">
        {/* READINESS */}
        <div className="stat-card highlight">
          <div className="stat-top">
            <span>Placement Readiness</span>
            <span>AI</span>
          </div>
          <h2>{hasRealData ? `${calculatedReadiness}%` : "Not available yet"}</h2>
          <div className="progress-bar">
            <div style={{ width: hasRealData ? `${calculatedReadiness}%` : "0%" }}></div>
          </div>
          <small>
            {hasRealData
              ? "Based on profile & activity"
              : "Complete your profile & assessments to generate readiness"}
          </small>
        </div>

        {/* TARGET ROLE */}
        <div className="stat-card">
          <div className="stat-top">
            <span>Target Role</span>
            <span>↗</span>
          </div>
          <h2>{targetRole || "Not specified"}</h2>
          <small>Selected career goal</small>
        </div>

        {/* PROFILE COMPLETION */}
        <div className="stat-card">
          <div className="stat-top">
            <span>Profile Completion</span>
            <span>✓</span>
          </div>
          <h2>{profileCompletion}%</h2>
          <div className="progress-bar">
            <div style={{ width: `${profileCompletion}%` }}></div>
          </div>
          <small>Based on sections filled</small>
        </div>
      </div>

      {/* ================= ACTUAL RECORD COUNTS ================= */}
      <div className="stats-grid dashboard-records-grid">
        <div className="stat-card record-stat-card" id="dashboard-projects-count">
          <div className="stat-top">
            <span>Projects</span>
            <span>📁</span>
          </div>
          <h2>{projectCount}</h2>
          <small>
            {projectCount === 0
              ? "No projects added yet"
              : projectCount === 1
              ? "1 project added"
              : `${projectCount} projects added`}
          </small>
          <button className="text-btn" onClick={() => navigate("/profile")}>
            Add Project →
          </button>
        </div>

        <div className="stat-card record-stat-card" id="dashboard-certs-count">
          <div className="stat-top">
            <span>Certifications</span>
            <span>🏅</span>
          </div>
          <h2>{certCount}</h2>
          <small>
            {certCount === 0
              ? "No certifications added yet"
              : certCount === 1
              ? "1 certification added"
              : `${certCount} certifications added`}
          </small>
          <button className="text-btn" onClick={() => navigate("/profile")}>
            Add Certification →
          </button>
        </div>

        <div className="stat-card record-stat-card" id="dashboard-internships-count">
          <div className="stat-top">
            <span>Internships</span>
            <span>💼</span>
          </div>
          <h2>{internshipCount}</h2>
          <small>
            {internshipCount === 0
              ? "No internships added yet"
              : internshipCount === 1
              ? "1 internship added"
              : `${internshipCount} internships added`}
          </small>
          <button className="text-btn" onClick={() => navigate("/profile")}>
            Add Internship →
          </button>
        </div>

        <div className="stat-card record-stat-card" id="dashboard-achievements-count">
          <div className="stat-top">
            <span>Achievements</span>
            <span>🏆</span>
          </div>
          <h2>{achievementCount}</h2>
          <small>
            {achievementCount === 0
              ? "No achievements added yet"
              : achievementCount === 1
              ? "1 achievement added"
              : `${achievementCount} achievements added`}
          </small>
          <button className="text-btn" onClick={() => navigate("/profile")}>
            Add Achievement →
          </button>
        </div>
      </div>

      {/* ================= CODING & APTITUDE STATS ================= */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Coding Practice</h3>
              <p>Your actual coding activity</p>
            </div>
            <button className="text-btn" onClick={() => navigate("/coding")}>
              Practice →
            </button>
          </div>

          <div className="coding-stats-dashboard">
            <div className="coding-stat-item">
              <strong id="dashboard-coding-solved">{codingStats.solved}</strong>
              <span>Solved</span>
            </div>
            <div className="coding-stat-item">
              <strong id="dashboard-coding-attempted">{codingStats.attempted}</strong>
              <span>Attempted</span>
            </div>
            <div className="coding-stat-item coding-easy">
              <strong>{codingStats.easy}</strong>
              <span>Easy</span>
            </div>
            <div className="coding-stat-item coding-medium">
              <strong>{codingStats.medium}</strong>
              <span>Medium</span>
            </div>
            <div className="coding-stat-item coding-hard">
              <strong>{codingStats.hard}</strong>
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
          <div className="card-heading">
            <div>
              <h3>Aptitude Practice</h3>
              <p>Your actual aptitude activity</p>
            </div>
            <button className="text-btn" onClick={() => navigate("/aptitude")}>
              Practice →
            </button>
          </div>

          <div className="aptitude-stats-dashboard">
            <div className="coding-stat-item">
              <strong id="dashboard-apt-attempted">{aptitudeStats.attempted}</strong>
              <span>Attempted</span>
            </div>
            <div className="coding-stat-item">
              <strong>{aptitudeStats.correct}</strong>
              <span>Correct</span>
            </div>
            <div className="coding-stat-item">
              <strong>{aptitudeStats.incorrect}</strong>
              <span>Incorrect</span>
            </div>
            <div className="coding-stat-item">
              <strong>
                {aptitudeStats.attempted > 0
                  ? `${Math.round((aptitudeStats.correct / aptitudeStats.attempted) * 100)}%`
                  : "0%"}
              </strong>
              <span>Accuracy</span>
            </div>
          </div>

          {aptitudeStats.attempted === 0 && (
            <p className="zero-stat-note">
              No attempts yet. Start an aptitude test to track your performance.
            </p>
          )}
        </div>
      </div>

      {/* ================= MAIN ANALYSIS ================= */}
      <div className="dashboard-grid">
        {/* PLACEMENT PREDICTION */}
        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Placement Readiness</h3>
              <p>Placement analysis status</p>
            </div>
            <button className="text-btn" onClick={() => navigate("/prediction")}>
              View Analysis →
            </button>
          </div>

          {hasRealData ? (
            <div className="readiness-section">
              <div className="circle-score">
                <div>
                  <strong>{calculatedReadiness}</strong>
                  <span>%</span>
                </div>
              </div>

              <div className="readiness-info">
                <h3>{readinessLabel}</h3>
                <p>
                  Your profile and assessment performance indicate {readinessLabel.toLowerCase()}.
                </p>
              </div>
            </div>
          ) : (
            <div className="readiness-section">
              <div className="circle-score">
                <div>
                  <strong>--</strong>
                </div>
              </div>

              <div className="readiness-info">
                <h3>Not available yet</h3>
                <p>
                  Complete your profile and assessments to generate your placement readiness analysis.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SKILL GAP */}
        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Top Skill Gaps</h3>
              <p>Identified from profile analysis</p>
            </div>
            <button className="text-btn" onClick={() => navigate("/skill-gap")}>
              Details →
            </button>
          </div>

          {hasRealData ? (
            <>
              <SkillRow name="DSA / Coding" value={`${codingVal}%`} />
              <SkillRow name="SQL / DBMS" value={`${sqlVal}%`} />
              <SkillRow name="Aptitude" value={`${aptitudeVal}%`} />
              <SkillRow name="Communication" value={`${commVal}%`} />
            </>
          ) : (
            <div className="empty-analysis-box">
              <p className="empty-title">No skill-gap analysis available yet.</p>
              <p className="empty-description">
                Complete assessments to identify your skill gaps.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= EXPLAINABILITY ================= */}
      <div className="dashboard-card">
        <div className="card-heading">
          <div>
            <h3>{hasRealData ? `Why is my readiness ${calculatedReadiness}%?` : "Readiness Analysis"}</h3>
            <p>Explainable AI feature analysis</p>
          </div>
          <span className="ai-status">
            <span></span>
            Explainable AI
          </span>
        </div>

        {hasRealData ? (
          <>
            <div className="factor-grid">
              <Factor name="Coding Performance" impact="High Impact" width={`${codingVal || 50}%`} />
              <Factor name="Aptitude Performance" impact="Medium Impact" width={`${aptitudeVal || 50}%`} />
              <Factor name="CGPA" impact="Medium Impact" width={`${cgpaVal ? cgpaVal * 10 : 50}%`} />
              <Factor name="Projects" impact="Low Impact" width={`${Math.min(projectCount * 20, 100)}%`} />
            </div>

            <div className="explain-note">
              <strong>Insight:</strong>
              <span>
                Improving your lower-scoring areas can strengthen your placement readiness.
              </span>
            </div>
          </>
        ) : (
          <div className="empty-analysis-box">
            <p className="empty-title">No analysis available yet.</p>
            <p className="empty-description">
              Complete your profile and assessments to generate your personalized analysis.
            </p>
          </div>
        )}
      </div>

      {/* ================= CAREER ROADMAP ================= */}
      <div className="dashboard-card">
        <div className="card-heading">
          <div>
            <h3>Personalized Career Roadmap</h3>
            <p>Targeted learning path</p>
          </div>
          <button className="text-btn" onClick={() => navigate("/roadmap")}>
            Open Roadmap →
          </button>
        </div>

        {targetRole ? (
          <div className="roadmap-steps">
            <RoadmapStep number="01" title="Profile Analysis" status="Completed" completed />
            <RoadmapStep number="02" title={`Strengthen ${targetRole} Core Skills`} status="Current Focus" active />
            <RoadmapStep number="03" title="Build Placement Project" status="Upcoming" />
            <RoadmapStep number="04" title="Mock Interview Preparation" status="Upcoming" />
          </div>
        ) : (
          <div className="empty-analysis-box">
            <p className="empty-title">No roadmap generated yet.</p>
            <p className="empty-description">
              Complete your profile to generate your personalized career roadmap.
            </p>
            <button className="text-btn" style={{ marginTop: "12px" }} onClick={() => navigate("/profile")}>
              Go to Profile →
            </button>
          </div>
        )}
      </div>

      {/* ================= BASE PAPER MODULES ================= */}
      <div className="section-title">
        <div>
          <p className="eyebrow">PREPARATION MODULES</p>
          <h2>Placement Preparation Modules</h2>
          <p>Core preparation modules for student skill development.</p>
        </div>
      </div>

      <div className="module-grid">
        <ModuleCard
          number="01"
          title="Aptitude Practice"
          description="Quantitative, logical and verbal aptitude preparation."
          onClick={() => navigate("/aptitude")}
        />
        <ModuleCard
          number="02"
          title="Coding Practice"
          description="Technical problem-solving and coding preparation."
          onClick={() => navigate("/coding")}
        />
        <ModuleCard
          number="03"
          title="Resume Analyzer"
          description="Analyze resume information and identify improvements."
          onClick={() => navigate("/resume")}
        />
      </div>

      {/* ================= PROJECT FLOW ================= */}
      <div className="dashboard-card project-flow-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">SYSTEM FLOW</p>
            <h3>How AI Career Mentor Works</h3>
          </div>
        </div>

        <div className="project-flow">
          <FlowStep number="01" title="Profile" text="Student data" />
          <FlowArrow />
          <FlowStep number="02" title="Prediction" text="ML readiness" />
          <FlowArrow />
          <FlowStep number="03" title="Explain" text="SHAP analysis" />
          <FlowArrow />
          <FlowStep number="04" title="Skill Gap" text="Identify gaps" />
          <FlowArrow />
          <FlowStep number="05" title="Roadmap" text="Personalized Path" />
        </div>
      </div>
    </Layout>
  );
}

function SkillRow({ name, value }) {
  return (
    <div className="skill-row">
      <div className="skill-name">
        <span>{name}</span>
        <strong>{value}</strong>
      </div>
      <div className="skill-bar">
        <div style={{ width: value }}></div>
      </div>
    </div>
  );
}

function Factor({ name, impact, width }) {
  return (
    <div className="factor">
      <div className="factor-header">
        <span>{name}</span>
        <strong>{impact}</strong>
      </div>
      <div className="factor-bar">
        <div style={{ width: width }}></div>
      </div>
    </div>
  );
}

function RoadmapStep({ number, title, status, completed, active }) {
  return (
    <div className={`roadmap-step ${completed ? "completed" : ""} ${active ? "active-step" : ""}`}>
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <small>{status}</small>
      </div>
    </div>
  );
}

function ModuleCard({ number, title, description, onClick }) {
  return (
    <div className="module-card">
      <span className="module-number">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onClick}>Open Module →</button>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div className="flow-step">
      <div className="flow-number">{number}</div>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function FlowArrow() {
  return <div className="flow-arrow">→</div>;
}

export default Dashboard;