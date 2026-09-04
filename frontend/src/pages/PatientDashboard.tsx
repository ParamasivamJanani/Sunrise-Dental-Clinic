import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { AppointmentResponse, DentistResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const TREATMENTS = [
  { value: 'CONSULTATION',       label: 'Consultation — LKR 1,500' },
  { value: 'TEETH_CLEANING',     label: 'Teeth Cleaning — LKR 3,500' },
  { value: 'TOOTH_FILLING',      label: 'Tooth Filling — LKR 5,000' },
  { value: 'TOOTH_EXTRACTION',   label: 'Tooth Extraction — LKR 7,000' },
  { value: 'ROOT_CANAL',         label: 'Root Canal — LKR 25,000' },
  { value: 'TEETH_WHITENING',    label: 'Teeth Whitening — LKR 15,000' },
  { value: 'BRACES_CONSULTATION',label: 'Braces Consultation — LKR 2,000' },
];

const timeRegex  = /^([0-1]\d|2[0-3]):[0-5]\d$/;
const phoneRegex = /^(\+94|0)[0-9]{9}$/;

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [dentists, setDentists] = useState<DentistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking form state
  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState({ dentistId: 0, treatmentType: '', appointmentDate: '', appointmentTime: '', contactNumber: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookLoading, setBookLoading] = useState(false);
  const [bookSuccess, setBookSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    axiosClient.get<AppointmentResponse[]>('/appointments/me')
      .then(res => setAppointments(res.data))
      .catch(err => setApiError(err.response?.data?.message || 'Failed to load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
    axiosClient.get<DentistResponse[]>('/dentists/public').then(res => setDentists(res.data)).catch(() => setApiError('Failed to load dentists.'));
    axiosClient.get('/auth/me').then(res => {
      setForm(prev => ({ ...prev, contactNumber: res.data.contactNumber, address: res.data.address }));
    }).catch(() => {});
  }, []);

  const handleCancel = async (appointmentNumber: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(appointmentNumber);
    setApiError('');
    try {
      await axiosClient.delete(`/appointments/me/${appointmentNumber}`);
      setBookSuccess('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setApiError(''); setBookSuccess('');
    
    const errs: Record<string, string> = {};
    if (!form.dentistId) errs.dentistId = 'Select a dentist.';
    if (!form.treatmentType) errs.treatmentType = 'Select a treatment.';
    if (!form.appointmentDate) errs.appointmentDate = 'Select a date.';
    else if (new Date(form.appointmentDate) < new Date(new Date().toDateString())) errs.appointmentDate = 'Appointment date cannot be in the past.';
    
    if (!form.appointmentTime) errs.appointmentTime = 'Select a time.';
    else if (!timeRegex.test(form.appointmentTime)) errs.appointmentTime = 'Enter a valid time.';
    if (!form.contactNumber) errs.contactNumber = 'Contact number is required.';
    else if (!phoneRegex.test(form.contactNumber)) errs.contactNumber = 'Enter a valid Sri Lankan contact number.';
    if (!form.address) errs.address = 'Address is required.';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    setBookLoading(true);
    try {
      const payload = {
        patientName: user?.fullName || 'Patient',
        contactNumber: form.contactNumber,
        address: form.address,
        dentistId: form.dentistId,
        treatmentType: form.treatmentType,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime
      };

      await axiosClient.post('/appointments/public', payload);
      setBookSuccess('Appointment booked successfully!');
      setForm(prev => ({ ...prev, dentistId: 0, treatmentType: '', appointmentDate: '', appointmentTime: '' }));
      fetchAppointments();
      setShowBooking(false);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookLoading(false);
    }
  };

  const statusBadge = (status: string) => (
    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>👋 Welcome, {user?.fullName?.split(' ')[0]}!</h2>
            <p>Your personal patient portal</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowBooking(!showBooking)}>
            {showBooking ? 'Cancel Booking' : '📅 Book Appointment'}
          </button>
        </div>

        {bookSuccess && <div className="alert alert-success">{bookSuccess}</div>}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        {showBooking && (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h3>Book New Appointment</h3>
            <form onSubmit={handleBook} className="form-grid" style={{ marginTop: 'var(--space-4)' }}>
              <div className="form-group">
                <label>Dentist</label>
                <select value={form.dentistId} onChange={e => setForm({...form, dentistId: Number(e.target.value)})}>
                  <option value={0}>Select a dentist</option>
                  {dentists.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                </select>
                {errors.dentistId && <span className="input-error">{errors.dentistId}</span>}
              </div>
              <div className="form-group">
                <label>Treatment</label>
                <select value={form.treatmentType} onChange={e => setForm({...form, treatmentType: e.target.value})}>
                  <option value="">Select treatment</option>
                  {TREATMENTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {errors.treatmentType && <span className="input-error">{errors.treatmentType}</span>}
              </div>
              <div className="form-group">
                <label>Date</label>
                <DatePicker 
                  selected={form.appointmentDate ? new Date(form.appointmentDate + "T00:00:00") : null} 
                  onChange={(date: Date | null) => setForm({...form, appointmentDate: date ? format(date, 'yyyy-MM-dd') : ''})} 
                  minDate={new Date()} 
                  dateFormat="yyyy-MM-dd" 
                  placeholderText="Select Date"
                  wrapperClassName="date-picker-wrapper"
                />
                {errors.appointmentDate && <span className="input-error">{errors.appointmentDate}</span>}
              </div>
              <div className="form-group">
                <label>Time</label>
                <DatePicker 
                  selected={form.appointmentTime ? new Date(`1970-01-01T${form.appointmentTime}:00`) : null} 
                  onChange={(date: Date | null) => setForm({...form, appointmentTime: date ? format(date, 'HH:mm') : ''})} 
                  showTimeSelect 
                  showTimeSelectOnly 
                  timeIntervals={15} 
                  timeCaption="Time" 
                  dateFormat="HH:mm" 
                  placeholderText="Select Time"
                  wrapperClassName="date-picker-wrapper"
                />
                {errors.appointmentTime && <span className="input-error">{errors.appointmentTime}</span>}
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="text" value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} placeholder="0771234567" />
                {errors.contactNumber && <span className="input-error">{errors.contactNumber}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Your Address" />
                {errors.address && <span className="input-error">{errors.address}</span>}
              </div>
              <div className="form-group full-width" style={{ marginTop: 'var(--space-2)' }}>
                <button type="submit" className="btn btn-primary" disabled={bookLoading}>
                  {bookLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="card-title">🕒 Your Appointment History</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}><div className="spinner" style={{ margin: '0 auto'}}/></div>
          ) : appointments.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Dentist</th>
                    <th>Treatment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.appointmentDate}</td>
                      <td>{a.appointmentTime}</td>
                      <td>{a.dentistName}</td>
                      <td>{a.treatmentType.replace(/_/g, ' ')}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        {a.status === 'SCHEDULED' && (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--color-danger, #e74c3c)' }}
                            disabled={cancellingId === a.appointmentNumber}
                            onClick={() => handleCancel(a.appointmentNumber)}
                          >
                            {cancellingId === a.appointmentNumber ? '...' : '✕ Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              You have no past or upcoming appointments.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
