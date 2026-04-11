import { create } from 'zustand';
import api from '../lib/axios';

const useAlertStore = create((set) => ({
  alerts: [],
  unreadCount: 0,
  loading: false,

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/alerts');
      set({ alerts: data.data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  sendSOS: async ({ message, severity }) => {
    try {
      const { data } = await api.post('/alerts', { message, severity });
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to send SOS' };
    }
  },

  resolveAlert: async (alertId) => {
    try {
      const { data } = await api.put(`/alerts/${alertId}/resolve`);
      set((state) => ({
        alerts: state.alerts.map((a) => (a._id === alertId ? data.data : a)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Resolve failed' };
    }
  },

  // Prepend new alert from socket (Critical ones go to top)
  prependAlert: (alert) => {
    if (!alert || !alert._id) return;
    set((state) => {
      const exists = state.alerts.find((a) => a._id === alert._id);
      if (exists) return state;

      const newAlerts = [alert, ...state.alerts];
      // Sort: unresolved Critical first
      const severityOrder = { Critical: 0, Medium: 1, Low: 2 };
      newAlerts.sort((a, b) => {
        if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
        return severityOrder[a.severity] - severityOrder[b.severity];
      });

      return {
        alerts: newAlerts,
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  markAlertResolvedFromSocket: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a._id === alertId ? { ...a, isResolved: true } : a)),
    }));
  },

  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useAlertStore;
