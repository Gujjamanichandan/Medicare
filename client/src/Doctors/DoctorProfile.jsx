import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker'; // Import the date picker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker
import { useParams } from 'react-router-dom';
import './DoctorProfile.css'; // Custom styling

const DoctorProfile = () => {
  const { id } = useParams(); // Get the doctor's id from the URL
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);  // Store the doctor's available schedule
  const [selectedDate, setSelectedDate] = useState(null); // Date from calendar
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [confirmation, setConfirmation] = useState(''); // Store confirmation message

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
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchDoctor();
    fetchSchedule();
  }, [id]); // Re-fetch if the id changes

  // Highlight available days in the calendar
  const highlightAvailableDays = schedule.map(slot => {
    const today = new Date();
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(slot.available_day);
    const nextAvailableDate = new Date(today);
    nextAvailableDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
    return nextAvailableDate;
  });

  // Check if the selected date is available
  const isAvailableDay = (date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return schedule.some(slot => slot.available_day === dayOfWeek);
  };

  // Get available times for the selected day
  const getAvailableTimesForSelectedDay = () => {
    if (!selectedDate) return [];

    const selectedDayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
    const availableSlot = schedule.find(slot => slot.available_day === selectedDayOfWeek);

    return availableSlot ? [
      availableSlot.timeslot1,
      availableSlot.timeslot2,
      availableSlot.timeslot3,
      availableSlot.timeslot4,
      availableSlot.timeslot5
    ].filter(Boolean) : []; // Only keep valid time values
  };

  // Handle the appointment submission
  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    try {
      const appointmentData = {
        doctor_id: id,
        appointment_date: selectedDate,
        start_time: selectedTime,
        symptoms: symptoms
      };
      await axios.post('http://localhost:5000/appointments', appointmentData);
      setConfirmation('Appointment successfully booked!');
    } catch (error) {
      console.error('Error booking appointment:', error);
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
  <div className="datepicker-wrapper">
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
  </div>
  {/* Display available times beside the calendar */}
  {selectedDate && (
    <div className="available-times">
      <h4>Available Times:</h4>
      <ul>
        {getAvailableTimesForSelectedDay().map((timeslot, index) => (
          <li 
            key={index} 
            onClick={() => setSelectedTime(timeslot)}
            className={selectedTime === timeslot ? 'selected' : ''} // Add selected class
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

          {/* Symptoms */}
          <label htmlFor="symptoms">Symptoms:</label>
          <textarea 
            id="symptoms" 
            value={symptoms} 
            onChange={(e) => setSymptoms(e.target.value)} 
            required 
          />

          <button type="submit">Submit Appointment</button>
        </form>

        {confirmation && <p>{confirmation}</p>}
      </div>
    </div>
  );
};

export default DoctorProfile;
