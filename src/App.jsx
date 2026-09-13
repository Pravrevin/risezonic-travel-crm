import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { pullFromSheet } from './lib/sync';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calls from './pages/Calls';
import Followups from './pages/Followups';
import Bookings from './pages/Bookings';
import Agents from './pages/Agents';
import AgentHome from './pages/AgentHome';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Risezonic CRM...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/** Admin-only screen: agents are bounced to their entry hub. */
const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Pull the register from the Google Sheet once an admin signs in.
  // localStorage is per-origin, so without this a fresh browser or teammate's
  // machine would otherwise start empty even though the records exist in the
  // sheet. Agents only file entries and never receive the register — the
  // script would refuse the read anyway.
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    pullFromSheet();
  }, [isAuthenticated, isAdmin]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute>{isAdmin ? <Dashboard /> : <AgentHome />}</PrivateRoute>} />
      <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
      <Route path="/calls" element={<PrivateRoute><Calls /></PrivateRoute>} />
      <Route path="/followups" element={<PrivateRoute><AdminRoute><Followups /></AdminRoute></PrivateRoute>} />
      <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
      <Route path="/agents" element={<PrivateRoute><AdminRoute><Agents /></AdminRoute></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
