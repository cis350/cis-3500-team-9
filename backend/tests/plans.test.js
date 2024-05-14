const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');
const { getPlanByName, createPlan } = require('../model/plans');

let connection;
let db;
let createdUserIds = [];
let createdPlanIds = [];

beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = await connection.db('AppData');
});

afterAll(async () => {
    // Clean up specific test data
    await db.collection('users').deleteMany({ _id: { $in: createdUserIds } });
    await db.collection('plans').deleteMany({ _id: { $in: createdPlanIds } });
    await closeMongoDBConnection();
});

describe('DB Utils', () => {
    let token;
    const username = 'testuser';
    const password = 'password';
    const friendUsername = 'frienduser';

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

        // Create test users in the database
        const user1 = await db.collection('users').insertOne({ username, password });
        createdUserIds.push(user1.insertedId);
        const user2 = await db.collection('users').insertOne({ username: friendUsername, password });
        createdUserIds.push(user2.insertedId);

        // Log in to get a token
        const res = await request(app)
            .post('/login')
            .send({ username, password });
        token = res.body.token;
    });

    test('getPlanByName should fetch a plan by name', async () => {
        // Insert a test plan
        const plan = await db.collection('plans').insertOne({ name: 'plan1' });
        createdPlanIds.push(plan.insertedId);

        const fetchedPlan = await getPlanByName('plan1');
        expect(fetchedPlan).toEqual({ _id: plan.insertedId, name: 'plan1' });
    });

    test('createPlan should insert a new plan', async () => {
        const newPlan = { name: 'newPlan' };
        const result = await createPlan(newPlan);
        createdPlanIds.push(result.insertedId);

        const planInDb = await db.collection('plans').findOne({ name: 'newPlan' });
        expect(planInDb).toEqual({ _id: result.insertedId, ...newPlan });
    });
});
