const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Get logged-in doctor's details
router.get('/info', verifyToken, (req, res) => {
  const doctorId = req.userId;

  const query = `
    SELECT d.image, d.qualification, d.specialization, u.name, u.email, u.phone 
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.user_id = ?
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch doctor info.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Convert the image (mediumblob) to Base64 if it exists
    const doctorInfo = results[0];
    if (doctorInfo.image) {
      doctorInfo.image = Buffer.from(doctorInfo.image).toString('base64');
    }

    res.json(doctorInfo);
  });
});


// Get upcoming appointments for the doctor
router.get('/appointments', verifyToken, (req, res) => {
  const doctorId = req.userId;

  const query = `
    SELECT a.id, a.full_name, a.email, a.phone, a.dob, a.appointment_date, a.start_time, a.symptoms, a.status
    FROM appointments a 
    WHERE a.doctor_id = ? AND a.appointment_date >= CURDATE()
    ORDER BY a.appointment_date ASC, a.start_time ASC`;
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
    res.json(results); // Return appointments
  });
});

// Update appointment status
router.patch('/appointments/:id', verifyToken, (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  const query = `UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?`;
  db.query(query, [status, appointmentId, req.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update appointment status.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or not authorized.' });
    }
    res.status(200).json({ message: 'Appointment status updated successfully.' });
  });
});

module.exports = router;
