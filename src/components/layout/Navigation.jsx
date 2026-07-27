import React from 'react';

export function Navigation({ activeTab, setActiveTab, shoppingCount, triggerHaptic }) {
  const handleTabClick = (tab) => {
    if (triggerHaptic) triggerHaptic();
    setActiveTab(tab);
  };

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-14">
        <button 
          onClick={() => handleTabClick('dashboard')}
          className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-chart-pie text-base mb-0.5"></i>
          <span>ภาพรวม</span>
        </button>

        <button 
          onClick={() => handleTabClick('stock')}
          className={`bottom-nav-item ${activeTab === 'stock' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-boxes-stacked text-base mb-0.5"></i>
          <span>คลัง</span>
        </button>

        <button 
          onClick={() => handleTabClick('shopping')}
          className={`bottom-nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-base mb-0.5"></i>
            {shoppingCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-amber-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </div>
          <span>ซื้อของ</span>
        </button>

        <button 
          onClick={() => handleTabClick('history')}
          className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-clock-rotate-left text-base mb-0.5"></i>
          <span>ประวัติ</span>
        </button>

        <button 
          onClick={() => handleTabClick('members')}
          className={`bottom-nav-item ${activeTab === 'members' || activeTab === 'settings' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-users text-base mb-0.5"></i>
          <span>สมาชิก</span>
        </button>
      </div>
    </nav>
  );
}
