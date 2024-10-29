import React,{ useState } from 'react';
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
          <div className="inside-vector-wrap">
            <img src="https://cdn.prod.website-files.com/65c992c37023d69385565acc/65c9e13f750e419cee597826_Inside-vector-semi-small.svg" alt="Vector" className="inside-vector-semi-small" />
            <img src="https://cdn.prod.website-files.com/65c992c37023d69385565acc/65c9de018f2da12e347fcd04_Inside-vector-small.svg" alt="Vector" className="inside-vector-small" />
            <img src="https://cdn.prod.website-files.com/65c992c37023d69385565acc/65c9e204960864bf2bf89d45_Inside-vector-medium.svg" alt="Vector" className="inside-vector-medium" />
            <img src="https://cdn.prod.website-files.com/65c992c37023d69385565acc/65c9e2c5ec86042bc9b16610_Inside-vector-large.svg" alt="Vector" className="inside-vector-large" />
            <img src="https://cdn.prod.website-files.com/65c992c37023d69385565acc/65c9e4d5c6aa622c9820a98d_Inside-vector-semi-large.svg" alt="Vector" className="inside-vector-semi-large" />
          </div>
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
              <input
                type="text"
                className="contact-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <input
                type="email"
                className="contact-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <input
                type="tel"
                className="contact-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />
              <input
                type="text"
                className="contact-input"
                name="subject"
                placeholder="Write your Subject"
                required
              />
            </div>
            <textarea
              className="contact-textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
            ></textarea>
            <button type="submit" className="contact-submit-button">Send Message</button>
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
