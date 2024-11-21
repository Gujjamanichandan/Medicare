// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // POST route to handle login
// router.post('/', (req, res) => {
//   const { email, password } = req.body;

//   // Validate the required fields
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   // Query the database to find the user by email
//   const query = 'SELECT * FROM users WHERE email = ? AND role = "Patient"';
//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Server error during login.' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'User not found. Please check your credentials.' });
//     }

//     const user = results[0];

//     // Compare the provided password with the hashed password stored in the database
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials.' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id }, // Payload: user id
//       process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for the secret
//       { expiresIn: '1h' } // Token expiration time (1 hour)
//     );

//     // Send success response with user data and token
//     res.status(200).json({
//       message: 'Login successful',
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       token, // Send the JWT token to the frontend
//     });
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST route to handle login
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  console.log('Email:', email); // Debugging
  console.log('Role:', role);

  // Validate the required fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(query, [email, role], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error during login.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found. Please check your credentials.' });
    }

    const user = results[0];

    console.log('User found:', user); // Debugging

    // Compare the provided password with the hashed password
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ message: 'Error validating credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  });
});

module.exports = router;
