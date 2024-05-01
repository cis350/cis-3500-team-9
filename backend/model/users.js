const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, getDB, getUsers } = require('./dbUtils');

/**
 *
 * @param {*} newUser
 * @returns
 */
const addUser = async (newUser) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').insertOne(newUser);
    // print the id of the user
    console.log(`New user created with id: ${result.insertedId}`);
    // return the result
    return result.insertedId;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

/**
   *
   * @returns
   */
const getAllUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').find({}).toArray();
    // print the results
    console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

/**
 * GET/READ a user given their username
 * @param {string} username - The username of the user to fetch
 * @returns {Object|null} - The user document from the database or null if not found
 */
const getUserByUName = async (username) => {
  try {
    const db = await getDB(); // Assumes getDB() is a function that connects to your MongoDB database
    const result = await db.collection('users').findOne({ username: username }); // Query the database for a user with the specified username
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    return null;
  }
};

// UPDATE a user given their ID
const updateUser = async (userID, newUName) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: ObjectId(userID) },
      { $set: { username: newUName } },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// DELETE a user given their ID
const deleteUser = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').deleteOne(
      { _id: ObjectId(userID) },
    );
      // print the result
    console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

/**
 * Verify a user's password against the hashed password in the database.
 * @param {object} user - The user object from the database which includes the hashed password.
 * @param {string} password - The plain text password entered by the user.
 * @returns {boolean} true if the password matches, false otherwise.
 */
const verifyPassword = async (user, password) => {
  try {
    return password == user.password; // Compare the plaintext password with the hashed password
  } catch (err) {
    console.log('error verifying password', err.message);
    return false;
  }
};

/**
 * Retrieves the user's schedule from the database.
 * @param {string} userID - The MongoDB ObjectId string of the user.
 * @returns {Array|null} An array of ISO string dates representing the user's availability, or null if no user is found.
 */
const getUserSchedule = async (userID) => {
  try {
    const db = await getDB(); // Assuming getDB is a function that returns a connected MongoDB client
    const result = await db.collection('users').findOne(
      { _id: new ObjectId(userID) }, // Convert string ID to ObjectId
      { projection: { availability: 1, _id: 0 } } // Only fetch the 'availability' field
    );
    return result ? result.availability : null; // Return the availability array if the user is found, otherwise null
  } catch (err) {
    console.error(`Error retrieving user schedule: ${err.message}`);
    throw err; // Rethrowing the error may be handled or logged at a higher level in your application
  }
};

/**
 * Updates the user's schedule in the database.
 * @param {string} userID - The MongoDB ObjectId string of the user.
 * @param {Array} schedule - An array of ISO string dates representing the user's availability.
 * @returns The result of the MongoDB update operation.
 */
 const updateUserSchedule = async (userID, schedule) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userID) }, // Convert string ID to ObjectId
      { $set: { availability: schedule } } // Set the 'availability' field
    );
    return result;
  } catch (err) {
    console.error(`Error updating user schedule: ${err.message}`);
    throw err;
  }
};

async function main() {
  
}

main();
// export the functions
module.exports = {
  addUser,
  getAllUsers,
  getUserByUName,
  updateUser,
  deleteUser,
  verifyPassword,
  getUserSchedule,
  updateUserSchedule
};