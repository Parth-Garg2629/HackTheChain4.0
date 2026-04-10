import React from 'react';

export default function TopNavBar() {
  return (
    <header className="w-full h-16 sticky top-0 z-50 flex justify-between items-center px-8 border-b border-[#3c4a46]/10 bg-surface/70 backdrop-blur-xl">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary">
            search
          </span>
          <input 
            className="w-full bg-surface-container-highest/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary/30 font-body placeholder:text-outline/50 text-on-surface outline-none" 
            placeholder="Search zones, resources, or incidents..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-secondary-fixed/70 hover:text-primary transition-all p-2">
          <span className="material-symbols-outlined">hub</span>
        </button>
        <button className="text-secondary-fixed/70 hover:text-primary transition-all p-2 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full pointer-events-none"></span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20 cursor-pointer">
          <img 
            alt="User Avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4S0SryIxxksNinKPB9nrJIM5FDYFe1vDXhZGJO98FxA6JkE4w3GkAcyLTzbpasIgRzRiFh_LZNjagMCy5u80AjTNPUX4Faa4Ey0mbYqJW9Ie5W8o5Hcs5O_mGa4s0s1OJSl3kf3D_wiyisSF2JujQTbuU9GoI1FSJWh4ZYHLVHcAAna1KgeQ1oEM_yPWKiuc_21D1IKY3F-l-8bs1h-F8VwnVogLk3RFaRSMtC2QTrHBo8wyMr3C0_YRuPCrSVYvxqeEsQAUNge0"
          />
        </div>
      </div>
    </header>
  );
}
