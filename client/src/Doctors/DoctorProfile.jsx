

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker'; // Import the date picker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker
import { useLocation, useParams } from 'react-router-dom'; // Import useLocation and useParams
import './DoctorProfile.css'; // Custom styling

const DoctorProfile = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the doctor's id from the URL

  // Appointment editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  // Doctor and scheduling data
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]); // Store the doctor's available schedule
  const [availableTimes, setAvailableTimes] = useState([]);

  // Appointment form fields
  const [selectedDate, setSelectedDate] = useState(null); // Date from calendar
  const [selectedTime, setSelectedTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [confirmation, setConfirmation] = useState(''); // Store confirmation message

  useEffect(() => {
    // Check if editing mode is enabled
    if (location.state?.isEditing) {
      const appointment = location.state.appointment;
      setIsEditing(true);
      setEditingAppointmentId(appointment.id);
      setSelectedDate(new Date(appointment.appointment_date));
      setSelectedTime(appointment.start_time);
      setFullName(appointment.full_name);
      setEmail(appointment.email);
      setPhone(appointment.phone);
      setDob(new Date(appointment.dob).toISOString().split('T')[0]); // Ensure dob is formatted as YYYY-MM-DD
      setSymptoms(appointment.symptoms || '');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      const times = await getAvailableTimesForSelectedDay();
      setAvailableTimes(times);
    };

    if (selectedDate) {
      fetchAvailableTimes();
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, schedule]);

  useEffect(() => {
    // Fetch the doctor's data by id
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}`);
        setDoctor(res.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    // Fetch the doctor's schedule
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}/schedule`);
        setSchedule(res.data); // Set the available schedule for the doctor

        // Set the closest available date
        const closestDate = findClosestAvailableDate(res.data);
        if (!isEditing && closestDate) {
          setSelectedDate(closestDate);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchDoctor();
    fetchSchedule();
  }, [id, isEditing]); // Re-fetch if the id changes or editing mode is toggled

  // Function to find the closest available date
  const findClosestAvailableDate = (schedule) => {
    const today = new Date();
    const availableDates = [];

    schedule.forEach((slot) => {
      const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(slot.available_day);
      const nextAvailableDate = new Date(today);
      nextAvailableDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
      availableDates.push(nextAvailableDate);
    });

    // Sort the available dates and find the closest one
    availableDates.sort((a, b) => a - b);
    return availableDates[0]; // Return the closest date
  };

  // Highlight available days in the calendar
  const highlightAvailableDays = schedule.map((slot) => {
    const today = new Date();
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(slot.available_day);
    const nextAvailableDate = new Date(today);
    nextAvailableDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
    return nextAvailableDate;
  });

  // Check if the selected date is available
  const isAvailableDay = (date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return schedule.some((slot) => slot.available_day === dayOfWeek);
  };

  // Get available times for the selected day
  const getAvailableTimesForSelectedDay = async () => {
    if (!selectedDate) return [];

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Fetch booked time slots for the selected doctor and date
      const res = await axios.get(
        `http://localhost:5000/appointments/booked-slots/${id}/${formattedDate}`
      );
      const bookedSlots = res.data;

      // Find the available slots for the selected day of the week
      const selectedDayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
      const availableSlot = schedule.find((slot) => slot.available_day === selectedDayOfWeek);

      return availableSlot
        ? [
            availableSlot.timeslot1,
            availableSlot.timeslot2,
            availableSlot.timeslot3,
            availableSlot.timeslot4,
            availableSlot.timeslot5,
          ].filter((slot) => slot && !bookedSlots.includes(slot)) // Exclude already booked slots
        : [];
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
  };

  

  // Handle the appointment submission
  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
  
    // Get the token from localStorage
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
    if (!token) {
      alert('You need to be logged in to book an appointment');
      return;
    }
  
    try {
      const appointmentData = {
        doctor_id: id,
        appointment_date: selectedDate?.toISOString().split('T')[0], // Format to YYYY-MM-DD
        start_time: selectedTime,
        full_name: fullName,
        email: email,
        phone: phone,
        dob: dob,
        symptoms: symptoms,
      };
  
      const endpoint = isEditing
        ? `http://localhost:5000/appointments/${editingAppointmentId}`
        : `http://localhost:5000/appointments`;
  
      const method = isEditing ? 'PATCH' : 'POST';
  
      // Send the token in the Authorization header
      const response = await axios({
        method,
        url: endpoint,
        data: appointmentData,
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      });
  
      // Set success message based on action
      setConfirmation(isEditing ? 'Appointment successfully updated!' : 'Appointment successfully booked!');
  
      // Clear the form fields after successful submission
      setFullName('');
      setEmail('');
      setPhone('');
      setDob('');
      setSymptoms('');
      setSelectedDate(null);
      setSelectedTime('');
      setEditingAppointmentId(null); // Reset editing state
      setIsEditing(false);
    } catch (error) {
      console.error('Error handling appointment:', error.response?.data || error);
  
      // Handle specific cases for duplicate entries or token expiration
      if (error.response?.status === 409) {
        alert('This time slot is already booked. Please choose a different time.');
      } else if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert(`Failed to process appointment: ${error.response?.data?.message || error.message}`);
      }
    }
  };
  

  
  

  // Format selected date and time for display
  const formatSelectedDateAndTime = () => {
    if (selectedDate && selectedTime) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = selectedDate.toLocaleDateString('en-US', options);
      return `${formattedDate}, at ${selectedTime}`;
    }
    return '';
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-profile-container">
      <div className="doctor-left-column">
        <img 
          src={`data:image/jpeg;base64,${doctor.image}`} 
          alt={doctor.doctor_name || 'Doctor'} 
          className="doctor-image"
        />
        <div className="doctor-info">
          <h3>Specialization</h3>
          <p>{doctor.specialization}</p>
          <h3>Qualification</h3>
          <p>{doctor.qualification}</p>
        </div>
      </div>

      <div className="doctor-right-column">
        <h1>{doctor.doctor_name}</h1>
        <p className="doctor-description">{doctor.description}</p>

        {/* Appointment form */}
        <form onSubmit={handleAppointmentSubmit}>
          <h3>Book an Appointment</h3>

          {/* Select date using DatePicker */}
          <label htmlFor="date">Select a Day:</label>
          <div className="datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              highlightDates={highlightAvailableDays} // Highlight available days
              filterDate={isAvailableDay} // Only enable available days
              placeholderText="Select an available day"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()} // Prevent selection of past dates
              maxDate={new Date(new Date().setDate(new Date().getDate() + 14))} // Restrict selection to 2 weeks from today
              inline // Shows the calendar inline
            />
            {/* Display available times beside the calendar */}
            {selectedDate && (
              <div className="available-times">
                <h4>Available Times:</h4>
                <ul>
                {availableTimes.map((timeslot, index) => (
            <li 
              key={index} 
              onClick={() => setSelectedTime(timeslot)}
              className={selectedTime === timeslot ? 'selected' : ''}
            >
              {timeslot}
            </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Display selected date and time */}
          {selectedDate && selectedTime && (
            <p>
              You have selected: <strong>{formatSelectedDateAndTime()}</strong>
            </p>
          )}

          {/* Patient details section shown after selecting date and time */}
          {selectedDate && selectedTime && (
            <>
          <h4>Patient Details</h4>
<div className="patient-details">
  <label htmlFor="full-name">Full Name:</label>
  <input
    type="text"
    id="full-name"
    value={fullName}
    onChange={(e) => {
      const value = e.target.value;
      if (/^[a-zA-Z\s]*$/.test(value)) { // Allow only letters and spaces
        setFullName(value);
      }
    }}
    required
  />
  {fullName && fullName.length < 3 && (
    <span className="validation-error">Full name must be at least 3 characters.</span>
  )}
  
  <div className="patient-contact">
    <div className="contact-field">
      <label htmlFor="email">Email Address:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0 && (
        <span className="validation-error">Please enter a valid email address.</span>
      )}
    </div>
    <div className="contact-field">
      <label htmlFor="phone">Phone Number:</label>
      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) { // Allow only numeric values up to 10 digits
            setPhone(value);
          }
        }}
        required
      />
      {phone && phone.length !== 10 && (
        <span className="validation-error">Phone number must be 10 digits.</span>
      )}
    </div>
  </div>

  <div className="patient-info">
    <div className="info-field">
      <label htmlFor="dob">Date of Birth:</label>
      <input
        type="date"
        id="dob"
        value={dob}
        onChange={(e) => {
          const today = new Date();
          const selectedDate = new Date(e.target.value);
          if (selectedDate <= today) { // Prevent future dates
            setDob(e.target.value);
          }
        }}
        required
      />
      {dob && new Date(dob) > new Date() && (
        <span className="validation-error">Date of birth cannot be in the future.</span>
      )}
    </div>
  </div>

  <label htmlFor="symptoms">Symptoms:</label>
  <textarea
    id="symptoms"
    value={symptoms}
    onChange={(e) => setSymptoms(e.target.value)}
    required
  />
  {symptoms && symptoms.length < 5 && (
    <span className="validation-error">Symptoms must be at least 5 characters.</span>
  )}
</div>

            </>
          )}

          {/* Submit button, always visible initially */}
          <button type="submit" disabled={!selectedDate || !selectedTime}>
            Submit Appointment
          </button>
        </form>

        {confirmation && (
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }} className="confirmation-message">
            {confirmation}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;

