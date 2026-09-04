import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Dentist {
  id: number;
  name: string;
  specialization: string;
  consultationFee: number;
  available: boolean;
}

const StaffManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    
    const fetchDentists = async () => {
      try {
        const response = await axiosClient.get('/dentists/all');
        setDentists(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load staff list.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDentists();
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content">
          <div className="alert alert-error">Access Denied. Only Administrators can view staff management.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>👥 Staff Management</h2>
            <p>Manage dentists and clinic staff.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/register-dentist')}>
            ➕ Register New Dentist
          </button>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span className="spinner" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '2rem', height: '2rem' }} />
            </div>
          ) : dentists.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No dentists registered yet.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Consultation Fee (LKR)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dentists.map((dentist) => (
                    <tr key={dentist.id}>
                      <td>#{dentist.id}</td>
                      <td>{dentist.name}</td>
                      <td>{dentist.specialization || 'General Dentist'}</td>
                      <td>{dentist.consultationFee.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${dentist.available ? 'badge-completed' : 'badge-scheduled'}`}>
                          {dentist.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StaffManagementPage;
