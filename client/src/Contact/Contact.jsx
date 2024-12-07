import React, { useState } from 'react';
import './Contact.css';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message); // Display success message
      setFormData({ name: '', email: '', phone: '', message: '' }); // Reset form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error submitting the form. Please try again later.');
    }
  };


  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1>Contact Us</h1>
        </div>
      </div>

      <div className='content'>
         <h1>Reach Out for Health and Wellness <br></br>
                   Assistance Today!</h1>
      </div>
      <div className= "box-container">
        <div className="box-1">
        <img src={require('../Asset/location-logo.png')} alt="Location" />
         <h2>Office location</h2>
         <p>274 Colborne St, Brantford,<br></br> ON N3T 2L6</p>
        </div>
        <div className="box-2">
        <img src={require('../Asset/cell-logo.png')} alt="Location" />
        <h2>Phone Number</h2>
        <p>123-456-7890<br></br> 098-765-4321</p>
        </div>  
        <div className="box-3">
        <img src={require('../Asset/email-logo.png')} alt="Location" />
        <h2>Email</h2>
        <p>medicare@gmail.com<br></br>emergencyM@gmail.com</p>
        </div>
      </div>

      <div className="contact-page">
      <div className="contact-form-container">
        <div className="section-title-wrap">
          <div className="section-sub-title">Get in Touch</div>
          <h2 className="section-title">Contact Us for Personalized Assistance and Quick Resolutions.</h2>
        </div>
        <div className="contact-form-wrapper">
        <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
  <div className="contact-input-grid">
    {/* Name Validation */}
    <input
      type="text"
      className="contact-input"
      name="name"
      value={formData.name}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) { // Allow only letters and spaces
          handleChange(e);
        }
      }}
      placeholder="Your name"
      required
    />
    {formData.name && formData.name.length < 3 && (
      <span className="validation-error">Name must be at least 3 characters.</span>
    )}

    {/* Email Validation */}
    <input
      type="email"
      className="contact-input"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Enter your email"
      required
    />
    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email.length > 0 && (
      <span className="validation-error">Please enter a valid email address.</span>
    )}

    {/* Phone Number Validation */}
    <input
      type="tel"
      className="contact-input"
      name="phone"
      value={formData.phone}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) { // Allow only numeric values up to 10 digits
          handleChange(e);
        }
      }}
      placeholder="Your phone number"
      required
    />
    {formData.phone && formData.phone.length !== 10 && (
      <span className="validation-error">Phone number must be 10 digits.</span>
    )}

    {/* Subject Validation */}
    <input
      type="text"
      className="contact-input"
      name="subject"
      value={formData.subject}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[a-zA-Z0-9\s.,!?]*$/.test(value)) { // Allow letters, numbers, and basic punctuation
          handleChange(e);
        }
      }}
      placeholder="Write your Subject"
      required
    />
    {formData.subject && formData.subject.length < 5 && (
      <span className="validation-error">Subject must be at least 5 characters.</span>
    )}
  </div>

  {/* Message Validation */}
  <textarea
    className="contact-textarea"
    name="message"
    value={formData.message}
    onChange={(e) => {
      const value = e.target.value;
      if (value.length <= 500) { // Limit to 500 characters
        handleChange(e);
      }
    }}
    placeholder="Write your message..."
    required
  ></textarea>
  {formData.message && formData.message.length < 10 && (
    <span className="validation-error">Message must be at least 10 characters.</span>
  )}
  {formData.message && formData.message.length > 500 && (
    <span className="validation-error">Message cannot exceed 500 characters.</span>
  )}

  <button type="submit" className="contact-submit-button" disabled={
    !formData.name || formData.name.length < 3 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
    !formData.phone || formData.phone.length !== 10 ||
    !formData.subject || formData.subject.length < 5 ||
    !formData.message || formData.message.length < 10 || formData.message.length > 500
  }>
    Send Message
  </button>
</form>

        </div>
      </div>
    </div>


     <div className="map-container">
    <iframe
      title="Conestoga College Brantford Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2914.1230178987556!2d-80.25694168451985!3d43.13938697914262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c79b31e792d55%3A0x7cdb77bc3e9ae43!2sConestoga%20College%20-%20Brantford%20Campus!5e0!3m2!1sen!2sca!4v1696174893215!5m2!1sen!2sca"
      width="600"
      height="450"
      style={{ border: 0, width: '1200px', height: '450px', borderRadius: '10px' }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade">
    </iframe>
  </div>
    </div>
  );
};

export default Contact;
