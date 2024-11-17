import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Access user data and logout from context
  const [location, setLocation] = useState('Locating...');
  const [dateTime, setDateTime] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility
  const navigate = useNavigate(); // Hook to navigate between pages

  // Function to get location using Nominatim API (OpenStreetMap)
  const getLocationName = (latitude, longitude) => {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

    fetch(nominatimUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.address) {
          const { city, state, country } = data.address;
          setLocation(`${city || 'Unknown City'}, ${state || 'Unknown State'}, ${country || 'Unknown Country'}`);
        } else {
          setLocation('Location not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
        setLocation('Location not available');
      });
  };

  useEffect(() => {
    // Get current location when the component mounts
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getLocationName(latitude, longitude);
    });

    // Update date and time every second
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setDateTime(formattedDateTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout(); // Call logout from context to clear user data
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav>
      <div className="first-section">
        <div className="container">
          <div>
            <i className="fas fa-map-marker-alt"></i> {/* Location Icon */}
            <span>{location}</span>
          </div>
          <div>{dateTime}</div>
        </div>
      </div>

      <div className="second-section">
        <div className="container">
          <img src="/logo.png" alt="Logo" className="logo" /> {/* Logo Image */}
          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/doctors">Our Providers</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          {/* Conditional rendering based on login state */}
          {user ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
              onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when hover ends
            >
              <button className="welcome-button">
                Welcome, {user.name || 'Guest'} {/* Fallback for missing name */}
              </button>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <Link to="/profile">My Profile</Link> {/* Link to Profile page */}
                  <span onClick={handleLogout} className="logout-text">Logout</span> {/* Logout as text */}
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
