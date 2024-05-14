/**
 * This module contains authentication and session functions
 *
 * Errors codes:  1 expired token, 2 invalid user,
 *          3 invalid token
 */

// import JWT
const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

// import DB function
const { getUserByUName, getUserIDByUName, verifyPassword } = require('../../model/users');

/**
 * Create a JWT containing the username
 * @param {*} userid
 * @returns the token
 */
const authenticateUser = (username) => {
  try {
    const token = jwt.sign({ username }, process.env.KEY, { expiresIn: '20m' });
    return token;
  } catch (err) {
  }
};

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns 0 if the user is valid, the appropriate status code
 */
const verifyUser = async (token) => {
  try {
    // decoded contains the paylod of the token
    const decoded = jwt.verify(token, process.env.KEY);
    // check that the payload contains a valid user
    const user = await getUserByUName(decoded.username);
    if (!user) {
      // user is undefined
      return 2;
    }
    return 0; // user verified - success
  } catch (err) {
    // expired token
    if (err.name === 'TokenExpiredError') {
      return 1;
    }
    // invalid token
    return 3;
  }
};

/**
 * Check user credentials against the database
 * @param {string} username - the username entered by the user
 * @param {string} password - the passwod entered by the user
 * @returns 0 if the user is valid, the appropriate status code
 */
const verifyUserCredentials = async (username, password) => {
  try {
    const user = await getUserByUName(username);
    if (!user) {
      return 2;
    }
    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid) {
      return 2;
    }
    return 0;
  } catch (err) {
    return 3;
  }
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.username = decoded.username; // Attach the username from the token to the request object
    const userId = await getUserIDByUName(req.username); // Assuming getUserByUName returns the user's _id as a string
    if (!userId) {
      return res.status(404).send('User not found.');
    }
    req.userId = userId; // Attach the user ID to the request object
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).send('Invalid or expired token.');
    }
    return res.status(500).send('Internal server error.');
  }
};

module.exports = { authenticateUser, verifyUser, verifyUserCredentials, authenticateToken };