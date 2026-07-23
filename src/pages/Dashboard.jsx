import React from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';

export function DashboardPage({ stats, items, currentUser, house, setActiveTab, handleQuickUseOne }) {
  return (
    <div className="space-y-5">
      <div className="glass-card p-4 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentUser.avatar}</div>
          <div>
            <div className="text-xs text-slate-400">กำลังใช้งานโดย:</div>
            <div className="font-bold text-white text-base">{currentUser.name}</div>
          </div>
        </div>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(house.code);
            alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
          }}
          className="bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
        >
          <i className="fa-solid fa-share-nodes"></i> แชร์รหัสเชิญ
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard title="📦 สินค้าทั้งหมด" value={stats.total} subtitle="รายการในบ้าน" icon="fa-boxes-stacked" iconClass="text-indigo-400" />
        <SummaryCard title="⚠️ ใกล้หมด" value={stats.lowCount} subtitle="น้อยกว่าขั้นต่ำ" icon="fa-triangle-exclamation" iconClass="text-amber-400" borderClass="border-amber-500/30" />
        <SummaryCard title="🔴 หมดแล้ว" value={stats.outCount} subtitle="จำนวนคงเหลือ 0" icon="fa-circle-xmark" iconClass="text-rose-400" borderClass="border-rose-500/30" />
        <SummaryCard title="🛒 รายการซื้อ" value={stats.shoppingCount} subtitle="ต้องซื้อเข้าบ้าน" icon="fa-cart-shopping" iconClass="text-cyan-400" borderClass="border-cyan-500/30" />
      </div>

      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-indigo-400"></i>
            <span>รายการสินค้าในบ้าน</span>
          </h3>
          <button onClick={() => setActiveTab('stock')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            ดูทั้งหมด ({items.length}) <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
          </button>
        </div>

        <div className="space-y-3">
          {items.slice(0, 5).map(item => (
            <div key={item.id} className="bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-xl shrink-0">
                  {item.icon || '📦'}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-sm text-slate-100 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-heading font-extrabold text-lg text-white">{item.quantity}</span>
                  <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                </div>
                <button 
                  onClick={() => handleQuickUseOne(item)}
                  disabled={item.quantity === 0}
                  className="btn-use-one text-xs px-3 py-1.5"
                >
                  <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
