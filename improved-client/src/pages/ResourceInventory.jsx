import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const inventoryData = [
  { id: '1', name: 'Trauma Kit - Type Alpha', sku: 'MED-992-K', category: 'Medical', location: 'Zone A-4', stock: 82, stockLabel: 'Available', icon: 'medical_services', colorTheme: 'primary' },
  { id: '2', name: 'Potable Water Pallet', sku: 'WAT-110-P', category: 'Food & Water', location: 'Zone C-1 (Port)', stock: 12, stockLabel: 'Low Stock', icon: 'water_drop', colorTheme: 'error' },
  { id: '3', name: 'Surveillance Drone Unit', sku: 'TEC-440-D', category: 'Technology', location: 'Hangar 9', stock: 100, stockLabel: 'Available', icon: 'precision_manufacturing', colorTheme: 'secondary' },
  { id: '4', name: 'Heavy Utility Truck (4x4)', sku: 'VEH-702-U', category: 'Transport', location: 'Regional Depot', stock: 45, stockLabel: 'Available', icon: 'local_shipping', colorTheme: 'primary' },
  { id: '5', name: 'Blankets (Winter Grade)', sku: 'SUP-330-W', category: 'Supplies', location: 'Zone B (Warehouse)', stock: 8, stockLabel: 'Low Stock', icon: 'bed', colorTheme: 'error' },
  { id: '6', name: 'Portable Generator', sku: 'EQP-220-G', category: 'Technology', location: 'Zone TS-22', stock: 60, stockLabel: 'In Use', icon: 'bolt', colorTheme: 'tertiary' },
];

const recentActivity = [
  { icon: 'add_shopping_cart', color: 'text-success_green bg-success_green/10', title: 'Stock Received', desc: '500 units of Insulin Gen-B added to Central Depot.', time: '14 mins ago' },
  { icon: 'local_shipping', color: 'text-secondary bg-secondary/10', title: 'Deployment Start', desc: 'Drone Unit 04-A dispatched to North-West Sector.', time: '2 hours ago' },
  { icon: 'priority_high', color: 'text-error bg-error/10', title: 'Critical Stock Alert', desc: 'Blankets (Winter) reached threshold limit in Zone B.', time: '4 hours ago' },
  { icon: 'swap_horiz', color: 'text-tertiary bg-tertiary/10', title: 'Zone Transfer', desc: 'Trauma kits moved from Depot Alpha to Zone KA-01.', time: '6 hours ago' },
];

const activeZones = [
  { id: 'ZONE-KA-01', name: 'Central Bengaluru', status: 'Critical', depots: 3, fill: '85%', barColor: 'bg-error', criticalItems: 5 },
  { id: 'ZONE-MH-44', name: 'Mumbai South', status: 'Critical', depots: 5, fill: '92%', barColor: 'bg-error', criticalItems: 8 },
  { id: 'ZONE-TN-14', name: 'North Chennai', status: 'Warning', depots: 2, fill: '48%', barColor: 'bg-tertiary-container', criticalItems: 2 },
  { id: 'ZONE-KL-09', name: 'Kochi Coastal', status: 'Stable', depots: 4, fill: '20%', barColor: 'bg-primary', criticalItems: 0 },
];

export default function ResourceInventory() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const categories = ['All', 'Medical', 'Food & Water', 'Technology', 'Transport', 'Supplies'];

  const colorMap = {
    primary: { text: 'text-primary', bar: 'bg-primary', badge: 'bg-primary/10 text-primary' },
    error: { text: 'text-error', bar: 'bg-error', badge: 'bg-error/10 text-error' },
    secondary: { text: 'text-secondary', bar: 'bg-secondary', badge: 'bg-secondary/10 text-secondary' },
    tertiary: { text: 'text-tertiary', bar: 'bg-tertiary', badge: 'bg-tertiary/10 text-tertiary' },
  };

  const filtered = categoryFilter === 'All'
    ? inventoryData
    : inventoryData.filter((i) => i.category === categoryFilter);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#050f19]">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Resource Inventory</h1>
          <p className="text-on-surface-variant font-body mt-1">Global Logistics & Stock Monitoring</p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold hover:brightness-110 transition-all shadow-lg text-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Resource
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: '42,891', delta: '+1.2%', deltaColor: 'text-success_green', icon: 'inventory', color: 'text-secondary bg-secondary/10' },
          { label: 'Critical Alerts', value: '14', delta: 'Action Req', deltaColor: 'text-error', icon: 'emergency_home', color: 'text-error bg-error/10' },
          { label: 'In Transit', value: '3,502', delta: '8 Shipments', deltaColor: 'text-primary', icon: 'local_shipping', color: 'text-primary bg-primary/10' },
          { label: 'Total Weight', value: '124.5t', delta: 'Metric Tons', deltaColor: 'text-tertiary', icon: 'weight', color: 'text-tertiary bg-tertiary/10' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">{s.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-on-surface">{s.value}</span>
              <span className={`text-xs font-medium ${s.deltaColor}`}>{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Zones Strip */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">radar</span>
            Active Zone Inventory Status
          </h2>
          <Link to="/zone-map" className="text-xs text-primary hover:underline font-medium">Full Zone Map →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeZones.map((zone) => (
            <div key={zone.id} className={`bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 hover:bg-surface-container transition-colors ${zone.status === 'Critical' ? 'border-l-4 border-l-error/60' : zone.status === 'Warning' ? 'border-l-4 border-l-tertiary-container/60' : 'border-l-4 border-l-primary/40'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-outline uppercase tracking-wider">{zone.id}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${zone.status === 'Critical' ? 'bg-error/10 text-error' : zone.status === 'Warning' ? 'bg-tertiary-container/10 text-tertiary-container' : 'bg-primary/10 text-primary'}`}>{zone.status}</span>
              </div>
              <p className="text-sm font-semibold text-on-surface truncate">{zone.name}</p>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden mt-3">
                <div className={`h-full ${zone.barColor} rounded-full`} style={{ width: zone.fill }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-outline">
                <span>{zone.depots} depots</span>
                {zone.criticalItems > 0 && <span className="text-error">{zone.criticalItems} critical</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Inventory List */}
        <div className="flex-1 space-y-5">
          {/* Category Filter */}
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-mono text-outline uppercase tracking-wider shrink-0">{filtered.length} items</span>
          </div>

          {/* Inventory Cards */}
          <div className="space-y-3">
            {filtered.map((item) => {
              const c = colorMap[item.colorTheme] || colorMap.primary;
              return (
                <div key={item.id} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 p-5 rounded-xl flex items-center gap-5 group">
                  <div className={`w-14 h-14 bg-surface-container-highest rounded-lg flex items-center justify-center ${c.text} shrink-0`}>
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-on-surface">{item.name}</h3>
                      <span className="text-[10px] font-mono bg-outline-variant/20 px-2 py-0.5 rounded text-outline uppercase tracking-wider">SKU: {item.sku}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">category</span> {item.category}
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> {item.location}
                      </span>
                    </div>
                  </div>
                  <div className="w-44 shrink-0">
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs ${item.colorTheme === 'error' ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
                        {item.colorTheme === 'error' ? 'Critical Depletion' : 'Stock Level'}
                      </span>
                      <span className={`text-xs font-bold font-mono ${c.text}`}>{item.stock}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${item.stock}%` }}></div>
                    </div>
                  </div>
                  <div className="w-28 text-right shrink-0">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.badge}`}>{item.stockLabel}</span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-primary transition-all shrink-0">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Activity + Zone Map Peek */}
        <aside className="w-72 flex flex-col gap-5 shrink-0">
          <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-on-surface">Recent Activity</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">history</span>
            </div>
            <div className="space-y-5">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.color}`}>
                    <span className="material-symbols-outlined text-sm">{act.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{act.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{act.desc}</p>
                    <p className="text-[10px] font-mono text-outline mt-1 uppercase">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-all">View All Activity</button>
          </div>

          <div className="bg-surface-container overflow-hidden rounded-xl border border-outline-variant/10">
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Zone Map</span>
              <span className="text-[10px] font-mono text-primary">LIVE DATA</span>
            </div>
            <div className="h-32 bg-surface-container-lowest flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 topo-bg opacity-30"></div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-on-surface">6 Depots Active</span>
              </div>
            </div>
            <div className="p-3">
              <Link to="/zone-map" className="block w-full py-2 bg-surface-container-highest text-on-surface text-sm text-center rounded-lg hover:brightness-125 transition-all font-headline font-medium">
                Open Full Map
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}



