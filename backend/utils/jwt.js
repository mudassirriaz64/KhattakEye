const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_ask_projects';

/**
 * Signs a JWT.
 * @param {object} payload 
 * @param {string} audience - 'customer' or 'admin'
 * @param {string} expiresIn - duration (default '7d')
 * @returns {string}
 */
const signToken = (payload, audience, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, {
    audience,
    expiresIn
  });
};

/**
 * Verifies a JWT.
 * @param {string} token 
 * @param {string} audience - 'customer' or 'admin'
 * @returns {object} payload
 */
const verifyToken = (token, audience) => {
  return jwt.verify(token, JWT_SECRET, {
    audience
  });
};

module.exports = {
  signToken,
  verifyToken
};
