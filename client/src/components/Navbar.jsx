import { Shield, LogOut, User, MapPin } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-crisis-border bg-crisis-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-crisis-primary/20 border border-crisis-primary/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-crisis-glow" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">ReliefSync</span>
            <div className="flex items-center gap-1.5 leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-semibold">Active Node</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5 text-slate-300">
              <User className="w-4 h-4 text-crisis-glow" />
              <span>{user?.name}</span>
            </div>
            <div className="w-px h-4 bg-crisis-border"></div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-4 h-4 text-crisis-glow" />
              <span className="font-mono">{user?.zoneCode}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
