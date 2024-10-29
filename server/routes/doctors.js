
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming you have this for database access
const Doctor = require('../models/doctorModel'); // If you are using a model file

// Get all doctors
router.get('/', (req, res) => {
  Doctor.getAllDoctors((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a specific doctor by ID
router.get('/:id', (req, res) => {
  const doctorId = req.params.id;
  Doctor.getDoctorById(doctorId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ message: 'Doctor not found' });
    res.json(result);  // Return the doctor data
  });
});

// Get the schedule for a specific doctor
router.get('/:id/schedule', (req, res) => {
    const doctorId = req.params.id;
  
    // Query to fetch all available time slots for a doctor by their ID
    const query = `
      SELECT available_day, timeslot1, timeslot2, timeslot3, timeslot4, timeslot5
      FROM doctorschedules
      WHERE doctor_id = ?
    `;
  
    db.query(query, [doctorId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Return the available schedule with time slots
      res.json(results);
    });
  });
  

module.exports = router;
