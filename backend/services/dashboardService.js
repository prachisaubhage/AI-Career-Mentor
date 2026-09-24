const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Internship = require('../models/Internship');
const Achievement = require('../models/Achievement');
const CodingAttempt = require('../models/CodingAttempt');
const AptitudeAttempt = require('../models/AptitudeAttempt');

/**
 * Dynamically calculate profile completion percentage based on real user data
 * @param {Object} user - User document
 * @param {Object} counts - { projectCount, certificationCount, internshipCount, achievementCount }
 * @returns {number} Profile completion percentage (0 - 100)
 */
const calculateProfileCompletion = (user, counts) => {
  let score = 0;

  // 1. Personal Information (15%)
  if (user.fullName && user.fullName.trim()) score += 5;
  if (user.email && user.email.trim()) score += 5;
  if (user.mobile && user.mobile.trim()) score += 5;

  // 2. Academic Information (20%)
  if (user.college && user.college.trim()) score += 4;
  if (user.branch && user.branch.trim()) score += 4;
  if (user.semester && user.semester.trim()) score += 4;
  if (user.cgpa && user.cgpa.trim()) score += 4;
  if (
    (user.tenthPercentage && user.tenthPercentage.trim()) ||
    (user.twelfthPercentage && user.twelfthPercentage.trim()) ||
    (user.diplomaPercentage && user.diplomaPercentage.trim())
  ) {
    score += 4;
  }

  // 3. Technical Skills (15%)
  if (user.technicalSkills && user.technicalSkills.trim()) score += 7;
  const hasSkillRatings =
    (user.dsaCoding && user.dsaCoding > 0) ||
    (user.sqlDbms && user.sqlDbms > 0) ||
    (user.aptitude && user.aptitude > 0) ||
    (user.communication && user.communication > 0);
  if (hasSkillRatings) score += 8;

  // 4. Career Goal & Target Role (10%)
  if (user.targetRole && user.targetRole.trim()) score += 5;
  if (user.careerGoal && user.careerGoal.trim()) score += 5;

  // 5. Projects (10%)
  if (counts.projectCount > 0) score += 10;

  // 6. Certifications (10%)
  if (counts.certificationCount > 0) score += 10;

  // 7. Internships (10%)
  if (counts.internshipCount > 0) score += 10;

  // 8. Achievements (5%)
  if (counts.achievementCount > 0) score += 5;

  // 9. Resume Uploaded (5%)
  if (user.resume && (user.resume.filename || user.resume.fileUrl)) score += 5;

  return Math.min(100, Math.round(score));
};

/**
 * Fetch and calculate Coding statistics for user
 * @param {ObjectId} userId
 * @returns {Object}
 */
const getCodingStatsForUser = async (userId) => {
  const attempts = await CodingAttempt.find({ userId });
  if (!attempts || attempts.length === 0) {
    return {
      solved: 0,
      attempted: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };
  }

  const solvedSet = new Set();
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  // Track distinct questions solved per difficulty
  for (const att of attempts) {
    if (att.correct && !solvedSet.has(att.questionId)) {
      solvedSet.add(att.questionId);
      const diff = (att.difficulty || '').toLowerCase();
      if (diff === 'easy') easySolved++;
      else if (diff === 'medium') mediumSolved++;
      else if (diff === 'hard') hardSolved++;
      else easySolved++;
    }
  }

  return {
    solved: solvedSet.size,
    attempted: attempts.length,
    easy: easySolved,
    medium: mediumSolved,
    hard: hardSolved,
  };
};

/**
 * Fetch and calculate Aptitude statistics for user
 * @param {ObjectId} userId
 * @returns {Object}
 */
const getAptitudeStatsForUser = async (userId) => {
  const attempts = await AptitudeAttempt.find({ userId });
  if (!attempts || attempts.length === 0) {
    return {
      attempted: 0,
      completed: 0,
      correct: 0,
      incorrect: 0,
      score: 0,
      average: 0,
    };
  }

  const attempted = attempts.length;
  let correct = 0;
  let totalScore = 0;

  for (const att of attempts) {
    if (att.correct) correct++;
    totalScore += att.score || 0;
  }

  const incorrect = attempted - correct;
  const average = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return {
    attempted,
    completed: attempted,
    correct,
    incorrect,
    score: totalScore,
    average,
  };
};

/**
 * Fetch complete dashboard metrics for user
 * @param {Object} user - User document
 * @returns {Object}
 */
const getDashboardMetrics = async (user) => {
  const userId = user._id;

  // Fetch real counts from collections
  const [
    projectCount,
    certificationCount,
    internshipCount,
    achievementCount,
    codingStats,
    aptitudeStats,
  ] = await Promise.all([
    Project.countDocuments({ userId }),
    Certification.countDocuments({ userId }),
    Internship.countDocuments({ userId }),
    Achievement.countDocuments({ userId }),
    getCodingStatsForUser(userId),
    getAptitudeStatsForUser(userId),
  ]);

  const counts = {
    projectCount,
    certificationCount,
    internshipCount,
    achievementCount,
  };

  const profileCompletion = calculateProfileCompletion(user, counts);

  return {
    fullName: user.fullName || '',
    projectCount,
    certificationCount,
    internshipCount,
    achievementCount,
    codingStats,
    aptitudeStats,
    profileCompletion,
    semester: user.semester || '',
    cgpa: user.cgpa || '',
    backlogs: user.backlogs || '0',
    targetRole: user.targetRole || '',
  };
};

module.exports = {
  calculateProfileCompletion,
  getCodingStatsForUser,
  getAptitudeStatsForUser,
  getDashboardMetrics,
};
