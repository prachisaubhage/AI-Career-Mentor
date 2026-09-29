import React from "react";
import "./Skills.css";

function Skills() {
  const technicalSkills = [
    { name: "DSA", level: 75 },
    { name: "C++", level: 70 },
    { name: "OOP", level: 80 },
    { name: "SQL", level: 70 },
    { name: "HTML & CSS", level: 85 },
    { name: "JavaScript", level: 65 },
    { name: "React", level: 55 },
  ];

  const softSkills = [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Leadership",
  ];

  const recommendedSkills = [
    "Data Structures & Algorithms",
    "Advanced SQL",
    "React.js",
    "Git & GitHub",
    "System Design",
  ];

  return (
    <div className="skills-page">

      {/* Header */}
      <div className="skills-header">
        <div>
          <h1>My Skills</h1>
          <p>
            Track your current skills and discover what you should learn next.
          </p>
        </div>

        <button className="update-skills-btn">
          + Add Skill
        </button>
      </div>

      {/* Main Content */}
      <div className="skills-grid">

        {/* Technical Skills */}
        <div className="skills-card technical-card">

          <div className="card-title">
            <div className="title-icon">💻</div>

            <div>
              <h2>Technical Skills</h2>
              <p>Your current technical skill level</p>
            </div>
          </div>

          <div className="technical-list">

            {technicalSkills.map((skill) => (
              <div className="skill-item" key={skill.name}>

                <div className="skill-top">
                  <span>{skill.name}</span>
                  <strong>{skill.level}%</strong>
                </div>

                <div className="progress-background">
                  <div
                    className="progress-fill"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Soft Skills */}
        <div className="skills-card">

          <div className="card-title">
            <div className="title-icon">🤝</div>

            <div>
              <h2>Soft Skills</h2>
              <p>Skills that help you succeed</p>
            </div>
          </div>

          <div className="soft-skills-list">

            {softSkills.map((skill) => (
              <div className="soft-skill" key={skill}>
                <span className="check-icon">✓</span>
                <span>{skill}</span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Recommended Skills */}
      <div className="recommended-section">

        <div className="section-heading">
          <div>
            <h2>Recommended Skills</h2>
            <p>
              Improve these skills to increase your career opportunities.
            </p>
          </div>
        </div>

        <div className="recommended-grid">

          {recommendedSkills.map((skill, index) => (
            <div className="recommended-card" key={skill}>

              <div className="recommended-number">
                {index + 1}
              </div>

              <div className="recommended-content">
                <h3>{skill}</h3>
                <p>Recommended for your career journey</p>
              </div>

              <button className="learn-btn">
                Learn
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Skills;