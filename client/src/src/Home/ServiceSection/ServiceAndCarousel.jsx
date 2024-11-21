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
  const [visibleItems, setVisibleItems] = useState(3); // Default to 3 items for desktop
  const sectionRef = useRef(null);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth <= 768) {
        setVisibleItems(1); // Show 1 item for mobile
      } else {
        setVisibleItems(3); // Show 3 items for desktop
      }
    };

    window.addEventListener('resize', updateVisibleItems);
    updateVisibleItems(); // Set initial value

    return () => {
      window.removeEventListener('resize', updateVisibleItems);
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < services.length - visibleItems) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="service-carousel-container" ref={sectionRef}>
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
            transform: `translateX(-${(currentIndex * 100) / visibleItems}%)`,
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
            className={`control-right ${
              currentIndex === services.length - visibleItems ? 'disabled' : ''
            }`}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceAndCarousel;
