const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure your DB connection is properly set up

// Route to handle submitting the contact form
router.post('/', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Insert the contact form data into the database
  const query = `
    INSERT INTO contactform (name, email, phone, message) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, email, phone, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Return a success message
    res.json({ message: 'Contact form submitted successfully!' });
  });
});

module.exports = router;
