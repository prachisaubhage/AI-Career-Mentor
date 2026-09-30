import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-container">

          {/* LEFT SIDE */}
          <div className="login-left">
            <div className="brand">
              <div className="brand-icon">✦</div>
              <span>AI Career Mentor</span>
            </div>

            <div className="login-content">
              <p className="small-title">YOUR CAREER, YOUR FUTURE</p>

              <h1>
                Build your
                <br />
                <span>Dream Career</span>
              </h1>

              <p className="description">
                Get personalized career guidance, skill recommendations,
                job opportunities and a roadmap designed especially for you.
              </p>

              <div className="features">
                <div className="feature">
                  <div className="feature-icon">✓</div>
                  <span>Personalized Career Roadmap</span>
                </div>

                <div className="feature">
                  <div className="feature-icon">✓</div>
                  <span>AI-Powered Skill Analysis</span>
                </div>

                <div className="feature">
                  <div className="feature-icon">✓</div>
                  <span>Smart Job Recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="login-right">
            <div className="login-card">

              <div className="mobile-brand">
                <div className="brand-icon">✦</div>
                <span>AI Career Mentor</span>
              </div>

              <h2>Welcome Back!</h2>

              <p className="login-subtitle">
                Sign in to continue your career journey.
              </p>

              <form onSubmit={handleLogin}>

                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="password-label">
                    <label>Password</label>
                    <a href="#forgot">Forgot Password?</a>
                  </div>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="remember">
                  <label>
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                </div>

                <button className="login-button" type="submit">
                  Login
                  <span>→</span>
                </button>

              </form>

              <div className="divider">
                <span>OR</span>
              </div>

              <button
                className="demo-button"
                onClick={() => setIsLoggedIn(true)}
              >
                Continue with Demo
              </button>

              <p className="signup-text">
                Don't have an account?
                <a href="#signup"> Create Account</a>
              </p>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // DASHBOARD PAGE
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">✦</div>
          <div>
            <strong>AI Career</strong>
            <span>MENTOR</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN MENU
          </div>

          <button className="nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>◎</span>
            My Profile
          </button>

          <button className="nav-item">
            <span>◈</span>
            Skill Analysis
          </button>

          <button className="nav-item">
            <span>◆</span>
            Career Roadmap
          </button>

          <button className="nav-item">
            <span>▣</span>
            Job Recommendations
          </button>

          <button className="nav-item">
            <span>▤</span>
            Resume Builder
          </button>

          <div className="nav-section-title">
            SUPPORT
          </div>

          <button className="nav-item">
            <span>?</span>
            Help & Support
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">P</div>
            <div>
              <strong>Prachi</strong>
              <span>Student</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <h1>Good Morning, Prachi! 👋</h1>
            <p>Let's take another step toward your dream career.</p>
          </div>

          <div className="topbar-right">

            <button className="notification">
              🔔
              <span></span>
            </button>

            <div className="profile-top">
              <div className="avatar">P</div>
              <div>
                <strong>Prachi</strong>
                <small>Computer Engineering</small>
              </div>
            </div>

          </div>

        </header>

        {/* WELCOME BANNER */}
        <section className="welcome-banner">

          <div className="welcome-text">
            <p>YOUR CAREER JOURNEY</p>

            <h2>
              You're on the right track! 🚀
            </h2>

            <p>
              Complete your profile and skill assessment to get
              better AI-powered career recommendations.
            </p>

            <button className="primary-button">
              Complete Profile →
            </button>
          </div>

          <div className="welcome-graphic">
            <div className="rocket">🚀</div>
            <div className="circle circle-one"></div>
            <div className="circle circle-two"></div>
          </div>

        </section>

        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">◎</div>
            <div>
              <span>Profile Completion</span>
              <h3>75%</h3>
            </div>
            <div className="progress-mini">
              <div style={{ width: "75%" }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">◆</div>
            <div>
              <span>Skills Assessed</span>
              <h3>12</h3>
            </div>
            <p className="positive">+3 this week</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">▣</div>
            <div>
              <span>Job Matches</span>
              <h3>24</h3>
            </div>
            <p className="positive">+8 new</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">★</div>
            <div>
              <span>Career Score</span>
              <h3>82/100</h3>
            </div>
            <p className="positive">Excellent</p>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="dashboard-grid">

          {/* CAREER PROGRESS */}
          <div className="dashboard-card career-progress">

            <div className="card-header">
              <div>
                <h3>Career Progress</h3>
                <p>Your journey towards becoming a software developer.</p>
              </div>

              <button className="view-button">
                View Roadmap
              </button>
            </div>

            <div className="roadmap">

              <div className="roadmap-item completed">
                <div className="roadmap-dot">✓</div>
                <div>
                  <strong>Profile Setup</strong>
                  <p>Completed</p>
                </div>
              </div>

              <div className="roadmap-line completed-line"></div>

              <div className="roadmap-item completed">
                <div className="roadmap-dot">✓</div>
                <div>
                  <strong>Skill Assessment</strong>
                  <p>Completed</p>
                </div>
              </div>

              <div className="roadmap-line"></div>

              <div className="roadmap-item current">
                <div className="roadmap-dot">3</div>
                <div>
                  <strong>Build Your Skills</strong>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="roadmap-line"></div>

              <div className="roadmap-item">
                <div className="roadmap-dot">4</div>
                <div>
                  <strong>Apply for Jobs</strong>
                  <p>Upcoming</p>
                </div>
              </div>

            </div>

          </div>

          {/* SKILLS */}
          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h3>Top Skills</h3>
                <p>Your current skill levels.</p>
              </div>

              <button className="view-button">
                View All
              </button>
            </div>

            <div className="skill-list">

              <div className="skill">
                <div className="skill-info">
                  <span>Java</span>
                  <strong>85%</strong>
                </div>
                <div className="skill-bar">
                  <div style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-info">
                  <span>SQL</span>
                  <strong>78%</strong>
                </div>
                <div className="skill-bar">
                  <div style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-info">
                  <span>DSA</span>
                  <strong>72%</strong>
                </div>
                <div className="skill-bar">
                  <div style={{ width: "72%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-info">
                  <span>Communication</span>
                  <strong>65%</strong>
                </div>
                <div className="skill-bar">
                  <div style={{ width: "65%" }}></div>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* JOB RECOMMENDATIONS */}
        <section className="dashboard-card jobs-card">

          <div className="card-header">

            <div>
              <h3>Recommended Jobs</h3>
              <p>Opportunities matching your skills and career goals.</p>
            </div>

            <button className="view-button">
              View All Jobs →
            </button>

          </div>

          <div className="job-list">

            <div className="job-item">

              <div className="company-logo">
                T
              </div>

              <div className="job-info">
                <h4>Software Engineering Intern</h4>
                <p>Technology Company • Pune</p>
                <div className="job-tags">
                  <span>Java</span>
                  <span>SQL</span>
                  <span>DSA</span>
                </div>
              </div>

              <div className="match">
                <strong>94%</strong>
                <span>Match</span>
              </div>

              <button className="apply-button">
                View Job
              </button>

            </div>

            <div className="job-item">

              <div className="company-logo">
                D
              </div>

              <div className="job-info">
                <h4>Graduate Software Developer</h4>
                <p>Financial Services • Mumbai</p>
                <div className="job-tags">
                  <span>Java</span>
                  <span>OOP</span>
                  <span>SQL</span>
                </div>
              </div>

              <div className="match">
                <strong>89%</strong>
                <span>Match</span>
              </div>

              <button className="apply-button">
                View Job
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;