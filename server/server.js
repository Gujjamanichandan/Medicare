const express = require('express');
const cors = require('cors');
const doctorsRoutes = require('./routes/doctors');
const specializationsRoutes = require('./routes/specializations');
const appointmentsRoutes = require('./routes/appointments');
const contactRoutes = require('./routes/contact');
const loginRoutes = require('./routes/login'); // Import the login route
const signupRoutes = require('./routes/signup'); // Import the signup route

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/doctors', doctorsRoutes);
app.use('/specializations', specializationsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/contact', contactRoutes);
app.use('/api/login', loginRoutes); // Setup login route with the correct path
app.use('/api/signup', signupRoutes); // Setup signup route

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
