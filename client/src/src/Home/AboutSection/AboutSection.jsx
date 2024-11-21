import React, { useEffect, useRef, useState } from 'react';
import './AboutSection.css';
import aboutImage from './about-image.png';
import { Link } from 'react-router-dom'; 

const AboutSection = () => {
  const [patientsCount, setPatientsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounts();
          setHasAnimated(true); // it prevent reanimation
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounts = () => {
    const animateCount = (target, setter, duration) => {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setter(start);
        if (start === target) clearInterval(timer);
      }, stepTime);
    };

    animateCount(50, setPatientsCount, 2000); // Animate to 50K
    animateCount(5, setExperienceCount, 2000); // Animate to 05
    animateCount(300, setReviewsCount, 2000); // Animate to 300
    animateCount(24, setServiceCount, 2000); // Animate to 24
  };

  return (
    <div className="about-section-container" ref={sectionRef}>
      <div className="about-left-column">
        <span className="about-label">About</span>
        <h2 className="about-title">Stay Healthy With 100% Treatment</h2>
        <p>
          At MedCare, our unwavering commitment to health excellence drives our mission. With a dedicated team of medical experts, cutting-edge research, and a passion for compassionate care.
        </p>

        {/* New Section for 2x2 Boxes */}
        <div className="info-grid">
          <div className="info-box">
            <h3>{patientsCount}K +</h3>
            <p>Recover Patients</p>
          </div>
          <div className="info-box">
            <h3>{experienceCount} +</h3>
            <p>Years Experience</p>
          </div>
          <div className="info-box">
            <h3>{reviewsCount} +</h3>
            <p>Positive Reviews</p>
          </div>
          <div className="info-box">
            <h3>{serviceCount}/7</h3>
            <p>Customer Service</p>
          </div>
        </div>

        <Link to="/about" className="learn-more-button">
  Learn More
</Link>      </div>
      <div className="about-right-column">
        <img src={aboutImage} alt="About" className="about-image" />
      </div>
    </div>
  );
};

export default AboutSection;
