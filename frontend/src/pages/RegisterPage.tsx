import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { AppointmentRequest, AppointmentResponse, DentistResponse } from '../types';

const TREATMENTS = [
  { value: 'CONSULTATION',       label: 'Consultation — LKR 1,500' },
  { value: 'TEETH_CLEANING',     label: 'Teeth Cleaning — LKR 3,500' },
  { value: 'TOOTH_FILLING',      label: 'Tooth Filling — LKR 5,000' },
  { value: 'TOOTH_EXTRACTION',   label: 'Tooth Extraction — LKR 7,000' },
  { value: 'ROOT_CANAL',         label: 'Root Canal — LKR 25,000' },
  { value: 'TEETH_WHITENING',    label: 'Teeth Whitening — LKR 15,000' },
  { value: 'BRACES_CONSULTATION',label: 'Braces Consultation — LKR 2,000' },
];

const phoneRegex = /^(\+94|0)[0-9]{9}$/;
const dateRegex  = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex  = /^([0-1]\d|2[0-3]):[0-5]\d$/;

const RegisterPage = () => {
  const [form, setForm] = useState<AppointmentRequest>({
    patientName: '', address: '', contactNumber: '',
    dentistId: 0, treatmentType: '', appointmentDate: '', appointmentTime: '',
  });
  const [dentists, setDentists] = useState<DentistResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<AppointmentResponse | null>(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient.get<DentistResponse[]>('/dentists').then(r => setDentists(r.data));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim() || form.patientName.length < 2)
      e.patientName = 'Name must be at least 2 characters.';
    if (!form.address.trim())        e.address = 'Address is required.';
    if (!phoneRegex.test(form.contactNumber))
      e.contactNumber = 'Enter a valid Sri Lankan phone number (e.g. 0771234567).';
    if (!form.dentistId)             e.dentistId = 'Please select a dentist.';
    if (!form.treatmentType)         e.treatmentType = 'Please select a treatment.';
    if (!dateRegex.test(form.appointmentDate))
      e.appointmentDate = 'Enter date as YYYY-MM-DD.';
    else if (new Date(form.appointmentDate) < new Date(new Date().toDateString()))
      e.appointmentDate = 'Appointment date cannot be in the past.';
    if (!timeRegex.test(form.appointmentTime))
      e.appointmentTime = 'Enter time as HH:MM (e.g. 09:30).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'dentistId' ? Number(value) : value }));
    if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(''); setSuccess(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axiosClient.post<AppointmentResponse>('/appointments', form);
      setSuccess(res.data);
      setForm({ patientName:'', address:'', contactNumber:'', dentistId:0, treatmentType:'', appointmentDate:'', appointmentTime:'' });
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to register appointment.');
    } finally {
      setLoading(false);
  const handlePrintSlip = () => {
    if (!success) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Appointment Slip</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; color: #333; max-width: 400px; margin: 0 auto; }
            .slip { border: 1px dashed #ccc; padding: 20px; border-radius: 8px; }
            .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
            .title { font-size: 18px; font-weight: bold; color: #2563eb; margin: 0; }
            .subtitle { font-size: 12px; color: #666; margin-top: 4px; }
            .detail { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .label { color: #666; }
            .value { font-weight: 600; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="slip">
            <div class="header">
              <h1 class="title">Sunrise Dental Clinic</h1>
              <div class="subtitle">Appointment Confirmation Slip</div>
            </div>
            <div class="detail"><span class="label">Appt No:</span> <span class="value">${success.appointmentNumber}</span></div>
            <div class="detail"><span class="label">Patient:</span> <span class="value">${success.patientName}</span></div>
            <div class="detail"><span class="label">Dentist:</span> <span class="value">${success.dentistName}</span></div>
            <div class="detail"><span class="label">Date:</span> <span class="value">${success.appointmentDate}</span></div>
            <div class="detail"><span class="label">Time:</span> <span class="value">${success.appointmentTime}</span></div>
            <div class="footer">Please bring this slip to the clinic.<br/>Thank you!</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.setTimeout(function(){ window.close(); }, 500); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📋 Register New Appointment</h2>
          <p>Fill in patient and appointment details below.</p>
        </div>

        {success && (
          <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              ✅ Appointment registered successfully! Appointment Number: <strong>{success.appointmentNumber}</strong>
            </div>
            <button className="btn btn-primary" onClick={handlePrintSlip} style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
              🖨️ Print Slip
            </button>
          </div>
        )}
        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <div className="card">
          <form id="register-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Patient Name */}
              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input id="patientName" name="patientName" value={form.patientName}
                  onChange={handleChange} placeholder="Full name"
                  className={errors.patientName ? 'error' : ''} />
                {errors.patientName && <span className="input-error">{errors.patientName}</span>}
              </div>

              {/* Contact */}
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input id="contactNumber" name="contactNumber" value={form.contactNumber}
                  onChange={handleChange} placeholder="0771234567"
                  className={errors.contactNumber ? 'error' : ''} />
                {errors.contactNumber && <span className="input-error">{errors.contactNumber}</span>}
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label htmlFor="address">Address *</label>
                <input id="address" name="address" value={form.address}
                  onChange={handleChange} placeholder="Full address"
                  className={errors.address ? 'error' : ''} />
                {errors.address && <span className="input-error">{errors.address}</span>}
              </div>

              {/* Dentist */}
              <div className="form-group">
                <label htmlFor="dentistId">Dentist *</label>
                <select id="dentistId" name="dentistId" value={form.dentistId}
                  onChange={handleChange} className={errors.dentistId ? 'error' : ''}>
                  <option value={0}>Select a dentist</option>
                  {dentists.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
                {errors.dentistId && <span className="input-error">{errors.dentistId}</span>}
              </div>

              {/* Treatment */}
              <div className="form-group">
                <label htmlFor="treatmentType">Treatment Type *</label>
                <select id="treatmentType" name="treatmentType" value={form.treatmentType}
                  onChange={handleChange} className={errors.treatmentType ? 'error' : ''}>
                  <option value="">Select treatment</option>
                  {TREATMENTS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.treatmentType && <span className="input-error">{errors.treatmentType}</span>}
              </div>

              {/* Date */}
              <div className="form-group">
                <label htmlFor="appointmentDate">Appointment Date *</label>
                <input id="appointmentDate" name="appointmentDate" type="date"
                  value={form.appointmentDate} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.appointmentDate ? 'error' : ''} />
                {errors.appointmentDate && <span className="input-error">{errors.appointmentDate}</span>}
              </div>

              {/* Time */}
              <div className="form-group">
                <label htmlFor="appointmentTime">Appointment Time *</label>
                <input id="appointmentTime" name="appointmentTime" type="time"
                  value={form.appointmentTime} onChange={handleChange}
                  className={errors.appointmentTime ? 'error' : ''} />
                {errors.appointmentTime && <span className="input-error">{errors.appointmentTime}</span>}
              </div>
            </div>

            <hr className="divider" />
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button id="register-submit-btn" type="submit"
                className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Registering...</> : '✅ Register Appointment'}
              </button>
              <button type="button" className="btn btn-secondary"
                onClick={() => { setForm({ patientName:'', address:'', contactNumber:'', dentistId:0, treatmentType:'', appointmentDate:'', appointmentTime:'' }); setErrors({}); setSuccess(null); setApiError(''); }}>
                🔄 Clear Form
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
