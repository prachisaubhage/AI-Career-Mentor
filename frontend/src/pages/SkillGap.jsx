import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./SkillGap.css";

function SkillGap() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("careerMentorProfile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const hasSkillData = Boolean(
    profile &&
    (Number(profile.coding || profile.dsaCoding || 0) > 0 ||
     Number(profile.sql || profile.sqlDbms || 0) > 0 ||
     Number(profile.aptitude || 0) > 0 ||
     Number(profile.communication || 0) > 0)
  );

  if (!profile || !hasSkillData) {
    return (
      <Layout>
        <div className="gap-empty">
          <h2>Skill Gap Analysis</h2>
          <p className="empty-title" style={{ fontSize: "18px", fontWeight: "bold", color: "#374151", margin: "12px 0 6px" }}>
            No skill-gap analysis available yet.
          </p>
          <p className="empty-description" style={{ color: "#6b7280", marginBottom: "20px" }}>
            Complete your profile and assessments to identify your skill gaps.
          </p>
          <button onClick={() => navigate("/profile")} className="prediction-button">
            Go to Profile →
          </button>
        </div>
      </Layout>
    );
  }

  const skills = [
    {
      name: "DSA / Coding",
      current: Number(profile.coding || 0),
      target: 80,
    },
    {
      name: "SQL / DBMS",
      current: Number(profile.sql || 0),
      target: 75,
    },
    {
      name: "Aptitude",
      current: Number(profile.aptitude || 0),
      target: 75,
    },
    {
      name: "Communication",
      current: Number(profile.communication || 0),
      target: 80,
    },
  ];

  const getGap = (current, target) => {
    return Math.max(target - current, 0);
  };

  const getPriority = (gap) => {
    if (gap >= 20) return "High";
    if (gap >= 10) return "Medium";
    return "Low";
  };

  const sortedSkills = [...skills].sort(
    (a, b) =>
      getGap(b.current, b.target) -
      getGap(a.current, a.target)
  );

  const highestGap = sortedSkills[0];

  return (
    <Layout>

      {/* HEADER */}

      <div className="gap-header">

        <div>

          <p className="gap-eyebrow">
            AI ANALYSIS
          </p>

          <h1>
            Skill Gap Analysis
          </h1>

          <p>
            Identify the skills that need improvement for your
            target career role.
          </p>

        </div>

        <div className="gap-role">

          <span>Target Role</span>

          <strong>
            {profile.targetRole}
          </strong>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="gap-summary">

        <div className="gap-summary-icon">
          !
        </div>

        <div>

          <strong>
            Primary improvement area
          </strong>

          <p>
            {highestGap.name} currently has the largest gap
            compared with the target level.
          </p>

        </div>

      </div>


      {/* SKILL CARDS */}

      <div className="skill-gap-grid">

        {skills.map((skill) => {

          const gap = getGap(
            skill.current,
            skill.target
          );

          const priority = getPriority(gap);

          const progress = Math.min(
            (skill.current / skill.target) * 100,
            100
          );

          return (

            <div
              className="skill-gap-card"
              key={skill.name}
            >

              <div className="skill-gap-card-top">

                <div>

                  <h3>
                    {skill.name}
                  </h3>

                  <span>
                    Placement target: {skill.target}%
                  </span>

                </div>

                <div
                  className={`priority ${priority.toLowerCase()}`}
                >
                  {priority}
                </div>

              </div>


              <div className="skill-values">

                <div>

                  <span>
                    Current
                  </span>

                  <strong>
                    {skill.current}%
                  </strong>

                </div>

                <div>

                  <span>
                    Target
                  </span>

                  <strong>
                    {skill.target}%
                  </strong>

                </div>

                <div>

                  <span>
                    Gap
                  </span>

                  <strong>
                    {gap}%
                  </strong>

                </div>

              </div>


              <div className="gap-progress">

                <div
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


              <p className="skill-gap-message">

                {gap === 0
                  ? "Target level achieved."
                  : `Improve by approximately ${gap} points to reach the target.`}

              </p>

            </div>

          );

        })}

      </div>


      {/* RECOMMENDATIONS */}

      <div className="gap-recommendation">

        <div>

          <p className="recommendation-label">
            AI RECOMMENDATION
          </p>

          <h2>
            Focus on {highestGap.name}
          </h2>

          <p>
            Your current {highestGap.name.toLowerCase()} score is{" "}
            {highestGap.current}%, while the suggested placement
            target is {highestGap.target}%. This area should receive
            higher priority in your preparation roadmap.
          </p>

        </div>

        <button
          onClick={() => navigate("/roadmap")}
        >
          Generate Career Roadmap →
        </button>

      </div>


      {/* ANALYSIS FLOW */}

      <div className="gap-flow-card">

        <div className="section-heading">

          <div>

            <h2>
              From Prediction to Personalized Preparation
            </h2>

            <p>
              Proposed AI Career Mentor workflow
            </p>

          </div>

        </div>


        <div className="gap-flow">

          <FlowStep
            number="01"
            title="Prediction"
            text="Readiness score"
          />

          <div className="flow-arrow">
            →
          </div>

          <FlowStep
            number="02"
            title="Explain"
            text="Feature contribution"
          />

          <div className="flow-arrow">
            →
          </div>

          <FlowStep
            number="03"
            title="Skill Gap"
            text="Identify weaknesses"
            active
          />

          <div className="flow-arrow">
            →
          </div>

          <FlowStep
            number="04"
            title="Roadmap"
            text="Personalized plan"
          />

        </div>

      </div>

    </Layout>
  );
}


/* FLOW STEP */

function FlowStep({
  number,
  title,
  text,
  active
}) {
  return (
    <div
      className={`gap-flow-step ${
        active ? "active" : ""
      }`}
    >

      <div className="gap-flow-number">
        {number}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>

    </div>
  );
}


export default SkillGap;