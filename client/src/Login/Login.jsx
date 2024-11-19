import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { setUser } = useContext(AuthContext); // Get setUser function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // Default role is 'patient'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully logged in
        console.log('Login successful:', data);

        // Save token and user details in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        // Update user info in context
        setUser(data);

        // Redirect after login
        navigate('/');
      } else {
        // Handle errors like invalid credentials
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Login</h1>

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

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
        )}

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#368387' }}>
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
