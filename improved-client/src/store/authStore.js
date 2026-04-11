import { create } from 'zustand';
import api from '../lib/axios';
import { initSocket, disconnectSocket } from '../lib/socket';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('reliefsync_user')) || null,
  token: localStorage.getItem('reliefsync_token') || null,
  loading: false,
  checkingAuth: true,
  error: null,

  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('reliefsync_token', data.token);
      localStorage.setItem('reliefsync_user', JSON.stringify(data.user));
      initSocket(data.user);
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('reliefsync_token', data.token);
      localStorage.setItem('reliefsync_user', JSON.stringify(data.user));
      initSocket(data.user);
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('reliefsync_token');
    localStorage.removeItem('reliefsync_user');
    disconnectSocket();
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('reliefsync_token');
    if (!token) {
      set({ checkingAuth: false, user: null, token: null });
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        initSocket(data.user);
        set({ user: data.user, token, checkingAuth: false });
      } else {
        localStorage.removeItem('reliefsync_token');
        localStorage.removeItem('reliefsync_user');
        set({ user: null, token: null, checkingAuth: false });
      }
    } catch (err) {
      localStorage.removeItem('reliefsync_token');
      localStorage.removeItem('reliefsync_user');
      set({ user: null, token: null, checkingAuth: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
