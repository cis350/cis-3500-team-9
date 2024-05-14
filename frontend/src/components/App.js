import React, { useState } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LoginForm from '../pages/LoginForm';
import RegistrationForm from '../pages/RegistrationForm';
import Scheduler from '../pages/Scheduler';
import FindFriends from '../pages/FindFriends';
import CreatePlan from '../pages/CreatePlan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginForm/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/registration" element={<RegistrationForm/>}/>
        <Route path="/schedule" element={<Scheduler/>}/>
        <Route path="/friends" element={<FindFriends/>}/>
        <Route path="/plan" element={<CreatePlan/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;