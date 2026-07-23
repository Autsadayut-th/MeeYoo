import React from 'react';

export function Sidebar({ house, activeTab, setActiveTab, shoppingCount, currentUser }) {
  return (
    <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-[#e8e4df] p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen z-30">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-600/20">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-stone-900">
              MeeYoo
            </h1>
            <p className="text-xs text-stone-500 font-medium">Organic Household Stock</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <i className="fa-solid fa-chart-pie text-lg w-6 text-center"></i>
            <span>🏠 Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'stock' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <i className="fa-solid fa-boxes-stacked text-lg w-6 text-center"></i>
            <span>📦 Stock Items</span>
          </button>

          <button 
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'shopping' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-cart-shopping text-lg w-6 text-center"></i>
              <span>🛒 Shopping List</span>
            </div>
            {shoppingCount > 0 && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {shoppingCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'history' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <i className="fa-solid fa-clock-rotate-left text-lg w-6 text-center"></i>
            <span>📜 History Log</span>
          </button>

          <button 
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'members' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <i className="fa-solid fa-users text-lg w-6 text-center"></i>
            <span>👥 Members</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'settings' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'}`}
          >
            <i className="fa-solid fa-gear text-lg w-6 text-center"></i>
            <span>⚙️ Settings</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
