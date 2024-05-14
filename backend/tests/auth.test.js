const request = require('supertest');
const webapp = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');

// import test utilities function
const { testUser } = require('./testUtils');

describe('POST /login enpoint tests', () => {
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

    // send the request to the API and collect the response
    response = await request(webapp).post('/login').send(`username=${testUser.username}&password=${testUser.password}`);
    console.log('response', response.text);
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

  // Tests for root endpoint
  test('root endpoint returns 200 and the response type is JSON', async () => {
    const response = await request(webapp).get('/');
    expect(response.status).toBe(200); 
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ message: 'hello CIS3500 friends!!!' });
  });

  // test('the status code is 201 and response type', () => {
  //   expect(response.status).toBe(201); // status code
  //   expect(response.type).toBe('application/json');
  // });

  // test('the JWT is in the response', () => {
  //   // expect the JWT of the new session should not be undefined
  //   console.log('returned data id', response.text);
  //   expect(JSON.parse(response.text).apptoken).not.toBe(undefined);
  // });

  // Tests for the /login endpoint
  test('missing a field (password) 401', async () => {
    const res = await request(webapp).post('/login/')
      .send('usernamename=testuser');
    expect(res.status).toEqual(401);
  });

  test('missing a field (username) 401', async () => {
    const res = await request(webapp).post('/login/')
      .send('password=testuser');
    expect(res.status).toEqual(401);
  });

  test('missing a field (password) 401', async () => {
    const res = await request(webapp).post('/login/').send('username=testuser');
    expect(res.status).toEqual(401);
  });

  // Test for the /user endpoint
  test('POST /user endpoint returns 201 and the response type is JSON', async () => {
    const res = await request(webapp).post('/user').send('username=testuser&password=testuser');
    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
  });

  test('POST /users endpoint returns 404 when missing username or password', async () => {
    const res = await request(webapp).post('/user').send('username=testuser');
    expect(res.status).toBe(404);
    expect(res.type).toBe('application/json');
  });
});
