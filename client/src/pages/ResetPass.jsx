import React, { useState } from 'react';
import '../App.css';

const ResetPass = () => {
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

  //api for reset pass
  const handleSubmit = async (e) => {
    console.log('password reset');
  };

  //css styling
  const resetPassStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter your email to reset password</h2>
      <div style={resetPassStyle}>
        <input
            type="text"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
        />
        <button type="submit">Reset password</button>
      </div>
    </form>
  );
};

export default ResetPass;
