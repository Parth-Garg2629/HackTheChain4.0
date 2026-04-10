import { useState } from 'react';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import { 
  Users, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Truck, 
  History,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { alerts, resolveAlert } = useAlertStore();
  const { resources, addResource, approveResource, deleteResource } = useResourceStore();
  
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', type: 'Other', notes: '' });

  const handleAddResource = async (e) => {
    e.preventDefault();
    const res = await addResource(newResource);
    if (res.success) {
      toast.success('Resource added to pool');
      setShowAddResource(false);
      setNewResource({ name: '', type: 'Other', notes: '' });
    } else {
      toast.error(res.message);
    }
  };

  const stats = [
    { label: 'Active Alerts', value: alerts.filter(a => !a.isResolved).length, icon: AlertCircle, color: 'text-red-400' },
    { label: 'Resources En Route', value: resources.filter(r => r.status === 'In Transit').length, icon: Truck, color: 'text-blue-400' },
    { label: 'Available Supply', value: resources.filter(r => r.status === 'Available').length, icon: Package, color: 'text-green-400' },
    { label: 'Total Responders', value: '14', icon: Users, color: 'text-crisis-glow' }, // Placeholder stat
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-crisis-glow" />
            Base Operations Command
          </h1>
          <p className="text-slate-400 text-sm">Real-time oversight of zone coordination and resource flow</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddResource(!showAddResource)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Provision Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Alerts (The Wow Factor Real-time Feed) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
              <History className="w-4 h-4" />
              SOS Incident Feed
            </h2>
            <div className="h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="card text-center py-10 text-slate-500 text-sm">
                No active incidents reported.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert._id} className={`card p-4 border-l-4 transition-all ${
                  alert.isResolved 
                    ? 'opacity-60 border-l-slate-600 grayscale' 
                    : alert.severity === 'Critical' 
                      ? 'border-l-red-500 bg-red-500/5 pulse-subtle' 
                      : alert.severity === 'Medium' 
                        ? 'border-l-amber-500' 
                        : 'border-l-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`badge-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white mb-3 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-crisis-border flex items-center justify-center text-[10px] font-bold">
                        {alert.sentBy?.name?.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{alert.sentBy?.name}</span>
                      <span className="text-[10px] bg-crisis-border/50 text-slate-300 px-1.5 py-0.5 rounded font-mono uppercase">
                        {alert.zone}
                      </span>
                    </div>
                    {!alert.isResolved && (
                      <button 
                        onClick={() => resolveAlert(alert._id)}
                        className="text-[10px] font-bold text-crisis-glow border border-crisis-glow/30 hover:bg-crisis-glow/10 px-2 py-1 rounded uppercase transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Resource Inventory & Management */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
             <Package className="w-4 h-4" />
             Tactical Inventory Control
          </h2>

          {showAddResource && (
            <div className="card border-crisis-primary/30 animate-slide-in">
              <form onSubmit={handleAddResource} className="grid md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Asset Name / Tag</label>
                  <input 
                    className="input py-2 text-sm" 
                    placeholder="Ambulance #4, Food Pack B..."
                    value={newResource.name}
                    onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                  <select 
                    className="input py-2 text-sm"
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                  >
                    <option>Ambulance</option>
                    <option>Medical Kit</option>
                    <option>Food Supply</option>
                    <option>Water Tank</option>
                    <option>Rescue Equipment</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary py-2 text-sm flex-1">Save</button>
                  <button type="button" onClick={() => setShowAddResource(false)} className="btn-ghost py-2 text-sm">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card p-0 overflow-hidden border-crisis-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-crisis-bg/50 text-[10px] uppercase font-bold text-slate-500 border-b border-crisis-border">
                  <tr>
                    <th className="px-5 py-3">Asset</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Assignment</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-crisis-border/30">
                  {resources.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-10 text-center text-slate-500 text-sm italic">
                        No resources in inventory pool.
                      </td>
                    </tr>
                  ) : (
                    resources.map((resource) => (
                      <tr key={resource._id} className="hover:bg-crisis-primary/5 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold text-white">{resource.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-tighter">ID: {resource._id.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-300 bg-crisis-border/30 px-2 py-0.5 rounded">{resource.type}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge-${resource.status.toLowerCase().replace(' ', '')}`}>
                            {resource.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {resource.assignedTo ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-white underline decoration-crisis-glow/30 underline-offset-2">{resource.assignedTo.name}</span>
                              <span className="text-[10px] text-slate-500 uppercase font-mono">{resource.assignedZone}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            {resource.status === 'Requested' && (
                              <button 
                                onClick={() => approveResource(resource._id)}
                                className="p-1.5 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30"
                                title="Approve Request"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteResource(resource._id)}
                              className="p-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                              title="Decommission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
