import { create } from 'zustand';
import api from '../lib/axios';

const useChatStore = create((set, get) => ({
  messages: {}, // { taskId: [messages] }
  loading: false,

  fetchMessages: async (taskId) => {
    set({ loading: true });
    try {
      // Use the reliefsync_token consistent with other stores
      const { data } = await api.get(`/messages/${taskId}`);
      if (data.success) {
        set((state) => ({
          messages: {
            ...state.messages,
            [taskId]: data.data,
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
