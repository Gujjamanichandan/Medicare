import React from 'react';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-column">
        <div className="footer-logo">
            <img src="/footer-logo.png" alt="Footer Logo" className="footer-logo" />
          </div>          <p className="description">We ensure quality healthcare with state-of-the-art <br></br>facilities and patient-focused solutions.</p>
          <div className="social-icons">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
          </div>
          <div className="location">
            <FaMapMarkerAlt />
            <span>274 Colborne St, Brantford, ON N3T 2L6</span>
          </div>
        </div>

        <div className="footer-column2">
          <h4>Quick Links</h4>
          <ul>
          <li><Link to="/">Home</Link></li>  
      <li><Link to="/about">About Us</Link></li> 
      <li><Link to="/doctors">Doctors</Link></li> 
      <li><Link to="/login">Login</Link></li> 
      <li><Link to="/signup">Sign Up</Link></li> 
          </ul>
        </div>

        <div className="footer-column3">
          <h4>Contact Information</h4>
          <div className="contact-info">
            <div className="contact-item"><FaPhone /> 123-456-7890</div>
            <div className="contact-item"><FaPhone /> 098-765-4321</div>
            <div className="contact-item">
            </div>
            <div className="hours">
            <h4>Hours</h4>
            <span>Monday-Friday : 9:00AM-5:00 PM</span>



            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
