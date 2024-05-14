const request = require('supertest');
const webapp = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');
const { testUser, insertTestDataToDB, deleteTestDataFromDB } = require('./testUtils');

describe('individual user - uploading plan tests', () => {
  let mongo; // local mongo connection
  let db; // database instance
  let testUserId; // ID of the test user
  let token; // authentication token

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();

    // insert test user into the database
    testUserId = await insertTestDataToDB(db, testUser);

    // log the user in and get the token
    const response = await request(webapp).post('/login').send(`username=${testUser.username}&password=${testUser.password}`);
    token = response.body.apptoken; // assuming the token is returned in the body as apptoken
  });

  afterAll(async () => {
    // clean up the test user from the database
    await deleteTestDataFromDB(db, testUser.username);
    
    // close database connections
    await mongo.close(); // the db connection in beforeAll
    await closeMongoDBConnection(); // the db connection in missing uname
    await closeMongoDBConnection(); // the db connection in missing password
  });

  const newPlan = {
    name: 'Test Plan',
    friends: ['friend1', 'friend2'],
    time: '2024-05-01T00:00:00.000Z',
  };

  test('POST /addPlan endpoint success case - creates a new plan', async () => {
    const res = await request(webapp).post('/addPlan')
      .set('Authorization', `Bearer ${token}`)
      .send(newPlan);
    expect(res.status).toBe(401);
    expect(res.type).toBe('application/json');
    expect(res.body.plan).toHaveProperty('name', newPlan.name);
  });

  test('GET /plan/:name endpoint success case - retrieves a plan by name', async () => {
    await request(webapp).post('/addPlan')
      .set('Authorization', `Bearer ${token}`)
      .send(newPlan); // Ensure the plan exists

    const res = await request(webapp).get(`/plan/${newPlan.name}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.type).toBe('application/json');
    expect(res.body.data).toHaveProperty('name', newPlan.name);
  });

  test('GET /plan/:name endpoint failure case - plan not found', async () => {
    const res = await request(webapp).get('/plan/NonExistentPlan')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.type).toBe('text/html');
    expect(res.body.error).toBe('Plan not found');
  });
});