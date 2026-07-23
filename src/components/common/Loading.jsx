import React from 'react';

export function Loading({ text = 'กำลังโหลดข้อมูล...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-400">
      <i className="fa-solid fa-circle-notch fa-spin text-2xl text-indigo-400 mb-2"></i>
      <span className="text-xs">{text}</span>
    </div>
  );
}
