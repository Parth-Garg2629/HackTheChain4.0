import { create } from 'zustand';
import api from '../lib/axios';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (zone = '') => {
    set({ loading: true, error: null });
    try {
      const url = zone ? `/tasks?zone=${zone}` : '/tasks';
      const { data } = await api.get(url);
      set({ tasks: data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [data.data, ...state.tasks] }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create task' };
    }
  },

  claimTask: async (taskId) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}/claim`);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? data.data : t)),
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Claim failed';
      const isConflict = err.response?.status === 409;
      return { success: false, message, isConflict };
    }
  },

  completeTask: async (taskId) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}/complete`);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? data.data : t)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Completion failed' };
    }
  },

  // Socket updates
  updateTaskFromSocket: (updatedTask) => {
    if (!updatedTask || !updatedTask._id) return;
    set((state) => {
      const exists = state.tasks.find((t) => t._id === updatedTask._id);
      if (exists) {
        return { tasks: state.tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)) };
      } else {
        const newTasks = [updatedTask, ...state.tasks];
        newTasks.sort((a, b) => {
          const priorityOrder = { Critical: 0, Medium: 1, Low: 2 };
          if (a.status !== b.status) return a.status === 'Open' ? -1 : 1;
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        return { tasks: newTasks };
      }
    });
  },
}));

export default useTaskStore;
