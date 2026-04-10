import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import AdminDashboard from './AdminDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { fetchAlerts } = useAlertStore();
  const { fetchResources } = useResourceStore();

  useEffect(() => {
    // Initial data fetch on dashboard mount
    fetchAlerts();
    fetchResources();
  }, [fetchAlerts, fetchResources]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {user?.role === 'Admin' ? <AdminDashboard /> : <VolunteerDashboard />}
      </main>
    </div>
  );
}
