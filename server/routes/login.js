const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed
const db = require('../config/db'); // Your database connection

// Login route
router.post('/', (req, res) => {
    const { email, password, userType } = req.body; // Updated to use userType
  
    // Query to find the user
    const query = 'SELECT * FROM users WHERE email = ? AND role = ?';
  
    db.query(query, [email, userType], async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database query error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = results[0];
  
      // Compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Successful login
      res.status(200).json({ message: 'Login successful', userId: user.id });
    });
  });
  
  module.exports = router;