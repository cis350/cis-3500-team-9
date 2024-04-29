import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/App.css';
import { createNewUser } from '../api/users';

const RegistrationForm = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createNewUser({
        // name: user.name,
        // email: user.email,
        username: user.username,
        password: user.password,
      });
      alert('User registered successfully');
      navigate('/schedule');
    } catch (error) {
      console.error('Registration error:', error);
      // If the API call includes response information, log or display it here
      if (error.response) {
        console.error('Registration error response:', error.response);
        alert(`Failed to register user: ${error.response.data.message}`);
      } else {
        alert('Failed to register user');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <body>
        <h2>Sign up for when2eat</h2>
        <div class="inputForm">
          <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
              required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Create account</button>
        </div>
        <div id="redirectText">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </body>
      
    </form>
  );
};

export default RegistrationForm;