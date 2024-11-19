import React, { useState } from 'react';

const PatientDetailsForm = ({ fullName, setFullName, email, setEmail, phone, setPhone, dob, setDob, symptoms, setSymptoms }) => {
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    symptoms: '' 
  });

  const validateFullName = (value) => {
    if (!value) {
      return 'Full name is required';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Email is invalid';
    }
    return '';
  };

  const validatePhone = (value) => {
    if (!value) {
      return 'Phone number is required';
    } else if (!/^\d{10}$/.test(value)) {
      return 'Phone number must be 10 digits';
    }
    return '';
  };

  const validateDob = (value) => {
    if (!value) {
      return 'Date of birth is required';
    }

    // Check if the entered date is in the future
    const today = new Date();
    const dobDate = new Date(value);
    if (dobDate > today) {
      return 'Date of birth cannot be in the future';
    }

    return '';
  };

  const validateSymptoms = (value) => {
    if (!value) {
      return 'Symptoms are required';
    }
    return '';
  };

  const handleChange = (e, validationFunction) => {
    const { name, value } = e.target;
    let errorMessage = validationFunction(value);

    // Update the corresponding error message in the state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    // Update the field value
    if (name === 'fullName') {
      setFullName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else if (name === 'dob') {
      setDob(value);
    } else if (name === 'symptoms') {
      setSymptoms(value);
    }
  };

  return (
    <>
      <h4>Patient Details</h4>
      <div className="patient-details">
        <label htmlFor="full-name">Full Name:</label>
        <input 
          type="text" 
          id="full-name" 
          name="fullName"
          value={fullName} 
          onChange={(e) => handleChange(e, validateFullName)} 
          required 
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}
        
        <div className="patient-contact">
          <div className="contact-field">
            <label htmlFor="email">Email Address:</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={email} 
              onChange={(e) => handleChange(e, validateEmail)} 
              required 
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="contact-field">
            <label htmlFor="phone">Phone Number:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={phone} 
              onChange={(e) => handleChange(e, validatePhone)} 
              required 
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
        </div>

        <div className="patient-info">
          <div className="info-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input 
              type="date" 
              id="dob" 
              name="dob"
              value={dob} 
              onChange={(e) => handleChange(e, validateDob)} 
              required 
            />
            {errors.dob && <p className="error">{errors.dob}</p>}
          </div>
        </div>

        <label htmlFor="symptoms">Symptoms:</label>
        <textarea 
          id="symptoms" 
          name="symptoms"
          value={symptoms} 
          onChange={(e) => handleChange(e, validateSymptoms)} 
          required 
        />
        {errors.symptoms && <p className="error">{errors.symptoms}</p>}
      </div>
    </>
  );
};

export default PatientDetailsForm;
