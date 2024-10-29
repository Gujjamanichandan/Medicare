
const db = require('../config/db');

const Doctor = {
  // Fetch all doctors with their name from users
  getAllDoctors: (callback) => {
    const query = `
      SELECT doctors.*, users.name AS doctor_name 
      FROM doctors
      INNER JOIN users ON doctors.user_id = users.id`;

    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }

      // Convert each doctor's image to Base64
      const modifiedResults = results.map(doctor => {
        if (doctor.image) {
          doctor.image = Buffer.from(doctor.image).toString('base64');
        }
        return doctor;
      });

      callback(null, modifiedResults);
    });
  },

  // Fetch a single doctor by ID
  getDoctorById: (id, callback) => {
    const query = `
      SELECT doctors.*, users.name AS doctor_name 
      FROM doctors
      INNER JOIN users ON doctors.user_id = users.id
      WHERE doctors.id = ?`;

    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }

      if (results.length > 0) {
        const doctor = results[0];
        if (doctor.image) {
          doctor.image = Buffer.from(doctor.image).toString('base64');
        }
        callback(null, doctor);  // Return the doctor data
      } else {
        callback(null, null);  // No doctor found
      }
    });
  }
};

module.exports = Doctor;
