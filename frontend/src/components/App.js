import React, { useState } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LoginForm from '../pages/LoginForm';
import RegistrationForm from '../pages/RegistrationForm';
import ResetPass from '../pages/ResetPass';
import Scheduler from '../pages/Scheduler';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginForm/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/registration" element={<RegistrationForm/>}/>
        <Route path="/reset_password" element={<ResetPass/>}/>
        <Route path="/schedule" element={<Scheduler/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

// import logo from '../When2Eat Logo.svg';
// import './css/App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
