import Layout from "../components/Layout";
import { getCurrentUserEmail, getResume } from "../utils/auth";

function ResumeAnalyzer() {
  const email = getCurrentUserEmail();
  const resume = getResume(email);
  const hasResume = Boolean(resume && (resume.filename || resume.name || resume.originalName));

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">PREPARATION MODULE</p>
          <h1>Resume Analyzer</h1>
          <p>
            Resume-based skill extraction and improvement analysis.
          </p>
        </div>
      </div>

      <div className="dashboard-card resume-upload-large">
        <div className="upload-icon">↑</div>
        <h2>Upload your resume</h2>
        <p>
          Upload a PDF or DOCX resume for analysis.
        </p>
        <input type="file" accept=".pdf,.doc,.docx" />
        <button className="primary-btn">
          Analyze Resume
        </button>
        {hasResume && (
          <p style={{ marginTop: "12px", color: "#10b981", fontSize: "14px", fontWeight: "600" }}>
            ✓ Uploaded: {resume.originalName || resume.filename || "resume.pdf"}
          </p>
        )}
      </div>

      <div className="dashboard-card">
        <h3>Resume Insights</h3>

        {hasResume ? (
          <div className="resume-insights">
            <div>
              <strong>{resume.detectedSkillsCount || 5}</strong>
              <span>Detected Skills</span>
            </div>
            <div>
              <strong>{resume.projectsCount || 1}</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong>{resume.score || 85}</strong>
              <span>Resume Score</span>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: "#6b7280", margin: "8px 0 16px" }}>
              No resume uploaded yet.
            </p>

            <div className="resume-insights">
              <div>
                <strong>0</strong>
                <span>Detected Skills</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Resume Score</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ResumeAnalyzer;