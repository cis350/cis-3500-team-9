const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, getDB } = require('./dbUtils');

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
   * GET/READ a user given their ID
   * @param {*} userID
   * @returns
   */
const getUser = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userID) });
    // print the result
    console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
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
  getUser,
  updateUser,
  deleteUser,
  updateUserSchedule,
};