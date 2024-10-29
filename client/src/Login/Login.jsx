import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient'); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/home'); // Redirect to home page
      } else {
        console.error('Login failed:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="auth-title">Login</h2>

        <div className="wrapper">
          <div className="toggle">
            <input 
              type="radio" 
              id="toggle-left" 
              name="toggle" 
              checked={userType === 'doctor'} 
              onChange={() => setUserType('admin')} 
            />
            <label htmlFor="toggle-left" className="left-toggle">Doctor</label>

            <input 
              type="radio" 
              id="toggle-right" 
              name="toggle" 
              checked={userType === 'patient'} 
              onChange={() => setUserType('patient')} 
            />
            <label htmlFor="toggle-right" className="right-toggle">Patient</label>

            <div className="separator"></div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Log In
        </button>

        <div className="auth-footer">
          <p>If you don't have an account, <Link to="/signup" style={{ marginLeft: '5px', color: '#368387' }}>Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
