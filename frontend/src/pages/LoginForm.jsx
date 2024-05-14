import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/css/App.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3010/login', credentials);
      localStorage.setItem('app-token', response.data.apptoken); // Save the token to local storage
      navigate('/schedule'); // Navigate to Scheduling page after successful login
    } catch (error) {
      console.error('Login failed:', error.response.data.error);
      alert('Login failed: ' + error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <body>
        <h2>Sign in to when2eat</h2>
        <div class='inputForm'>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </div>
        <div id='redirect-text'>
          <p>Don't have an account? <a href='registration'>Create one</a></p>
          <a href='/reset_password'>Reset password</a>
        </div>
        
      </body>
      
    </form>
  );
};

export default LoginForm;