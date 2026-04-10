import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import useTaskStore from '../store/taskStore';
import AdminDashboard from './AdminDashboard'; // Using existing file name but it will adapt to Dispatcher
import VolunteerDashboard from './VolunteerDashboard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { fetchAlerts } = useAlertStore();
  const { fetchResources } = useResourceStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    // Initial data fetch on dashboard mount
    fetchAlerts();
    fetchResources();
    fetchTasks();
  }, [fetchAlerts, fetchResources, fetchTasks]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {user?.role === 'General Volunteer' ? <AdminDashboard /> : <VolunteerDashboard />}
      </main>
    </div>
  );
}
