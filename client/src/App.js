import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ResetPass from './components/ResetPass';
import Scheduler from './components/Scheduler';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header/>
      <body>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/registration" element={<RegistrationForm/>}/>
            <Route path="/reset_password" element={<ResetPass/>}/>
            <Route path="/schedule" element={<Scheduler/>}/>
          </Routes>
        </BrowserRouter>
      </body>
      
    </div>
    
  )
}

export default App;
