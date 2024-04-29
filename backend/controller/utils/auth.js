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
const { getUserByUName, verifyPassword } = require('../../model/users');

/**
 * Create a JWT containing the username
 * @param {*} userid
 * @returns the token
 */
const authenticateUser = (username) => {
  try {
    const token = jwt.sign({ username }, process.env.KEY, { expiresIn: '120s' });
    console.log('token', token);
    return token;
  } catch (err) {
    console.log('error', err.message);
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
    console.log('payload', decoded);
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
      console.log('error', err.message);
      return 1;
    }
    // invalid token
    console.log('error', err.message);
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
      console.log('User not found');
      return 2;
    }
    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid) {
      console.log('Invalid password')
      return 2;
    }
    return 0;
  } catch (err) {
    console.log('error', err.message);
    return 3;
  }
};

module.exports = { authenticateUser, verifyUser, verifyUserCredentials };