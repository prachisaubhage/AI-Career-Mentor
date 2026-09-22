const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sanitizeEmail } = require('../utils/validators');

/**
 * @desc    Register / Signup a new user
 * @route   POST /api/auth/register or POST /api/auth/signup
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const rawName = req.body.fullName || req.body.name || '';
    const { email, mobile, password } = req.body;
    const sanitizedEmail = sanitizeEmail(email);
    const trimmedMobile = (mobile || '').trim();
    const finalName = rawName.trim();

    console.log('Signup request received');
    console.log(`Email received: ${sanitizedEmail}`);

    console.log('Checking existing user');
    // Check if email already exists
    const existingUserEmail = await User.findOne({ email: sanitizedEmail });
    if (existingUserEmail) {
      console.log(`Email already exists: ${sanitizedEmail}`);
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Check if mobile already exists only if mobile is provided
    if (trimmedMobile) {
      const existingUserMobile = await User.findOne({ mobile: trimmedMobile });
      if (existingUserMobile) {
        return res.status(409).json({
          success: false,
          message: 'An account with this mobile number already exists',
        });
      }
    }

    console.log('Creating user');
    const userData = {
      fullName: finalName,
      name: finalName,
      email: sanitizedEmail,
      password, // Password hashed automatically via userSchema pre-save hook
    };

    if (trimmedMobile) {
      userData.mobile = trimmedMobile;
    }

    const user = new User(userData);

    await user.save();
    console.log('User saved successfully');
    console.log(`User ID: ${user._id}`);

    const token = generateToken(user._id);

    // Return user without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      college: user.college || '',
      branch: user.branch || '',
      semester: user.semester || '',
      targetRole: user.targetRole || '',
      createdAt: user.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = sanitizeEmail(email);

    console.log(`Login request received for email: ${sanitizedEmail}`);

    // Explicitly select password to compare
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    // Return user without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName || user.name,
      name: user.name || user.fullName,
      email: user.email,
      mobile: user.mobile || '',
      college: user.college || '',
      branch: user.branch || '',
      semester: user.semester || '',
      targetRole: user.targetRole || '',
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (client destroys token)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
