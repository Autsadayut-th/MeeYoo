import React from 'react';
import { StockStatusBadge } from './StockStatusBadge';
import { getStockStatus } from '../../utils/stockStatus';

export function StockCard({ item, onQuickUse, onUpdateQty, onEdit, onDelete }) {
  const { statusBarClass, isOut } = getStockStatus(item.quantity, item.min_threshold);

  return (
    <div className="glass-card relative overflow-hidden p-4 space-y-3">
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusBarClass}`}></div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {item.icon || '📦'}
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">{item.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.3 rounded-full text-slate-400">
                {item.category}
              </span>
              <StockStatusBadge quantity={item.quantity} minThreshold={item.min_threshold} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(item)}
            className="text-slate-400 hover:text-indigo-400 p-2 rounded-lg hover:bg-white/5 text-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button 
            onClick={() => onDelete(item)}
            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 text-sm"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-heading text-3xl font-extrabold ${isOut ? 'text-rose-400' : 'text-white'}`}>
            {item.quantity}
          </span>
          <span className="text-xs text-slate-400">{item.unit}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onQuickUse(item)}
            disabled={isOut}
            className="btn-use-one px-3 py-2 text-xs"
          >
            <i className="fa-solid fa-hand-holding"></i> ใช้ 1
          </button>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => onUpdateQty(item, -1)}
              disabled={isOut}
              className="stepper-btn text-base"
            >
              -
            </button>
            <button 
              onClick={() => onUpdateQty(item, 1)}
              className="stepper-btn text-base"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
