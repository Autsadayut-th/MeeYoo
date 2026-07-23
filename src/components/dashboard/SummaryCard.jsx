import React from 'react';

export function SummaryCard({ title, value, subtitle, icon, borderClass = '', iconClass = '' }) {
  return (
    <div className={`glass-card p-4 ${borderClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{title}</span>
        <i className={`fa-solid ${icon} ${iconClass} text-sm`}></i>
      </div>
      <div className="font-heading text-2xl font-extrabold text-white mt-1">{value}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>
    </div>
  );
}
