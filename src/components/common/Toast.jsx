import React from 'react';

export function Toast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform animate-bounce-short">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-emerald-400 text-sm">{notification.title || 'การแจ้งเตือน'}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg font-bold p-1 leading-none transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
