import useAlertStore from '../store/alertStore';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const SEVERITY_COLORS = {
  Critical: { badge: 'bg-error/10 text-error', border: 'border-error/60' },
  Medium: { badge: 'bg-tertiary-container/10 text-tertiary-container', border: 'border-tertiary-container/60' },
  Low: { badge: 'bg-primary/10 text-primary', border: 'border-primary/60' },
};

const STATUS_COLORS = {
  Active: 'text-error',
  'In Progress': 'text-secondary',
  Resolved: 'text-primary',
};

export default function Incidents() {
  const { alerts, fetchAlerts, resolveAlert } = useAlertStore();
  const { tasks, fetchTasks, claimTask } = useTaskStore();
  
  const [filter, setFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  useEffect(() => {
    fetchAlerts();
    fetchTasks();
  }, [fetchAlerts, fetchTasks]);

  const handleClaim = async (alertId) => {
    const task = tasks.find(t => t.linkedAlert === alertId || t.linkedAlert?._id === alertId);
    if (!task) return;
    
    const res = await claimTask(task._id);
    if (res.success) {
      toast.success('Mission claimed. Initiating tactical link.');
    } else {
      toast.error(res.message);
    }
  };

  const handleResolve = async (alertId) => {
    const res = await resolveAlert(alertId);
    if (res.success) {
      toast.success('Alert resolved and archived.');
    } else {
      toast.error(res.message);
    }
  };

  const filters = ['All', 'Active', 'Resolved'];
  const severities = ['All', 'Critical', 'Medium', 'Low'];

  const filtered = alerts.filter((inc) => {
    const status = inc.isResolved ? 'Resolved' : 'Active';
    const statusMatch = filter === 'All' || status === filter;
    const sevMatch = severityFilter === 'All' || inc.severity === severityFilter;
    return statusMatch && sevMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#050f19] space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">Incident Log</h1>
          <p className="text-on-surface-variant font-body mt-1">Tracking {alerts.length} active and resolved incidents across all zones</p>
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
            <div className="text-2xl font-bold font-mono text-error">{alerts.filter(i => i.severity === 'Critical' && !i.isResolved).length}</div>
            <div className="text-xs text-on-surface-variant">Active Critical</div>
          </div>
        </div>
        <div className="bg-tertiary-container/5 border border-tertiary-container/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-tertiary-container">{alerts.filter(i => !i.isResolved).length}</div>
            <div className="text-xs text-on-surface-variant">Total Active</div>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-primary">{alerts.filter(i => i.isResolved).length}</div>
            <div className="text-xs text-on-surface-variant">Total Resolved</div>
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
            const sc = SEVERITY_COLORS[inc.severity] || SEVERITY_COLORS.Low;
            const task = tasks.find(t => t.linkedAlert === inc._id || t.linkedAlert?._id === inc._id);
            const status = inc.isResolved ? 'Resolved' : task?.status || 'Active';
            
            return (
              <div
                key={inc._id}
                className={`bg-surface-container-low rounded-xl p-5 border-l-4 ${sc.border} hover:bg-surface-container transition-colors group flex items-start gap-5`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${sc.badge}`}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-outline">{inc._id ? inc._id.slice(-6).toUpperCase() : 'UNKNOWN'}</span>
                    <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-mono text-outline uppercase">{inc.zoneCode}</span>
                    <span className={`text-[10px] font-bold uppercase ${inc.isResolved ? 'text-primary' : 'text-error'}`}>• {status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">Incoming SOS Request</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{inc.message}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[10px] text-outline font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {new Date(inc.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="text-[10px] text-outline font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">person</span>
                      Sent By: {inc.sentBy?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!inc.isResolved && task?.status === 'Open' && (
                    <button 
                      onClick={() => handleClaim(inc._id)}
                      className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Claim mission
                    </button>
                  )}
                  {!inc.isResolved && (
                    <button 
                      onClick={() => handleResolve(inc._id)}
                      className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container transition-colors"
                    >
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
