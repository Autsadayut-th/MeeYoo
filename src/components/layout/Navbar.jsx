import React from 'react';

export function Navbar({ house, currentUser, activeUserIndex, switchUser }) {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-xl border-b border-[#e8e4df] px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-600/20 shrink-0">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-stone-900 text-base leading-tight">MeeYoo</span>
              <div className="pulse-emerald" title="Real-time Sync Active"></div>
            </div>
            <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <span>{house.name}</span>
              <span className="text-[10px] bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded font-mono text-stone-600">
                {house.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-stone-100 border border-stone-200 rounded-full p-1 shadow-inner">
          <button 
            onClick={() => switchUser(0)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 0 ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
          >
            👨‍💻 U1 (สมชาย)
          </button>
          <button 
            onClick={() => switchUser(1)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 1 ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
          >
            👩‍🎨 U2 (สมหญิง)
          </button>
        </div>
      </div>
    </header>
  );
}
