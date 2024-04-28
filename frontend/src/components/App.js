import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import LoginForm from '../pages/LoginForm';
import RegistrationForm from '../pages/RegistrationForm';
import ResetPass from '../pages/ResetPass';

// const LoginForm = () => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials((prevCredentials) => ({
//       ...prevCredentials,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });
//       if (response.ok) {
//         alert('Login successful');
//       } else {
//         alert('Failed to login');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Sign in to when2eat</h2>
//       <div class='input-form'>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={credentials.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={credentials.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//       </div>
//       <p>Don't have an account? <a>Create one</a></p>
//       <a href='gmail.com'>Reset password</a>
//     </form>
//   );
// };

function App() {
  return (
    // <div className='App'>
    //   <body>
    //     <LoginForm/>
    //     <RegistrationForm/>
    //     <ResetPass/>
    //   </body>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/registration" element={<RegistrationForm/>}/>
        <Route path="/reset_password" element={<ResetPass/>}/>
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
//         <img src={logo} className="App-logo" alt="logo" />
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
