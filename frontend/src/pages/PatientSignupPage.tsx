import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { LoginResponse } from '../types';

const phoneRegex = /^(\+94|0)[0-9]{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PatientSignupPage = () => {
  const [form, setForm] = useState({
    username: '', password: '', email: '', fullName: '', contactNumber: '', address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.username.length < 4) e.username = 'Username must be at least 4 characters.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!emailRegex.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!phoneRegex.test(form.contactNumber)) e.contactNumber = 'Enter a valid Sri Lankan phone number.';
    if (!form.address.trim()) e.address = 'Address is required.';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await axiosClient.post<LoginResponse>('/auth/register-patient', form);
      login({ 
        token: res.data.token, 
        role: res.data.role as any, 
        fullName: res.data.fullName, 
        username: res.data.username 
      });
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="login-header">
          <div className="login-logo">🦷</div>
          <h2>Patient Registration</h2>
          <p>Create your Sunrise Dental account</p>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: 'var(--space-4)' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className={errors.fullName ? 'error' : ''} />
              {errors.fullName && <span className="input-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} className={errors.username ? 'error' : ''} />
              {errors.username && <span className="input-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={errors.contactNumber ? 'error' : ''} />
              {errors.contactNumber && <span className="input-error">{errors.contactNumber}</span>}
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} className={errors.address ? 'error' : ''} />
              {errors.address && <span className="input-error">{errors.address}</span>}
            </div>

            <div className="form-group full-width">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-6)' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default PatientSignupPage;
