import React from 'react';

export function ShoppingItem({ item, onToggle, onRestock }) {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-xl border transition ${item.is_purchased ? 'bg-slate-950/40 border-white/5 opacity-55' : 'bg-slate-900/80 border-white/10'}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button 
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${item.is_purchased ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500 text-transparent'}`}
        >
          <i className="fa-solid fa-check text-xs"></i>
        </button>
        <div className="overflow-hidden">
          <div className={`font-bold text-sm truncate ${item.is_purchased ? 'line-through text-slate-400' : 'text-slate-100'}`}>
            {item.item_name}
          </div>
          <div className="text-[10px] text-slate-400">
            {item.auto_added ? '⚡ แจ้งเตือนของใกล้หมด' : '📝 เพิ่มเอง'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-bold text-xs text-slate-200">ต้องซื้อ: {item.quantity_needed}</span>
        {item.is_purchased && (
          <button 
            onClick={() => onRestock(item)}
            className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <i className="fa-solid fa-box-archive"></i> เติมเข้า Stock
          </button>
        )}
      </div>
    </div>
  );
}
