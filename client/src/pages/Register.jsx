import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Wifi, AlertTriangle, UserPlus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ 
    name: '', 
    zoneCode: '', 
    role: 'Volunteer', 
    password: '' 
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      toast.success('Registration successful! Protocol initialized.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crisis-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crisis-primary/20 border border-crisis-primary/30 mb-4">
            <UserPlus className="w-8 h-8 text-crisis-glow" />
          </div>
          <h1 className="text-3xl font-bold text-white">ReliefSync</h1>
          <p className="text-slate-400 mt-1 text-sm">Join the response network</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-1">Enlist Responder</h2>
          <p className="text-slate-400 text-sm mb-6">Create your credentials to join the coordination grid</p>

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
                placeholder="Full Name"
                className="input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Deployment Role
              </label>
              <select
                name="role"
                className="input cursor-pointer"
                value={form.role}
                onChange={handleChange}
              >
                <option value="Volunteer">Field Volunteer</option>
                <option value="Admin">Base Coordinator (Admin)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Zone Code
              </label>
              <input
                name="zoneCode"
                type="text"
                placeholder="STATE-CITY-##"
                className="input font-mono uppercase"
                value={form.zoneCode}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Example: RJ-KOTA-01 or MH-MUM-02</p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                Secure Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Initializing Protocol...' : 'Register Responder'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already enlisted?{' '}
            <Link to="/login" className="text-crisis-glow hover:underline font-medium">
              Access Base
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
