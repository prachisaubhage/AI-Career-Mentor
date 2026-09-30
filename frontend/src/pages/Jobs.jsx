import "./Jobs.css";

function Jobs() {
  const jobs = [
    {
      logo: "G",
      company: "Google",
      role: "Software Engineering Intern",
      location: "Bangalore, India",
      type: "Internship",
      skills: ["C++", "DSA", "OOP"],
      match: "92%",
    },
    {
      logo: "M",
      company: "Microsoft",
      role: "Software Engineer Intern",
      location: "Hyderabad, India",
      type: "Internship",
      skills: ["C++", "DSA", "SQL"],
      match: "89%",
    },
    {
      logo: "A",
      company: "Amazon",
      role: "SDE Intern",
      location: "Bangalore, India",
      type: "Internship",
      skills: ["Java", "DSA", "SQL"],
      match: "86%",
    },
    {
      logo: "T",
      company: "TCS",
      role: "Graduate Software Developer",
      location: "Pune, India",
      type: "Full Time",
      skills: ["C++", "SQL", "OOP"],
      match: "84%",
    },
  ];

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <span className="page-label">OPPORTUNITIES FOR YOU</span>
          <h1>Job Opportunities 💼</h1>
          <p>
            Explore internships and jobs that match your skills and career
            goals.
          </p>
        </div>

        <button className="filter-button">⚙ Filters</button>
      </div>

      <div className="job-search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search jobs, companies or skills..."
        />
      </div>

      <div className="jobs-layout">
        <div className="jobs-list">
          {jobs.map((job) => (
            <div className="job-card" key={job.company}>
              <div className="company-logo">{job.logo}</div>

              <div className="job-main">
                <div className="job-title-row">
                  <div>
                    <h2>{job.role}</h2>
                    <h3>{job.company}</h3>
                  </div>

                  <span className="match">{job.match} Match</span>
                </div>

                <div className="job-info">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                </div>

                <div className="job-skills">
                  {job.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <button className="apply-button">
                  View Opportunity →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="jobs-sidebar">
          <div className="career-tip">
            <div className="tip-icon">💡</div>
            <h2>Career Tip</h2>
            <p>
              Keep improving your DSA, SQL and problem-solving skills to
              increase your job match score.
            </p>
          </div>

          <div className="job-stats">
            <h2>Your Job Readiness</h2>

            <div className="readiness-circle">
              <strong>72%</strong>
              <span>Ready</span>
            </div>

            <p>You're making good progress!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;