/**
 * Express webserver / controller
 */

// import express
const express = require('express');

// import the cors -cross origin resource sharing- module
const cors = require('cors');

// create a new express app
const webapp = express();

// import authentication functions
const { authenticateUser, verifyUser, verifyUserCredentials, authenticateToken } = require('./utils/auth')
// enable cors
webapp.use(cors());

// configure express to parse request bodies
webapp.use(express.urlencoded({extended: true}));
webapp.use(express.json()); // This line is necessary to parse JSON bodies

// import the db function
const users = require('../model/users');
const plans = require('../model/plans');

// root endpoint route
webapp.get('/', (_req, resp) =>{
    resp.json({message: 'hello CIS3500 friends!!!'})
});


/**
 * Login endpoint
 * The name is used to log in
 */
webapp.post('/login', async (req, resp)=>{
  // check that the name was sent in the body
  if(!req.body.username || req.body.username===''){
    resp.status(401).json({error: 'empty or missing username'});
    return;
  }
  if(!req.body.password || req.body.password===''){
    resp.status(401).json({error: 'empty or missing password'});
    return;
  }
  // authenticate the user
  try {
    const isValidUser = await verifyUserCredentials(req.body.username, req.body.password);
    if (isValidUser != 0) {
      resp.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    const token = authenticateUser(req.body.username);
    resp.status(201).json({ apptoken: token });
  } catch (err) {
    console.log('error during login', err.message);
    resp.status(500).json({ error: 'Internal server error' });
  }
})

/**
 * route implementation GET /users
 */
webapp.get('/users', async (_req, resp)=>{
    try{
        // get the data from the DB
        const allUsers = await users.getAllUsers();
        // send response
        resp.status(200).json({data: allUsers});

    } catch(err){
        // send the error code
        resp.status(400).json({message: 'There was an error'});
    }
});

/**
 * route implementation GET /user/:id
 */
webapp.get('/user/:id', async (req, res) => {
    console.log('READ a user');
    try {
      // get the data from the db
      console.log('id', req.params.id);
      const result = await users.getUser(req.params.id);
      if (result === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(400).json({ message: 'there was error' });
    }
  });

/**
 * route implementation POST /user
 * validate the session
 */
webapp.post('/user', async (req, resp) =>{
    // parse the body
    if(!req.body.username || !req.body.password){
        resp.status(404).json({message: 'missing username or password in the body'});
        return;
    }
    // verify the session
    if(await verifyUser(req.headers.authorization)){
        try{
          // create the new user object
          const newUser = {
            username: req.body.username,
            password: req.body.password,
            availability: [],
            friends: [],
          }
          const result = await users.addUser(newUser);
          resp.status(201).json({data: {id: result}});

      }catch(err){
        resp.status(400).json({message: 'There was an error'});
      }
    }
    else{
      resp.status(401).json({message: 'Failed Authentication'});
    }
    

});

/**
 * route implementation DELETE /user/:id
 */
webapp.delete('/user/:id', async (req, res) => {
    try {
      const result = await users.deleteUser(req.params.id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'user not in the system' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(400).json({ message: 'there was error' });
    }
  });
  
  /**
 * route implementation PUT /user/:id
 */
  webapp.put('/user/:id', async (req, res) => {
    console.log('UPDATE a user');
    // parse the body of the request
    if (!req.body.password) {
      res.status(400).json({ message: 'missing password' });
      return;
    }
    try {
      const result = await users.updateUser(req.params.id, req.body.password);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  });

webapp.post('/user/schedule', authenticateToken, async (req, res) => {
  const { schedule } = req.body;
  console.log(schedule)
  const userId = req.userId; // Get the user ID from the request object set by the middleware
  console.log(userId);

  try {
      const result = await users.updateUserSchedule(userId, schedule);
      res.status(201).json({ message: result });
  } catch (error) {
      console.error('Failed to update schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
  }
});

webapp.get('/user/schedule', authenticateToken, async (req, res) => {
  const userId = req.userId;
  console.log('GET /user/schedule userId:', userId);
  try {
      const schedule = await users.getUserSchedule(userId);
      console.log('User schedule:', schedule);
      res.status(200).json({ data: schedule || [] });
  } catch (error) {
      console.error('Failed to retrieve schedule:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve user's friends
webapp.get('/friends', authenticateToken, async (req, res) => {
  const userId = req.userId;
  console.log('GET /friends userId:', userId);

  if (!userId) {
    console.error('User ID not provided');
    return res.status(400).json({ error: 'User ID not provided' });
  }

  try {
    const friends = await users.getUserFriends(userId);
    console.log('User friends:', friends);
    res.status(200).json({ friends });
  } catch (error) {
    console.error('Failed to retrieve friends list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.post('/addFriend', authenticateToken, async (req, res) => {
  const friendUsername = req.body.friendUsername;
  const username = req.username;
  const userId = req.userId; // Username from the token

  try {
      const friend = await users.getUserByUName(friendUsername);
      if (!friend) {
          return res.status(404).json({ error: 'Friend username does not exist' });
      }

      if (friendUsername === username) {
          return res.status(400).json({ error: "You cannot add yourself as a friend." });
      }

      const user = await users.getUserByUName(username);
      if (user.friends.includes(friendUsername)) {
          return res.status(400).json({ error: "This user is already your friend." });
      }

      await users.updateUserFriends(userId, friendUsername); // Await this operation
      const updatedUser = await users.getUserByUName(username); // Fetch updated user details

      res.status(200).json({ message: 'Friend added successfully', friends: updatedUser.friends });
  } catch (error) {
      console.error('Failed to add friend:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.get('/plan/:name', authenticateToken, async (req, res) => {
  //const userId = req.userId;
  //console.log('GET /user/schedule userId:', userId);
  const planName = req.params.name;
  console.log('GET planName', planName);
  try {
      const plan = await plans.getPlanByName(userId);
      console.log('plan:', plan);
      res.status(200).json({ data: plan || [] });
  } catch (error) {
      console.error('Failed to retrieve plan:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

webapp.post('/addPlan', authenticateToken, async (req, res) => {
  const friendUsernames = req.body.friendUsernames;
  const planName = req.body.name;
  const time = req.body.time;

  try {
      // Check if the username of each friend exists
      for (const friendUsername of friendUsernames) {
        const friend = await users.getUserByUName(friendUsername);
        if (!friend) {
            return res.status(404).json({ error: 'Friend username does not exist' });
        }
      }

      // Create new plan object
      const newPlan = {
        name: planName,
        friends: friendUsernames,
        time: time
      }
      // Add plan
      plans.createPlan(newPlan);
      const plan = plans.getPlanByName(planName);
      res.status(201).json({ message: 'Plan created successfully', plan: plan });


  } catch (error) {
      console.error('Failed to create plan:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// export the webapp
module.exports = webapp;