import React from 'react';
import './About.css';
import bannerImg from './about_banner.jpg';
import missionImg from './about_ourMission.jpg';
import apartImg from './about_whatSetsApart.jpg';
import doctor1Img from './about_doctor1.png';
import doctor2Img from './about_doctor2.png';
import doctor3Img from './about_doctor3.png';
import doctor4Img from './about_doctor4.png';
import appointmentImg from './about_getAppointmentBanner.jpg';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero fade-in">
        <div className="container">
          <h1>About Us</h1>
        </div>
      </section>

      <section className="stay-healthy-section fade-in">
        <div className="container">
          <h2 id='firsthead'>Stay Healthy With 100% Treatment</h2>
          <p>
            At MedCare, our unwavering commitment to health excellence drives our mission. 
            With a dedicated team of medical experts, cutting-edge research, and a passion 
            for compassionate care.
          </p>
          <img src={bannerImg} alt="Stay Healthy" className="stay-healthy-img"/>
        </div>
      </section>

      <section className="mission-section fade-in">
        <div className="container mission-flex">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              Our mission is to promote health literacy, facilitate access to quality care, 
              and raise awareness for healthier living through MedCare.
            </p>
            <ul>
              <li>✔ Empower Informed Decision-Making</li>
              <li>✔ Promote Health Literacy</li>
              <li>✔ Foster a supportive community</li>
              <li>✔ Facilitate access to quality care</li>
              <li>✔ Promote ethical medical practices</li>
            </ul>
          </div>
          <div className="mission-img">
            <img src={missionImg} alt="Our Mission"/>
          </div>
        </div>
      </section>

      <section className="apart-section fade-in">
        <div className="container apart-flex">
          <div className="apart-img">
            <img src={apartImg} alt="What Sets Us Apart"/>
          </div>
          <div className="apart-text">
            <h2>What Sets Us Apart</h2>
            <p>
              MedCare is committed to delivering accurate and up-to-date medical information. 
              Our content is curated by a team of medical experts, ensuring you receive information 
              you can rely on.
            </p>
          </div>
        </div>
      </section>

      <section className="doctors-section fade-in">
        <div className="container">
          <h2>Get Service From Our Quality Doctors</h2>
          <div className="doctors">
            <div className="doctor">
              <img src={doctor1Img} alt="Dr. David Martin"/>
              <h3>Dr. David Martin</h3>
              <p>Cardiologist</p>
              <button className="book-btn">Book Appointment</button>
            </div>
            <div className="doctor">
              <img src={doctor2Img} alt="Dr. Robert Jackson"/>
              <h3>Dr. Robert Jackson</h3>
              <p>Neurologist</p>
              <button className="book-btn">Book Appointment</button>
            </div>
            <div className="doctor">
              <img src={doctor3Img} alt="Dr. Sarah Davis"/>
              <h3>Dr. Sarah Davis</h3>
              <p>Dermatologist</p>
              <button className="book-btn">Book Appointment</button>
            </div>
            <div className="doctor">
              <img src={doctor4Img} alt="Dr. Emily Rodriguez"/>
              <h3>Dr. Emily Rodriguez</h3>
              <p>Pediatrician</p>
              <button className="book-btn">Book Appointment</button>
            </div>
          </div>
        </div>
      </section>

      <section className="appointment-banner fade-in">
        <div className="container appointment-flex">
          <div className="appointment-text">
            <h2>Get an Appointment Today!</h2>
            <p>
              Schedule an appointment with one of our specialists and take the first 
              step towards a healthier you.
            </p>
            <button className="appointment-btn">Get Appointment</button>
          </div>
          <div className="appointment-img">
            <img src={appointmentImg} alt="Appointment Banner"/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
