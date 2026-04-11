import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', zoneCode: '', password: '' });
  
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.zoneCode || !formData.password) {
      toast.error('Tactical credentials required.');
      return;
    }

    const res = await login(formData);
    if (res.success) {
      toast.success('Authentication confirmed. Accessing dashboard.');
      navigate('/');
    } else {
      setShowErrorModal(true);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex relative">
      <main className="flex w-full min-h-screen">

        {/* ── Left Panel: Branding ── */}
        <section
          className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a141e 0%, #005047 100%)' }}
        >
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-20 grayscale mix-blend-overlay">
            <img
              alt="Relief workers"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh_uO_7aasR2SD0FD-afrcrePY-xAjkgDloIoxSbc6cStWKodbn-MBN45F5-9aRpqbJVdecwOxgsvwW8o9hRNMtxd-HRj_4CYREW2CPkJcYw7PBapHWkP4hK4e965fvZ9pzjroOsuqcT4YNJiMZlWoaV4-3Zc6-3Q93HXDJMepsBCUigvrLXsplfZTYqqZkSF0cYvRDHFj-Fjy8kkyz3-yKBfOIeRFFssPCKxHXRAAriQRPeSxjTactuct5-EbALTYWgdU5EUwWNk"
            />
          </div>

          {/* Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hub
              </span>
              <h1 className="font-headline font-extrabold text-3xl tracking-tight text-white">
                ReliefSync
              </h1>
            </div>
            <p className="font-headline text-5xl font-bold text-white leading-tight max-w-lg">
              Real-time coordination for those who can't wait.
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-8">
            {[
              { value: '12',    label: 'Active Zones' },
              { value: '247',   label: 'Responders'   },
              { value: '98.4%', label: 'Delivery'     },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="font-mono text-primary text-3xl font-bold">{s.value}</p>
                <p className="text-secondary-fixed/70 text-sm font-medium uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative glow */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ── Right Panel: Login Form ── */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-surface relative">
          <div className="w-full max-w-md space-y-10 relative z-10">

            {/* Mobile branding */}
            <div className="lg:hidden flex items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-primary text-3xl">hub</span>
              <span className="font-headline font-bold text-xl text-on-surface">ReliefSync</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold text-on-surface">Welcome Back</h2>
              <p className="text-on-surface-variant font-medium">
                Access your secure responder dashboard
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
              {/* Full Name */}
              <div className="relative">
                <input
                  className="peer w-full bg-surface-container-highest border-none rounded-lg p-4 pt-6 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all placeholder-transparent outline-none"
                  id="full_name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  type="text"
                  required
                />
                <label
                  className="absolute left-4 top-2 text-xs font-semibold text-primary uppercase tracking-wider transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
              </div>

              {/* Zone Code */}
              <div className="relative">
                <input
                  className="peer w-full bg-surface-container-highest border-none rounded-lg p-4 pt-6 font-mono text-on-surface focus:ring-1 focus:ring-primary/30 transition-all placeholder-transparent outline-none"
                  id="zone_code"
                  name="zoneCode"
                  value={formData.zoneCode}
                  onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })}
                  placeholder="Zone Code"
                  type="text"
                  required
                />
                <label
                  className="absolute left-4 top-2 text-xs font-semibold text-primary uppercase tracking-wider transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase"
                  htmlFor="zone_code"
                >
                  Zone Code
                </label>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm pointer-events-none">
                  info
                </span>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  className="peer w-full bg-surface-container-highest border-none rounded-lg p-4 pt-6 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all placeholder-transparent outline-none"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <label
                  className="absolute left-4 top-2 text-xs font-semibold text-primary uppercase tracking-wider transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant bg-surface-container-highest text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Remember device
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-primary hover:text-primary-fixed transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Validating Credentials...' : 'Sign In to Dashboard'}
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-outline-variant/20">
              <p className="text-on-surface-variant text-sm">
                New responder?{' '}
                <Link
                  to="/register"
                  className="text-primary font-bold ml-1 hover:underline underline-offset-4"
                >
                  Register for Zone Access
                </Link>
              </p>
            </div>
          </div>

          {/* Background ornament */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
            <span
              className="material-symbols-outlined text-[200px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
        </section>
      </main>

      {/* ── Error Modal Overlay ── */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowErrorModal(false)}
          />
          <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-6">
                <span className="material-symbols-outlined text-4xl">person_remove</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Not Registered</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                We couldn't find an operator identity with those credentials. Please register to initialize your access.
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <Link 
                  to="/register"
                  className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                >
                  Go to Register
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="w-full py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-2 text-outline-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
