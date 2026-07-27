import React from 'react';

export function MembersView({ house, setAuthView, currentUser, members, handleSignOut, onOpenInviteModal, triggerHaptic }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-house-user text-emerald-600 text-xs"></i>
            <span>ข้อมูลบ้าน ({house.name})</span>
          </div>
          <button 
            onClick={() => setAuthView('join_home')}
            className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
          >
            ย้าย/เปลี่ยนบ้าน
          </button>
        </h3>

        <div className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 p-3 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-500 dark:text-slate-400">รหัสเชิญ</div>
            <div className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{house.code}</div>
          </div>

          <button 
            onClick={() => {
              if (triggerHaptic) triggerHaptic();
              if (onOpenInviteModal) onOpenInviteModal();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <i className="fa-solid fa-qrcode text-sm"></i>
            <span>แสดง QR Code</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white mb-3 flex items-center justify-between">
          <span>สมาชิก ({members.length} คน)</span>
          <button 
            onClick={handleSignOut}
            className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-right-from-bracket text-[10px]"></i> ออกจากระบบ
          </button>
        </h3>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-xs text-stone-400 dark:text-slate-500 py-2">ยังไม่มีข้อมูลสมาชิก</p>
          ) : (
            members.map((mem) => (
              <div key={mem.id || mem.email || mem.user_email} className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 rounded-lg flex items-center gap-3">
                <div className="avatar-initials avatar-initials-md">
                  {getInitials(mem.name || mem.user_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-stone-900 dark:text-white text-xs flex items-center gap-2">
                    <span className="truncate">{mem.name || mem.user_name}</span>
                    {(mem.email === currentUser?.email || mem.user_email === currentUser?.email) && (
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-px rounded font-semibold shrink-0">
                        คุณ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 truncate">{mem.email || mem.user_email} · {mem.role || 'สมาชิก'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card p-4 space-y-2">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-cloud text-emerald-600 text-xs"></i>
          <span>สถานะคลาวด์</span>
        </h3>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-lg text-xs space-y-1">
          <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-check text-[10px]"></i> เชื่อมต่อ Supabase Cloud พร้อมใช้งาน
          </div>
          <p className="text-stone-600 dark:text-slate-400 text-[11px]">
            ข้อมูลซิงค์ผ่านคลาวด์อัตโนมัติ ไม่ต้องตั้งค่าเพิ่ม
          </p>
        </div>
      </div>
    </div>
  );
}
