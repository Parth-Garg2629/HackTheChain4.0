import React, { useState, useEffect, useMemo } from 'react';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import useTaskStore from '../store/taskStore';
import { Link } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import toast from 'react-hot-toast';

export default function VolunteerDashboard() {
  const { user } = useAuthStore();
  const { sendSOS, alerts, fetchAlerts } = useAlertStore();
  const { tasks, fetchTasks, completeTask } = useTaskStore();

  const [sosMessage, setSosMessage] = useState('');
  const [severity, setSeverity] = useState('Critical');
  const [loading, setLoading] = useState(false);
  const [activeChatTask, setActiveChatTask] = useState(null);

  useEffect(() => {
    fetchAlerts();
    fetchTasks();
  }, [fetchAlerts, fetchTasks]);

  const handleSendSOS = async (e) => {
    e.preventDefault();
    if (!sosMessage) return;
    setLoading(true);
    const res = await sendSOS({ message: sosMessage, severity });
    if (res.success) {
      toast.success('SOS Broadcasted. Help is coordinating.');
      setSosMessage('');
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleCompleteTask = async (taskId) => {
    const res = await completeTask(taskId);
    if (res.success) {
      toast.success('Mission marked as complete.');
      setActiveChatTask(null);
    } else {
      toast.error(res.message);
    }
  };

  const myClaimedMissions = useMemo(() => 
    tasks.filter(t => (t.assignedTo?._id === user?.id || t.assignedTo === user?.id) && t.status === 'Claimed'),
    [tasks, user]
  );

  const inventory = [
    { item: 'Medkit-Standard (Gen 4)', qty: '04', status: 'SECURED', statusClass: 'text-primary' },
    { item: 'Ration Pack (High Cal)', qty: '12', status: 'SECURED', statusClass: 'text-primary' },
    { item: 'Backup Radio Battery', qty: '01', status: 'LOW', statusClass: 'text-error animate-pulse' },
    { item: 'Water Purifier Tabs', qty: '50', status: 'SECURED', statusClass: 'text-primary' },
    { item: 'Thermal Blanket', qty: '06', status: 'SECURED', statusClass: 'text-primary' },
  ];

  return (
    <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden bg-background">
      {/* Left Panel: Map & Logistics */}
      <section className="col-span-8 flex flex-col border-r border-outline-variant/10 overflow-hidden">
        {/* Topographic Map */}
        <div className="flex-1 relative bg-surface-container-lowest topo-bg overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-60"></div>
          {/* Coordinate Overlay */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-1 z-10">
            <div className="bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-outline-variant/20">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-0.5">Coordinates</span>
              <code className="text-xs font-mono text-on-surface">34°02'21.2"N 118°14'37.1"W</code>
            </div>
            <div className="bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-outline-variant/20">
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest block mb-0.5">Elevation</span>
              <code className="text-xs font-mono text-on-surface">1,242m ASL</code>
            </div>
          </div>
          {/* Map Marker Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-primary/5 rounded-full border border-primary/20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission Control / Chat Area */}
        <div className="h-64 bg-surface-container-low flex flex-col border-t border-outline-variant/10">
          <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/5">
            <h3 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-outline">
              {activeChatTask ? `Mission Comms: ${activeChatTask.id ? activeChatTask.id.slice(-6).toUpperCase() : 'UNKNOWN'}` : 'Active Mission Control'}
            </h3>
            {activeChatTask && (
              <button 
                onClick={() => handleCompleteTask(activeChatTask.id)}
                className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20 font-bold uppercase"
              >
                Mark Complete
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden relative">
            {activeChatTask ? (
              <ChatPanel 
                taskId={activeChatTask.id} 
                missionTitle={activeChatTask.title}
                isCompleted={false}
              />
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {myClaimedMissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                    <span className="material-symbols-outlined text-4xl mb-2">assignment_late</span>
                    <p className="text-xs font-bold uppercase tracking-widest">No active missions assigned</p>
                    <Link to="/incidents" className="text-[10px] text-primary hover:underline mt-2">Browse Incidents</Link>
                  </div>
                ) : (
                  myClaimedMissions.map((mission) => (
                    <div key={mission._id} className="flex gap-4 items-center border-l-2 border-primary pl-4 bg-surface-container-highest/30 p-3 rounded-r-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-on-surface">Mission {mission._id ? mission._id.slice(-6).toUpperCase() : 'UNKNOWN'}</p>
                        <p className="text-xs text-outline mt-1 line-clamp-1">{alerts.find(a => a._id === mission.linkedAlert || a._id === mission.linkedAlert?._id)?.message}</p>
                      </div>
                      <button 
                        onClick={() => setActiveChatTask({ id: mission._id, title: mission._id.toUpperCase() })}
                        className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-lg hover:brightness-110"
                      >
                        OPEN COMMS
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right Panel: SOS & Inventory */}
      <section className="col-span-4 flex flex-col overflow-hidden">
        {/* SOS Broadcast Section */}
        <div className="p-8 bg-surface border-b border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            <h2 className="text-lg font-extrabold font-headline tracking-tight uppercase text-on-surface">SOS Broadcast</h2>
          </div>
          <form onSubmit={handleSendSOS} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-3 block">Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Critical', 'Medium', 'Low'].map(sev => {
                  const isActive = severity === sev;
                  const styles = {
                    'Critical': `border-error-container/40 text-error-container hover:bg-error-container/10 ${isActive ? 'bg-error-container/20 border-error' : 'bg-surface-container-lowest border-2'}`,
                    'Medium': `border-outline-variant/20 text-tertiary hover:border-tertiary/40 ${isActive ? 'bg-tertiary/20' : 'bg-surface-container-low border'}`,
                    'Low': `border-outline-variant/20 text-outline hover:border-outline/40 ${isActive ? 'bg-outline/20' : 'bg-surface-container-low border'}`
                  };
                  const icons = { 'Critical': 'priority_high', 'Medium': 'warning', 'Low': 'info' };
                  
                  return (
                    <button 
                      key={sev} 
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all ${styles[sev]}`}
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">{icons[sev]}</span>
                      <span className="text-[10px] font-bold uppercase font-headline">{sev}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold font-headline text-outline uppercase tracking-widest mb-3 block">Broadcast Message</label>
              <textarea 
                required
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
                className="w-full bg-surface-container-highest border-none rounded-lg p-4 text-sm font-body text-on-surface focus:ring-1 focus:ring-primary/30 placeholder:text-outline-variant/60 resize-none h-32 outline-none" 
                placeholder="Describe the emergency situation and immediate requirements..."
              ></textarea>
            </div>
            <button 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-br from-error to-[#93000a] text-on-error font-extrabold font-headline uppercase tracking-[0.2em] rounded-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">radio</span>
              {loading ? 'Transmitting...' : 'Initiate Broadcast'}
            </button>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col bg-surface-container-lowest/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-outline">Gear Inventory</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-outline-variant/20 rounded-full text-outline-variant uppercase">82% Load</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-surface-container-lowest text-outline-variant border-b border-outline-variant/10">
                <tr>
                  <th className="py-2 font-medium uppercase tracking-tighter">Item</th>
                  <th className="py-2 font-medium uppercase tracking-tighter text-right">Qty</th>
                  <th className="py-2 font-medium uppercase tracking-tighter text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {inventory.map((row, i) => (
                  <tr key={i} className="group text-on-surface">
                    <td className="py-3">{row.item}</td>
                    <td className="py-3 text-right">{row.qty}</td>
                    <td className="py-3 text-right">
                      <span className={row.statusClass}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
