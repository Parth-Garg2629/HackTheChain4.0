import React from 'react';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function CrisisLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background">
      <SideNavBar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNavBar />
        {children}
      </main>
    </div>
  );
}
