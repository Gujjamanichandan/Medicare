import React from 'react';
import AboutSection from './AboutSection/AboutSection';
import './Home.css';
import OurDoctors from './OurDoctors/OurDoctors';
import ServiceAndCarousel from './ServiceSection/ServiceAndCarousel';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';

const Home = () => {
  return (
    <div className="home">
      {/* First Section */}
      <div className="homepage-first-section">
        <div className="content-container" id='home-bg'>
          <h1 className="title">Caring for Your</h1>
        </div>
      </div>

      <div className="homepage-second-section">
        <div className="content-container">
          <div className="two-columns">
            <div className="column">
              <p id='home-text'>We are dedicated to providing the highest quality of care to our patients. Our compassionate staff is here to support your health and wellness journey.</p>
            </div>
            <div className="column">
              <h1 className="title" id='home-text2'>WELL-BEING</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="homepage-third-section">
        <div className="content-container">
          <img
            src={require('./successful-medical-team_329181-9252.jpg')} 
            alt="Successful Medical Team"
            className="team-image"
          />
        </div>
      </div>

{/* Our Doctors */}
  
<AboutSection /> 
    <ServiceAndCarousel />
    <OurDoctors />
    <WhyChooseUs />

    

    </div>
  );
};



export default Home;
