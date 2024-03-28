import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      {showLogin ? (
        <>
          <LoginForm />
          <button onClick={() => setShowLogin(false)}>Register Instead</button>
        </>
      ) : (
        <>
          <RegistrationForm />
          <button onClick={() => setShowLogin(true)}>Login Instead</button>
        </>
      )}
    </div>
  );
};

export default HomePage;
