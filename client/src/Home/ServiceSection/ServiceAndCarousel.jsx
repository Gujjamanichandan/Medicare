import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ServiceAndCarousel.css'; 

const services = [
  {
    image: 'images/cardiology.png', 
    title: 'Cardiology',
    description: 'Our board-certified cardiologists treat and prevent cardiovascular problems with a focus on heart health.',
  },
  {
    image: 'images/oncology.png', 
    title: 'Oncology',
    description: 'Cancer treatments provided by our oncologists are personalized and provided with unwavering support.',
  },
  {
    image: 'images/neurology.png', 
    title: 'Neurology',
    description: 'Specialized care for brain and nerve disorders, ensuring expert diagnosis and compassionate treatment.',
  },
  {
    image: 'images/ophthalmology.png',
    title: 'Ophthalmology',
    description: 'In order to keep your vision healthy, our ophthalmologists provide eye exams and surgeries.',
  },
  {
    image: 'images/pediatrics.png', 
    title: 'Pediatrics',
    description: 'Complete care for children, from check-ups to treatments, delivered with compassion and expertise.',
  },
];

const ServiceAndCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false); 
  const sectionRef = useRef(null); 

  const totalItems = services.length;

  const handleNext = () => {
    if (currentIndex < totalItems - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false); 
          }
        });
      },
      { threshold: 0.1 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className={`service-carousel-container ${isVisible ? 'zoom-in' : ''}`} ref={sectionRef}>
      <div className="service-section">
        <div className="content-container">
          <span className="service-label">Services</span>
          <h2 className="service-heading">The Best Quality Service You Can Get</h2>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="service-carousel">
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(-${currentIndex * 33.33}%)`,
          }}
        >
          {services.map((service, index) => (
            <div className="carousel-item" key={index}>
              <div className="service-card">
                <div className="image-circle">
                  <img src={require(`./${service.image}`)} alt={service.title} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="carousel-controls">
          <FaChevronLeft
            className={`control-left ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrev}
          />
          <FaChevronRight
            className={`control-right ${currentIndex === totalItems - 3 ? 'disabled' : ''}`}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceAndCarousel;
