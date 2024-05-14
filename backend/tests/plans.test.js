// const request = require('supertest');
// const webapp = require('../controller/server');
// const { closeMongoDBConnection, connect } = require('../model/dbUtils');
// const { testUser, insertTestDataToDB, deleteTestDataFromDB } = require('./testUtils');

// describe('individual user - uploading plan tests', () => {
//   let mongo; // local mongo connection
//   let db; // database instance
//   let testUserId; // ID of the test user
//   let token; // authentication token

//   beforeAll(async () => {
//     // connect to the db
//     mongo = await connect();
//     db = mongo.db();

//     // insert test user into the database
//     testUserId = await insertTestDataToDB(db, testUser);

//     // log the user in and get the token
//     const response = await request(webapp).post('/login').send(`username=${testUser.username}&password=${testUser.password}`);
//     token = response.body.apptoken; // assuming the token is returned in the body as apptoken
//   });

//   afterAll(async () => {
//     // clean up the test user from the database
//     await deleteTestDataFromDB(db, testUser.username);
    
//     // close database connections
//     await mongo.close(); // the db connection in beforeAll
//     await closeMongoDBConnection(); // the db connection in missing uname
//     await closeMongoDBConnection(); // the db connection in missing password
//   });

//   const newPlan = {
//     name: 'Test Plan',
//     friends: ['friend1', 'friend2'],
//     time: '2024-05-01T00:00:00.000Z',
//   };

//   test('POST /addPlan endpoint success case - creates a new plan', async () => {
//     const res = await request(webapp).post('/addPlan')
//       .set('Authorization', `Bearer ${token}`)
//       .send(newPlan);
//     // expect(res.status).toBe(401);
//     // expect(res.type).toBe('application/json');
//     // expect(res.body.plan).toHaveProperty('name', newPlan.name);
//   });

//   test('GET /plan/:name endpoint success case - retrieves a plan by name', async () => {
//     await request(webapp).post('/addPlan')
//       .set('Authorization', `Bearer ${token}`)
//       .send(newPlan); // Ensure the plan exists

//     const res = await request(webapp).get(`/plan/${newPlan.name}`)
//       .set('Authorization', `Bearer ${token}`);
//     // expect(res.status).toBe(404);
//     // expect(res.type).toBe('application/json');
//     // expect(res.body.data).toHaveProperty('name', newPlan.name);
//   });

//   test('GET /plan/:name endpoint failure case - plan not found', async () => {
//     const res = await request(webapp).get('/plan/NonExistentPlan')
//       .set('Authorization', `Bearer ${token}`);
//     // expect(res.status).toBe(404);
//     // expect(res.type).toBe('text/html');
//     // expect(res.body.error).toBe('Plan not found');
//   });
// });


const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../app'); // Adjust the path to where your Express app is defined
const { getDB, closeMongoDBConnection } = require('../dbUtils');

let connection;
let db;

beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = await connection.db('AppData');
});

afterAll(async () => {
    await closeMongoDBConnection();
});

describe('DB Utils', () => {
    let token;
    const username = 'testuser';
    const password = 'password';
    const friendUsername = 'frienduser';

    beforeAll(async () => {
        // Ensure the test environment is connected to the test database
        process.env.NODE_ENV = 'test';

        // Create test users in the database
        await db.collection('users').insertOne({ username, password });
        await db.collection('users').insertOne({ username: friendUsername, password });

        // Log in to get a token
        const res = await request(app)
            .post('/login')
            .send({ username, password });
        token = res.body.token;
    });

    afterAll(async () => {
        // Clean up the test data
        await db.collection('users').deleteMany({});
        await db.collection('plans').deleteMany({});
    });

    test('getPlanByName should fetch a plan by name', async () => {
        // Insert a test plan
        await db.collection('plans').insertOne({ name: 'plan1', details: 'Test plan details' });

        const plan = await getPlanByName('plan1');
        expect(plan).toEqual({ name: 'plan1', details: 'Test plan details' });
    });

    test('createPlan should insert a new plan', async () => {
        const newPlan = { name: 'newPlan', details: 'Some details' };
        const result = await createPlan(newPlan);

        const planInDb = await db.collection('plans').findOne({ name: 'newPlan' });
        expect(planInDb).toEqual(newPlan);
    });
});

