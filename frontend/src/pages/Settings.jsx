import React, { useState } from "react";
import { getCurrentUser, getInitials } from "../utils/auth";
import "./Settings.css";

function Settings() {
  const [user] = useState(() => getCurrentUser());
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const studentName = user.name && user.name.trim() ? user.name.trim() : "Student";
  const studentEmail = user.email || "student@example.com";
  const initials = getInitials(studentName);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      {/* Page Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>

        <div className="settings-profile">
          <div className="settings-avatar">{initials}</div>
          <div>
            <h3>{studentName}</h3>
            <span>Student</span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="settings-card">
        <div className="card-title">
          <div className="card-icon">👤</div>
          <div>
            <h2>Account Settings</h2>
            <p>Update your personal information.</p>
          </div>
        </div>

        <div className="settings-form">

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              defaultValue={studentName}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              defaultValue={studentEmail}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Career Goal</label>
            <select defaultValue="Software Developer">
              <option>Software Developer</option>
              <option>Web Developer</option>
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>AI / ML Engineer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Education</label>
            <input
              type="text"
              defaultValue="Computer Engineering Student"
              placeholder="Enter your education"
            />
          </div>

        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">

        <div className="card-title">
          <div className="card-icon">🔔</div>
          <div>
            <h2>Notifications</h2>
            <p>Choose how you want to receive updates.</p>
          </div>
        </div>

        <div className="setting-option">
          <div>
            <h3>Push Notifications</h3>
            <p>Receive important career updates and reminders.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-option">
          <div>
            <h3>Email Updates</h3>
            <p>Receive job opportunities and career recommendations.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={() => setEmailUpdates(!emailUpdates)}
            />
            <span className="slider"></span>
          </label>
        </div>

      </div>

      {/* Appearance */}
      <div className="settings-card">

        <div className="card-title">
          <div className="card-icon">🎨</div>
          <div>
            <h2>Appearance</h2>
            <p>Customize how your Career Mentor looks.</p>
          </div>
        </div>

        <div className="setting-option">
          <div>
            <h3>Dark Mode</h3>
            <p>Switch between light and dark appearance.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

      </div>

      {/* Security */}
      <div className="settings-card">

        <div className="card-title">
          <div className="card-icon">🔒</div>
          <div>
            <h2>Security</h2>
            <p>Manage your account security.</p>
          </div>
        </div>

        <div className="security-row">
          <div>
            <h3>Password</h3>
            <p>Last updated recently</p>
          </div>

          <button className="secondary-btn">
            Change Password
          </button>
        </div>

      </div>

      {/* Save Button */}
      <div className="save-section">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

    </div>
  );
}

export default Settings;