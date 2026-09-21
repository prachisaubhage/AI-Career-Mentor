/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate mobile number: exactly 10 digits, starts with 6, 7, 8, or 9
 * @param {string} mobile
 * @returns {boolean}
 */
const isValidMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return false;
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.trim());
};

/**
 * Validate password strength (minimum 6 characters)
 * @param {string} password
 * @returns {boolean}
 */
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Sanitize email: lowercase and trimmed
 * @param {string} email
 * @returns {string}
 */
const sanitizeEmail = (email) => {
  return email ? email.trim().toLowerCase() : '';
};

module.exports = {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  sanitizeEmail,
};
