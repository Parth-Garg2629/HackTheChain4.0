import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const ROLES = [
  {
    id: 'General Volunteer',
    icon: 'volunteer_activism',
    label: 'Field Volunteer',
    sub: 'Ground Response',
  },
  {
    id: 'Victim',
    icon: 'emergency',
    label: 'Citizen in Distress',
    sub: 'Emergency Signal',
  },
];

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('General Volunteer');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', zoneCode: '', password: '' });

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate zone code format (RJ-KOTA-01)
    const zoneRegex = /^[A-Z]{2}-[A-Z]+-\d{2}$/;
    if (!zoneRegex.test(formData.zoneCode.toUpperCase())) {
      toast.error('Invalid zone format. Use STATE-CITY-01 (e.g. MH-PUNE-05)');
      return;
    }

    const res = await register({
      ...formData,
      role: selectedRole
    });

    if (res.success) {
      toast.success('Registration successful.');
      setShowSuccessModal(true);
    } else {
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex overflow-hidden relative">
      <div className="flex w-full h-screen">

        {/* ── Left Panel: Branding ── */}
        <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Relief workers coordinating logistics"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAibbploUK40YnyWFm_xCs-0MDkTSsqCuhhe4s5v42o3jjbfJsLLxncBM9_AnDbB_j77bjpvVquY55OTHDdtyyThySO5653wqvoUjq2kD5ieF9eYeVac4zl_fCUtS6gWS2EPuREuIe38rFTSLEmwUlYfSI9-MgT304cMMJVlJTV5G54ZzGfnnX0UtqkUq2h-EmAWCxmNBST9YF8ZtYWYktij9Go5N-Xu6yS9zk4MnG9luorsb0XHAPxlWoQL9YHRZWETcPP6n9C8FQ"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface/60 to-transparent" />
          </div>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  hub
                </span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white uppercase">
                ReliefSync
              </span>
            </div>
          </div>

          {/* Headline + stats */}
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Mission-Critical <br />
              <span className="text-primary">Coordination</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-12">
              Join the network that powers the world's most responsive relief efforts. From base
              camp to the furthest mile, we stay in sync.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low/40 backdrop-blur-md p-6 rounded-xl border border-outline-variant/20">
                <div className="font-mono text-primary text-3xl font-bold mb-1">2.4k+</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  Active Operators
                </div>
              </div>
              <div className="bg-surface-container-low/40 backdrop-blur-md p-6 rounded-xl border border-outline-variant/20">
                <div className="font-mono text-primary text-3xl font-bold mb-1">99.9%</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  Uptime Sync
                </div>
              </div>
            </div>
          </div>

          {/* Footer credit */}
          <div className="relative z-10">
            <p className="text-sm text-on-surface-variant/60 font-medium">
              © 2024 ReliefSync Global Operations. Secure access only.
            </p>
          </div>
        </section>

        {/* ── Right Panel: Registration Form ── */}
        <main className="w-full lg:w-1/2 flex flex-col justify-center bg-surface px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto">

            {/* Header + step indicator */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-3xl font-bold text-white tracking-tight font-headline">
                  Create Operator Identity
                </h2>
                <div className="text-right">
                  <span className="font-mono text-primary text-xs font-bold tracking-widest">
                    STEP 1 OF 2
                  </span>
                  <div className="flex gap-1 mt-1">
                    <div className="h-1.5 w-8 rounded-full bg-primary-container" />
                    <div className="h-1.5 w-8 rounded-full bg-surface-container-highest" />
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant">
                Initialize your credentials for the global response network.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              {/* Text inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface/80 px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Rodriguez"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                  />
                </div>


                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface/80 px-1">Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full bg-surface-container-highest border-none rounded-lg p-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 cursor-pointer hover:text-primary transition-colors"
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-on-surface/80 px-1">
                  Operational Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {ROLES.map((role) => {
                    const active = selectedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`relative group cursor-pointer p-4 rounded-xl transition-all
                          ${active
                            ? 'bg-surface-container-low border border-primary/20'
                            : 'bg-surface-container-highest/30 border border-outline-variant/10 hover:border-primary/40 hover:bg-surface-container-low'
                          }`}
                      >
                        {active && (
                          <div className="absolute top-3 right-3">
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <span
                                className="material-symbols-outlined text-on-primary font-bold"
                                style={{ fontSize: 10 }}
                              >
                                check
                              </span>
                            </div>
                          </div>
                        )}
                        <span
                          className={`material-symbols-outlined mb-2 ${active ? 'text-primary' : 'text-outline group-hover:text-on-surface'}`}
                          style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {role.icon}
                        </span>
                        <div className={`font-bold text-sm ${active ? 'text-white' : 'text-on-surface-variant group-hover:text-white'}`}>
                          {role.label}
                        </div>
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
                          {role.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone Assignment - MANUAL ENTRY */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface/80 px-1">
                  Initial Zone Assignment
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.zoneCode}
                    onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })}
                    placeholder="e.g. RJ-KOTA-01"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-4 text-on-surface font-mono placeholder:text-outline/40 placeholder:font-body focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 pointer-events-none">
                    edit_location_alt
                  </span>
                </div>
                <p className="text-[10px] text-outline px-1 uppercase tracking-tight font-medium">Please enter your assigned tactical zone code</p>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary-container hover:bg-primary text-on-primary-container font-bold rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-container/10 disabled:opacity-50"
                >
                  {loading ? 'Initializing Operator...' : 'Create Account'}
                  {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>}
                </button>

                <p className="text-center text-on-surface-variant text-sm mt-6">
                  Already have an identity?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
                  >
                    Login to Hub
                  </Link>
                </p>
              </div>
            </form>

            {/* Security footer */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10">
              <div className="flex items-center gap-4 text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em] font-medium justify-center">
                <span>Encrypted Protocol AES-256</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
                <span>Biometric Ready</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
                <span>ISO 27001</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Success Modal Overlay ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Registration Complete</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                Operator identity initialized. Your request is pending clearance from the Central Coordination Hub.
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <Link 
                  to="/login"
                  className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                >
                  Proceed to Login
                  <span className="material-symbols-outlined text-lg">login</span>
                </Link>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Review Details
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
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
