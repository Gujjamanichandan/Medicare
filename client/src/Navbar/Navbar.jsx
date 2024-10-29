import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [location, setLocation] = useState('Locating...');
  const [dateTime, setDateTime] = useState('');

  // Get location name using Nominatim API (OpenStreetMap)
  const getLocationName = (latitude, longitude) => {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    
    fetch(nominatimUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.address) {
          const { city, state, country } = data.address;
          setLocation(`${city}, ${state}, ${country}`);
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

  return (
    <nav>
      <div className="first-section">
        <div className="container">
          <div>
            <i className="fas fa-map-marker-alt"></i> {/* Location Icon */}
            <span> {location}</span>
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
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
