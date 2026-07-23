import React from 'react';

export function Sidebar({ house, activeTab, setActiveTab, shoppingCount, currentUser }) {
  return (
    <aside className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen z-30">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MeeYoo
            </h1>
            <p className="text-xs text-slate-400 font-medium">Household Realtime Stock</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-chart-pie text-lg w-6 text-center"></i>
            <span>🏠 Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'stock' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-boxes-stacked text-lg w-6 text-center"></i>
            <span>📦 Stock Items</span>
          </button>

          <button 
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'shopping' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-cart-shopping text-lg w-6 text-center"></i>
              <span>🛒 Shopping List</span>
            </div>
            {shoppingCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2 py-0.5 rounded-full font-bold">
                {shoppingCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'history' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-clock-rotate-left text-lg w-6 text-center"></i>
            <span>📜 History Log</span>
          </button>

          <button 
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'members' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-users text-lg w-6 text-center"></i>
            <span>👥 Members</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'settings' ? 'bg-indigo-600/25 border border-indigo-500/40 text-white shadow-inner' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-gear text-lg w-6 text-center"></i>
            <span>⚙️ Settings</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
