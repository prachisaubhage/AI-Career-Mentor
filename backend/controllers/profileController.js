const User = require('../models/User');

/**
 * @desc    Get current user profile
 * @route   GET /api/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const {
      fullName,
      college,
      branch,
      semester,
      cgpa,
      backlogs,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      technicalSkills,
      dsaCoding,
      sqlDbms,
      aptitude,
      communication,
      targetRole,
      careerGoal,
    } = req.body;

    // Preserve existing info and update fields if provided in request
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (semester !== undefined) user.semester = semester;
    if (cgpa !== undefined) user.cgpa = cgpa;
    if (backlogs !== undefined) user.backlogs = backlogs;
    if (tenthPercentage !== undefined) user.tenthPercentage = tenthPercentage;
    if (twelfthPercentage !== undefined) user.twelfthPercentage = twelfthPercentage;
    if (diplomaPercentage !== undefined) user.diplomaPercentage = diplomaPercentage;
    if (technicalSkills !== undefined) user.technicalSkills = technicalSkills;
    if (dsaCoding !== undefined) user.dsaCoding = Number(dsaCoding) || 0;
    if (sqlDbms !== undefined) user.sqlDbms = Number(sqlDbms) || 0;
    if (aptitude !== undefined) user.aptitude = Number(aptitude) || 0;
    if (communication !== undefined) user.communication = Number(communication) || 0;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (careerGoal !== undefined) user.careerGoal = careerGoal;

    user.profileLastUpdated = Date.now();

    const updatedUser = await user.save();

    // Exclude password in response
    const profileResponse = updatedUser.toObject();
    delete profileResponse.password;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: profileResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
