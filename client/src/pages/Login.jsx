import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Wifi, AlertTriangle, Activity } from 'lucide-react';
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
      toast.success('Grid Access Established. Welcome back.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crisis-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crisis-primary/20 border border-crisis-primary/30 mb-4">
            <Activity className="w-8 h-8 text-crisis-glow" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CrisisGrid</h1>
          <p className="text-slate-400 mt-1 text-sm">Autonomous Fleet & Task Logistics Ecosystem</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Signal Stable</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">System Entry</h2>
          <p className="text-slate-400 text-sm mb-6">Authenticate to access the operational grid</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Operator Name</label>
              <input name="name" type="text" placeholder="Arjun Sharma" className="input" value={form.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Assignment Zone</label>
              <input name="zoneCode" type="text" placeholder="RJ-KOTA-01" className="input font-mono uppercase" value={form.zoneCode} onChange={handleChange} required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Access Key</label>
              <input name="password" type="password" placeholder="••••••••" className="input" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2 group" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sync Interface'
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Unauthorized?{' '}
            <Link to="/register" className="text-crisis-glow hover:underline font-bold">Initialize Node</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
