import React from 'react';

export function MobileNavbar({ activeTab, setActiveTab, shoppingCount }) {
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-chart-pie text-lg mb-1"></i>
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab('stock')}
          className={`bottom-nav-item ${activeTab === 'stock' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-boxes-stacked text-lg mb-1"></i>
          <span>Stock</span>
        </button>

        <button 
          onClick={() => setActiveTab('shopping')}
          className={`bottom-nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-lg mb-1"></i>
            {shoppingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </div>
          <span>Shopping</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-clock-rotate-left text-lg mb-1"></i>
          <span>History</span>
        </button>

        <button 
          onClick={() => setActiveTab('members')}
          className={`bottom-nav-item ${activeTab === 'members' || activeTab === 'settings' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-users text-lg mb-1"></i>
          <span>Members</span>
        </button>
      </div>
    </nav>
  );
}
