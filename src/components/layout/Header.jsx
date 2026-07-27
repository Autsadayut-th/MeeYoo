import React from 'react';

export function Header({ house, isDarkMode, toggleDarkMode, onOpenScanner, currentUser, onSelectMembersTab, triggerHaptic }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-[#e8e4df] dark:border-slate-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm shadow-sm">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <span className="font-heading font-bold text-stone-900 dark:text-white text-sm">MeeYoo</span>
            <div className="text-[11px] text-stone-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span>{house?.name || 'บ้านของเรา'}</span>
              {house?.code && (
                <span className="text-[10px] bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-1.5 py-px rounded font-mono">
                  {house.code}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-amber-300 flex items-center justify-center text-sm transition"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
          </button>

          <button 
            onClick={() => { triggerHaptic && triggerHaptic(); onOpenScanner(); }}
            className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300 flex items-center justify-center text-sm transition"
            title="สแกนบาร์โค้ด"
          >
            <i className="fa-solid fa-barcode text-xs"></i>
          </button>

          <div 
            onClick={onSelectMembersTab}
            className="flex items-center gap-1.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs cursor-pointer hover:border-emerald-500 transition"
            title="สมาชิก"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser?.name)
              )}
            </div>
            <span className="font-medium text-stone-700 dark:text-slate-200 hidden sm:inline text-[11px] truncate max-w-[80px]">
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'สมาชิก'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
