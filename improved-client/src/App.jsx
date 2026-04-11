import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrisisLayout from './components/CrisisLayout';
import Overview from './pages/Overview';
import Incidents from './pages/Incidents';
import ZoneMap from './pages/ZoneMap';
import ResourceInventory from './pages/ResourceInventory';
import VolunteerDashboard from './pages/VolunteerDashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useAlertStore from './store/alertStore';
import useResourceStore from './store/resourceStore';
import useTaskStore from './store/taskStore';
import { initSocket } from './lib/socket';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { user, token, checkingAuth, checkAuth } = useAuthStore();
  const { prependAlert, markAlertResolvedFromSocket } = useAlertStore();
  const { updateResourceFromSocket, removeResourceFromSocket } = useResourceStore();
  const { updateTaskFromSocket } = useTaskStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (token && user) {
      const socket = initSocket(user);

      // Global socket listeners for real-time sync
      socket.on('sos_alert', (data) => {
        prependAlert(data.alert);
        if (data.task) updateTaskFromSocket(data.task);
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

      // New CrisisGrid Task Events
      socket.on('task_created', (task) => {
        updateTaskFromSocket(task);
      });

      socket.on('task_claimed', (task) => {
        updateTaskFromSocket(task);
      });

      socket.on('task_updated', (task) => {
        updateTaskFromSocket(task);
      });

      return () => {
        socket.off('sos_alert');
        socket.off('alert_created');
        socket.off('alert_resolved');
        socket.off('resource_updated');
        socket.off('task_created');
        socket.off('task_claimed');
        socket.off('task_updated');
      };
    }
  }, [token, user, prependAlert, markAlertResolvedFromSocket, updateResourceFromSocket, removeResourceFromSocket, updateTaskFromSocket]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050f19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-center">
            <h2 className="text-white font-headline font-bold text-xl tracking-wide">SECURE LINK INITIATING</h2>
            <p className="text-primary/60 font-mono text-[10px] mt-2 uppercase tracking-widest animate-pulse">Synchronizing with ReliefSync Hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Pages with Sidebar + Topbar layout — Wrapped in ProtectedRoute */}
        <Route path="/"          element={<ProtectedRoute><CrisisLayout><Overview /></CrisisLayout></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><CrisisLayout><Incidents /></CrisisLayout></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><CrisisLayout><ResourceInventory /></CrisisLayout></ProtectedRoute>} />
        <Route path="/zone-map"  element={<ProtectedRoute><CrisisLayout><ZoneMap /></CrisisLayout></ProtectedRoute>} />
        <Route path="/volunteer" element={<ProtectedRoute><CrisisLayout><VolunteerDashboard /></CrisisLayout></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><CrisisLayout><Settings /></CrisisLayout></ProtectedRoute>} />

        {/* Standalone auth pages — no layout chrome */}
        <Route path="/login"    element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
