const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure your DB connection is set up here
const bcrypt = require('bcryptjs'); // For password hashing

// POST route to handle signup
router.post('/', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error while checking existing user.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, phone, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [name, email, phone, hashedPassword, role];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error saving user:', err);
        return res.status(500).json({ message: 'Error saving user' });
      }
      
      res.status(201).json({ message: 'Signup successful', userId: result.insertId });
    });
  });
});

module.exports = router;
