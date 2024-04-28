import React, { useState } from 'react';
import '../components/css/App.css';

const RegistrationForm = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

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
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        alert('User registered successfully');
      } else {
        alert('Failed to register user');
      }
    } catch (error) {
      console.error('Registration error:', error);
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