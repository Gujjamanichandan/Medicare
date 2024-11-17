import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './About/About';
import Contact from './Contact/Contact';
import DoctorProfile from './Doctors/DoctorProfile';
import Doctors from './Doctors/Doctors';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Login from './Login/Login';
import Signup from './Login/Signup';
import MyProfile from './MyProfile/MyProfile'; // Profile Page
import Navbar from './Navbar/Navbar';
import AuthContext from './context/AuthContext'; // AuthContext for managing login state

function App() {
  const { user } = useContext(AuthContext);  // Get the user from AuthContext

  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar will update based on user's login state */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          
          {/* Protect the profile page with a check for logged-in status */}
          <Route
            path="/profile"
            element={user ? <MyProfile /> : <Login />}  // If the user is logged in, show the profile page; otherwise redirect to login
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
