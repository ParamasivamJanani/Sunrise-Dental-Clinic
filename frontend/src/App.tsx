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
import PatientSignupPage from './pages/PatientSignupPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfilePage from './pages/PatientProfilePage';
import PatientBillingPage from './pages/PatientBillingPage';
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
          <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
          <Route path="/register-dentist" element={<ProtectedRoute><DentistRegisterPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/bill" element={<ProtectedRoute><BillPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
          <Route path="/my-bills" element={<ProtectedRoute><PatientBillingPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
