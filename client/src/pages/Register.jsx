import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Wifi, AlertTriangle, Activity, UserPlus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ 
    name: '', 
    zoneCode: '', 
    role: 'General Volunteer', 
    password: '' 
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      toast.success('Node Initialized. Welcome to CrisisGrid.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const roles = [
    { title: 'Victim', desc: 'Need Immediate SOS Assistance', icon: AlertTriangle },
    { title: 'General Volunteer', desc: 'Resource & Task Management', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 lg:py-0">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crisis-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl animate-fade-in">
        <div className="text-center mb-8">
          <Activity className="w-12 h-12 text-crisis-glow mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">CrisisGrid Node Initialization</h1>
          <p className="text-slate-400 mt-1 text-sm">Register as a responder and sync with your local zone</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Operator Name</label>
                <input name="name" type="text" placeholder="Full Name" className="input" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Assignment Zone</label>
                <input name="zoneCode" type="text" placeholder="RJ-KOTA-01" className="input font-mono uppercase" value={form.zoneCode} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Operational Role Selection</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.title })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.role === r.title 
                      ? 'bg-crisis-primary/20 border-crisis-primary border-2' 
                      : 'bg-crisis-bg border-crisis-border hover:border-crisis-primary/30'
                    }`}
                  >
                    <r.icon className={`w-5 h-5 mb-2 ${form.role === r.title ? 'text-crisis-glow' : 'text-slate-500'}`} />
                    <div className="text-xs font-bold text-white leading-tight">{r.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Access Secret</label>
              <input name="password" type="password" placeholder="Create a strong key" className="input" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-primary w-full justify-center group py-3" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Initialize Node Integration'
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already integrated?{' '}
            <Link to="/login" className="text-crisis-glow hover:underline font-bold">Sync Entry</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
