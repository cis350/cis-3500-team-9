const express = require('express');
const router = express.Router();
const { addUser, getAllUsers, getUser, getUserByUName, updateUser, deleteUser } = require('./users');

// Post route for adding a user
router.post('/user', async (req, res) => {
  try {
    const userId = await addUser(req.body); // assuming req.body has all necessary user details
    res.status(201).send({ userId });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Other routes (GET, PUT, DELETE) below...
// Example: GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
