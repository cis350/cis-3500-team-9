const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, getDB, getUsers } = require('./dbUtils');

/**
 * GET/READ a plan given its name
 * @param {string} planName - The name of the plan to fetch
 * @returns {Object|null} - The user document from the database or null if not found
 */
const getPlanByName = async (planName) => {
    try {
      const db = await getDB(); // Assumes getDB() is a function that connects to your MongoDB database
      const result = await db.collection('plans').findOne({ name: planName });
      return result;
    } catch (err) {}
  };

const createPlan = async (newPlan) => {
  try {
    const db = await getDB();
    const result = await db.collection('plans').insertOne(newPlan);
    return result;
  } catch (err) {}
};

async function main() {
  
}

main();
// export the functions
module.exports = {
  getPlanByName,
  createPlan
};