import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './About/About';
import Contact from './Contact/Contact';
import DoctorProfile from './Doctors/DoctorProfile'; // Import the doctor profile component
import Doctors from './Doctors/Doctors';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Navbar from './Navbar/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} /> {/* Doctor profile route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
