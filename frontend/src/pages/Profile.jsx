import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getCurrentUser,
  getCurrentUserEmail,
  saveProfile,
  getProjects,
  saveProjects,
  getCertifications,
  saveCertifications,
  getInternships,
  saveInternships,
  getAchievements,
  saveAchievements,
  getResume,
  saveResume,
  removeResume,
  calcProfileCompletion,
} from "../utils/auth";
import "./Profile.css";

// ============================================================
// UTILITY: generate unique id for records
// ============================================================
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ============================================================
// MAIN PROFILE COMPONENT
// ============================================================
function Profile() {
  const navigate = useNavigate();
  const currentUserEmail = getCurrentUserEmail();

  // ---- Basic profile form fields ----
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("careerMentorProfile");
    const user = getCurrentUser();
    let initial = {
      fullName: "",
      name: "",
      email: "",
      semester: "",
      cgpa: "",
      backlogs: "0",
      aptitude: "",
      coding: "",
      sql: "",
      communication: "",
      targetRole: "",
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const studentFullName = parsed.fullName || parsed.name || "";
        return {
          ...initial,
          ...parsed,
          fullName: studentFullName,
          name: studentFullName,
        };
      } catch (e) {
        console.error(e);
      }
    }

    if (user) {
      const uName = user.fullName || user.name || "";
      if (uName && uName !== "Student") {
        initial.fullName = uName;
        initial.name = uName;
      }
      if (user.email) initial.email = user.email;
    }

    return initial;
  });

  // ---- Per-user record arrays ----
  const [projects, setProjects] = useState(() => getProjects(currentUserEmail));
  const [certifications, setCertifications] = useState(() => getCertifications(currentUserEmail));
  const [internships, setInternships] = useState(() => getInternships(currentUserEmail));
  const [achievements, setAchievements] = useState(() => getAchievements(currentUserEmail));
  const [resume, setResume] = useState(() => getResume(currentUserEmail));

  // ---- UI state ----
  const [message, setMessage] = useState("");

  // Modal state for each section
  const [projectModal, setProjectModal] = useState({ open: false, mode: "add", record: null });
  const [certModal, setCertModal] = useState({ open: false, mode: "add", record: null });
  const [internshipModal, setInternshipModal] = useState({ open: false, mode: "add", record: null });
  const [achievementModal, setAchievementModal] = useState({ open: false, mode: "add", record: null });

  // View modal state
  const [viewModal, setViewModal] = useState({ open: false, type: "", record: null });

  // Profile completion (dynamic)
  const profileCompletion = calcProfileCompletion(
    profile, projects, certifications, internships, achievements, resume
  );

  // ---- Handlers ----

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "fullName") updated.name = value;
      else if (name === "name") updated.fullName = value;
      return updated;
    });
  }

  function handleSaveAndContinue(e) {
    if (e) e.preventDefault();
    const studentFullName = (profile.fullName || profile.name || "").trim();
    if (!studentFullName || !profile.email) {
      setMessage("Please enter your full name and email before continuing.");
      return;
    }
    const updatedProfile = { ...profile, fullName: studentFullName, name: studentFullName };
    saveProfile(updatedProfile);
    setMessage("Profile saved successfully! Proceeding to Dashboard...");
    setTimeout(() => navigate("/dashboard"), 300);
  }

  // ---- RESUME ----

  function handleResumeChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: evt.target.result,
      };
      saveResume(currentUserEmail, resumeData);
      setResume(resumeData);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveResume() {
    removeResume(currentUserEmail);
    setResume(null);
  }

  // ---- PROJECTS ----

  function openAddProject() {
    setProjectModal({ open: true, mode: "add", record: null });
  }
  function openEditProject(record) {
    setProjectModal({ open: true, mode: "edit", record });
  }
  function openViewProject(record) {
    setViewModal({ open: true, type: "project", record });
  }
  function deleteProject(id) {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(currentUserEmail, updated);
  }
  function handleSaveProject(data) {
    let updated;
    if (projectModal.mode === "add") {
      updated = [...projects, { ...data, id: genId() }];
    } else {
      updated = projects.map((p) => (p.id === data.id ? data : p));
    }
    setProjects(updated);
    saveProjects(currentUserEmail, updated);
    setProjectModal({ open: false, mode: "add", record: null });
  }

  // ---- CERTIFICATIONS ----

  function openAddCert() {
    setCertModal({ open: true, mode: "add", record: null });
  }
  function openEditCert(record) {
    setCertModal({ open: true, mode: "edit", record });
  }
  function openViewCert(record) {
    setViewModal({ open: true, type: "cert", record });
  }
  function deleteCert(id) {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    saveCertifications(currentUserEmail, updated);
  }
  function handleSaveCert(data) {
    let updated;
    if (certModal.mode === "add") {
      updated = [...certifications, { ...data, id: genId() }];
    } else {
      updated = certifications.map((c) => (c.id === data.id ? data : c));
    }
    setCertifications(updated);
    saveCertifications(currentUserEmail, updated);
    setCertModal({ open: false, mode: "add", record: null });
  }

  // ---- INTERNSHIPS ----

  function openAddInternship() {
    setInternshipModal({ open: true, mode: "add", record: null });
  }
  function openEditInternship(record) {
    setInternshipModal({ open: true, mode: "edit", record });
  }
  function openViewInternship(record) {
    setViewModal({ open: true, type: "internship", record });
  }
  function deleteInternship(id) {
    const updated = internships.filter((i) => i.id !== id);
    setInternships(updated);
    saveInternships(currentUserEmail, updated);
  }
  function handleSaveInternship(data) {
    let updated;
    if (internshipModal.mode === "add") {
      updated = [...internships, { ...data, id: genId() }];
    } else {
      updated = internships.map((i) => (i.id === data.id ? data : i));
    }
    setInternships(updated);
    saveInternships(currentUserEmail, updated);
    setInternshipModal({ open: false, mode: "add", record: null });
  }

  // ---- ACHIEVEMENTS ----

  function openAddAchievement() {
    setAchievementModal({ open: true, mode: "add", record: null });
  }
  function openEditAchievement(record) {
    setAchievementModal({ open: true, mode: "edit", record });
  }
  function openViewAchievement(record) {
    setViewModal({ open: true, type: "achievement", record });
  }
  function deleteAchievement(id) {
    const updated = achievements.filter((a) => a.id !== id);
    setAchievements(updated);
    saveAchievements(currentUserEmail, updated);
  }
  function handleSaveAchievement(data) {
    let updated;
    if (achievementModal.mode === "add") {
      updated = [...achievements, { ...data, id: genId() }];
    } else {
      updated = achievements.map((a) => (a.id === data.id ? data : a));
    }
    setAchievements(updated);
    saveAchievements(currentUserEmail, updated);
    setAchievementModal({ open: false, mode: "add", record: null });
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Layout>

      {/* ================= HEADER ================= */}

      <div className="profile-header">

        <div>
          <p className="profile-eyebrow">STUDENT PROFILE</p>
          <h1>Build Your Career Profile</h1>
          <p>
            Enter your academic, technical and career information
            to generate a personalized placement analysis.
          </p>
        </div>

        <div className="profile-header-right">
          <div className="profile-completion-badge">
            <span className="completion-pct">{profileCompletion}%</span>
            <span className="completion-label">Profile Complete</span>
            <div className="completion-bar">
              <div style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
          <div className="profile-status">
            <span className="status-dot"></span>
            AI Mentor Active
          </div>
        </div>

      </div>


      {/* ================= BASIC INFORMATION ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">01</span>
            <div>
              <h2>Basic Information</h2>
              <p>Basic details used to create your student profile.</p>
            </div>
          </div>
        </div>

        <div className="profile-form-grid">

          <FormField
            label="Full Name"
            name="fullName"
            value={profile.fullName || profile.name || ""}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

        </div>
      </div>


      {/* ================= ACADEMIC INFORMATION ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">02</span>
            <div>
              <h2>Academic Information</h2>
              <p>Academic information used by the proposed prediction system.</p>
            </div>
          </div>
        </div>

        <div className="profile-form-grid">

          <div className="form-field">
            <label htmlFor="semester">Current Semester</label>
            <select
              id="semester"
              name="semester"
              value={profile.semester || "Semester 6"}
              onChange={handleChange}
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </div>

          <FormField
            label="Current CGPA"
            name="cgpa"
            type="number"
            value={profile.cgpa}
            onChange={handleChange}
            placeholder="Example: 8.2"
            min="0"
            max="10"
            step="0.1"
          />

          <FormField
            label="Number of Backlogs"
            name="backlogs"
            type="number"
            value={profile.backlogs}
            onChange={handleChange}
            placeholder="Example: 0"
            min="0"
          />

        </div>
      </div>


      {/* ================= SKILL ASSESSMENT ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">03</span>
            <div>
              <h2>Skill Assessment</h2>
              <p>Enter your current preparation level from 0–100.</p>
            </div>
          </div>
        </div>

        <div className="profile-form-grid">

          <FormField
            label="DSA / Coding Score"
            name="coding"
            type="number"
            value={profile.coding}
            onChange={handleChange}
            placeholder="Example: 65"
            min="0"
            max="100"
          />

          <FormField
            label="SQL / DBMS Score"
            name="sql"
            type="number"
            value={profile.sql}
            onChange={handleChange}
            placeholder="Example: 55"
            min="0"
            max="100"
          />

          <FormField
            label="Aptitude Score"
            name="aptitude"
            type="number"
            value={profile.aptitude}
            onChange={handleChange}
            placeholder="Example: 70"
            min="0"
            max="100"
          />

          <FormField
            label="Communication Score"
            name="communication"
            type="number"
            value={profile.communication}
            onChange={handleChange}
            placeholder="Example: 75"
            min="0"
            max="100"
          />

        </div>

        {/* Score Range Guide */}
        <div className="skill-score-guide">
          <div className="skill-score-guide-header">
            <h4>Score Range Guide</h4>
            <span>Self-assessment reference</span>
          </div>
          <div className="skill-score-guide-table-wrapper">
            <table className="skill-score-guide-table">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>0–20</strong></td>
                  <td>Beginner / almost no knowledge</td>
                </tr>
                <tr>
                  <td><strong>21–40</strong></td>
                  <td>Basic knowledge</td>
                </tr>
                <tr>
                  <td><strong>41–60</strong></td>
                  <td>Intermediate</td>
                </tr>
                <tr>
                  <td><strong>61–80</strong></td>
                  <td>Good</td>
                </tr>
                <tr>
                  <td><strong>81–100</strong></td>
                  <td>Strong / advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* ================= CAREER GOAL ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">04</span>
            <div>
              <h2>Career Goal</h2>
              <p>Select the role you want to prepare for.</p>
            </div>
          </div>
        </div>

        <div className="profile-form-grid single-column">
          <div className="form-field">
            <label>Target Career Role</label>
            <select
              name="targetRole"
              value={profile.targetRole}
              onChange={handleChange}
            >
              <option value="Software Developer">Software Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Web Developer">Web Developer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
              <option value="Software Testing">Software Testing</option>
            </select>
          </div>
        </div>
      </div>


      {/* ================= PROJECTS ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">05</span>
            <div>
              <h2>Projects</h2>
              <p>
                Add your projects with details, tech stack, links and files.
                Each project record counts as one project.
              </p>
            </div>
          </div>
          <button
            className="records-add-btn"
            id="add-project-btn"
            onClick={openAddProject}
          >
            + Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="records-empty">
            <span>📁</span>
            <p>No projects added yet. Click <strong>+ Add Project</strong> to add your first project.</p>
          </div>
        ) : (
          <div className="records-list">
            {projects.map((proj) => (
              <RecordCard
                key={proj.id}
                title={proj.name}
                subtitle={proj.technologies}
                meta={proj.completionDate ? `Completed: ${proj.completionDate}` : ""}
                filesCount={(proj.files || []).length}
                onView={() => openViewProject(proj)}
                onEdit={() => openEditProject(proj)}
                onDelete={() => deleteProject(proj.id)}
                accentColor="#6366f1"
              />
            ))}
          </div>
        )}
      </div>


      {/* ================= CERTIFICATIONS ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">06</span>
            <div>
              <h2>Certifications</h2>
              <p>
                Add your certifications with issuer, date, credential ID
                and optional certificate file. Each certification = one record.
              </p>
            </div>
          </div>
          <button
            className="records-add-btn"
            id="add-cert-btn"
            onClick={openAddCert}
          >
            + Add Certification
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="records-empty">
            <span>🏅</span>
            <p>No certifications added yet. Click <strong>+ Add Certification</strong> to add one.</p>
          </div>
        ) : (
          <div className="records-list">
            {certifications.map((cert) => (
              <RecordCard
                key={cert.id}
                title={cert.name}
                subtitle={cert.issuer}
                meta={cert.issueDate ? `Issued: ${cert.issueDate}` : ""}
                filesCount={cert.file ? 1 : 0}
                onView={() => openViewCert(cert)}
                onEdit={() => openEditCert(cert)}
                onDelete={() => deleteCert(cert.id)}
                accentColor="#10b981"
              />
            ))}
          </div>
        )}
      </div>


      {/* ================= INTERNSHIPS ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">07</span>
            <div>
              <h2>Internships</h2>
              <p>
                Add internship experiences with role, company, duration and
                optional documents. Each internship = one record.
              </p>
            </div>
          </div>
          <button
            className="records-add-btn"
            id="add-internship-btn"
            onClick={openAddInternship}
          >
            + Add Internship
          </button>
        </div>

        {internships.length === 0 ? (
          <div className="records-empty">
            <span>💼</span>
            <p>No internships added yet. Click <strong>+ Add Internship</strong> to add one.</p>
          </div>
        ) : (
          <div className="records-list">
            {internships.map((intern) => (
              <RecordCard
                key={intern.id}
                title={`${intern.role} @ ${intern.company}`}
                subtitle={intern.domain}
                meta={intern.duration || (intern.startDate ? `${intern.startDate} – ${intern.endDate || "Present"}` : "")}
                filesCount={(intern.files || []).length}
                onView={() => openViewInternship(intern)}
                onEdit={() => openEditInternship(intern)}
                onDelete={() => deleteInternship(intern.id)}
                accentColor="#f59e0b"
              />
            ))}
          </div>
        )}
      </div>


      {/* ================= ACHIEVEMENTS ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">08</span>
            <div>
              <h2>Achievements</h2>
              <p>
                Add awards, competitions, recognitions and other achievements.
                Each achievement = one record.
              </p>
            </div>
          </div>
          <button
            className="records-add-btn"
            id="add-achievement-btn"
            onClick={openAddAchievement}
          >
            + Add Achievement
          </button>
        </div>

        {achievements.length === 0 ? (
          <div className="records-empty">
            <span>🏆</span>
            <p>No achievements added yet. Click <strong>+ Add Achievement</strong> to add one.</p>
          </div>
        ) : (
          <div className="records-list">
            {achievements.map((ach) => (
              <RecordCard
                key={ach.id}
                title={ach.title}
                subtitle={ach.type}
                meta={ach.date ? `Date: ${ach.date}` : ""}
                filesCount={ach.file ? 1 : 0}
                onView={() => openViewAchievement(ach)}
                onEdit={() => openEditAchievement(ach)}
                onDelete={() => deleteAchievement(ach.id)}
                accentColor="#ec4899"
              />
            ))}
          </div>
        )}
      </div>


      {/* ================= RESUME ================= */}

      <div className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="section-number">09</span>
            <div>
              <h2>Resume</h2>
              <p>
                Upload your resume (PDF, DOC, DOCX). You can replace or remove it at any time.
              </p>
            </div>
          </div>
        </div>

        {resume ? (
          <div className="resume-uploaded-state">
            <div className="resume-file-info">
              <div className="resume-file-icon">📄</div>
              <div>
                <strong>{resume.name}</strong>
                <p>{(resume.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="resume-actions">
              <label className="upload-button" htmlFor="resume-replace-input">
                Replace
                <input
                  id="resume-replace-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </label>
              <button
                className="resume-remove-btn"
                onClick={handleRemoveResume}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="resume-upload">
            <div className="upload-icon">↑</div>
            <div>
              <strong>Upload your resume</strong>
              <p>PDF, DOC or DOCX format</p>
            </div>
            <label className="upload-button" htmlFor="resume-upload-input">
              Choose File
              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </label>
          </div>
        )}
      </div>


      {/* ================= SAVE & CONTINUE ================= */}

      <div className="profile-submit">
        <div>
          <h3>Ready to view your career dashboard?</h3>
          <p>
            Save your profile details to update your placement readiness and
            personalized career roadmap.
          </p>
        </div>
        <button
          className="analyze-button save-continue-btn"
          id="save-continue-btn"
          onClick={handleSaveAndContinue}
        >
          Save &amp; Continue →
        </button>
      </div>


      {message && (
        <div className="profile-message">{message}</div>
      )}


      {/* ================= MODALS ================= */}

      {projectModal.open && (
        <ProjectModal
          mode={projectModal.mode}
          initial={projectModal.record}
          onSave={handleSaveProject}
          onClose={() => setProjectModal({ open: false, mode: "add", record: null })}
        />
      )}

      {certModal.open && (
        <CertModal
          mode={certModal.mode}
          initial={certModal.record}
          onSave={handleSaveCert}
          onClose={() => setCertModal({ open: false, mode: "add", record: null })}
        />
      )}

      {internshipModal.open && (
        <InternshipModal
          mode={internshipModal.mode}
          initial={internshipModal.record}
          onSave={handleSaveInternship}
          onClose={() => setInternshipModal({ open: false, mode: "add", record: null })}
        />
      )}

      {achievementModal.open && (
        <AchievementModal
          mode={achievementModal.mode}
          initial={achievementModal.record}
          onSave={handleSaveAchievement}
          onClose={() => setAchievementModal({ open: false, mode: "add", record: null })}
        />
      )}

      {viewModal.open && (
        <ViewModal
          type={viewModal.type}
          record={viewModal.record}
          onClose={() => setViewModal({ open: false, type: "", record: null })}
        />
      )}

    </Layout>
  );
}


// ============================================================
// FORM FIELD (reusable)
// ============================================================
function FormField({ label, name, type = "text", value, onChange, placeholder, min, max, step }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}


// ============================================================
// RECORD CARD (Projects / Certs / Internships / Achievements)
// ============================================================
function RecordCard({ title, subtitle, meta, filesCount, onView, onEdit, onDelete, accentColor }) {
  return (
    <div className="record-card" style={{ borderLeftColor: accentColor }}>
      <div className="record-card-info">
        <strong className="record-card-title">{title}</strong>
        {subtitle && <span className="record-card-sub">{subtitle}</span>}
        {meta && <span className="record-card-meta">{meta}</span>}
        {filesCount > 0 && (
          <span className="record-card-files">📎 {filesCount} file{filesCount > 1 ? "s" : ""} attached</span>
        )}
      </div>
      <div className="record-card-actions">
        <button className="rec-btn rec-btn-view" onClick={onView}>View</button>
        <button className="rec-btn rec-btn-edit" onClick={onEdit}>Edit</button>
        <button className="rec-btn rec-btn-delete" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}


// ============================================================
// MODAL WRAPPER
// ============================================================
function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// FILE UPLOAD AREA (generic, multi-file)
// ============================================================
function FileUploadArea({ label, files, onFilesChange, accept, multiple = false }) {
  const inputRef = useRef();

  function handleFileInput(e) {
    const selectedFiles = Array.from(e.target.files);
    const fileMetas = selectedFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    if (multiple) {
      onFilesChange([...(files || []), ...fileMetas]);
    } else {
      onFilesChange(fileMetas.length > 0 ? fileMetas[0] : null);
    }
    // reset so same file can be selected again
    e.target.value = "";
  }

  function removeFile(idx) {
    if (multiple) {
      onFilesChange(files.filter((_, i) => i !== idx));
    } else {
      onFilesChange(null);
    }
  }

  const fileList = multiple ? (files || []) : (files ? [files] : []);

  return (
    <div className="form-field file-upload-field">
      <label>{label}</label>
      <div className="file-drop-area">
        <button
          type="button"
          className="file-choose-btn"
          onClick={() => inputRef.current.click()}
        >
          📎 Choose {multiple ? "Files" : "File"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
        {fileList.length > 0 ? (
          <div className="file-list">
            {fileList.map((f, i) => (
              <div key={i} className="file-tag">
                <span>📄 {f.name}</span>
                <button type="button" onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
          </div>
        ) : (
          <span className="file-placeholder">No file chosen</span>
        )}
      </div>
    </div>
  );
}


// ============================================================
// PROJECT MODAL
// ============================================================
function ProjectModal({ mode, initial, onSave, onClose }) {
  const empty = {
    id: "",
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    completionDate: "",
    files: [],
  };

  const [form, setForm] = useState(() =>
    initial ? { ...empty, ...initial } : empty
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <ModalWrapper
      title={mode === "add" ? "Add Project" : "Edit Project"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-grid">
          <div className="form-field">
            <label>Project Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. E-Commerce Website" required />
          </div>
          <div className="form-field">
            <label>Technologies / Tech Stack</label>
            <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" />
          </div>
          <div className="form-field modal-full-col">
            <label>Project Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe the project..." rows={3} />
          </div>
          <div className="form-field">
            <label>GitHub URL</label>
            <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
          </div>
          <div className="form-field">
            <label>Live Project URL</label>
            <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-field">
            <label>Completion Date</label>
            <input name="completionDate" type="date" value={form.completionDate} onChange={handleChange} />
          </div>
          <div className="form-field modal-full-col">
            <FileUploadArea
              label="Project Files (Report PDF, PPT, ZIP, Images, etc.)"
              files={form.files}
              onFilesChange={(files) => setForm((prev) => ({ ...prev, files }))}
              accept=".pdf,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.doc,.docx"
              multiple
            />
            <p className="file-upload-note">
              All uploaded files belong to this single project record. Total files attached ≠ number of projects.
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">
            {mode === "add" ? "Add Project" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}


// ============================================================
// CERTIFICATION MODAL
// ============================================================
function CertModal({ mode, initial, onSave, onClose }) {
  const empty = {
    id: "",
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    file: null,
  };

  const [form, setForm] = useState(() =>
    initial ? { ...empty, ...initial } : empty
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <ModalWrapper
      title={mode === "add" ? "Add Certification" : "Edit Certification"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-grid">
          <div className="form-field">
            <label>Certification Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Python for Everybody" required />
          </div>
          <div className="form-field">
            <label>Issuing Organization / Platform</label>
            <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="e.g. Coursera, Udemy, NPTEL" />
          </div>
          <div className="form-field">
            <label>Issue Date</label>
            <input name="issueDate" type="date" value={form.issueDate} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Credential ID</label>
            <input name="credentialId" value={form.credentialId} onChange={handleChange} placeholder="e.g. ABC-12345" />
          </div>
          <div className="form-field modal-full-col">
            <label>Credential URL</label>
            <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-field modal-full-col">
            <FileUploadArea
              label="Upload Certificate (PDF, JPG, JPEG, PNG)"
              files={form.file}
              onFilesChange={(file) => setForm((prev) => ({ ...prev, file }))}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
            />
            <p className="file-upload-note">
              Uploading a certificate file does NOT create a new certification. It belongs to this record only.
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">
            {mode === "add" ? "Add Certification" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}


// ============================================================
// INTERNSHIP MODAL
// ============================================================
function InternshipModal({ mode, initial, onSave, onClose }) {
  const empty = {
    id: "",
    company: "",
    role: "",
    domain: "",
    startDate: "",
    endDate: "",
    duration: "",
    description: "",
    skills: "",
    files: [],
  };

  const [form, setForm] = useState(() =>
    initial ? { ...empty, ...initial } : empty
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave(form);
  }

  return (
    <ModalWrapper
      title={mode === "add" ? "Add Internship" : "Edit Internship"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-grid">
          <div className="form-field">
            <label>Company Name *</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. TCS, Infosys, Startup" required />
          </div>
          <div className="form-field">
            <label>Role / Position *</label>
            <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Software Engineer Intern" required />
          </div>
          <div className="form-field">
            <label>Domain</label>
            <input name="domain" value={form.domain} onChange={handleChange} placeholder="e.g. Web Development, Data Science" />
          </div>
          <div className="form-field">
            <label>Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months, 6 weeks" />
          </div>
          <div className="form-field">
            <label>Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          </div>
          <div className="form-field modal-full-col">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe your responsibilities and work..." rows={3} />
          </div>
          <div className="form-field modal-full-col">
            <label>Skills Learned</label>
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. React, REST APIs, Agile" />
          </div>
          <div className="form-field modal-full-col">
            <FileUploadArea
              label="Internship Documents (Certificate, Offer Letter, Completion Letter, etc.)"
              files={form.files}
              onFilesChange={(files) => setForm((prev) => ({ ...prev, files }))}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
            />
            <p className="file-upload-note">
              All uploaded documents belong to this internship record only. They do not count as separate internships.
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">
            {mode === "add" ? "Add Internship" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}


// ============================================================
// ACHIEVEMENT MODAL
// ============================================================
function AchievementModal({ mode, initial, onSave, onClose }) {
  const empty = {
    id: "",
    title: "",
    description: "",
    date: "",
    type: "",
    file: null,
  };

  const [form, setForm] = useState(() =>
    initial ? { ...empty, ...initial } : empty
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  }

  return (
    <ModalWrapper
      title={mode === "add" ? "Add Achievement" : "Edit Achievement"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-grid">
          <div className="form-field">
            <label>Achievement Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 1st Place Hackathon, Merit Scholarship" required />
          </div>
          <div className="form-field">
            <label>Type / Category</label>
            <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. Award, Competition, Scholarship" />
          </div>
          <div className="form-field">
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-field modal-full-col">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the achievement..." rows={3} />
          </div>
          <div className="form-field modal-full-col">
            <FileUploadArea
              label="Achievement Document / Certificate (optional)"
              files={form.file}
              onFilesChange={(file) => setForm((prev) => ({ ...prev, file }))}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">
            {mode === "add" ? "Add Achievement" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}


// ============================================================
// VIEW MODAL (read-only detail view)
// ============================================================
function ViewModal({ type, record, onClose }) {
  const r = record || {};

  const title =
    type === "project" ? r.name :
    type === "cert" ? r.name :
    type === "internship" ? `${r.role} @ ${r.company}` :
    type === "achievement" ? r.title :
    "Detail";

  return (
    <ModalWrapper title={title} onClose={onClose}>
      <div className="view-modal-content">
        {type === "project" && (
          <>
            {r.technologies && <ViewRow label="Technologies" value={r.technologies} />}
            {r.completionDate && <ViewRow label="Completion Date" value={r.completionDate} />}
            {r.githubUrl && <ViewRow label="GitHub URL" value={r.githubUrl} link />}
            {r.liveUrl && <ViewRow label="Live URL" value={r.liveUrl} link />}
            {r.description && <ViewRow label="Description" value={r.description} />}
            {(r.files || []).length > 0 && (
              <div className="view-files">
                <strong>Attached Files:</strong>
                {r.files.map((f, i) => (
                  <div key={i} className="file-tag"><span>📄 {f.name}</span></div>
                ))}
              </div>
            )}
          </>
        )}

        {type === "cert" && (
          <>
            {r.issuer && <ViewRow label="Issuer" value={r.issuer} />}
            {r.issueDate && <ViewRow label="Issue Date" value={r.issueDate} />}
            {r.credentialId && <ViewRow label="Credential ID" value={r.credentialId} />}
            {r.credentialUrl && <ViewRow label="Credential URL" value={r.credentialUrl} link />}
            {r.file && (
              <div className="view-files">
                <strong>Certificate File:</strong>
                <div className="file-tag"><span>📄 {r.file.name}</span></div>
              </div>
            )}
          </>
        )}

        {type === "internship" && (
          <>
            {r.domain && <ViewRow label="Domain" value={r.domain} />}
            {r.duration && <ViewRow label="Duration" value={r.duration} />}
            {r.startDate && <ViewRow label="Start Date" value={r.startDate} />}
            {r.endDate && <ViewRow label="End Date" value={r.endDate} />}
            {r.skills && <ViewRow label="Skills Learned" value={r.skills} />}
            {r.description && <ViewRow label="Description" value={r.description} />}
            {(r.files || []).length > 0 && (
              <div className="view-files">
                <strong>Attached Documents:</strong>
                {r.files.map((f, i) => (
                  <div key={i} className="file-tag"><span>📄 {f.name}</span></div>
                ))}
              </div>
            )}
          </>
        )}

        {type === "achievement" && (
          <>
            {r.type && <ViewRow label="Type" value={r.type} />}
            {r.date && <ViewRow label="Date" value={r.date} />}
            {r.description && <ViewRow label="Description" value={r.description} />}
            {r.file && (
              <div className="view-files">
                <strong>Document:</strong>
                <div className="file-tag"><span>📄 {r.file.name}</span></div>
              </div>
            )}
          </>
        )}
      </div>
    </ModalWrapper>
  );
}

function ViewRow({ label, value, link }) {
  return (
    <div className="view-row">
      <span className="view-label">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noreferrer" className="view-link">{value}</a>
      ) : (
        <span className="view-value">{value}</span>
      )}
    </div>
  );
}


export default Profile;