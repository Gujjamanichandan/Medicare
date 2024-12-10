import React from 'react';
import { Link } from 'react-router-dom';
import './OurDoctors.css';

const doctors = [
  {
    image: 'images/Dr. Sarah Hendricks, MD, FESC - Cardiology.jpg',
    specialization: 'Cardiology',
    name: 'Dr. Sarah Hendricks',
    qualifications: 'MD, FESC',
  },
  {
    image: 'images/Dr. Matthew Evans, MD, FRCP - Neurology.jpg',
    specialization: 'Neurology',
    name: 'Dr. Matthew Evans',
    qualifications: 'MD, FRCP',
  },
  {
    image: 'images/Dr. Daniel Greene, MD, FACP - Oncology.jpg',
    specialization: 'Oncology',
    name: 'Dr. Daniel Greene',
    qualifications: 'MD, FACP',
  },
  {
    image: 'images/Dr. Christopher Davis, MD, FAAP - Pediatrics.jpg',
    specialization: 'Pediatrics',
    name: 'Dr. Christopher Davis',
    qualifications: 'MD, FAAP',
  },
];

const OurDoctors = () => {
  return (
    <div className="our-doctors-section">
      <div className="our-doctors-header">
        <div className="left-column">
          <span className="small-text">Our Specialists</span>
          <h2 className="main-title">
            Get Service From Our <br /> Quality Doctors
          </h2>
        </div>
        <div className="right-column">
        <Link to="/doctors">
        <button className="view-all-doctors-btn">View All Doctors</button>
      </Link>        </div>
      </div>

      <div className="doctors-grid-home">
        {doctors.map((doctor, index) => (
          <div className="doctor-card" key={index}>
            <img src={require(`./${doctor.image}`)} alt={doctor.name} className="doctor-image" />
            <span className="doctor-specialization">{doctor.specialization}</span>
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-qualifications">{doctor.qualifications}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurDoctors;
