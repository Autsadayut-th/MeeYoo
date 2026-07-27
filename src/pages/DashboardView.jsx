import React from 'react';

export function DashboardView({ currentUser, house, stats, items, setActiveTab, resetForm, setShowAddModal, handleQuickUseOne, onOpenInviteModal, triggerHaptic }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar-initials avatar-initials-lg">
            {getInitials(currentUser?.name)}
          </div>
          <div>
            <div className="text-[11px] text-stone-500 dark:text-slate-400">เข้าสู่ระบบในชื่อ</div>
            <div className="font-semibold text-stone-900 dark:text-white text-sm">
              {currentUser?.name || 'สมาชิก'} <span className="text-stone-500 dark:text-slate-400 font-normal">({currentUser?.role || 'เจ้าของบ้าน'})</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (triggerHaptic) triggerHaptic();
            if (onOpenInviteModal) onOpenInviteModal();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
        >
          <i className="fa-solid fa-qrcode text-sm"></i>
          <span>เชิญสมาชิก</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">สินค้าทั้งหมด</span>
            <i className="fa-solid fa-boxes-stacked text-emerald-600 text-xs"></i>
          </div>
          <div className="font-heading text-2xl font-bold text-stone-900 dark:text-white mt-1">{stats.total}</div>
          <div className="text-[10px] text-stone-400 dark:text-slate-500 mt-0.5">รายการในบ้าน</div>
        </div>

        <div className="glass-card p-4 border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">ใกล้หมด</span>
            <i className="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
          </div>
          <div className="font-heading text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1">{stats.lowCount}</div>
          <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">น้อยกว่าขั้นต่ำ</div>
        </div>

        <div className="glass-card p-4 border-rose-200 dark:border-rose-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">หมดแล้ว</span>
            <i className="fa-solid fa-circle-xmark text-rose-500 text-xs"></i>
          </div>
          <div className="font-heading text-2xl font-bold text-rose-800 dark:text-rose-300 mt-1">{stats.outCount}</div>
          <div className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">จำนวนคงเหลือ 0</div>
        </div>

        <div className="glass-card p-4 border-teal-200 dark:border-teal-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">รายการซื้อ</span>
            <i className="fa-solid fa-cart-shopping text-teal-500 text-xs"></i>
          </div>
          <div className="font-heading text-2xl font-bold text-teal-800 dark:text-teal-300 mt-1">{stats.shoppingCount}</div>
          <div className="text-[10px] text-teal-700/80 dark:text-teal-400/80 mt-0.5">ต้องซื้อเข้าบ้าน</div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-emerald-600 text-xs"></i>
            <span>รายการสินค้าในบ้าน</span>
          </h3>
          <button 
            onClick={() => { if (triggerHaptic) triggerHaptic(); setActiveTab('stock'); }}
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            ดูทั้งหมด ({items.length}) <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
          </button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="py-8 text-center text-stone-400 dark:text-slate-500 space-y-2">
              <i className="fa-solid fa-box-open text-2xl text-stone-300 dark:text-slate-600"></i>
              <p className="text-xs">ยังไม่มีสินค้าในบ้านหลังนี้</p>
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                + เพิ่มสินค้าใหม่
              </button>
            </div>
          ) : (
            items.slice(0, 5).map(item => {
              const isOut = item.quantity === 0;
              const isLow = item.quantity <= item.min_threshold && !isOut;
              const gaugePct = Math.min(100, Math.round((item.quantity / (item.min_threshold * 2)) * 100));

              return (
                <div key={item.id} className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.icon || <i className="fa-solid fa-cube text-stone-400"></i>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-semibold text-sm text-stone-900 dark:text-white truncate">{item.name}</div>
                        <div className="text-[11px] text-stone-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{item.category}</span>
                          <span className={`px-1.5 py-px rounded text-[10px] font-semibold ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                            {isOut ? 'หมด' : isLow ? 'ใกล้หมด' : 'ปกติ'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-heading font-bold text-lg text-stone-900 dark:text-white">{item.quantity}</span>
                        <span className="text-xs text-stone-500 dark:text-slate-400 ml-1">{item.unit}</span>
                      </div>

                      <button 
                        onClick={() => handleQuickUseOne(item)}
                        disabled={isOut}
                        className="btn-use-one text-xs px-3 py-1.5"
                      >
                        <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                      </button>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${gaugePct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
