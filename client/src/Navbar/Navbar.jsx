import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [location, setLocation] = useState('Locating...');
  const [dateTime, setDateTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
            <i className="fas fa-map-marker-alt"></i>
            <span> {location}</span>
          </div>
          <div>{dateTime}</div>
        </div>
      </div>

      <div className="second-section">
        <div className="container">
          <img src="/logo.png" alt="Logo" className="logo" />

          {/* Inline Menu for Desktop */}
          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/doctors">Our Providers</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="right-side">
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>

            {/* Hamburger Icon */}
            <div className="hamburger" onClick={toggleMenu}>
              <div className={`line ${menuOpen ? 'rotate-top' : ''}`}></div>
              <div className={`line ${menuOpen ? 'fade-out' : ''}`}></div>
              <div className={`line ${menuOpen ? 'rotate-bottom' : ''}`}></div>
            </div>
          </div>
        </div>

        {/* Vertical Menu for Tablet and Mobile */}
        <div className={`menu-mobile ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/doctors" onClick={() => setMenuOpen(false)}>Our Providers</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
