const express = require('express');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed
const db = require('../config/db'); // Update this path based on your database connection
const router = express.Router();

// POST /api/signup
router.post('/', async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Simple validation (add more as needed)
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const queryCheck = 'SELECT * FROM users WHERE email = ?';
    const [existingUser] = await db.execute(queryCheck, [email]);
    
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const queryInsert = `
      INSERT INTO users (name, email, phone, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.execute(queryInsert, [name, email, phone, hashedPassword, 'Patient']);

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully', userId: result[0].insertId });
  } catch (error) {
    console.error('Error during signup:', error); // Log the error to console
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
