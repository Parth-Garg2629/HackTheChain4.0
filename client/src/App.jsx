import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useAlertStore from './store/alertStore';
import useResourceStore from './store/resourceStore';
import { initSocket } from './lib/socket';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { user, token } = useAuthStore();
  const { prependAlert, markAlertResolvedFromSocket } = useAlertStore();
  const { updateResourceFromSocket, removeResourceFromSocket } = useResourceStore();

  useEffect(() => {
    if (token && user) {
      const socket = initSocket(user);

      // Global socket listeners for real-time sync
      socket.on('sos_alert', (data) => {
        prependAlert(data.alert);
      });

      socket.on('alert_created', (alert) => {
        prependAlert(alert);
      });

      socket.on('alert_resolved', (data) => {
        markAlertResolvedFromSocket(data.alertId);
      });

      socket.on('resource_updated', (data) => {
        if (data.action === 'deleted') {
          removeResourceFromSocket(data.resourceId);
        } else {
          updateResourceFromSocket(data.resource);
        }
      });

      return () => {
        socket.off('sos_alert');
        socket.off('alert_created');
        socket.off('alert_resolved');
        socket.off('resource_updated');
      };
    }
  }, [token, user, prependAlert, markAlertResolvedFromSocket, updateResourceFromSocket, removeResourceFromSocket]);

  return (
    <Router>
      <Toaster position="top-right" 
        toastOptions={{
          style: {
            background: '#0d1a2d',
            color: '#fff',
            border: '1px solid #1e3a5f',
          },
        }} 
      />
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
