import React from 'react';

/**
 * Navbar Component - แถบด้านบน Production แบบคลีน (แสดงข้อมูลบ้าน และโปรไฟล์ผู้ใช้)
 */
export function Navbar({ house, currentUser, isDarkMode, toggleDarkMode, onOpenScanner }) {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-[#e8e4df] dark:border-slate-800 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-600/20 shrink-0">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-stone-900 dark:text-white text-base leading-tight">MeeYoo</span>
              <div className="pulse-emerald" title="Real-time Sync Active"></div>
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <span>{house.name}</span>
              <span className="text-[10px] bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-1.5 py-0.2 rounded font-mono">
                {house.code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* DARK / LIGHT MODE TOGGLE */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-amber-300 flex items-center justify-center text-sm shadow-xs transition"
            title={isDarkMode ? 'สลับเป็น Warm Light Mode' : 'สลับเป็น Warm Dark Mode'}
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          {/* BARCODE SCANNER BUTTON */}
          {onOpenScanner && (
            <button 
              onClick={onOpenScanner}
              className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm shadow-xs"
              title="สแกนบาร์โค้ดด้วยกล้องมือถือ"
            >
              <i className="fa-solid fa-barcode"></i>
            </button>
          )}

          {/* LOGGED IN USER PROFILE BADGE */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs shadow-inner">
            <span className="text-sm">{currentUser.avatar}</span>
            <span className="font-bold text-stone-800 dark:text-slate-200 hidden sm:inline text-[11px] truncate max-w-[80px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
