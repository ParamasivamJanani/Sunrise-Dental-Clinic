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
import PatientsPage from './pages/PatientsPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import PrescriptionPage from './pages/PrescriptionPage';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><RegisterPage /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['ADMIN']}><StaffManagementPage /></ProtectedRoute>} />
          <Route path="/register-dentist" element={<ProtectedRoute allowedRoles={['ADMIN']}><DentistRegisterPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><SearchPage /></ProtectedRoute>} />
          <Route path="/bill" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><BillPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><PatientsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><CalendarPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/prescription" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><PrescriptionPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
