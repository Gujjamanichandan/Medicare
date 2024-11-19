import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import './DoctorProfile.css';
import PatientDetailsForm from './PatientDetailsForm'; // Import the new component

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}`);
        setDoctor(res.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctors/${id}/schedule`);
        setSchedule(res.data);
        const closestDate = findClosestAvailableDate(res.data);
        if (closestDate) {
          setSelectedDate(closestDate);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchDoctor();
    fetchSchedule();
  }, [id]);

  const findClosestAvailableDate = (schedule) => {
    const today = new Date();
    const availableDates = [];
    schedule.forEach(slot => {
      const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(slot.available_day);
      const nextAvailableDate = new Date(today);
      nextAvailableDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
      availableDates.push(nextAvailableDate);
    });
    availableDates.sort((a, b) => a - b);
    return availableDates[0];
  };

  const highlightAvailableDays = schedule.map(slot => {
    const today = new Date();
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(slot.available_day);
    const nextAvailableDate = new Date(today);
    nextAvailableDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
    return nextAvailableDate;
  });

  const isAvailableDay = (date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return schedule.some(slot => slot.available_day === dayOfWeek);
  };

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
    ].filter(Boolean) : [];
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to book an appointment');
      return;
    }

    try {
      const appointmentData = {
        doctor_id: id,
        appointment_date: selectedDate.toISOString().split('T')[0],
        start_time: selectedTime,
        full_name: fullName,
        email: email,
        phone: phone,
        dob: dob,
        symptoms: symptoms,
      };

      const response = await axios.post('http://localhost:5000/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConfirmation('Appointment successfully booked!');
      setFullName('');
      setEmail('');
      setPhone('');
      setDob('');
      setSymptoms('');
      setSelectedDate(null);
      setSelectedTime('');
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error);
      alert(`Failed to book appointment: ${error.response?.data?.message || error.message}`);
    }
  };

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

        <form onSubmit={handleAppointmentSubmit}>
          <h3>Book an Appointment</h3>

          <label htmlFor="date">Select a Day:</label>
          <div className="datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              highlightDates={highlightAvailableDays}
              filterDate={isAvailableDay}
              placeholderText="Select an available day"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 14))}
              inline
            />
            {selectedDate && (
              <div className="available-times">
                <h4>Available Times:</h4>
                <ul>
                  {getAvailableTimesForSelectedDay().map((timeslot, index) => (
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

          {selectedDate && selectedTime && (
            <p>
              You have selected: <strong>{formatSelectedDateAndTime()}</strong>
            </p>
          )}

          {selectedDate && selectedTime && (
            <PatientDetailsForm 
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              dob={dob}
              setDob={setDob}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
            />
          )}

          <button type="submit" disabled={!selectedDate || !selectedTime}>
            Book Appointment
          </button>
        </form>

        {confirmation && <p className="confirmation-message">{confirmation}</p>}
      </div>
    </div>
  );
};

export default DoctorProfile;
