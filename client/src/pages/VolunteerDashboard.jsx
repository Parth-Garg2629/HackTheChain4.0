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
  Shield,
  Clock,
  ClipboardCheck,
  Truck,
  Activity,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import ChatPanel from '../components/ChatPanel';

export default function VolunteerDashboard() {
  const { user } = useAuthStore();
  const { alerts, sendSOS } = useAlertStore();
  const { tasks } = useTaskStore();
  
  const [sosMessage, setSosMessage] = useState('');
  const [sosSeverity, setSosSeverity] = useState('Critical');
  const [loading, setLoading] = useState(false);
  const [activeChatTask, setActiveChatTask] = useState(null);

  const handleSendSOS = async (e) => {
    e.preventDefault();
    if (!sosMessage) return;
    setLoading(true);
    const res = await sendSOS({ message: sosMessage, severity: sosSeverity });
    if (res.success) {
      toast.success('SOS Broadcasted. Help is coordinating.');
      setSosMessage('');
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  // Find tasks where THIS user is the victim
  const myDistressMissions = tasks.filter(t => t.victim?.toString() === user?.id || t.victim?._id === user?.id);
  const myAlerts = alerts.filter(a => a.sentBy?._id === user?.id || a.sentBy === user?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Emergency Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
          <Zap className="w-3 h-3 fill-red-500" />
          Emergency Distress Channel Active
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">How can we help you?</h1>
        <p className="text-slate-400">Your location is being broadcasted to all active responders in {user?.zoneCode}</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        
        {/* SOS Transmitter (Left side) */}
        <div className="md:col-span-3 space-y-6">
          <div className="card border-red-500/30 bg-red-500/5 p-6 shadow-2xl shadow-red-500/5">
            <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              Transmit SOS Signal
            </h3>
            <form onSubmit={handleSendSOS} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Situation Report</label>
                <textarea 
                  className="input min-h-[150px] border-red-500/20 focus:border-red-500/50 text-lg placeholder:text-slate-600" 
                  placeholder="Describe your emergency (e.g., 'Stuck on roof, water rising, 3 people with me')" 
                  value={sosMessage} 
                  onChange={(e) => setSosMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Severity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'Critical'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSosSeverity(s)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          sosSeverity === s 
                          ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
                          : 'bg-crisis-bg border-crisis-border text-slate-500 hover:border-red-500/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !sosMessage} 
                  className="btn-primary bg-red-600 hover:bg-red-500 h-auto py-0 px-10 text-xl font-black italic tracking-tighter shadow-xl shadow-red-600/20 disabled:opacity-50"
                >
                  {loading ? 'SENDING...' : 'SEND SOS'}
                </button>
              </div>
            </form>
          </div>

          {/* Active Missions / Alerts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Your Active Signals
            </h3>
            <div className="space-y-3">
              {myAlerts.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-crisis-border rounded-2xl opacity-30">
                  <p className="text-sm font-bold uppercase tracking-widest">No active distress signals</p>
                </div>
              ) : (
                myAlerts.map(alert => {
                  const linkedTask = myDistressMissions.find(t => t.linkedAlert === alert._id);
                  return (
                    <div key={alert._id} className="card p-5 border-l-4 border-l-red-500 bg-crisis-card/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                           <span className="badge-critical text-[10px]">SOS ACTIVE</span>
                           <span className="text-[10px] text-slate-500 font-mono italic">{new Date(alert.createdAt).toLocaleString()}</span>
                        </div>
                        {linkedTask?.status === 'Claimed' && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                             <span className="text-[10px] font-bold text-blue-400 uppercase">Responder Dispatched</span>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm mb-4 leading-relaxed">{alert.message}</p>
                      
                      {linkedTask && (
                        <div className="flex items-center justify-between pt-4 border-t border-crisis-border/30">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-crisis-primary/20 flex items-center justify-center">
                               <Navigation className="w-4 h-4 text-crisis-glow" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">Status</p>
                               <p className="text-xs text-white font-bold">{linkedTask.status === 'Open' ? 'Awaiting Volunteer' : linkedTask.status === 'Claimed' ? `Assigned to ${linkedTask.assignedTo?.name}` : 'Mission Complete'}</p>
                            </div>
                          </div>
                          
                          {linkedTask.status === 'Claimed' && (
                            <button 
                              onClick={() => setActiveChatTask({ id: linkedTask._id, title: "Responder Comms" })}
                              className="flex items-center gap-2 bg-crisis-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-crisis-glow transition-all shadow-lg shadow-crisis-primary/20"
                            >
                              <MessageSquare className="w-4 h-4" />
                              TALK TO RESPONDER
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat / Sidebar area */}
        <div className="md:col-span-2">
          {activeChatTask ? (
            <div className="sticky top-6">
               <ChatPanel 
                  taskId={activeChatTask.id} 
                  missionTitle={activeChatTask.title} 
                  isCompleted={tasks.find(t => t._id === activeChatTask.id)?.status === 'Completed'}
               />
               <button 
                 onClick={() => setActiveChatTask(null)}
                 className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
               >
                 Close Communication Window
               </button>
            </div>
          ) : (
            <div className="sticky top-6 space-y-6">
              <div className="card bg-crisis-primary/5 border-crisis-primary/20 p-6">
                 <h4 className="text-sm font-bold text-crisis-glow mb-4 flex items-center gap-2">
                   <Shield className="w-4 h-4" />
                   Safety Protocol
                 </h4>
                 <ul className="space-y-3">
                    {[
                      'Stay calm and secure your surroundings',
                      'Help is being coordinated via CrisisGrid',
                      'Once claimed, you can chat with the responder',
                      'Keep your device battery optimized'
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-300">
                        <span className="text-crisis-glow font-bold">{i+1}.</span>
                        {step}
                      </li>
                    ))}
                 </ul>
              </div>
              
              <div className="p-6 text-center opacity-20">
                 <Activity className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">CrisisGrid Mesh Network</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
