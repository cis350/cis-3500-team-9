/**
 * Utility functions for testing.
 */
const testUser = {
    email: 'testemail@example.com',
    username: 'testuser',
    password: 'testpassword',
    name: 'Test User',
};

/**
 * Add a test data to the database.
 * @param {*} db - The database. 
 * @param {*} testData - The test user data.
 */
const insertTestUserToDB = async (db, testData)  => {
    const result = await db.collection('users').insertOne(testData);
    return result.insertedId;
};

/**
 * Remove a test data from the database.
 * @param {*} db 
 * @param {*} testData 
 */
const deleteTestUserFromDB = async (db, testData) => {
    try {
        const result = await db.collection('users').deleteOne({ email: testData.email });
        const { deleteCount }  = result;
        if (deleteCount === 1) {
            console.log('info', 'Successfully deleted test user from the database');
        } else {
            console.log('warning', 'Test user not deleted in the database');
        }
    } catch (err) {
        console.log('error', err.message);
    }
};

/**
 * Utility function to check if a value is in an array.
 * 
 * @param {*} arr 
 * @param {*} val 
 * @returns 
 */
const isInArray = (arr, val) => {
    let value = false;
    arr.map((x) => {
        if (String(x.id) === String(val)) {
            value = true;
        }
    });
    return value;
}

// export the functions
module.exports = {
    testUser,
    insertTestUserToDB,
    deleteTestUserFromDB,
    isInArray,
}