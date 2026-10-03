import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./Prediction.css";

function Prediction() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("careerMentorProfile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const hasUserData = Boolean(
    profile &&
    (Number(profile.cgpa || 0) > 0 ||
     Number(profile.coding || profile.dsaCoding || 0) > 0 ||
     Number(profile.sql || profile.sqlDbms || 0) > 0 ||
     Number(profile.aptitude || 0) > 0 ||
     Number(profile.communication || 0) > 0 ||
     Number(profile.projects || 0) > 0 ||
     Number(profile.certifications || 0) > 0)
  );

  if (!profile || !hasUserData) {
    return (
      <Layout>
        <div className="prediction-empty">
          <h2>Placement Prediction</h2>
          <p className="empty-title" style={{ fontSize: "20px", fontWeight: "bold", color: "#374151", margin: "12px 0 6px" }}>
            Not available yet
          </p>
          <p className="empty-description" style={{ color: "#6b7280", marginBottom: "20px" }}>
            Complete your profile and assessments to generate your placement prediction.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="prediction-button"
          >
            Go to My Profile →
          </button>
        </div>
      </Layout>
    );
  }

  /*
   * ------------------------------------------------
   * PROTOTYPE READINESS CALCULATION
   * ------------------------------------------------
   *
   * This is a frontend prototype calculation.
   * It is NOT the final ML model.
   *
   * Later this formula will be replaced by
   * the trained placement prediction model.
   */

  const cgpa = Number(profile.cgpa || 0);
  const backlogs = Number(profile.backlogs || 0);
  const coding = Number(profile.coding || profile.dsaCoding || 0);
  const sql = Number(profile.sql || profile.sqlDbms || 0);
  const aptitude = Number(profile.aptitude || 0);
  const communication = Number(profile.communication || 0);
  const projects = Number(profile.projects || 0);
  const certifications = Number(profile.certifications || 0);

  // Convert CGPA out of 10 into percentage-style score
  const cgpaScore = Math.min((cgpa / 10) * 100, 100);

  // Project and certification contribution
  const projectScore = Math.min(projects * 20, 100);
  const certificationScore = Math.min(certifications * 15, 100);

  // Backlog penalty
  const backlogPenalty = backlogs * 5;

  // Prototype readiness calculation
  let readiness = Math.round(
    cgpaScore * 0.20 +
    coding * 0.20 +
    sql * 0.15 +
    aptitude * 0.15 +
    communication * 0.10 +
    projectScore * 0.10 +
    certificationScore * 0.10 -
    backlogPenalty
  );

  readiness = Math.max(0, Math.min(readiness, 100));


  // Readiness label
  let readinessLabel = "Needs Improvement";

  if (readiness >= 75) {
    readinessLabel = "High Readiness";
  } else if (readiness >= 60) {
    readinessLabel = "Moderate Readiness";
  }


  // Prototype package band
  let packageBand = "₹3–5 LPA";

  if (readiness >= 80) {
    packageBand = "₹8–12 LPA";
  } else if (readiness >= 70) {
    packageBand = "₹6–8 LPA";
  } else if (readiness >= 60) {
    packageBand = "₹5–7 LPA";
  }


  /*
   * Find strongest and weakest areas
   */

  const skills = [
    {
      name: "Coding Performance",
      value: coding,
    },
    {
      name: "SQL / DBMS",
      value: sql,
    },
    {
      name: "Aptitude Performance",
      value: aptitude,
    },
    {
      name: "Communication",
      value: communication,
    },
  ];

  const sortedSkills = [...skills].sort(
    (a, b) => a.value - b.value
  );

  const weakestSkill = sortedSkills[0];


  /*
   * Impact levels
   */

  function getImpact(value) {
    if (value < 60) return "High";

    if (value < 75) return "Medium";

    return "Low";
  }


  return (
    <Layout>

      {/* ================= HEADER ================= */}

      <div className="prediction-header">

        <div>

          <p className="prediction-eyebrow">
            AI ANALYSIS
          </p>

          <h1>
            Placement Prediction
          </h1>

          <p>
            Prototype prediction based on your current student profile.
          </p>

        </div>


        <div className="prototype-badge">

          <span></span>

          Prototype Analysis

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="prediction-grid">

        {/* LEFT COLUMN */}

        <div>


          {/* READINESS CARD */}

          <div className="readiness-card">

            <div className="score-circle">

              <div>

                <strong>
                  {readiness}
                </strong>

                <span>
                  %
                </span>

              </div>

            </div>


            <div className="readiness-content">

              <p>
                PLACEMENT READINESS
              </p>

              <h2>
                {readinessLabel}
              </h2>

              <span>
                Your current profile indicates a{" "}
                {readinessLabel.toLowerCase()} level of placement
                readiness. Improving your weakest technical areas
                can strengthen the profile.
              </span>

            </div>

          </div>


          {/* PACKAGE */}

          <div className="prediction-card">

            <div className="prediction-card-heading">

              <div>

                <h3>
                  Estimated Package Band
                </h3>

                <p>
                  Prototype estimate
                </p>

              </div>

            </div>


            <div className="package-value">
              {packageBand}
            </div>


            <p className="prototype-note">
              This is a prototype output. The final version will
              generate the package band using the trained
              placement-prediction model.
            </p>

          </div>


          {/* INPUTS */}

          <div className="prediction-card">

            <div className="prediction-card-heading">

              <div>

                <h3>
                  Prediction Inputs
                </h3>

                <p>
                  Features considered by the proposed system
                </p>

              </div>

            </div>


            <div className="input-grid">

              <InputBox
                title="CGPA"
                value={profile.cgpa || "—"}
              />

              <InputBox
                title="Backlogs"
                value={profile.backlogs ?? "0"}
              />

              <InputBox
                title="Aptitude"
                value={`${profile.aptitude || 0}%`}
              />

              <InputBox
                title="Coding"
                value={`${profile.coding || profile.dsaCoding || 0}%`}
              />

              <InputBox
                title="SQL / DBMS"
                value={`${profile.sql || profile.sqlDbms || 0}%`}
              />

              <InputBox
                title="Communication"
                value={`${profile.communication || 0}%`}
              />

              <InputBox
                title="Projects"
                value={profile.projects ?? 0}
              />

              <InputBox
                title="Certifications"
                value={profile.certifications ?? 0}
              />

            </div>

          </div>


          {/* TARGET ROLE */}

          <div className="prediction-card">

            <div className="prediction-card-heading">

              <div>

                <h3>
                  Target Career
                </h3>

                <p>
                  Selected from your student profile
                </p>

              </div>

            </div>


            <div className="target-role">

              <span>Target Role</span>

              <strong>
                {profile.targetRole}
              </strong>

            </div>

          </div>

        </div>


        {/* RIGHT COLUMN */}

        <div>


          {/* EXPLAINABILITY */}

          <div className="prediction-card explanation-card">

            <div className="prediction-card-heading">

              <div>

                <h3>
                  What affects your score?
                </h3>

                <p>
                  SHAP-style explanation
                </p>

              </div>

            </div>


            {skills.map((skill) => (

              <div
                className="impact-item"
                key={skill.name}
              >

                <div className="impact-header">

                  <span>
                    {skill.name}
                  </span>

                  <strong>
                    {getImpact(skill.value)}
                  </strong>

                </div>


                <div className="impact-bar">

                  <div
                    style={{
                      width: `${skill.value}%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}


            <div className="weakest-box">

              <strong>
                Key improvement area
              </strong>

              <p>
                {weakestSkill.name} currently has the
                lowest score at {weakestSkill.value}%.
              </p>

            </div>


            <button
              className="full-button"
              onClick={() => navigate("/skill-gap")}
            >
              View Skill Gaps →
            </button>

          </div>


          {/* PIPELINE */}

          <div className="prediction-card">

            <div className="prediction-card-heading">

              <div>

                <h3>
                  AI Career Mentor Pipeline
                </h3>

                <p>
                  Proposed system workflow
                </p>

              </div>

            </div>


            <div className="pipeline">

              <PipelineStep
                number="01"
                title="Profile"
                text="Student data"
                active
              />

              <PipelineStep
                number="02"
                title="Prediction"
                text="Readiness"
                active
              />

              <PipelineStep
                number="03"
                title="Explain"
                text="SHAP"
              />

              <PipelineStep
                number="04"
                title="Skill Gap"
                text="Weak areas"
              />

              <PipelineStep
                number="05"
                title="Roadmap"
                text="Personal plan"
              />

            </div>

          </div>


        </div>

      </div>


      {/* ================= DISCLAIMER ================= */}

      <div className="prediction-disclaimer">

        <strong>Prototype:</strong>

        <span>
          The readiness score and package band shown here are
          generated using a frontend prototype calculation.
          They will later be replaced by the trained ML model
          described in the proposed system.
        </span>

      </div>

    </Layout>
  );
}


/* =====================================================
   INPUT BOX
===================================================== */

function InputBox({
  title,
  value
}) {

  return (

    <div className="input-box">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );

}


/* =====================================================
   PIPELINE STEP
===================================================== */

function PipelineStep({
  number,
  title,
  text,
  active
}) {

  return (

    <div
      className={`pipeline-step ${
        active ? "pipeline-active" : ""
      }`}
    >

      <div className="pipeline-number">
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


export default Prediction;