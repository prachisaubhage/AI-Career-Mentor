import "./Resume.css";

function Resume() {
  return (
    <div className="resume-page">
      <div className="resume-header">
        <div>
          <span className="page-label">BUILD YOUR RESUME</span>
          <h1>Resume Builder 📄</h1>
          <p>
            Create a professional resume and make your profile stand out.
          </p>
        </div>

        <button className="download-button">
          ⬇ Download Resume
        </button>
      </div>

      <div className="resume-layout">
        {/* FORM */}

        <div className="resume-form">
          <div className="form-card">
            <div className="form-title">
              <div className="form-icon">👤</div>
              <div>
                <h2>Personal Information</h2>
                <p>Tell recruiters about yourself.</p>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="Prachi Saubhage" />
              </div>

              <div className="input-group">
                <label>Job Title</label>
                <input
                  type="text"
                  placeholder="Software Developer"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                />
              </div>

              <div className="input-group">
                <label>Phone</label>
                <input type="text" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="input-group">
              <label>About Me</label>
              <textarea
                rows="4"
                placeholder="Write a short professional summary..."
              ></textarea>
            </div>
          </div>

          <div className="form-card">
            <div className="form-title">
              <div className="form-icon">🎓</div>
              <div>
                <h2>Education</h2>
                <p>Add your educational qualifications.</p>
              </div>
            </div>

            <div className="input-group">
              <label>College / University</label>
              <input
                type="text"
                placeholder="Your College Name"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Degree</label>
                <input
                  type="text"
                  placeholder="B.Tech / B.E."
                />
              </div>

              <div className="input-group">
                <label>Graduation Year</label>
                <input type="text" placeholder="2027" />
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-title">
              <div className="form-icon">💻</div>
              <div>
                <h2>Skills</h2>
                <p>Add your technical and soft skills.</p>
              </div>
            </div>

            <div className="resume-skills">
              <span>C++</span>
              <span>DSA</span>
              <span>OOP</span>
              <span>SQL</span>
              <span>HTML</span>
              <span>CSS</span>
              <span>JavaScript</span>
              <span>React</span>
            </div>

            <button className="add-button">+ Add Skill</button>
          </div>

          <div className="form-card">
            <div className="form-title">
              <div className="form-icon">🚀</div>
              <div>
                <h2>Projects</h2>
                <p>Showcase your best projects.</p>
              </div>
            </div>

            <div className="input-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="AI Career Mentor"
              />
            </div>

            <div className="input-group">
              <label>Project Description</label>
              <textarea
                rows="3"
                placeholder="Describe your project..."
              ></textarea>
            </div>

            <button className="add-button">
              + Add Project
            </button>
          </div>
        </div>

        {/* PREVIEW */}

        <div className="resume-preview">
          <div className="preview-header">
            <h2>Resume Preview</h2>
            <span>Live Preview</span>
          </div>

          <div className="resume-paper">
            <div className="paper-header">
              <h1>Prachi Saubhage</h1>
              <h3>Software Developer</h3>
              <p>
                your@email.com &nbsp; | &nbsp; +91 XXXXX XXXXX
              </p>
            </div>

            <div className="paper-section">
              <h2>PROFILE</h2>
              <p>
                Motivated computer science student passionate about software
                development, problem solving and building useful technology.
              </p>
            </div>

            <div className="paper-section">
              <h2>EDUCATION</h2>
              <h3>Your College Name</h3>
              <p>B.Tech / B.E. • 2027</p>
            </div>

            <div className="paper-section">
              <h2>SKILLS</h2>
              <div className="paper-skills">
                <span>C++</span>
                <span>DSA</span>
                <span>OOP</span>
                <span>SQL</span>
                <span>React</span>
                <span>JavaScript</span>
              </div>
            </div>

            <div className="paper-section">
              <h2>PROJECTS</h2>
              <h3>AI Career Mentor</h3>
              <p>
                AI-powered platform designed to provide personalized career
                guidance and learning recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;