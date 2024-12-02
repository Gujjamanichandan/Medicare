const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Helper function to verify the token and extract the user ID
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        reject(err); // Reject if token is invalid
      } else {
        resolve(decoded.id); // Assuming the decoded JWT contains the user's ID
      }
    });
  });
};

// POST route to handle booking a new appointment
router.post('/', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' }); // Return if no token is present
  }

  try {
    // Verify the token and extract the user ID
    const patient_id = await verifyToken(token);

    // Proceed with appointment creation
    const { doctor_id, appointment_date, start_time, full_name, email, phone, dob, symptoms } = req.body;

    // Validate required fields
    if (!doctor_id || !appointment_date || !start_time || !full_name || !email || !phone || !dob) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Format the appointment date
    const formattedAppointmentDate = new Date(appointment_date).toISOString().split('T')[0]; // Format to YYYY-MM-DD

    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, symptoms, status, full_name, email, phone, dob) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      patient_id, // Use the authenticated user's ID (patient_id)
      doctor_id,
      formattedAppointmentDate,
      start_time,
      symptoms || null, // Use null if no symptoms provided
      'Pending', // Default status
      full_name || null,
      email || null,
      phone || null,
      dob || null,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error saving appointment', error: err.message });
      }

      res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// GET route to fetch appointments for the logged-in user
router.get('/', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }

  try {
    // Verify the token and extract the user ID
    const patient_id = await verifyToken(token);

    // Query appointments for the patient_id, including doctor_name
    const query = `
      SELECT a.*, u.name AS doctor_name 
      FROM appointments a
      JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = ?
    `;
    db.query(query, [patient_id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching appointments' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No appointments found for this user' });
      }

      // Return the appointments with doctor details to the client
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});


router.get('/booked-slots/:doctorId/:appointmentDate', (req, res) => {
  const { doctorId, appointmentDate } = req.params;

  const query = `
    SELECT start_time
    FROM appointments
    WHERE doctor_id = ? AND appointment_date = ? AND status IN ('Confirmed', 'Pending')
  `;

  db.query(query, [doctorId, appointmentDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching booked slots.' });
    }

    // Return only the booked slots
    res.status(200).json(results.map((row) => row.start_time));
  });
});




// GET route to fetch booked time slots for a specific doctor and date
router.get('/booked-slots/:doctorId/:date', (req, res) => {
  const { doctorId, date } = req.params;

  const query = `
    SELECT start_time
    FROM appointments
    WHERE doctor_id = ? AND appointment_date = ?
  `;

  db.query(query, [doctorId, date], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch booked time slots.' });
    }

    // Return only the booked time slots
    res.status(200).json(results.map((row) => row.start_time));
  });
});


// DELETE route to cancel an appointment
router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }

  try {
    const userId = await verifyToken(token); // Verify token and get user ID
    const { id } = req.params;

    // Delete the appointment only if it belongs to the logged-in user
    const query = `DELETE FROM appointments WHERE id = ? AND patient_id = ?`;
    db.query(query, [id, userId], (err, result) => {
      if (err) {
        console.error('Error deleting appointment:', err);
        return res.status(500).json({ message: 'Error deleting appointment.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found or not authorized.' });
      }

      res.status(200).json({ message: 'Appointment cancelled successfully.' });
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
