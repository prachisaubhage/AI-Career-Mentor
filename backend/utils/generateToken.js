const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token for authenticated user
 * @param {string} userId - Mongoose user _id string
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'career_mentor_jwt_dev_secret_key_change_in_prod';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
