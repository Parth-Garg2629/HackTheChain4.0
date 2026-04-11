import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Shield, User } from 'lucide-react';
import io from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';

const socket = io('http://localhost:5000');

export default function ChatPanel({ taskId, missionTitle, isCompleted }) {
  const { user } = useAuthStore();
  const { messages, fetchMessages, addMessage } = useChatStore();
  const [content, setContent] = useState('');
  const scrollRef = useRef(null);

  const missionMessages = messages[taskId] || [];

  useEffect(() => {
    if (!taskId) return;

    // Join mission chat room
    socket.emit('join_mission_chat', { taskId });

    // Fetch initial history
    fetchMessages(taskId);

    // Listen for new messages
    const handleNewMessage = (msg) => {
      addMessage(taskId, msg);
    };

    socket.on('new_mission_message', handleNewMessage);

    return () => {
      socket.off('new_mission_message', handleNewMessage);
    };
  }, [taskId, fetchMessages, addMessage]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [missionMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!content.trim() || isCompleted) return;

    socket.emit('send_mission_message', {
      taskId,
      senderId: user.id || user._id,
      content: content.trim()
    });

    setContent('');
  };

  return (
    <div className="flex flex-col h-[500px] border border-outline-variant bg-surface-container/30 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-primary/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider line-clamp-1">{missionTitle || 'Mission Comms'}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-outline' : 'bg-success_green animate-pulse'}`} />
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                {isCompleted ? 'Mission Offline' : 'Live Tactical Feed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar"
      >
        {missionMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
            <MessageSquare className="w-10 h-10 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Awaiting Communication Secure channel established</p>
          </div>
        ) : (
          missionMessages.map((msg, idx) => (
            <div 
              key={msg._id || idx}
              className={`flex flex-col ${msg.sender?._id === (user.id || user._id) ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender?.role === 'General Volunteer' ? (
                  <Shield className="w-3 h-3 text-primary" />
                ) : (
                  <User className="w-3 h-3 text-on-surface-variant" />
                )}
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{msg.sender?.name}</span>
                <span className="text-[9px] text-on-surface-variant/60 font-mono">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div 
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
                  msg.sender?._id === (user.id || user._id)
                    ? 'bg-primary-container text-on-primary-container rounded-tr-none'
                    : 'bg-surface-container-high text-on-surface border border-outline-variant/50 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant bg-surface-container-highest/20">
        <div className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isCompleted}
            placeholder={isCompleted ? "Communication channel closed." : "Transmit tactical update..."}
            className="w-full bg-surface-container-highest/40 border border-outline-variant/30 rounded-xl py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!content.trim() || isCompleted}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
