import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Profile {
  username: string;
  email: string;
  fullName: string;
  contactNumber: string;
  address: string;
}

const phoneRegex = /^(\+94|0)[0-9]{9}$/;

const PatientProfilePage = () => {
  const { user, login } = useAuth();

  // Profile form
  const [profile, setProfile] = useState<Profile>({ username: '', email: '', fullName: '', contactNumber: '', address: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    axiosClient.get<Profile>('/auth/me').then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(''); setProfileSuccess('');
    if (!profile.fullName.trim()) return setProfileError('Full name is required.');
    if (!phoneRegex.test(profile.contactNumber)) return setProfileError('Enter a valid Sri Lankan phone number.');
    if (!profile.address.trim()) return setProfileError('Address is required.');

    setProfileLoading(true);
    try {
      const res = await axiosClient.put<Profile>('/auth/me', {
        fullName: profile.fullName,
        contactNumber: profile.contactNumber,
        address: profile.address,
      });
      setProfile(res.data);
      // Refresh display name in context
      login({ token: localStorage.getItem('token') || '', role: user?.role as any, fullName: res.data.fullName, username: res.data.username });
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(''); setPassSuccess('');
    if (passwords.newPassword.length < 6) return setPassError('New password must be at least 6 characters.');
    if (passwords.newPassword !== passwords.confirmPassword) return setPassError('New passwords do not match.');

    setPassLoading(true);
    try {
      await axiosClient.put('/auth/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassSuccess('Password changed successfully!');
    } catch (err: any) {
      setPassError(err.response?.data?.message ?? 'Failed to change password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>👤 My Profile</h2>
          <p>Manage your personal information and account security.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Personal Information */}
          <div className="card">
            <div className="card-title">Personal Information</div>

            {profileSuccess && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{profileSuccess}</div>}
            {profileError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{profileError}</div>}

            <form onSubmit={handleProfileSubmit} style={{ marginTop: 'var(--space-4)' }}>
              <div className="form-group">
                <label>Username</label>
                <input value={profile.username} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Username cannot be changed.</span>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={profile.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input name="fullName" value={profile.fullName} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input name="contactNumber" value={profile.contactNumber} onChange={handleProfileChange} placeholder="0771234567" />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input name="address" value={profile.address} onChange={handleProfileChange} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={profileLoading}>
                {profileLoading ? <span className="spinner" /> : '💾 Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="card-title">Change Password</div>

            {passSuccess && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{passSuccess}</div>}
            {passError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{passError}</div>}

            <form onSubmit={handlePassSubmit} style={{ marginTop: 'var(--space-4)' }}>
              <div className="form-group">
                <label>Current Password *</label>
                <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePassChange} autoComplete="current-password" />
              </div>
              <div className="form-group">
                <label>New Password *</label>
                <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePassChange} autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password *</label>
                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePassChange} autoComplete="new-password" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={passLoading}>
                {passLoading ? <span className="spinner" /> : '🔐 Change Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfilePage;
