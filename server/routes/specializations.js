const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure you have your database connection setup

// Get all specializations
router.get('/', (req, res) => {
  db.query('SELECT DISTINCT specialization FROM doctors', (error, results) => {
    if (error) {
      console.error('Error fetching specializations:', error);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results.map(row => row.specialization)); // Return only the specialization field
  });
});

module.exports = router;
