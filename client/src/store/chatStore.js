import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/messages';

const useChatStore = create((set, get) => ({
  messages: {}, // { taskId: [messages] }
  loading: false,

  fetchMessages: async (taskId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        set((state) => ({
          messages: {
            ...state.messages,
            [taskId]: res.data.data,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err.message);
    } finally {
      set({ loading: false });
    }
  },

  addMessage: (taskId, message) => {
    set((state) => {
      const currentMessages = state.messages[taskId] || [];
      // Prevent duplicates if socket and fetch collide
      if (currentMessages.find(m => m._id === message._id)) return state;
      
      return {
        messages: {
          ...state.messages,
          [taskId]: [...currentMessages, message],
        },
      };
    });
  },

  clearChat: (taskId) => {
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[taskId];
      return { messages: newMessages };
    });
  }
}));

export default useChatStore;
