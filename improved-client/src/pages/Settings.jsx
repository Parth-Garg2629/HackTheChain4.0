import React, { useState } from 'react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'display', label: 'Display', icon: 'palette' },
  { id: 'connectivity', label: 'Connectivity', icon: 'wifi' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'about', label: 'About', icon: 'info' },
];

function ProfileSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Operator Profile</h2>
        <p className="text-sm text-on-surface-variant">Manage your identity and zone assignments</p>
      </div>
      <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4S0SryIxxksNinKPB9nrJIM5FDYFe1vDXhZGJO98FxA6JkE4w3GkAcyLTzbpasIgRzRiFh_LZNjagMCy5u80AjTNPUX4Faa4Ey0mbYqJW9Ie5W8o5Hcs5O_mGa4s0s1OJSl3kf3D_wiyisSF2JujQTbuU9GoI1FSJWh4ZYHLVHcAAna1KgeQ1oEM_yPWKiuc_21D1IKY3F-l-8bs1h-F8VwnVogLk3RFaRSMtC2QTrHBo8wyMr3C0_YRuPCrSVYvxqeEsQAUNge0" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-headline font-bold text-on-surface">Operator Name</h3>
          <p className="text-xs font-mono text-outline uppercase tracking-wider mt-0.5">ID: RS-9421-ALPHA</p>
          <p className="text-xs text-on-surface-variant mt-1">Zone 04-B · Dispatcher</p>
        </div>
        <button className="text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors">Change Photo</button>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Full Name', placeholder: 'Operator Name', type: 'text' },
          { label: 'Contact Number', placeholder: '+91 XXXXX XXXXX', type: 'tel' },
          { label: 'Email Address', placeholder: 'operator@reliefsync.in', type: 'email' },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-2 block">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 outline-none placeholder:text-outline" />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-2 block">Assigned Zone</label>
          <select className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 outline-none">
            <option>Zone 04-B (Central)</option>
            <option>Zone 01-A (North)</option>
            <option>Zone 03-C (South)</option>
          </select>
        </div>
        <button className="bg-primary-container text-on-primary-container font-bold py-3 px-8 rounded-lg hover:brightness-110 transition-all font-headline text-sm mt-4">Save Changes</button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    sos: true, zoneUpdate: true, dispatch: false, system: true, email: false,
  });
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'sos', label: 'SOS Alerts', desc: 'Immediate notification for new distress signals', icon: 'emergency', color: 'text-error' },
    { key: 'zoneUpdate', label: 'Zone Status Updates', desc: 'When a zone changes severity level', icon: 'map', color: 'text-secondary' },
    { key: 'dispatch', label: 'Dispatch Events', desc: 'When resources or volunteers are deployed', icon: 'local_shipping', color: 'text-tertiary' },
    { key: 'system', label: 'System Messages', desc: 'Sync status and connectivity alerts', icon: 'hub', color: 'text-primary' },
    { key: 'email', label: 'Email Digest', desc: 'Daily operations summary to your inbox', icon: 'email', color: 'text-on-surface-variant' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Notification Preferences</h2>
        <p className="text-sm text-on-surface-variant">Manage which alerts reach you and when</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{item.label}</p>
              <p className="text-xs text-on-surface-variant">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-12 h-6 rounded-full transition-all duration-200 relative ${prefs[item.key] ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${prefs[item.key] ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplaySettings() {
  const [theme, setTheme] = useState('dark');
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Display Settings</h2>
        <p className="text-sm text-on-surface-variant">Adjust the visual interface for your field conditions</p>
      </div>
      <div>
        <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-4 block">Color Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {['dark', 'high-contrast', 'dim'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-4 rounded-xl border-2 text-sm font-headline font-semibold capitalize transition-all ${theme === t ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/60'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-4 block">Interface Density</label>
        <div className="grid grid-cols-3 gap-3">
          {['compact', 'comfortable', 'spacious'].map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`p-4 rounded-xl border-2 text-sm font-headline font-semibold capitalize transition-all ${density === d ? 'border-secondary text-secondary bg-secondary/5' : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/60'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-4 block">Font Size</label>
        <input type="range" min="12" max="20" defaultValue="14" className="w-full accent-primary" />
        <div className="flex justify-between text-[10px] font-mono text-outline mt-1">
          <span>Small</span><span>Default</span><span>Large</span>
        </div>
      </div>
    </div>
  );
}

function ConnectivitySettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Connectivity</h2>
        <p className="text-sm text-on-surface-variant">Manage server connections and sync status</p>
      </div>
      <div className="space-y-4">
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-semibold text-on-surface text-sm">Sync Server</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span>
              CONNECTED
            </span>
          </div>
          <input type="text" readOnly value="wss://reliefsync.ops.in/live" className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-xs font-mono text-on-surface-variant outline-none" />
        </div>
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline font-semibold text-on-surface text-sm">API Endpoint</h3>
          </div>
          <input type="text" readOnly value="https://api.reliefsync.ops.in/v2" className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-xs font-mono text-on-surface-variant outline-none" />
        </div>
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-semibold text-on-surface text-sm">Offline Mode</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Cache critical data for use without connectivity</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-primary cursor-pointer relative">
              <span className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Security</h2>
        <p className="text-sm text-on-surface-variant">Manage your access credentials and session security</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-2 block">Current Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-2 block">New Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 outline-none" />
        </div>
        <button className="bg-primary-container text-on-primary-container font-bold py-3 px-8 rounded-lg hover:brightness-110 transition-all font-headline text-sm">Update Password</button>
        <div className="border-t border-outline-variant/10 pt-6 mt-4">
          <h3 className="font-headline font-semibold text-on-surface mb-4 text-sm">Active Sessions</h3>
          {['Field Device (Android) · Zone 04-B', 'Command Console (Chrome) · Central Hub'].map((s) => (
            <div key={s} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg mb-2 border border-outline-variant/10">
              <div>
                <p className="text-xs font-semibold text-on-surface">{s.split('·')[0]}</p>
                <p className="text-[10px] font-mono text-outline">{s.split('·')[1]}</p>
              </div>
              <button className="text-[10px] font-bold text-error border border-error/20 px-3 py-1.5 rounded-lg hover:bg-error/5 transition-colors">Revoke</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-1">About ReliefSync</h2>
        <p className="text-sm text-on-surface-variant">System information and licensing</p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Application', value: 'ReliefSync Field Operations' },
          { label: 'Version', value: '2.4.1-stable' },
          { label: 'Build', value: 'rc-20260410-001' },
          { label: 'License', value: 'NGO Relief Coordination v3' },
          { label: 'Protocol', value: 'CrisisGrid Mesh v2' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10">
            <span className="text-sm text-on-surface-variant">{item.label}</span>
            <span className="text-sm font-mono text-on-surface">{item.value}</span>
          </div>
        ))}
      </div>
      <button className="w-full py-3 border border-error/20 text-error text-sm font-headline font-bold rounded-lg hover:bg-error/5 transition-colors">
        Clear Cache & Reset
      </button>
    </div>
  );
}

const PANELS = { profile: ProfileSettings, notifications: NotificationSettings, display: DisplaySettings, connectivity: ConnectivitySettings, security: SecuritySettings, about: AboutSettings };

export default function Settings() {
  const [active, setActive] = useState('profile');
  const ActivePanel = PANELS[active];

  return (
    <div className="flex-1 overflow-hidden flex bg-[#050f19]">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-outline-variant/10 bg-surface-container-lowest flex flex-col py-6 shrink-0">
        <div className="px-6 mb-6">
          <h1 className="text-lg font-headline font-bold text-on-surface">Settings</h1>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {settingsSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg font-headline font-medium text-sm tracking-tight transition-colors duration-150 text-left ${
                active === s.id
                  ? 'bg-surface-container text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: active === s.id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          <ActivePanel />
        </div>
      </div>
    </div>
  );
}
