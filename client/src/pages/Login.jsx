import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Wifi, AlertTriangle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name: '', zoneCode: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back to ReliefSync!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crisis-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crisis-primary/20 border border-crisis-primary/30 mb-4">
            <Shield className="w-8 h-8 text-crisis-glow" />
          </div>
          <h1 className="text-3xl font-bold text-white">ReliefSync</h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time disaster relief coordination</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-medium">System Operational</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-1">Sign In to Base</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your credentials and zone code to access the system</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Arjun Sharma"
                className="input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Zone Code
              </label>
              <input
                name="zoneCode"
                type="text"
                placeholder="e.g., RJ-KOTA-01"
                className="input font-mono uppercase"
                value={form.zoneCode}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Format: STATE-CITY-## (e.g., RJ-KOTA-01)</p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access System'
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-5">
            New responder?{' '}
            <Link to="/register" className="text-crisis-glow hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          HackTheChain 4.0 · ReliefSync v1.0
        </p>
      </div>
    </div>
  );
}
