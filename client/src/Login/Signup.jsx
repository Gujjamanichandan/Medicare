import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State to hold the success message

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password, role: 'patient' }), // Role is 'patient' by default
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful:', data);
        // Clear the form fields
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        
        // Display success message
        setSuccessMessage('User successfully created!');
        
        // Optionally redirect after some time
        // setTimeout(() => {
        //   window.location.href = "/login"; // Redirect to login page after success
        // }, 2000); // Wait 2 seconds before redirecting
      } else {
        console.error('Signup failed:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Sign Up</h1>
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">Sign Up</button>
        
        {successMessage && <p style={{fontSize: '20px',fontWeight: 'bold', marginTop: '10px' }}>{successMessage}</p>} {/* Success message */}

        <p className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: '#368387' }}>Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
