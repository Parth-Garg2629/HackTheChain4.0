import React from 'react';

const zoneData = [
  { id: 'ZONE-KA-01', name: 'Central Bengaluru', status: 'Critical', alerts: 42, volunteers: 156, borderCol: 'border-error/50', statusBg: 'bg-error/10 text-error', textCol: 'text-error', tileShadow: '' },
  { id: 'ZONE-TN-14', name: 'North Chennai', status: 'Warning', alerts: 18, volunteers: 89, borderCol: 'border-tertiary-container/50', statusBg: 'bg-tertiary-container/10 text-tertiary-container', textCol: 'text-tertiary-container', tileShadow: '' },
  { id: 'ZONE-KL-09', name: 'Kochi Coastal', status: 'Stable', alerts: 2, volunteers: 240, borderCol: 'border-primary/50', statusBg: 'bg-primary/10 text-primary', textCol: 'text-primary', tileShadow: '' },
  { id: 'ZONE-AP-05', name: 'Vijayawada East', status: 'Warning', alerts: 12, volunteers: 112, borderCol: 'border-tertiary-container/50', statusBg: 'bg-tertiary-container/10 text-tertiary-container', textCol: 'text-tertiary-container', tileShadow: '' },
  { id: 'ZONE-TS-22', name: 'Hyderabad Hub', status: 'Warning', alerts: 25, volunteers: 305, borderCol: 'border-tertiary-container/50', statusBg: 'bg-tertiary-container/10 text-tertiary-container', textCol: 'text-tertiary-container', tileShadow: '' },
  { id: 'ZONE-MH-44', name: 'Mumbai South', status: 'Critical', alerts: 56, volunteers: 422, borderCol: 'border-error/50', statusBg: 'bg-error/10 text-error', textCol: 'text-error', tileShadow: 'shadow-[0_10px_30px_-10px_rgba(255,180,171,0.1)]' },
];

export default function ZoneMap() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#050f19] flex">
      {/* Main Map Area */}
      <div className="flex-1 mr-6">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-2">Operational Zones</h1>
            <p className="text-on-surface-variant font-body max-w-xl">Live grid view of active relief sectors in Southern India. Color intensity represents severity levels based on resource saturation.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high px-4 py-2 rounded-xl flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Live Map</span>
              </div>
              <div className="h-4 w-px bg-outline-variant/30"></div>
              <div className="font-mono text-sm text-primary">12.9716° N, 77.5946° E</div>
            </div>
          </div>
        </div>

        {/* Heatmap Overlay */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {zoneData.map((zone) => (
              <div 
                key={zone.id} 
                className={`group bg-surface-container-low hover:bg-surface-container-high rounded-xl p-6 transition-all duration-300 border-l-4 ${zone.borderCol} cursor-pointer ${zone.tileShadow}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-mono text-xs font-bold tracking-widest ${zone.textCol}`}>{zone.id}</span>
                  <span className={`${zone.statusBg} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>{zone.status}</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-1">{zone.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-label tracking-tighter">Alerts</p>
                    <p className={`font-mono text-xl ${zone.textCol}`}>{zone.alerts}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-label tracking-tighter">Volunteers</p>
                    <p className="font-mono text-xl text-on-surface">{zone.volunteers}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary font-medium">View Details</span>
                  <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Drawer (Zone Details) */}
      <aside className="w-[420px] bg-surface-container h-full rounded-2xl border border-outline-variant/20 overflow-y-auto z-40 transform translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline font-bold text-2xl text-on-surface">Zone Details</h2>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="mb-8">
            <div className="relative h-48 rounded-xl overflow-hidden mb-6 group bg-surface-container-highest">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <span className="font-mono text-xs text-primary font-bold bg-surface-container-lowest/80 px-2 py-1 rounded">ZONE-KA-01</span>
                <h4 className="text-white font-bold text-lg mt-1">Central Bengaluru</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <span className="text-[10px] uppercase font-label tracking-wider text-on-surface-variant">Medical Units</span>
                <p className="font-mono text-xl text-on-surface mt-1">12 / 15</p>
                <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
                  <div className="bg-primary h-full w-[80%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <span className="text-[10px] uppercase font-label tracking-wider text-on-surface-variant">Food Storage</span>
                <p className="font-mono text-xl text-on-surface mt-1">65%</p>
                <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
                  <div className="bg-tertiary-container h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Incidents */}
          <div className="space-y-6">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">emergency_share</span>
                Active Incidents (42)
              </h5>
              <div className="space-y-3">
                <div className="p-3 bg-error-container/20 border-l-2 border-error rounded-r-lg flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-on-error-container">Structural Collapse - MG Road</p>
                    <p className="text-xs text-on-surface-variant mt-1 font-mono">INC-9921 • 14:22 PM</p>
                  </div>
                  <span className="material-symbols-outlined text-error text-sm">warning</span>
                </div>
                <div className="p-3 bg-surface-container-highest/40 border-l-2 border-tertiary-container rounded-r-lg flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Power Outage - Indiranagar</p>
                    <p className="text-xs text-on-surface-variant mt-1 font-mono">INC-9918 • 13:45 PM</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-container text-sm">bolt</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-outline-variant/10 flex gap-3">
              <button className="flex-1 bg-primary-container text-on-primary-container font-bold text-sm py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(45,212,191,0.2)]">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                Dispatch Relief
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
