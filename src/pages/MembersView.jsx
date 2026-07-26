import React from 'react';

export function MembersView({ house, setAuthView, currentUser, members, handleSignOut, triggerHaptic }) {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-house-user text-emerald-600"></i>
            <span>ข้อมูลบ้าน ({house.name})</span>
          </div>
          <button 
            onClick={() => setAuthView('join_home')}
            className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            ย้าย/เปลี่ยนบ้าน
          </button>
        </h3>

        <div className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-500 dark:text-slate-400">Invitation Code (รหัสเชิญ)</div>
            <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">{house.code}</div>
          </div>
          <button 
            onClick={() => {
              if (triggerHaptic) triggerHaptic();
              navigator.clipboard.writeText(house.code);
              alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
            }}
            className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs"
          >
            <i className="fa-solid fa-copy"></i> คัดลอกรหัส
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white mb-3 flex items-center justify-between">
          <span>สมาชิกร่วมบ้าน ({members.length} คน)</span>
          <button 
            onClick={handleSignOut}
            className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-right-from-bracket"></i> ออกจากระบบ
          </button>
        </h3>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-xs text-stone-400 dark:text-slate-500 py-2">ยังไม่มีข้อมูลสมาชิก</p>
          ) : (
            members.map((mem) => (
              <div key={mem.id || mem.email || mem.user_email} className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 shadow-xs">
                <div className="text-2xl">{mem.avatar || '👤'}</div>
                <div className="flex-1">
                  <div className="font-bold text-stone-900 dark:text-white text-xs flex items-center gap-2">
                    {mem.name || mem.user_name}
                    {(mem.email === currentUser?.email || mem.user_email === currentUser?.email) && (
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                        บัญชีของคุณ ({mem.role || 'เจ้าของบ้าน'})
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400">{mem.email || mem.user_email} • {mem.role || 'สมาชิก'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card p-4 space-y-3">
        <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-emerald-600"></i>
          <span>สถานะการเชื่อมระบบคลาวด์ (Automatic Realtime Cloud)</span>
        </h3>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl text-xs space-y-1">
          <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-check"></i> เชื่อมต่อ Supabase Cloud อัตโนมัติพร้อมใช้งาน 100%
          </div>
          <p className="text-stone-600 dark:text-slate-400 text-[11px]">
            ผู้ใช้ทั่วไปสามารถใช้งานตัดสต็อกและซิงค์ข้อมูลผ่านคลาวด์ได้ทันที โดยไม่ต้องตั้งค่าทางเทคนิคใดๆ
          </p>
        </div>
      </div>
    </div>
  );
}
