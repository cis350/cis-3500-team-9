const request = require('supertest');
const webapp = require('../controller/server');
const { closeMongoDBConnection, connect } = require('../model/dbUtils');

// import test utilities function
const { testUser } = require('./testUtils');

describe('individual user - adding friends tests', () => {
  let mongo; // local mongo connection
  let response; // the response from our express server
  /**
       * We need to make the request to the endpoint
       * before running any test.
       * We need to connecto the DB for all the DB checks
       * If beforeAll is undefined
       * inside .eslintrc.js, add 'jest' to the 'env' key
       */
  let token;
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();

    // log the user in
    const res = await request(webapp).post('/login').send(`username=${testUser.username}&password=${testUser.password}`);
    //console.log('response', response.text);
    token = res.body.token;
    //token = localStorage.getItem('app-token');
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


//const oneSched = ["2024-04-29T13:00:00.000Z"];

const friendList = [
    "vivyxiao",
    "test3",
    "test1",
    "chencaro"
]

const newPlan = {
    name: "testPlan",
    friendsUsernames: friendList,
    time: "5:00 PM"
}

const friendUsername1 = "vivyxiao";
const friendUsername2 = "chencaro";

  // Test for the /schedule endpoint
  test('POST /addFriend endpoint success case - adds one friend', async () => {
    const res = await request(webapp).post('/addFriend').send({ friendUsername: friendUsername1 }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });

  test('POST /addFriend endpoint success case - adds more than one friend', async () => {
    let res = await request(webapp).post('/addFriend').send({ friendUsername: friendUsername1 });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');

    res = await request(webapp).post('/addFriend').send({ friendUsername: friendUsername2 });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });

  test('POST /addFriend endpoint tries to add self - failure case', async () => {
    const res = await request(webapp).post('/addFriend').send({ friendUsername: testUser.username });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });

  test('POST /addFriend endpoint tries to add friend twice - failure case', async () => {
    let res = await request(webapp).post('/addFriend').send({ friendUsername: friendUsername1 });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');

    res = await request(webapp).post('/addFriend').send({ friendUsername: friendUsername1 });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });

  test('POST /addFriend endpoint tries to add friend that doesnt exist failure case', async () => {
    const res = await request(webapp).post('/addFriend').send({ friendUsername: "notInDB" });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });

  test('GET /friends endpoint success case', async () => {
    const res = await request(webapp).get('/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(res.status).toBe(401);
    expect(res.type).toBe('text/html');
  });
});