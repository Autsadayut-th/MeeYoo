import React from 'react';

export function EmptyState({ icon = 'fa-box-open', message = 'ไม่พบข้อมูล' }) {
  return (
    <div className="glass-card p-8 text-center text-slate-400">
      <i className={`fa-solid ${icon} text-3xl mb-2 text-slate-500`}></i>
      <p className="text-sm">{message}</p>
    </div>
  );
}
