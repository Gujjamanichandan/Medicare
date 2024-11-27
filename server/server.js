// Load environment variables from the .env file at the very beginning
require('dotenv').config();  // Ensure dotenv is loaded before any other code

const express = require('express');
const cors = require('cors');
const doctorsRoutes = require('./routes/doctors');
const specializationsRoutes = require('./routes/specializations');
const appointmentsRoutes = require('./routes/appointments');
const contactRoutes = require('./routes/contact');
const loginRoutes = require('./routes/login'); 
const signupRoutes = require('./routes/signup'); 
const doctorDashboardRoutes = require('./routes/doctorDashboard');


const app = express();
const PORT = process.env.PORT || 5000;  // Use the port from the .env file or default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/doctors', doctorsRoutes);
app.use('/specializations', specializationsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/contact', contactRoutes);
app.use('/api/login', loginRoutes); 
app.use('/api/signup', signupRoutes); 
app.use('/doctor-dashboard', doctorDashboardRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
