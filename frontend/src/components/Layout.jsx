import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, getInitials, logoutUser } from "../utils/auth";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = getCurrentUser();
  const studentFullName =
    user.fullName && user.fullName.trim() ? user.fullName.trim() : "Student";
  const initials = getInitials(studentFullName);

  const menuItem = ({ isActive }) =>
    `menu-item ${isActive ? "active" : ""}`;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="app-layout">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">AI</div>

          <div>
            <h2>Career Mentor</h2>
            <span>Intelligent Placement</span>
          </div>
        </div>

        <div className="menu-section">
          <p className="menu-title">MAIN</p>

          <NavLink to="/dashboard" className={menuItem}>
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink to="/profile" className={menuItem}>
            <span>◉</span>
            My Profile
          </NavLink>
        </div>

        <div className="menu-section">
          <p className="menu-title">AI ANALYSIS</p>

          <NavLink to="/prediction" className={menuItem}>
            <span>◈</span>
            Placement Prediction
          </NavLink>

          <NavLink to="/skill-gap" className={menuItem}>
            <span>◌</span>
            Skill Gap Analysis
          </NavLink>

          <NavLink to="/career-roadmap" className={menuItem}>
            <span>→</span>
            Career Roadmap
          </NavLink>
        </div>

        <div className="menu-section">
          <p className="menu-title">BASE PAPER MODULES</p>

          <NavLink to="/aptitude" className={menuItem}>
            <span>✓</span>
            Aptitude Practice
          </NavLink>

          <NavLink to="/coding" className={menuItem}>
            <span>&lt;/&gt;</span>
            Coding Practice
          </NavLink>

          <NavLink to="/resume" className={menuItem}>
            <span>▤</span>
            Resume Analyzer
          </NavLink>
        </div>

        <div className="menu-section">
          <p className="menu-title">TRACKING</p>

          <NavLink to="/analytics" className={menuItem}>
            <span>▥</span>
            Progress Analytics
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <div className="prototype-badge">
            <span></span>
            AI Mentor Active
          </div>

          <button
            className="logout-btn"
            id="sidebar-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </aside>

      <main className="main-content">
        {/* ================= UPPER-RIGHT CORNER STUDENT NAME ================= */}
        <div className="top-header-bar">
          <div className="top-header-status">
            <span className="status-indicator"></span>
            AI Career Mentor Platform
          </div>

          <div className="top-user-profile" id="top-user-profile">
            <div className="top-user-avatar">{initials}</div>
            <div className="top-user-details">
              <span className="top-user-name" id="authenticated-student-name">
                {studentFullName}
              </span>
              <span className="top-user-role">Student</span>
            </div>
          </div>
        </div>

        {children}
      </main>

    </div>
  );
}

export default Layout;