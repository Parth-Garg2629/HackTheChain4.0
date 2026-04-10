import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import useResourceStore from '../store/resourceStore';
import { 
  AlertTriangle, 
  Package, 
  Send, 
  Clock, 
  CheckCircle2, 
  Info,
  Truck,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VolunteerDashboard() {
  const { user } = useAuthStore();
  const { sendSOS } = useAlertStore();
  const { resources, requestResource, returnResource } = useResourceStore();

  const [sosMessage, setSosMessage] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [sending, setSending] = useState(false);

  const handleSendSOS = async (e) => {
    e.preventDefault();
    if (!sosMessage.trim()) return toast.error('Please describe the emergency');
    
    setSending(true);
    const res = await sendSOS({ message: sosMessage, severity });
    if (res.success) {
      toast.success('SOS Signal Broadcasted to Base');
      setSosMessage('');
    } else {
      toast.error(res.message);
    }
    setSending(false);
  };

  const myAssignments = resources.filter(r => r.assignedTo?._id === user.id);
  const availableResources = resources.filter(r => r.status === 'Available');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-crisis-primary/20 to-transparent p-6 rounded-2xl border border-crisis-primary/20">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Field Ops: {user?.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-slate-400">
            <MapPin className="w-4 h-4 text-crisis-glow" />
            <span className="text-sm font-medium tracking-wide">Assigned Sector: <span className="text-crisis-glow font-mono uppercase">{user?.zoneCode}</span></span>
          </div>
        </div>
        <div className="flex -space-x-2">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-crisis-bg bg-crisis-border flex items-center justify-center text-[10px] font-bold">
               {String.fromCharCode(64 + i)}
             </div>
           ))}
           <div className="w-8 h-8 rounded-full border-2 border-crisis-bg bg-crisis-primary/30 flex items-center justify-center text-[10px] font-bold text-white">
             +10
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Col: SOS Transmitter */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            SOS Network Transmitter
          </h2>
          
          <div className="card space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300 leading-relaxed">
                <span className="font-bold">Protocol Alert:</span> Your SOS broadcast is transmitted instantly to all Base Coordinators. Use "Critical" only for life-threatening situations.
              </p>
            </div>

            <form onSubmit={handleSendSOS} className="space-y-4">
              <div className="flex gap-2 p-1 bg-crisis-bg rounded-lg border border-crisis-border">
                {['Low', 'Medium', 'Critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      severity === level 
                        ? level === 'Critical' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 
                          level === 'Medium' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 
                          'bg-green-600 text-white'
                        : 'text-slate-500 hover:bg-crisis-border/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  className="input min-h-[120px] resize-none"
                  placeholder="Describe situational requirements (e.g., '10 families isolated at Sector 5, need water and medical kits immediately')"
                  value={sosMessage}
                  onChange={(e) => setSosMessage(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={sending}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  severity === 'Critical' ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'btn-primary'
                }`}
              >
                {sending ? 'Transmitting Signal...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Broadcast SOS
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Gear */}
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2 pt-4">
            <Package className="w-4 h-4" />
            Active Tactical Gear
          </h2>
          <div className="space-y-3">
            {myAssignments.length === 0 ? (
              <div className="card text-center py-8 text-slate-500 text-xs italic border-dashed">
                No resources currently assigned to your node.
              </div>
            ) : (
              myAssignments.map((res) => (
                <div key={res._id} className="card p-4 flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-crisis-glow"></div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-crisis-primary/10 rounded-xl border border-crisis-primary/20">
                      <Truck className="w-5 h-5 text-crisis-glow" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{res.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`badge-${res.status.toLowerCase().replace(' ', '')} text-[8px]`}>
                          {res.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {res._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => returnResource(res._id)}
                    className="btn-ghost py-1.5 px-3 text-xs"
                  >
                    Release
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Resource Requisition */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Supply Requisition Grid
          </h2>

          <div className="card p-0 overflow-hidden border-crisis-border">
             <div className="p-4 bg-crisis-bg/50 border-b border-crisis-border flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Available Assets</span>
               <span className="text-[10px] font-bold text-green-500 uppercase">{availableResources.length} Online</span>
             </div>
             <div className="divide-y divide-crisis-border/30 max-h-[600px] overflow-y-auto">
               {availableResources.length === 0 ? (
                 <div className="p-10 text-center text-slate-500 text-sm">
                   All equipment is currently deployed.
                 </div>
               ) : (
                 availableResources.map((res) => (
                   <div key={res._id} className="p-4 flex items-center justify-between hover:bg-crisis-primary/5 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-crisis-border flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{res.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-medium">{res.type}</p>
                        </div>
                     </div>
                     <button 
                       onClick={async () => {
                         const loadToast = toast.loading('Sending request to Base...');
                         const result = await requestResource(res._id);
                         toast.dismiss(loadToast);
                         if (result.success) {
                           toast.success('Request received at Base Camp');
                         } else if (result.isConflict) {
                           toast.error(result.message, { duration: 5000 });
                         } else {
                           toast.error(result.message);
                         }
                       }}
                       className="text-xs font-bold text-crisis-glow hover:bg-crisis-glow hover:text-white px-3 py-1.5 rounded border border-crisis-glow/30 transition-all flex items-center gap-2"
                     >
                       Requisition
                     </button>
                   </div>
                 ))
               )}
             </div>
          </div>
          
          <div className="card p-5 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/20">
             <div className="flex gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-2xl">
                 <CheckCircle2 className="w-6 h-6 text-indigo-400" />
               </div>
               <div>
                 <h4 className="font-bold text-white mb-1">Standard Operating Procedure</h4>
                 <ul className="text-[10px] text-slate-400 space-y-1.5 list-disc pl-3">
                   <li>Request equipment only for active operational needs.</li>
                   <li>Returned gear must be reported for status refresh.</li>
                   <li>SOS alerts are recorded on an immutable blockchain ledger.</li>
                 </ul>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
