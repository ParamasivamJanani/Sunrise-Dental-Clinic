import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { LoginResponse, UserRole } from '../types';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!username.trim() || (!forgotPasswordMode && !password.trim())) {
      setError(forgotPasswordMode ? 'Please enter your username.' : 'Please enter your username and password.');
      return;
    }
    setLoading(true);

    if (forgotPasswordMode) {
      try {
        const res = await axiosClient.post('/auth/forgot-password', { username });
        setSuccessMsg(res.data.message || 'Password reset link sent.');
        setForgotPasswordMode(false);
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Failed to reset password.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axiosClient.post<LoginResponse>('/auth/login', { username, password });
        login({ ...res.data, role: res.data.role as UserRole });
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">🦷</div>
          <h1>Sunrise Dental Clinic</h1>
          <p>Patient Management System — Colombo</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
            ✅ {successMsg}
          </div>
        )}

        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {!forgotPasswordMode && (
            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0',
                    color: 'var(--color-text-muted)'
                  }}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 'var(--space-2)' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordMode(true); setError(''); setSuccessMsg(''); }} style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                  Forgot Password?
                </a>
              </div>
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {loading ? <><span className="spinner" /> Processing...</> : (forgotPasswordMode ? '✉️ Send New Password' : '🔓 Sign In')}
          </button>
          
          {forgotPasswordMode && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
               <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordMode(false); setError(''); setSuccessMsg(''); }} style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Back to Login
                </a>
            </div>
          )}

          {!forgotPasswordMode && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.9rem' }}>
              Are you a new patient? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Sign up here</Link>
            </div>
          )}
        </form>

        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-text-secondary)' }}>Default credentials:</strong><br />
          Admin: <code>admin / admin123</code>&nbsp;&nbsp;|&nbsp;&nbsp;Staff: <code>staff / staff123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
