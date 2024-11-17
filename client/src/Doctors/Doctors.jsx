import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router DOM
import AuthContext from '../context/AuthContext'; // Import AuthContext for login check
import './Doctors.css';

const Doctors = () => {
  const { user } = useContext(AuthContext); // Access user data from context
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const specializations = ["Cardiology", "Oncology", "Neurology", "Ophthalmology", "Pediatrics"];

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/doctors');
        setDoctors(res.data);
        setFilteredDoctors(res.data); // Initialize filtered doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query and selected specialization
  const filterDoctors = (query, specialization) => {
    const lowerCaseQuery = query.toLowerCase();

    const filtered = doctors.filter(doctor => {
      const matchesQuery = doctor.doctor_name && doctor.doctor_name.toLowerCase().includes(lowerCaseQuery);
      const matchesSpecialization = !specialization || doctor.specialization === specialization;

      return matchesQuery && matchesSpecialization;
    });

    setFilteredDoctors(filtered);
  };

  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    filterDoctors(newQuery, selectedSpecialization);
  };

  const handleSpecializationChange = (event) => {
    const newSpecialization = event.target.value;
    setSelectedSpecialization(newSpecialization);
    filterDoctors(searchQuery, newSpecialization);
  };

  return (
    <div className="doctors-page-container">
      <div className="contact-header">
        <div className="container">
          <h1>Our Providers</h1>
        </div>
      </div>

      <div className="doctors-page">
        <div className="left-sidebar">
          <h2 className="filter-title">Find the Right Specialist for You</h2>
          
          {/* Search input */}
          <label htmlFor="search">Search by name:</label>
          <input 
            type="text" 
            id="search"
            placeholder="Enter doctor's name..." 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
          
          {/* Specialization filter */}
          <label htmlFor="specialization">Filter by Specialization:</label>
          <select id="specialization" value={selectedSpecialization} onChange={handleSpecializationChange}>
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="doctors-list">
          {user ? (
            <div className="doctors-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Link to={`/doctors/${doctor.id}`} className="doctor-card" key={doctor.id}>
                    <img 
                      src={`data:image/jpeg;base64,${doctor.image}`} 
                      alt={doctor.doctor_name || 'Doctor'} 
                      className="doctor-image"
                    />
                    <h3>{doctor.doctor_name || 'Name Not Available'}</h3>
                    <p>{doctor.specialization}</p>
                    <p>{doctor.qualification}</p>
                    <button className="book-appointment-btn">Book Appointment</button>
                  </Link>
                ))
              ) : (
                <h3>No Doctors Found</h3>
              )}
            </div>
          ) : (
            <div className="login-message">
            <p>
  <strong style={{ fontSize: '25px', marginBottom: '15px' }}>
    Please login to book an appointment.
  </strong>
</p>

              <Link to="/login">
                <button className="login-button-2">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
