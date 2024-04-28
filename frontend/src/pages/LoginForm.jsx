import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        alert('Login successful');
      } else {
        alert('Failed to login');
      }
    } catch (error) {
      console.error('Login error:', error);
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