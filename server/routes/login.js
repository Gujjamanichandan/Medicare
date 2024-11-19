const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST route to handle login
router.post('/', (req, res) => {
  const { email, password, role } = req.body;

  // Validate the required fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  // Different logic for patient and doctor
  if (role === 'patient') {
    // For patient, use bcrypt to compare passwords
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error during login.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found. Please check your credentials.' });
      }

      const user = results[0];

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Generate JWT token for patient
      const token = jwt.sign(
        { id: user.id }, // Payload: user id
        process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for the secret
        { expiresIn: '1h' } // Token expiration time (1 hour)
      );

      // Send success response with user data and token
      res.status(200).json({
        message: 'Login successful',
        id: user.id,
        name: user.name,
        email: user.email,
        token, // Send the JWT token to the frontend
      });
    });
  } else if (role === 'doctor') {
    // For doctor, compare email and password directly (without bcrypt)
    const query = 'SELECT * FROM doctors WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error during login.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Doctor not found or invalid credentials.' });
      }

      const doctor = results[0];

      // Generate JWT token for doctor
      const token = jwt.sign(
        { id: doctor.id }, // Payload: doctor id
        process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for the secret
        { expiresIn: '1h' } // Token expiration time (1 hour)
      );

      // Send success response with doctor data and token
      res.status(200).json({
        message: 'Login successful',
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        token, // Send the JWT token to the frontend
      });
    });
  } else {
    return res.status(400).json({ message: 'Invalid role. Please select either patient or doctor.' });
  }
});

module.exports = router;
