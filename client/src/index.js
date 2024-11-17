// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";



// const root = ReactDOM.createRoot(document.getElementById('root')); // Update this line
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

// Wrap your app with AuthProvider to provide authentication state globally
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);

