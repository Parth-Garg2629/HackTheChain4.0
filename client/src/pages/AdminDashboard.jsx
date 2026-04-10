import { useState, useEffect } from 'react';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import { 
  Users, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Truck, 
  History,
  Activity,
  Filter,
  Globe,
  Map,
  ClipboardList,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import ChatPanel from '../components/ChatPanel';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { alerts, resolveAlert } = useAlertStore();
  const { resources, addResource, approveResource, deleteResource } = useResourceStore();
  const { tasks, fetchTasks, createTask, claimTask, completeTask } = useTaskStore();
  
  const [viewScope, setViewScope] = useState('regional'); // 'regional' or 'global'
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [activeChatTask, setActiveChatTask] = useState(null);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', location: '', priority: 'Low', zoneCode: user?.zoneCode });
  const [newResource, setNewResource] = useState({ name: '', type: 'Other', notes: '' });

  useEffect(() => {
    fetchTasks(viewScope === 'regional' ? user?.zoneCode : '');
  }, [viewScope, user?.zoneCode, fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const res = await createTask({ ...newTask, zoneCode: newTask.zoneCode || user?.zoneCode });
    if (res.success) {
      toast.success('Strategy Task Deployed');
      setShowAddTask(false);
      setNewTask({ title: '', description: '', location: '', priority: 'Low', zoneCode: user?.zoneCode });
    } else {
      toast.error(res.message);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    const res = await addResource(newResource);
    if (res.success) {
      toast.success('Asset Provisioned');
      setShowAddResource(false);
      setNewResource({ name: '', type: 'Other', notes: '' });
    } else {
      toast.error(res.message);
    }
  };

  // Filter data based on viewScope for UI components
  const displayTasks = tasks; // fetchTasks already handles this in the store
  const displayAlerts = viewScope === 'regional' ? alerts.filter(a => a.zone === user?.zoneCode) : alerts;
  const displayResources = viewScope === 'regional' ? resources.filter(r => r.assignedZone === user?.zoneCode || r.status === 'Available') : resources;

  const stats = [
    { label: 'Unclaimed Tasks', value: displayTasks.filter(t => t.status === 'Open').length, icon: ClipboardList, color: 'text-amber-400' },
    { label: 'Active SOS', value: displayAlerts.filter(a => !a.isResolved).length, icon: AlertCircle, color: 'text-red-400' },
    { label: 'Fleet in Transit', value: displayResources.filter(r => ['In Transit', 'In Use'].includes(r.status)).length, icon: Truck, color: 'text-blue-400' },
    { label: 'Operational Nodes', value: displayResources.filter(r => r.status === 'Available').length, icon: Package, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-crisis-glow" />
            Volunteer Operations Command
          </h1>
          <p className="text-slate-400 text-sm">Strategic mission management and resource orchestration</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View Scope Toggle */}
          <div className="bg-crisis-card p-1 rounded-lg border border-crisis-border flex">
            <button 
              onClick={() => setViewScope('regional')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewScope === 'regional' ? 'bg-crisis-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Map className="w-3 h-3" />
              Regional
            </button>
            <button 
              onClick={() => setViewScope('global')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewScope === 'global' ? 'bg-crisis-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Globe className="w-3 h-3" />
              Global
            </button>
          </div>

          <button onClick={() => setShowAddTask(!showAddTask)} className="btn-primary">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Forms Section */}
      {showAddTask && (
        <div className="card border-crisis-primary/30 animate-slide-in">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Deploy Tactical Task</h3>
          <form onSubmit={handleCreateTask} className="grid md:grid-cols-3 gap-4 pb-2">
             <div className="md:col-span-2">
               <input 
                 className="input mb-3" placeholder="Task Title (e.g., Deliver Rations to Sector G)" 
                 value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required
               />
               <textarea 
                 className="input min-h-[80px] text-sm" placeholder="Detailed mission description..." 
                 value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})}
               />
             </div>
             <div className="flex flex-col gap-3">
               <input className="input" placeholder="Location" value={newTask.location} onChange={(e) => setNewTask({...newTask, location: e.target.value})} required />
               <select className="input" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                 <option>Low</option>
                 <option>Medium</option>
                 <option>Critical</option>
               </select>
               <div className="flex gap-2">
                 <button type="submit" className="btn-primary flex-1">Issue Task</button>
                 <button type="button" onClick={() => setShowAddTask(false)} className="btn-ghost">Cancel</button>
               </div>
             </div>
          </form>
        </div>
      )}

      {/* Main Grid: Tasks & SOS Ticker */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Task Monitoring Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Strategic Task Board
            </h2>
            <span className="text-[10px] font-mono bg-crisis-border/50 px-2 py-0.5 rounded text-slate-300">
               Viewing: {viewScope.toUpperCase()}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {displayTasks.length === 0 ? (
              <div className="card md:col-span-2 text-center py-10 text-slate-500 italic text-sm">No tasks currently registered.</div>
            ) : (
              displayTasks.map((task) => (
                <div key={task._id} className={`card p-4 border-l-4 transition-all ${
                  task.status === 'Completed' ? 'opacity-50 border-l-slate-600' :
                  task.priority === 'Critical' ? 'border-l-red-500 bg-red-500/5' : 
                  task.priority === 'Medium' ? 'border-l-amber-500' : 'border-l-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                     <span className={`badge-${task.priority.toLowerCase()}`}>
                       {task.priority} Priority
                     </span>
                     <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                       task.status === 'Open' ? 'text-green-400 bg-green-400/10' : 
                       task.status === 'Claimed' ? 'text-blue-400 bg-blue-400/10' : 
                       'text-slate-400 bg-slate-400/10'
                     }`}>
                       {task.status}
                     </span>
                     {task.status === 'Open' && (
                        <button 
                          onClick={() => claimTask(task._id)}
                          className="text-[10px] font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors"
                        >
                          CLAIM MISSION
                        </button>
                      )}
                  </div>
                  <h4 className="text-white font-bold text-base mb-1">{task.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                       <Map className="w-3 h-3" />
                       {task.location}
                       <span className="bg-crisis-border/50 px-1 rounded font-mono uppercase">{task.zoneCode}</span>
                    </div>
                    {task.status === 'Claimed' && (
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {task.assignedTo?.name}
                        </div>
                        <button 
                          onClick={() => setActiveChatTask({ id: task._id, title: task.title })}
                          className="text-[10px] bg-crisis-primary/20 text-crisis-glow px-2 py-1 rounded hover:bg-crisis-primary/30 transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Comms
                        </button>
                        {task.assignedTo?._id === user?.id && (
                          <button 
                            onClick={() => completeTask(task._id)}
                            className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded hover:bg-green-500/20 transition-colors"
                          >
                            Finish
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Fleet Management Table */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                 <Truck className="w-4 h-4" />
                 Tactical Fleet & Assets
              </h2>
              <button 
                onClick={() => setShowAddResource(!showAddResource)}
                className="text-[10px] font-bold text-crisis-glow flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Asset
              </button>
            </div>

            {showAddResource && (
              <div className="card border-crisis-primary/30 animate-slide-in mb-4">
                <form onSubmit={handleAddResource} className="grid md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <input className="input py-2 text-sm" placeholder="Asset Identifier..." value={newResource.name} onChange={(e) => setNewResource({...newResource, name: e.target.value})} required />
                  </div>
                  <div>
                    <select className="input py-2 text-sm" value={newResource.type} onChange={(e) => setNewResource({...newResource, type: e.target.value})}>
                      <option>Truck</option>
                      <option>Van</option>
                      <option>Ambulance</option>
                      <option>Generator</option>
                      <option>Chainsaw</option>
                      <option>Medical Kit</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary py-2 text-sm">Add</button>
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
                      <th className="px-5 py-3">Deployment</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-crisis-border/30">
                    {displayResources.map((resource) => (
                        <tr key={resource._id} className="hover:bg-crisis-primary/5 transition-colors group">
                          <td className="px-5 py-3 text-sm font-semibold text-white">{resource.name}</td>
                          <td className="px-5 py-3 text-xs text-slate-400">{resource.type}</td>
                          <td className="px-5 py-3">
                            <span className={`badge-${resource.status.toLowerCase().replace(' ', '')}`}>
                              {resource.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-300">
                             {resource.assignedTo ? `${resource.assignedTo.name} (${resource.assignedZone})` : '—'}
                          </td>
                          <td className="px-5 py-3 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               {resource.status === 'Requested' && (
                                 <button onClick={() => approveResource(resource._id)} className="p-1 bg-green-500/20 text-green-400 rounded-md"><CheckCircle2 className="w-3 h-3" /></button>
                               )}
                               <button onClick={() => deleteResource(resource._id)} className="p-1 bg-red-500/20 text-red-400 rounded-md"><Trash2 className="w-3 h-3" /></button>
                             </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Alert Sidebar (High Priority Sidebar) */}
        <div className="lg:col-span-1 space-y-4">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Intelligence Ticker
           </h2>
            <div className="space-y-3 max-h-[800px] overflow-y-auto custom-scrollbar">
              {displayAlerts.length === 0 ? (
                <div className="p-10 text-center text-slate-600 italic text-xs">Waiting for incoming signal...</div>
              ) : (
                displayAlerts.map((alert) => (
                  <div key={alert._id} className={`card p-4 border-l-4 transition-all ${alert.isResolved ? 'opacity-40 grayscale' : alert.severity === 'Critical' ? 'border-l-red-500 animate-pulse-subtle' : 'border-l-amber-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`badge-${alert.severity.toLowerCase()}`}>SOS {alert.severity}</span>
                       <span className="text-[10px] text-slate-500 font-mono">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-white mb-3">{alert.message}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-slate-500">Reported by: <span className="text-slate-300">{alert.sentBy?.name}</span></span>
                       {!alert.isResolved && (
                         <button onClick={() => resolveAlert(alert._id)} className="text-[10px] font-bold text-crisis-glow hover:underline uppercase">Acknowledge</button>
                       )}
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

      </div>
      {/* Chat Overlay */}
      {activeChatTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md animate-slide-in">
            <div className="bg-crisis-bg border border-crisis-border rounded-2xl shadow-2xl">
              <div className="flex justify-end p-2">
                <button onClick={() => setActiveChatTask(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </button>
              </div>
              <ChatPanel 
                taskId={activeChatTask.id} 
                missionTitle={activeChatTask.title} 
                isCompleted={tasks.find(t => t._id === activeChatTask.id)?.status === 'Completed'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
