import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Clock, User, Shield } from 'lucide-react';
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
      senderId: user.id,
      content: content.trim()
    });

    setContent('');
  };

  return (
    <div className="flex flex-col h-[500px] border border-crisis-border bg-crisis-bg/50 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-crisis-border bg-crisis-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-crisis-primary/20">
            <MessageSquare className="w-5 h-5 text-crisis-glow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider line-clamp-1">{missionTitle || 'Mission Comms'}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {isCompleted ? 'Mission Offline' : 'Live Tactical Feed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-crisis-border"
      >
        {missionMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
            <MessageSquare className="w-10 h-10 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Communication Secure channel established</p>
          </div>
        ) : (
          missionMessages.map((msg, idx) => (
            <div 
              key={msg._id || idx}
              className={`flex flex-col ${msg.sender?._id === user.id ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.sender?.role === 'General Volunteer' ? (
                  <Shield className="w-3 h-3 text-crisis-glow" />
                ) : (
                  <User className="w-3 h-3 text-slate-400" />
                )}
                <span className="text-[10px] font-bold text-slate-500 uppercase">{msg.sender?.name}</span>
                <span className="text-[9px] text-slate-600 font-mono">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div 
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${
                  msg.sender?._id === user.id
                    ? 'bg-crisis-primary text-white rounded-tr-none shadow-lg shadow-crisis-primary/10'
                    : 'bg-crisis-border/40 text-slate-200 border border-crisis-border/50 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-crisis-border bg-crisis-bg">
        <div className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isCompleted}
            placeholder={isCompleted ? "Communication channel closed." : "Transmit tactical update..."}
            className="w-full bg-crisis-border/20 border border-crisis-border rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-crisis-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!content.trim() || isCompleted}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-crisis-glow hover:bg-crisis-primary/10 rounded-lg transition-colors disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isCompleted && (
          <p className="text-[9px] text-center text-slate-600 mt-2 font-bold uppercase tracking-widest">
            History is preserved in mission logs
          </p>
        )}
      </form>
    </div>
  );
}
