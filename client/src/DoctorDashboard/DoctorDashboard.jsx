import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext); // Access user data from context
  const [doctorInfo, setDoctorInfo] = useState(null); // Doctor information
  const [appointments, setAppointments] = useState([]); // Doctor's appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/doctor-dashboard/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data); // Set the updated appointment list
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Unable to fetch appointments. Please try again later.');
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch doctor's information and appointments
      const fetchDoctorData = async () => {
        try {
          const token = localStorage.getItem('token');
          const doctorResponse = await axios.get('http://localhost:5000/doctor-dashboard/info', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctorInfo(doctorResponse.data);

          await fetchAppointments(); // Fetch appointments
        } catch (error) {
          console.error('Error fetching doctor data:', error);
          setError('Unable to fetch data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchDoctorData();
    }
  }, [user]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/doctor-dashboard/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Re-fetch appointments to ensure UI is in sync with the backend
      await fetchAppointments();

      if (newStatus === 'Cancelled') {
        alert('Appointment status updated to Cancelled. The time slot is now available.');
      } else {
        alert('Appointment status updated successfully.');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status. Please try again later.');
    }
  };

  const formatDate = (date) => new Date(date).toISOString().split('T')[0];
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="doctor-dashboard">
      {/* Left Sidebar */}
      <div className="doctor-info">
        <h2>My Information</h2>
        {doctorInfo ? (
          <div className="info-container">
            {/* Doctor Image */}
            <div className="image-container">
              <img
                src={`data:image/jpeg;base64,${doctorInfo.image}`}
                alt={doctorInfo.name || 'Doctor'}
                className="doctor-image"
              />
            </div>
            {/* Doctor Details */}
            <div className="details-container">
              <p><strong>Name:</strong> {doctorInfo.name}</p>
              <p><strong>Qualification:</strong> {doctorInfo.qualification}</p>
              <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
              <p><strong>Email:</strong> {doctorInfo.email}</p>
              <p><strong>Phone:</strong> {doctorInfo.phone}</p>
            </div>
          </div>
        ) : (
          <p>Doctor information not available.</p>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="appointment-item">
                <div className="appointment-column">
                  <h4>Patient Details</h4>
                  <p><strong>Full Name:</strong> {appointment.full_name}</p>
                  <p><strong>Email:</strong> {appointment.email}</p>
                  <p><strong>Phone:</strong> {appointment.phone}</p>
                  <p><strong>Date of Birth:</strong> {formatDate(appointment.dob)}</p>
                </div>
                <div className="appointment-column">
                  <h4>Appointment Details</h4>
                  <p><strong>Appointment Date:</strong> {formatDate(appointment.appointment_date)}</p>
                  <p><strong>Appointment Time:</strong> {formatTime(appointment.start_time)}</p>
                  <p><strong>Symptoms:</strong> {appointment.symptoms || 'N/A'}</p>
                  <div className="status-container">
                    <span className="status-text">Click to change status:</span>
                    <select
                      className={`status-dropdown-d ${appointment.status.toLowerCase()}`}
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    >
                      <option value="Pending" style={{ color: 'white' }}>Pending</option>
                      <option value="Confirmed" style={{ color: 'white' }}>Confirmed</option>
                      <option value="Cancelled" style={{ color: 'white' }}>Cancelled</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
