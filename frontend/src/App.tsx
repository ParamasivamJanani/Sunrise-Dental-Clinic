import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import BillPage from './pages/BillPage';
import HelpPage from './pages/HelpPage';
import DentistRegisterPage from './pages/DentistRegisterPage';
import StaffManagementPage from './pages/StaffManagementPage';
import PatientSignupPage from './pages/PatientSignupPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfilePage from './pages/PatientProfilePage';
import PatientBillingPage from './pages/PatientBillingPage';
import PatientsPage from './pages/PatientsPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import PrescriptionPage from './pages/PrescriptionPage';
import { useAuth } from './context/AuthContext';
import './styles/globals.css';

const Home = () => {
  const { user } = useAuth();
  if (user?.role === 'PATIENT') return <PatientDashboard />;
  return <DashboardPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<PatientSignupPage />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><RegisterPage /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['ADMIN']}><StaffManagementPage /></ProtectedRoute>} />
          <Route path="/register-dentist" element={<ProtectedRoute allowedRoles={['ADMIN']}><DentistRegisterPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><SearchPage /></ProtectedRoute>} />
          <Route path="/bill" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><BillPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientProfilePage /></ProtectedRoute>} />
          <Route path="/my-bills" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientBillingPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><PatientsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><CalendarPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DENTIST']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/prescription" element={<ProtectedRoute allowedRoles={['DENTIST']}><PrescriptionPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
