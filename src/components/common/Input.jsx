import React from 'react';

export function Input({ label, type = 'text', className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-bold text-slate-300">{label}</label>}
      <input 
        type={type} 
        className={`w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 ${className}`}
        {...props}
      />
    </div>
  );
}
