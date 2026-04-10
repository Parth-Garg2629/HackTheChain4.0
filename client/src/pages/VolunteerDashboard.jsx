import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import useTaskStore from '../store/taskStore';
import { 
  Send, 
  Package, 
  Zap, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Clock,
  ClipboardCheck,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VolunteerDashboard() {
  const { user } = useAuthStore();
  const { createAlert } = useAlertStore();
  const { resources, requestResource, returnResource } = useResourceStore();
  const { tasks, claimTask, completeTask } = useTaskStore();
  
  const [sosMessage, setSosMessage] = useState('');
  const [sosSeverity, setSosSeverity] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleSendSOS = async (e) => {
    e.preventDefault();
    if (!sosMessage) return;
    setLoading(true);
    const res = await createAlert({ message: sosMessage, severity: sosSeverity });
    if (res.success) {
      toast.success('SOS Broadcasted to Base Camp');
      setSosMessage('');
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleClaim = async (taskId) => {
    const res = await claimTask(taskId);
    if (res.success) {
      toast.success('Task Claimed. Check Navigation.');
    } else if (res.isConflict) {
      toast.error('Task already claimed by another responder.');
    } else {
      toast.error(res.message);
    }
  };

  const myTasks = tasks.filter(t => t.assignedTo?._id === user?.id && t.status !== 'Completed');
  const availableTasks = tasks.filter(t => t.status === 'Open' && t.zoneCode === user?.zoneCode);
  const myResources = resources.filter(r => r.assignedTo?._id === user?.id);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Role Banner */}
      <div className="flex items-center justify-between p-4 bg-crisis-card rounded-xl border border-crisis-border">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${user?.role === 'Verified Driver' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
               {user?.role === 'Verified Driver' ? <Truck className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
            </div>
            <div>
               <h2 className="text-white font-bold leading-tight">{user?.name}</h2>
               <p className="text-slate-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Responder: {user?.role} • {user?.zoneCode}
               </p>
            </div>
         </div>
         <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Status</span>
            <span className="text-xs text-white font-mono">SIGNAL STABLE</span>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Task Board */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Available Mission Tasks
          </h3>

          <div className="space-y-3">
             {availableTasks.length === 0 ? (
               <div className="card text-center py-10 text-slate-500 italic text-sm">No tasks in your zone.</div>
             ) : (
               availableTasks.map(task => (
                 <div key={task._id} className={`card p-4 border-l-4 transition-all hover:scale-[1.01] ${task.priority === 'Critical' ? 'border-l-red-500 bg-red-500/5' : 'border-l-crisis-glow'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`badge-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
                       <button onClick={() => handleClaim(task._id)} className="text-[10px] font-bold bg-crisis-primary px-3 py-1 rounded text-white">
                         CLAIM
                       </button>
                    </div>
                    <h4 className="text-white font-bold mb-1">{task.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-crisis-glow" /> {task.location}</span>
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just Posted</span>
                    </div>
                 </div>
               ))
             )}
          </div>

          {myTasks.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-crisis-glow uppercase tracking-tighter flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Active Deployments
              </h3>
              {myTasks.map(task => (
                <div key={task._id} className="card p-4 border-l-4 border-l-blue-500 bg-blue-500/5">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">IN PROGRESS</span>
                      <button onClick={() => completeTask(task._id)} className="text-[10px] font-bold text-green-400 border border-green-400/30 px-3 py-1 rounded">
                        COMPLETE
                      </button>
                   </div>
                   <h4 className="text-white font-bold mb-1">{task.title}</h4>
                   <p className="text-xs text-slate-400 mb-3">{task.description}</p>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                      <MapPin className="w-3 h-3" /> {task.location}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SOS & Tools */}
        <div className="space-y-6">
          <div className="card border-red-500/20 bg-red-500/5 relative overflow-hidden group">
             <h3 className="text-sm font-bold text-red-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 fill-red-400" /> SOS Transmitter
             </h3>
             <form onSubmit={handleSendSOS} className="space-y-4">
                <textarea className="input min-h-[100px] border-red-500/30 text-sm" placeholder="What is your situation?" value={sosMessage} onChange={(e) => setSosMessage(e.target.value)} />
                <div className="flex gap-4">
                  <select className="input flex-1 py-1.5 text-xs font-bold" value={sosSeverity} onChange={(e) => setSosSeverity(e.target.value)}>
                    <option>Low</option><option>Medium</option><option>Critical</option>
                  </select>
                  <button type="submit" disabled={loading} className="btn-primary bg-red-600 w-32 border-none">
                    {loading ? '...' : 'SOS'}
                  </button>
                </div>
             </form>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                <Package className="w-4 h-4" /> Logistics & Gear
             </h3>
             
             {myResources.map(res => (
               <div key={res._id} className="card p-3 bg-crisis-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-crisis-primary/20 rounded-md text-crisis-glow">
                        {['Truck', 'Van', 'Ambulance'].includes(res.type) ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                     </div>
                     <div className="text-xs font-bold text-white uppercase">{res.name}</div>
                  </div>
                  <button onClick={() => returnResource(res._id)} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase">Return</button>
               </div>
             ))}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.filter(r => r.status === 'Available').map(res => (
                  <div key={res._id} className="card p-3 border-crisis-border hover:border-crisis-primary/50 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{res.type}</span>
                        <button 
                          onClick={() => requestResource(res._id)}
                          disabled={user?.role === 'General Volunteer' && ['Truck', 'Van', 'Ambulance'].includes(res.type)}
                          className="text-[10px] font-bold text-crisis-glow hover:underline uppercase disabled:text-slate-600"
                        >
                          Request
                        </button>
                     </div>
                     <h4 className="text-white font-bold text-sm">{res.name}</h4>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
