const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const validator = require('validator'); 

// Route to handle submitting the contact form
router.post('/', (req, res) => {
  let { name, email, phone, message } = req.body;

  // Input validation and sanitization
  if (
    !name || !email || !phone || !message ||
    !validator.isEmail(email) || 
    !validator.isMobilePhone(phone, 'any') || 
    !validator.isLength(name, { min: 1, max: 100 }) || 
    !validator.isLength(message, { min: 1, max: 500 }) 
  ) {
    return res.status(400).json({ error: 'Invalid input. Please check your data.' });
  }

  // Escape to prevent XSS
  name = validator.escape(name);
  email = validator.escape(email);
  phone = validator.escape(phone);
  message = validator.escape(message);

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
