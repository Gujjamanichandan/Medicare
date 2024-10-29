const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure your DB connection is properly set up

// Route to handle booking a new appointment
router.post('/', (req, res) => {
  const { doctor_id, appointment_date, start_time, symptoms } = req.body;

  // Insert the new appointment into the database
  const query = `
    INSERT INTO appointments (doctor_id, appointment_date, start_time, symptoms, status) 
    VALUES (?, ?, ?, ?, 'Pending')
  `;
  
  db.query(query, [doctor_id, appointment_date, start_time, symptoms], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Return a success message and the new appointment ID
    res.json({ message: 'Appointment successfully booked!', appointmentId: result.insertId });
  });
});

module.exports = router;
