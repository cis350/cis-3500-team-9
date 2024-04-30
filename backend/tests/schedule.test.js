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

  const blockSched = [
    '2024-04-29T13:00:00.000Z',
    '2024-04-29T14:00:00.000Z',
    '2024-04-29T15:00:00.000Z',
    '2024-04-29T16:00:00.000Z',
    '2024-04-29T17:00:00.000Z',
    '2024-04-29T18:00:00.000Z'
  ];

  const oneSched = ["2024-04-29T13:00:00.000Z"];
  // Test for the /schedule endpoint
  test('POST /schedule endpoint success case - enters one available timeslot', async () => {
    // TODO
    const res = await request(webapp).post('/schedule').send(`timeslot=${oneSched}$`);
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('POST /schedule endpoint success case - enters more than one available timeslot', async () => {
    const res = await request(webapp).post('/schedule').send(`timeslot=${blockSched}$`);
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('POST /schedule endpoint success case - submits no available timeslots', async () => {
    const res = await request(webapp).post('/schedule').send([]);
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('GET /schedule endpoint - schedule contains one available timeslot', async () => {
    // submit schedule first
    request(webapp).post('/schedule').send(`timeslot=${oneSched}$`);

    const res = await request(webapp).get('/schedule');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    const resArray = JSON.parse(res.text).data;
    //TODO
    expect(resArray).toEqual(expect.arrayContaining(oneSched));
  });

  test('GET /schedule endpoint - schedule contains more than one available timeslot', async () => {
    // submit schedule first
    request(webapp).post('/schedule').send(`timeslot=${blockSched}$`);

    const res = await request(webapp).get('/schedule');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    const resArray = JSON.parse(res.text).data;
    //TODO
    expect(resArray).toEqual(expect.arrayContaining(blockSched));
  });

  test('GET /schedule endpoint - no available timeslots submitted', async () => {
    const res = await request(webapp).get('/schedule');
    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');

    const resArray = JSON.parse(res.text).data;
    expect(resArray).toEqual(expect.arrayContaining([]));
  });

  


});
