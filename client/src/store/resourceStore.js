import { create } from 'zustand';
import api from '../lib/axios';

const useResourceStore = create((set, get) => ({
  resources: [],
  loading: false,
  error: null,

  fetchResources: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/resources');
      set({ resources: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch resources', loading: false });
    }
  },

  addResource: async (resourceData) => {
    try {
      const { data } = await api.post('/resources', resourceData);
      set((state) => ({ resources: [data.data, ...state.resources] }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add resource' };
    }
  },

  requestResource: async (resourceId) => {
    try {
      const { data } = await api.put(`/resources/${resourceId}/request`);
      set((state) => ({
        resources: state.resources.map((r) => (r._id === resourceId ? data.data : r)),
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Request failed';
      const isConflict = err.response?.status === 409;
      return { success: false, message, isConflict };
    }
  },

  approveResource: async (resourceId) => {
    try {
      const { data } = await api.put(`/resources/${resourceId}/approve`);
      set((state) => ({
        resources: state.resources.map((r) => (r._id === resourceId ? data.data : r)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Approval failed' };
    }
  },

  returnResource: async (resourceId) => {
    try {
      const { data } = await api.put(`/resources/${resourceId}/return`);
      set((state) => ({
        resources: state.resources.map((r) => (r._id === resourceId ? data.data : r)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Return failed' };
    }
  },

  deleteResource: async (resourceId) => {
    try {
      await api.delete(`/resources/${resourceId}`);
      set((state) => ({
        resources: state.resources.filter((r) => r._id !== resourceId),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Delete failed' };
    }
  },

  // Called by socket events to sync state
  updateResourceFromSocket: (updatedResource) => {
    set((state) => {
      const exists = state.resources.find((r) => r._id === updatedResource._id);
      if (exists) {
        return { resources: state.resources.map((r) => (r._id === updatedResource._id ? updatedResource : r)) };
      } else {
        return { resources: [updatedResource, ...state.resources] };
      }
    });
  },

  removeResourceFromSocket: (resourceId) => {
    set((state) => ({ resources: state.resources.filter((r) => r._id !== resourceId) }));
  },
}));

export default useResourceStore;
