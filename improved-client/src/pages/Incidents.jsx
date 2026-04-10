import React, { useState } from 'react';

const ALL_INCIDENTS = [
  { id: 'INC-9921', zone: 'ZONE-KA-01', title: 'Structural Collapse - MG Road', desc: 'Multi-storey building partially collapsed. 6 people reported trapped. Fire brigade and NDRF on standby.', severity: 'Critical', status: 'Active', time: '14:22', responders: 12 },
  { id: 'INC-9920', zone: 'ZONE-MH-44', title: 'Flooding - Dharavi East', desc: 'Severe waterlogging has cut off 3 residential colonies. Boats deployed.', severity: 'Critical', status: 'Active', time: '14:10', responders: 20 },
  { id: 'INC-9918', zone: 'ZONE-TN-14', title: 'Power Outage - Indiranagar', desc: 'Substation fire has caused widespread outage affecting 4,000+ households.', severity: 'Warning', status: 'Active', time: '13:45', responders: 5 },
  { id: 'INC-9915', zone: 'ZONE-AP-05', title: 'Road Blockage - NH-44', desc: 'Landslide debris blocking primary relief convoy route.', severity: 'Warning', status: 'In Progress', time: '13:10', responders: 8 },
  { id: 'INC-9910', zone: 'ZONE-MH-44', title: 'Medical Supply - Bandra Hospital', desc: 'Critical shortage of IV fluids and blood type O+. Air-lift requested.', severity: 'Critical', status: 'In Progress', time: '12:55', responders: 3 },
  { id: 'INC-9905', zone: 'ZONE-KL-09', title: 'Medical Supply Shortage - Kochi', desc: 'Coastal clinic running low on antibiotics. Fleet dispatch initiated.', severity: 'Warning', status: 'Resolved', time: '12:30', responders: 4 },
  { id: 'INC-9900', zone: 'ZONE-TS-22', title: 'Evacuation Required - Secunderabad', desc: 'Flash flood risk imminent. 200+ residents require evacuation.', severity: 'Critical', status: 'Active', time: '11:50', responders: 30 },
];

const SEVERITY_COLORS = {
  Critical: { badge: 'bg-error/10 text-error', border: 'border-error/60' },
  Warning: { badge: 'bg-tertiary-container/10 text-tertiary-container', border: 'border-tertiary-container/60' },
  Advisory: { badge: 'bg-primary/10 text-primary', border: 'border-primary/60' },
};

const STATUS_COLORS = {
  Active: 'text-error',
  'In Progress': 'text-secondary',
  Resolved: 'text-primary',
};

export default function Incidents() {
  const [filter, setFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filters = ['All', 'Active', 'In Progress', 'Resolved'];
  const severities = ['All', 'Critical', 'Warning', 'Advisory'];

  const filtered = ALL_INCIDENTS.filter((inc) => {
    const statusMatch = filter === 'All' || inc.status === filter;
    const sevMatch = severityFilter === 'All' || inc.severity === severityFilter;
    return statusMatch && sevMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#050f19] space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">Incident Log</h1>
          <p className="text-on-surface-variant font-body mt-1">Tracking {ALL_INCIDENTS.length} active and resolved incidents across all zones</p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold hover:brightness-110 transition-all text-sm">
          <span className="material-symbols-outlined text-lg">add</span>
          Log Incident
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-error/5 border border-error/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
            <span className="material-symbols-outlined">crisis_alert</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-error">{ALL_INCIDENTS.filter(i => i.severity === 'Critical').length}</div>
            <div className="text-xs text-on-surface-variant">Critical</div>
          </div>
        </div>
        <div className="bg-tertiary-container/5 border border-tertiary-container/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-tertiary-container">{ALL_INCIDENTS.filter(i => i.severity === 'Warning').length}</div>
            <div className="text-xs text-on-surface-variant">Warnings</div>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-primary">{ALL_INCIDENTS.filter(i => i.status === 'Resolved').length}</div>
            <div className="text-xs text-on-surface-variant">Resolved</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-outline-variant/30 mx-2"></div>
        <div className="flex gap-2">
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                severityFilter === s
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] font-mono text-outline uppercase tracking-wider">{filtered.length} results</span>
      </div>

      {/* Incident Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
            <p className="font-headline font-semibold">No incidents match your filters</p>
          </div>
        ) : (
          filtered.map((inc) => {
            const sc = SEVERITY_COLORS[inc.severity] || SEVERITY_COLORS.Advisory;
            return (
              <div
                key={inc.id}
                className={`bg-surface-container-low rounded-xl p-5 border-l-4 ${sc.border} hover:bg-surface-container transition-colors group flex items-start gap-5`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${sc.badge}`}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-outline">{inc.id}</span>
                    <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-mono text-outline uppercase">{inc.zone}</span>
                    <span className={`text-[10px] font-bold uppercase ${STATUS_COLORS[inc.status]}`}>• {inc.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">{inc.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{inc.desc}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[10px] text-outline font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {inc.time} PM
                    </span>
                    <span className="text-[10px] text-outline font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">groups</span>
                      {inc.responders} responders
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors">
                    Assign
                  </button>
                  {inc.status !== 'Resolved' && (
                    <button className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container transition-colors">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
