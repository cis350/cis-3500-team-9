const request = require('supertest');
const webapp = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');

// import test utilities function
const { testUser } = require('./testUtils');

describe('individual user - uploading schedule tests', () => {
  let mongo; // local mongo connection
  let response; // the response from our express server
  /**
       * We need to make the request to the endpoint
       * before running any test.
       * We need to connecto the DB for all the DB checks
       * If beforeAll is undefined
       * inside .eslintrc.js, add 'jest' to the 'env' key
       */
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();

    // log the user in
    await request(webapp).post('/login').send(`username=${testUser.username}&password=${testUser.password}`);
    //console.log('response', response.text);
  });

  /**
   * After running the tests, we need to remove any test data from the DB
   * We need to close the mongodb connection
   */
  afterAll(async () => {
    // we need to clear the DB
    try {
      // await deleteTestDataFromDB(db, 'testuser');
      await mongo.close(); // the db connection in beforeAll
      await closeMongoDBConnection(); // the db connection in missing uname
      await closeMongoDBConnection(); // the db connection in missing password
    } catch (err) {
      return err;
    }
  });

  /**
   * Status code and response type
   */

  // Tests for the /schedule endpoint
//   test('missing a field (password) 401', async () => {
//     const res = await request(webapp).post('/login/')
//       .send('usernamename=testuser');
//     expect(res.status).toEqual(401);
//   });

//   test('missing a field (username) 401', async () => {
//     const res = await request(webapp).post('/login/')
//       .send('password=testuser');
//     expect(res.status).toEqual(401);
//   });

//   test('missing a field (password) 401', async () => {
//     const res = await request(webapp).post('/login/').send('username=testuser');
//     expect(res.status).toEqual(401);
//   });

const oneSched = ["2024-04-29T13:00:00.000Z"];

const blockSched = [
  "2024-04-30T12:00:00.000Z",
  "2024-04-30T13:00:00.000Z",
  "2024-04-30T14:00:00.000Z",
  "2024-04-30T15:00:00.000Z",
  "2024-04-30T16:00:00.000Z",
  "2024-04-30T17:00:00.000Z",
  "2024-04-30T18:00:00.000Z",
  "2024-04-30T19:00:00.000Z",
  "2024-04-30T21:00:00.000Z",
  "2024-04-30T22:00:00.000Z",
  "2024-04-30T23:00:00.000Z",
  "2024-05-01T00:00:00.000Z"
];

  // Test for the /plan endpoint
  test('POST /plan endpoint success case - enters one available timeslot', async () => {
    // TODO
    const res = await request(webapp).post('/addSchedule').send({ schedule: oneSched });
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('POST /schedule endpoint success case - enters more than one available timeslot', async () => {
    const res = await request(webapp).post('/addSchedule').send({ schedule: blockSched });
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('POST /schedule endpoint success case - submits no available timeslots', async () => {
    const res = await request(webapp).post('/addSchedule').send([]);
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });
});
