// =======================================================
// AI CAREER MENTOR - AUTH & USER STORAGE UTILITY
// =======================================================

import { API_ENDPOINTS } from "./api";

const SEED_USERS = {
  "prachisaubhage07@gmail.com": {
    fullName: "Prachi Saubhage",
    name: "Prachi Saubhage",
    email: "prachisaubhage07@gmail.com",
    password: "password123",
    profile: {
      fullName: "Prachi Saubhage",
      name: "Prachi Saubhage",
      email: "prachisaubhage07@gmail.com",
      semester: "Semester 6",
      cgpa: "8.4",
      backlogs: "0",
      coding: "75",
      sql: "70",
      aptitude: "80",
      communication: "85",
      targetRole: "Software Developer",
    },
  },
  "prachi@example.com": {
    fullName: "Prachi Saubhage",
    name: "Prachi Saubhage",
    email: "prachi@example.com",
    password: "password123",
    profile: {
      fullName: "Prachi Saubhage",
      name: "Prachi Saubhage",
      email: "prachi@example.com",
      semester: "Semester 6",
      cgpa: "8.4",
      backlogs: "0",
      coding: "75",
      sql: "70",
      aptitude: "80",
      communication: "85",
      targetRole: "Software Developer",
    },
  },
  "rahul123@gmail.com": {
    fullName: "Rahul Sharma",
    name: "Rahul Sharma",
    email: "rahul123@gmail.com",
    password: "password123",
    profile: {
      fullName: "Rahul Sharma",
      name: "Rahul Sharma",
      email: "rahul123@gmail.com",
      semester: "Semester 4",
      cgpa: "7.9",
      backlogs: "0",
      coding: "68",
      sql: "62",
      aptitude: "74",
      communication: "78",
      targetRole: "Data Analyst",
    },
  },
  "rahul@example.com": {
    fullName: "Rahul Sharma",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    profile: {
      fullName: "Rahul Sharma",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      semester: "Semester 4",
      cgpa: "7.9",
      backlogs: "0",
      coding: "68",
      sql: "62",
      aptitude: "74",
      communication: "78",
      targetRole: "Data Analyst",
    },
  },
};

// =======================================================
// USER REGISTRY HELPERS
// =======================================================

/**
 * Retrieve all registered users from localStorage, initializing seed users if empty.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem("careerMentorUsers");
    if (!data) {
      localStorage.setItem("careerMentorUsers", JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(data);
    const merged = { ...SEED_USERS, ...parsed };
    return merged;
  } catch (err) {
    console.error("Error reading users:", err);
    return SEED_USERS;
  }
}

/**
 * Save users map to localStorage
 */
export function saveUsers(users) {
  try {
    localStorage.setItem("careerMentorUsers", JSON.stringify(users));
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

// =======================================================
// SESSION HELPERS
// =======================================================

/**
 * Check if a session is currently active
 */
export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

/**
 * Get the currently authenticated student's email (used as the storage key)
 */
export function getCurrentUserEmail() {
  try {
    const userStr = localStorage.getItem("careerMentorCurrentUser");
    if (userStr) {
      const u = JSON.parse(userStr);
      return (u.email || "").trim().toLowerCase();
    }
  } catch (err) {
    console.error("Error reading current user email:", err);
  }
  return "";
}

/**
 * Get the currently authenticated student's identity.
 * Prioritizes student's actual Full Name. Never returns email as display name.
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("careerMentorCurrentUser");
    if (userStr) {
      const u = JSON.parse(userStr);
      const studentFullName = u.fullName || u.name || "";
      if (studentFullName && studentFullName !== "Student") {
        return {
          fullName: studentFullName,
          name: studentFullName,
          email: u.email || "",
        };
      }
    }

    const profileStr = localStorage.getItem("careerMentorProfile");
    if (profileStr) {
      const p = JSON.parse(profileStr);
      const studentFullName = p.fullName || p.name || "";
      if (studentFullName && studentFullName !== "Student") {
        return {
          fullName: studentFullName,
          name: studentFullName,
          email: p.email || "",
        };
      }
    }
  } catch (err) {
    console.error("Error reading current user:", err);
  }
  return { fullName: "Student", name: "Student", email: "" };
}

/**
 * Get initials from a student's full name
 */
export function getInitials(name) {
  if (!name || typeof name !== "string" || name === "Student") return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

// =======================================================
// AUTH ACTIONS
// =======================================================

/**
 * Log in an existing student (calls backend API, persists session)
 */
export async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("careerMentorToken", data.token);

      const studentFullName =
        (data.user && (data.user.fullName || data.user.name)) || "Student";

      const users = getUsers();
      let user = users[normalizedEmail];
      let profile =
        (user && user.profile) || buildEmptyProfile(studentFullName, normalizedEmail);

      users[normalizedEmail] = {
        fullName: studentFullName,
        name: studentFullName,
        email: normalizedEmail,
        password,
        profile,
      };
      saveUsers(users);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "careerMentorCurrentUser",
        JSON.stringify({
          fullName: studentFullName,
          name: studentFullName,
          email: normalizedEmail,
        })
      );
      localStorage.setItem("careerMentorProfile", JSON.stringify(profile));

      return {
        fullName: studentFullName,
        name: studentFullName,
        email: normalizedEmail,
        profile,
        token: data.token,
      };
    } else {
      // Check if it matches a local seed user before rejecting
      const users = getUsers();
      const localUser = users[normalizedEmail];
      if (localUser && localUser.password === password) {
        const studentFullName = localUser.fullName || localUser.name || "Student";
        const profile = localUser.profile || buildEmptyProfile(studentFullName, normalizedEmail);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "careerMentorCurrentUser",
          JSON.stringify({
            fullName: studentFullName,
            name: studentFullName,
            email: normalizedEmail,
          })
        );
        localStorage.setItem("careerMentorProfile", JSON.stringify(profile));

        return {
          fullName: studentFullName,
          name: studentFullName,
          email: normalizedEmail,
          profile,
        };
      }
      throw new Error(data.message || "Invalid email or password");
    }
  } catch (err) {
    // If backend was unreachable, allow local demo user
    const users = getUsers();
    const localUser = users[normalizedEmail];
    if (localUser && localUser.password === password) {
      const studentFullName = localUser.fullName || localUser.name || "Student";
      const profile = localUser.profile || buildEmptyProfile(studentFullName, normalizedEmail);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "careerMentorCurrentUser",
        JSON.stringify({
          fullName: studentFullName,
          name: studentFullName,
          email: normalizedEmail,
        })
      );
      localStorage.setItem("careerMentorProfile", JSON.stringify(profile));

      return {
        fullName: studentFullName,
        name: studentFullName,
        email: normalizedEmail,
        profile,
      };
    }
    console.error("Login error:", err.message);
    throw err;
  }
}

/**
 * Sign up a new student (POSTs to backend /api/auth/signup, creates user in MongoDB Atlas)
 */
export async function registerUser(fullName, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const studentFullName = fullName.trim();

  // Send registration request to backend API
  const response = await fetch(API_ENDPOINTS.SIGNUP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: studentFullName,
      fullName: studentFullName,
      email: normalizedEmail,
      password: password.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || "Registration failed. Please try again.";
    console.error("Backend signup error:", errorMsg);
    throw new Error(errorMsg);
  }

  // Store JWT token
  if (data.token) {
    localStorage.setItem("careerMentorToken", data.token);
  }

  const users = getUsers();
  const newProfile = buildEmptyProfile(studentFullName, normalizedEmail);

  users[normalizedEmail] = {
    fullName: studentFullName,
    name: studentFullName,
    email: normalizedEmail,
    password,
    profile: newProfile,
  };

  saveUsers(users);

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem(
    "careerMentorCurrentUser",
    JSON.stringify({
      fullName: studentFullName,
      name: studentFullName,
      email: normalizedEmail,
    })
  );
  localStorage.setItem("careerMentorProfile", JSON.stringify(newProfile));

  return {
    fullName: studentFullName,
    name: studentFullName,
    email: normalizedEmail,
    profile: newProfile,
    token: data.token,
  };
}

/**
 * Update the student profile and persist to user registry
 */
export function saveProfile(profile) {
  const studentFullName = (profile.fullName || profile.name || "").trim();
  const sanitizedProfile = {
    ...profile,
    fullName: studentFullName,
    name: studentFullName,
  };

  localStorage.setItem(
    "careerMentorProfile",
    JSON.stringify(sanitizedProfile)
  );

  if (studentFullName || sanitizedProfile.email) {
    const updatedUser = {
      fullName: studentFullName || "Student",
      name: studentFullName || "Student",
      email: sanitizedProfile.email || "",
    };
    localStorage.setItem(
      "careerMentorCurrentUser",
      JSON.stringify(updatedUser)
    );

    if (sanitizedProfile.email) {
      const users = getUsers();
      const normalizedEmail = sanitizedProfile.email.trim().toLowerCase();
      if (!users[normalizedEmail]) {
        users[normalizedEmail] = {
          fullName: studentFullName,
          name: studentFullName,
          email: sanitizedProfile.email,
        };
      }
      users[normalizedEmail].fullName = studentFullName;
      users[normalizedEmail].name = studentFullName;
      users[normalizedEmail].profile = sanitizedProfile;
      saveUsers(users);
    }
  }
}

/**
 * Log out active student
 */
export function logoutUser() {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("careerMentorCurrentUser");
  localStorage.removeItem("careerMentorProfile");
}

// =======================================================
// PER-USER DATA STORAGE (Projects, Certifications, etc.)
// Each dataset is keyed by the user's email address.
// =======================================================

/**
 * Build a storage key namespaced to the current user's email.
 */
function userKey(email, suffix) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  return `careerMentor:${normalizedEmail}:${suffix}`;
}

// ---- PROJECTS ----

/**
 * Get the list of projects for the current user.
 * Returns an empty array for brand-new users.
 */
export function getProjects(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "projects"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects:", err);
  }
  return [];
}

/**
 * Save the full list of projects for the current user.
 */
export function saveProjects(email, projects) {
  try {
    localStorage.setItem(userKey(email, "projects"), JSON.stringify(projects));
  } catch (err) {
    console.error("Error saving projects:", err);
  }
}

// ---- CERTIFICATIONS ----

/**
 * Get the list of certifications for the current user.
 */
export function getCertifications(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "certifications"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading certifications:", err);
  }
  return [];
}

/**
 * Save the full list of certifications for the current user.
 */
export function saveCertifications(email, certs) {
  try {
    localStorage.setItem(userKey(email, "certifications"), JSON.stringify(certs));
  } catch (err) {
    console.error("Error saving certifications:", err);
  }
}

// ---- INTERNSHIPS ----

/**
 * Get the list of internships for the current user.
 */
export function getInternships(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "internships"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading internships:", err);
  }
  return [];
}

/**
 * Save the full list of internships for the current user.
 */
export function saveInternships(email, internships) {
  try {
    localStorage.setItem(userKey(email, "internships"), JSON.stringify(internships));
  } catch (err) {
    console.error("Error saving internships:", err);
  }
}

// ---- ACHIEVEMENTS ----

/**
 * Get the list of achievements for the current user.
 */
export function getAchievements(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "achievements"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading achievements:", err);
  }
  return [];
}

/**
 * Save the full list of achievements for the current user.
 */
export function saveAchievements(email, achievements) {
  try {
    localStorage.setItem(userKey(email, "achievements"), JSON.stringify(achievements));
  } catch (err) {
    console.error("Error saving achievements:", err);
  }
}

// ---- RESUME ----

/**
 * Get the resume metadata for the current user.
 * Returns null if no resume uploaded.
 */
export function getResume(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "resume"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading resume:", err);
  }
  return null;
}

/**
 * Save resume metadata (name, size, type, dataUrl) for the current user.
 */
export function saveResume(email, resumeData) {
  try {
    localStorage.setItem(userKey(email, "resume"), JSON.stringify(resumeData));
  } catch (err) {
    console.error("Error saving resume:", err);
  }
}

/**
 * Remove resume for the current user.
 */
export function removeResume(email) {
  try {
    localStorage.removeItem(userKey(email, "resume"));
  } catch (err) {
    console.error("Error removing resume:", err);
  }
}

// ---- CODING STATS ----

/**
 * Get coding stats for the current user.
 * New users start at zero.
 */
export function getCodingStats(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "codingStats"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading coding stats:", err);
  }
  // Default: brand-new user starts at zero
  return {
    solved: 0,
    attempted: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    attempts: [],
  };
}

/**
 * Save coding stats for the current user.
 */
export function saveCodingStats(email, stats) {
  try {
    localStorage.setItem(userKey(email, "codingStats"), JSON.stringify(stats));
  } catch (err) {
    console.error("Error saving coding stats:", err);
  }
}

// ---- APTITUDE STATS ----

/**
 * Get aptitude stats for the current user.
 * New users start at zero.
 */
export function getAptitudeStats(email) {
  try {
    const raw = localStorage.getItem(userKey(email, "aptitudeStats"));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading aptitude stats:", err);
  }
  // Default: brand-new user starts at zero
  return {
    attempted: 0,
    completed: 0,
    correct: 0,
    incorrect: 0,
    score: 0,
    average: 0,
    attempts: [],
  };
}

/**
 * Save aptitude stats for the current user.
 */
export function saveAptitudeStats(email, stats) {
  try {
    localStorage.setItem(userKey(email, "aptitudeStats"), JSON.stringify(stats));
  } catch (err) {
    console.error("Error saving aptitude stats:", err);
  }
}

// =======================================================
// PROFILE COMPLETION CALCULATOR
// Calculates a dynamic percentage based on what the user
// has actually filled in. Does NOT use hardcoded values.
// =======================================================

/**
 * Calculate profile completion percentage dynamically.
 * @param {object} profile  - The profile form fields
 * @param {Array}  projects - Array of project records
 * @param {Array}  certs    - Array of certification records
 * @param {Array}  internships - Array of internship records
 * @param {Array}  achievements - Array of achievement records
 * @param {object|null} resume - Resume metadata or null
 * @returns {number} 0–100
 */
export function calcProfileCompletion(profile, projects, certs, internships, achievements, resume) {
  const sections = [
    // 1. Personal info: fullName + email
    !!(profile.fullName || profile.name) && !!profile.email,
    // 2. Academic info: semester + cgpa
    !!profile.semester && !!profile.cgpa,
    // 3. Skills: at least 2 of the 4 skill fields filled
    [profile.coding, profile.sql, profile.aptitude, profile.communication].filter(Boolean).length >= 2,
    // 4. Career goal
    !!profile.targetRole,
    // 5. Projects: at least 1 real project record
    projects.length > 0,
    // 6. Certifications: at least 1
    certs.length > 0,
    // 7. Internships: at least 1
    internships.length > 0,
    // 8. Achievements: at least 1
    achievements.length > 0,
    // 9. Resume uploaded
    !!resume,
  ];

  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
}

// =======================================================
// INTERNAL HELPERS
// =======================================================

function buildEmptyProfile(fullName, email) {
  return {
    fullName: fullName || "",
    name: fullName || "",
    email: email || "",
    semester: "",
    cgpa: "",
    backlogs: "0",
    coding: "",
    sql: "",
    aptitude: "",
    communication: "",
    targetRole: "",
  };
}
