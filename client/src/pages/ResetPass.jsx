import React, { useState } from 'react';
import '../App.css';

const ResetPass = () => {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);

  //api for reset pass
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('password reset for ', email);
    setShow(!show);
    setEmail(email);
  };

  //css styling
  const resetPassStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0rem 12rem",
    textAlign: "center",
  }

  return (
    <div>
      {!show && (
        <form onSubmit={handleSubmit}>
          <div style={resetPassStyle}>
            <h2>Enter your email to reset password</h2>
            <input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Reset password</button>
            <a href='/login'>Cancel</a>
          </div>
      </form>
      )}
      {show && (
        <div style={resetPassStyle}>
          <h2>Submitted</h2>
          <p>
            If an account exists for {email}, you will get an email
            with instructions on resetting your password. If it doesn't
            arrive, be sure to check your spam folder.
          </p>
          <a href='/login'>Back to Log in</a>
        </div>
      )}
    </div>
  );
};

export default ResetPass;
