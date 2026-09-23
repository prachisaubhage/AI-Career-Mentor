const { isValidEmail, isValidMobile, isValidPassword } = require('../utils/validators');

/**
 * Middleware to validate registration body
 */
const validateRegister = (req, res, next) => {
  const nameValue = req.body.fullName || req.body.name;
  const { email, password, confirmPassword, mobile } = req.body;

  if (!nameValue || typeof nameValue !== 'string' || !nameValue.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Name is required',
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required',
    });
  }

  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  if (confirmPassword !== undefined && confirmPassword !== password) {
    return res.status(400).json({
      success: false,
      message: 'Password confirmation does not match password',
    });
  }

  if (mobile && !isValidMobile(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9',
    });
  }

  next();
};

/**
 * Middleware to validate login body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
