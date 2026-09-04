import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const DentistRegisterPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: '', specialization: '', consultationFee: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // If not admin, do not render form
  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content">
          <div className="alert alert-error">Access Denied. Only Administrators can register dentists.</div>
        </main>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = 'Full Name is required';
    if (!form.specialization) e.specialization = 'Specialization is required';
    if (form.consultationFee < 0) e.consultationFee = 'Fee must be positive';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'consultationFee' ? Number(value) : value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(''); setSuccessMsg('');
    if (!validate()) return;
    setLoading(true);
    try {
      await axiosClient.post('/dentists/register', form);
      setSuccessMsg(`Dentist ${form.fullName} registered successfully!`);
      setForm({ fullName: '', specialization: '', consultationFee: 0 });
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to register dentist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>🧑‍⚕️ Register New Dentist</h2>
          <p>Add a new dentist record to the system.</p>
        </div>

        {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}
        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Dr. John Doe" className={errors.fullName ? 'error' : ''} />
                {errors.fullName && <span className="input-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="specialization">Specialization *</label>
                <input id="specialization" name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. General Dentist" className={errors.specialization ? 'error' : ''} />
                {errors.specialization && <span className="input-error">{errors.specialization}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="consultationFee">Consultation Fee (LKR) *</label>
                <input id="consultationFee" name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} className={errors.consultationFee ? 'error' : ''} />
                {errors.consultationFee && <span className="input-error">{errors.consultationFee}</span>}
              </div>
            </div>

            <hr className="divider" />
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Registering...</> : '✅ Register Dentist'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DentistRegisterPage;
