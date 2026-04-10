import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function SideNavBar() {
  const navItems = [
    { name: 'Overview', icon: 'dashboard', path: '/' },
    { name: 'Incidents', icon: 'warning', path: '/incidents' },
    { name: 'Resources', icon: 'inventory_2', path: '/resources' },
    { name: 'Zone Map', icon: 'map', path: '/zone-map' },
    { name: 'Field Ops', icon: 'radar', path: '/volunteer' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <aside className="h-screen w-64 border-r border-[#3c4a46]/20 bg-surface flex flex-col py-6 shrink-0 z-50">
      <div className="px-6 mb-10">
        <div className="text-xl font-bold text-primary-container flex items-center gap-2 font-headline">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          ReliefSync
        </div>
        <div className="text-[10px] tracking-widest text-[#57f1db]/60 mt-1 font-bold">SYNC ACTIVE</div>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg font-headline font-medium text-sm tracking-tight transition-colors duration-200
              ${isActive 
                ? 'bg-surface-container-low text-primary' 
                : 'text-secondary-fixed/70 hover:text-primary hover:bg-surface-container-low'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-4">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg font-headline font-medium text-sm tracking-tight transition-colors duration-200 text-on-surface-variant hover:text-error hover:bg-error/5"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
