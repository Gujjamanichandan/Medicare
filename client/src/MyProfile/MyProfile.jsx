import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import './MyProfile.css';

const MyProfile = () => {
  const { user } = useContext(AuthContext); // Access user data from context
  const [appointments, setAppointments] = useState([]); // Store appointments
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointments(response.data); // Store appointments
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [user]);

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Cancelled':
        return { color: 'red', fontWeight: 'bold' };
      case 'Pending':
        return { color: 'orange', fontWeight: 'bold' };
      case 'Confirmed':
        return { color: 'green', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== appointmentId)
      );
      alert('Appointment successfully cancelled.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel the appointment. Please try again later.');
    }
  };

  return (
    <div className="profile-page">
      {/* Left Sidebar */}
      <div className="profile-left-sidebar">
        <h2>My Information</h2>
        <div className="profile-info">
          <div className="profile-row">
            <label>Name:</label>
            <span>{user?.name || 'N/A'}</span>
          </div>
          <div className="profile-row">
            <label>Phone:</label>
            <span>{appointments[0]?.phone || 'N/A'}</span>
          </div>
          <div className="profile-row">
            <label>Email:</label>
            <span>{user?.email || 'N/A'}</span>
          </div>
          <div className="profile-row">
            <label>Date of Birth:</label>
            <span>{appointments[0]?.dob ? formatDate(appointments[0]?.dob) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="profile-right-sidebar">
        <h2>Upcoming Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length > 0 ? (
          <div className="appointments-container">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="two-columns-pro">
                  {/* First Column: Patient Details */}
                  <div className="patient-details">
                    <h4>Patient Details</h4>
                    <p>
                      <strong>Full Name:</strong> {appointment.full_name || 'N/A'}
                    </p>
                    <p>
                      <strong>Email:</strong> {appointment.email || 'N/A'}
                    </p>
                    <p>
                      <strong>Phone:</strong> {appointment.phone || 'N/A'}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{' '}
                      {appointment.dob ? formatDate(appointment.dob) : 'N/A'}
                    </p>
                  </div>

                  {/* Second Column: Appointment Details */}
                  <div className="appointment-details-column">
                    <h4>Appointment Details</h4>
                    <p>
                      <strong>Doctor:</strong> {appointment.doctor_name || 'N/A'}
                    </p>
                    <p>
                      <strong>Appointment Date:</strong>{' '}
                      {formatDate(appointment.appointment_date)}
                    </p>
                    <p>
                      <strong>Appointment Time:</strong>{' '}
                      {appointment.start_time ? formatTime(appointment.start_time) : 'N/A'}
                    </p>
                    <p>
                      <strong>Symptoms:</strong> {appointment.symptoms || 'N/A'}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span style={getStatusStyle(appointment.status)}>
                        {appointment.status}
                      </span>
                    </p>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="cancel-button"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No appointments booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
