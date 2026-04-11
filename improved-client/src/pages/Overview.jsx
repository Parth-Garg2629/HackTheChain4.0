import useAlertStore from '../store/alertStore';
import useTaskStore from '../store/taskStore';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const { alerts, fetchAlerts } = useAlertStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchAlerts();
    fetchTasks();
  }, [fetchAlerts, fetchTasks]);

  const stats = useMemo(() => [
    { label: 'Total Conflicts', value: alerts.length.toString(), icon: 'map', color: 'text-primary', bg: 'bg-primary/10', delta: 'Managed Zones' },
    { label: 'SOS Alerts', value: alerts.filter(a => !a.isResolved).length.toString(), icon: 'emergency', color: 'text-error', bg: 'bg-error/10', delta: `${alerts.filter(a => a.severity === 'Critical').length} critical` },
    { label: 'Active Missions', value: tasks.filter(t => t.status === 'Claimed').length.toString(), icon: 'groups', color: 'text-secondary', bg: 'bg-secondary/10', delta: 'Responders deployed' },
    { label: 'Resolved', value: alerts.filter(a => a.isResolved).length.toString(), icon: 'inventory_2', color: 'text-tertiary', bg: 'bg-tertiary/10', delta: 'Operations complete' },
  ], [alerts, tasks]);

  const recentAlerts = useMemo(() => alerts.slice(0, 4).map(alert => ({
    id: alert._id ? alert._id.slice(-6).toUpperCase() : 'UNKNOWN',
    zone: alert.zoneCode,
    title: 'Incoming Distress Signal',
    message: alert.message,
    severity: alert.severity,
    time: new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    color: alert.severity === 'Critical' ? 'text-error' : alert.severity === 'Medium' ? 'text-tertiary-container' : 'text-primary',
    border: alert.severity === 'Critical' ? 'border-error' : alert.severity === 'Medium' ? 'border-tertiary-container' : 'border-primary'
  })), [alerts]);

  const zoneLoad = useMemo(() => {
    const zones = {};
    alerts.forEach(a => {
      if (!zones[a.zoneCode]) zones[a.zoneCode] = { alerts: 0, critical: 0 };
      zones[a.zoneCode].alerts++;
      if (a.severity === 'Critical') zones[a.zoneCode].critical++;
    });
    return Object.entries(zones).map(([code, data]) => ({
      id: code,
      name: code ? `Sector ${code.split('-').slice(1).join('-') || code}` : 'Unknown Sector',
      status: data.critical > 0 ? 'Critical' : 'Stable',
      alerts: data.alerts,
      fill: `w-[${Math.min(100, (data.alerts / 10) * 100)}%]`,
      barColor: data.critical > 0 ? 'bg-error' : 'bg-primary'
    })).slice(0, 5);
  }, [alerts]);

  const quickActions = [
    { label: 'Dispatch Relief', icon: 'local_shipping', color: 'bg-primary-container text-on-primary-container', path: '/zone-map' },
    { label: 'View Zone Map', icon: 'map', color: 'bg-secondary/10 text-secondary', path: '/zone-map' },
    { label: 'Resource Inventory', icon: 'inventory_2', color: 'bg-tertiary/10 text-tertiary', path: '/resources' },
    { label: 'Field Operations', icon: 'volunteer', color: 'bg-surface-container text-on-surface', path: '/volunteer' },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#050f19] space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">Crisis Overview</h1>
          <p className="text-on-surface-variant font-body mt-1">Live operational snapshot across all active relief zones</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span className="flex h-2 w-2 rounded-full bg-primary relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          </span>
          <span className="text-[10px] font-bold font-headline text-on-surface tracking-widest uppercase">Live Feed</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:bg-surface-container transition-colors">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div className="font-mono text-3xl font-bold text-on-surface">{stat.value}</div>
            <div className="text-sm text-on-surface-variant mt-1">{stat.label}</div>
            <div className={`text-[10px] font-mono mt-2 ${stat.color} uppercase tracking-wider`}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className={`${action.color} rounded-xl p-4 flex items-center gap-3 hover:brightness-110 transition-all font-headline font-semibold text-sm`}
          >
            <span className="material-symbols-outlined">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Critical Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-sm">emergency</span>
              Live Incident Feed
            </h2>
            <Link to="/incidents" className="text-xs text-primary hover:underline font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`bg-surface-container-low rounded-xl p-4 border-l-4 ${alert.border} flex items-start gap-4 hover:bg-surface-container transition-colors`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono font-bold ${alert.color} uppercase tracking-wider`}>{alert.severity}</span>
                    <span className="text-[10px] text-outline font-mono">• {alert.id}</span>
                    <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded font-mono text-outline uppercase">{alert.zone}</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">{alert.message}</p>
                </div>
                <div className="text-[10px] font-mono text-outline shrink-0">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Status Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">radar</span>
              Zone Load
            </h2>
            <Link to="/zone-map" className="text-xs text-primary hover:underline font-medium">Full Map →</Link>
          </div>
          <div className="space-y-3">
            {zoneLoad.map((zone) => (
              <div key={zone.id} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{zone.name}</p>
                    <p className="text-[10px] font-mono text-outline uppercase">{zone.id}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    zone.status === 'Critical' ? 'bg-error/10 text-error' :
                    'bg-primary/10 text-primary'
                  }`}>{zone.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${zone.barColor} rounded-full ${zone.fill}`}></div>
                  </div>
                  <span className="text-[10px] font-mono text-outline w-12 text-right">{zone.alerts} SOS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
