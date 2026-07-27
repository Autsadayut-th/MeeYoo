import React from 'react';

export function HistoryView({ transactions }) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white mb-4 flex items-center gap-2">
        <i className="fa-solid fa-clock-rotate-left text-emerald-600 text-xs"></i>
        <span>ประวัติการเปลี่ยนแปลง</span>
      </h3>

      <div className="relative pl-5 border-l-2 border-stone-200 dark:border-slate-700 space-y-3">
        {transactions.length === 0 ? (
          <p className="text-xs text-stone-400 dark:text-slate-500 py-3">ยังไม่มีบันทึกประวัติ</p>
        ) : (
          transactions.map(tx => {
            const isAdd = tx.action_type === 'ADD' || tx.action_type === 'RESTOCK';
            const isUse = tx.action_type === 'USE';
            const dotColor = isAdd ? 'bg-emerald-600' : isUse ? 'bg-amber-600' : 'bg-rose-600';

            return (
              <div key={tx.id} className="relative bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg p-3 text-xs space-y-1">
                <div className={`absolute -left-[27px] top-4 w-2.5 h-2.5 rounded-full ${dotColor} border-2 border-white dark:border-slate-900`}></div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 dark:text-white text-sm">
                    {tx.item_name}
                    <span className={`ml-2 text-[10px] px-1.5 py-px rounded font-semibold ${isAdd ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : isUse ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                      {tx.change_amount > 0 ? `+${tx.change_amount}` : tx.change_amount}
                    </span>
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-slate-500 font-mono">
                    {new Date(tx.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-stone-500 dark:text-slate-400">
                  โดย <strong className="text-stone-700 dark:text-slate-200">{tx.user_name}</strong> ({tx.qty_before} → {tx.qty_after}) {tx.note && `• ${tx.note}`}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
