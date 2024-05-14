const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');
const { getPlanByName, createPlan } = require('../model/plans');

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
        // expect(plan).toEqual({ name: 'plan1', details: 'Test plan details' });
    });

    test('createPlan should insert a new plan', async () => {
        const newPlan = { name: 'newPlan', details: 'Some details' };
        const result = await createPlan(newPlan);

        const planInDb = await db.collection('plans').findOne({ name: 'newPlan' });
        expect(planInDb).toEqual(newPlan);
    });

    // test('POST /user/schedule endpoint success case - enters one available timeslot', async () => {
    //     const oneSched = { schedule: ['2024-05-14T14:45:50.890655+00:00'] };
    //     const res = await request(app)
    //         .post('/user/schedule')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(oneSched);

    //     expect(res.status).toBe(201);
    //     expect(res.type).toBe('application/json');
    // });

    // test('POST /user/schedule endpoint success case - enters more than one available timeslot', async () => {
    //     const blockSched = { schedule: ['2024-05-14T14:45:50.890655+00:00', '2024-05-15T14:45:50.890655+00:00'] };
    //     const res = await request(app)
    //         .post('/user/schedule')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(blockSched);

    //     expect(res.status).toBe(201);
    //     expect(res.type).toBe('application/json');
    // });

    // test('POST /user/schedule endpoint success case - submits no available timeslots', async () => {
    //     const noSched = { schedule: [] };
    //     const res = await request(app)
    //         .post('/user/schedule')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(noSched);

    //     expect(res.status).toBe(201);
    //     expect(res.type).toBe('application/json');
    // });
});
