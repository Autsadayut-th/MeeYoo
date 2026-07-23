import React from 'react';

export function Navbar({ house, currentUser, activeUserIndex, switchUser }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-500/20 shrink-0">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-white text-base leading-tight">MeeYoo</span>
              <div className="pulse-emerald" title="Real-time Sync Enabled"></div>
            </div>
            <div className="text-xs text-indigo-300 font-medium flex items-center gap-1">
              <span>{house.name}</span>
              <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono">
                {house.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 border border-white/15 rounded-full p-1 shadow-inner">
          <button 
            onClick={() => switchUser(0)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 0 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
          >
            👨‍💻 U1
          </button>
          <button 
            onClick={() => switchUser(1)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 1 ? 'bg-pink-600 text-white shadow' : 'text-slate-400'}`}
          >
            👩‍🎨 U2
          </button>
        </div>
      </div>
    </header>
  );
}
