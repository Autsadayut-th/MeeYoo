import React, { useState } from 'react';

export function MembersView({ 
  house, 
  setAuthView, 
  currentUser, 
  members, 
  pendingRequests = [],
  onApproveMember,
  onRejectMember,
  handleSignOut, 
  onOpenInviteModal, 
  onUpdateMemberProfile,
  onUpdateHomeName,
  triggerHaptic 
}) {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditHomeModal, setShowEditHomeModal] = useState(false);

  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar_url || '');
  const [newHomeName, setNewHomeName] = useState(house?.name || '');

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('กรุณาเลือกไฟล์รูปภาพขนาดไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    if (triggerHaptic) triggerHaptic();
    if (onUpdateMemberProfile) {
      onUpdateMemberProfile(profileName.trim(), profileAvatar);
    }
    setShowEditProfileModal(false);
  };

  const handleSaveHomeName = (e) => {
    e.preventDefault();
    if (!newHomeName.trim()) return;
    if (triggerHaptic) triggerHaptic();
    if (onUpdateHomeName) {
      onUpdateHomeName(newHomeName.trim());
    }
    setShowEditHomeModal(false);
  };

  return (
    <div className="space-y-4">
      {/* HOUSE INFO HEADER CARD */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-house-user text-emerald-600 text-xs"></i>
            <span>ข้อมูลบ้าน ({house.name})</span>
            <button 
              onClick={() => { setNewHomeName(house.name); setShowEditHomeModal(true); }}
              className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 text-xs"
              title="แก้ไขชื่อบ้าน"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
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

      {/* PENDING JOIN REQUESTS */}
      {pendingRequests.length > 0 && (
        <div className="glass-card p-4 border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20">
          <h3 className="font-heading font-semibold text-sm text-amber-900 dark:text-amber-300 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>คำขอเข้าร่วมบ้านที่รออนุมัติ ({pendingRequests.length})</span>
            </div>
          </h3>

          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id || req.user_id || req.email} className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/50 p-3 rounded-lg flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="avatar-initials avatar-initials-md bg-amber-600 overflow-hidden">
                    {req.avatar_url ? (
                      <img src={req.avatar_url} alt={req.name} className="w-full h-full object-cover" />
                    ) : getInitials(req.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-stone-900 dark:text-white text-xs truncate">
                      {req.name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 truncate">
                      {req.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      if (triggerHaptic) triggerHaptic();
                      if (onApproveMember) onApproveMember(req);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition"
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>อนุมัติ</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (triggerHaptic) triggerHaptic();
                      if (onRejectMember) onRejectMember(req);
                    }}
                    className="bg-stone-200 hover:bg-stone-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-stone-700 dark:text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                  >
                    <i className="fa-solid fa-xmark"></i>
                    <span>ปฏิเสธ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBERS LIST */}
      <div className="glass-card p-4">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white mb-3 flex items-center justify-between">
          <span>สมาชิก ({members.length} คน)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setProfileName(currentUser?.name || '');
                setProfileAvatar(currentUser?.avatar_url || '');
                setShowEditProfileModal(true);
              }}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-user-pen"></i> แก้ไขโปรไฟล์
            </button>
            <span className="text-stone-300">|</span>
            <button 
              onClick={handleSignOut}
              className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-right-from-bracket text-[10px]"></i> ออกจากระบบ
            </button>
          </div>
        </h3>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-xs text-stone-400 dark:text-slate-500 py-2">ยังไม่มีข้อมูลสมาชิก</p>
          ) : (
            members.map((mem) => {
              const isMe = (mem.email === currentUser?.email || mem.user_email === currentUser?.email || mem.id === currentUser?.id);
              const avatar = isMe ? (currentUser?.avatar_url || mem.avatar_url) : mem.avatar_url;
              const name = isMe ? (currentUser?.name || mem.name || mem.user_name) : (mem.name || mem.user_name);

              return (
                <div key={mem.id || mem.email || mem.user_email} className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 rounded-lg flex items-center gap-3">
                  <div className="avatar-initials avatar-initials-md overflow-hidden shrink-0">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-stone-900 dark:text-white text-xs flex items-center gap-2">
                      <span className="truncate">{name}</span>
                      {isMe && (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-px rounded font-semibold shrink-0">
                          คุณ
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 truncate">{mem.email || mem.user_email} · {mem.role || 'สมาชิก'}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CLOUD STATUS */}
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
            ระบบเปิดใช้งานการอนุมัติสมาชิกและซิงค์ข้อมูลเรียลไทม์
          </p>
        </div>
      </div>

      {/* EDIT MEMBER PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 rounded-2xl w-full max-w-sm shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-slate-800 pb-2.5">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-user-pen text-emerald-600"></i>
                <span>แก้ไขโปรไฟล์ส่วนตัว</span>
              </h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-stone-400 hover:text-stone-800 dark:hover:text-white text-sm">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">รูปโปรไฟล์</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold overflow-hidden shrink-0 shadow-sm">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : getInitials(profileName)}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input 
                      type="text" 
                      placeholder="วาง URL รูปโปรไฟล์..."
                      value={profileAvatar}
                      onChange={e => setProfileAvatar(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>อัปโหลดรูปจากเครื่อง</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">ชื่อแสดงผล *</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-3 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400 text-xs font-medium"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT HOUSE NAME MODAL */}
      {showEditHomeModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 rounded-2xl w-full max-w-sm shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-slate-800 pb-2.5">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-pen-to-square text-emerald-600"></i>
                <span>แก้ไขชื่อบ้าน</span>
              </h3>
              <button onClick={() => setShowEditHomeModal(false)} className="text-stone-400 hover:text-stone-800 dark:hover:text-white text-sm">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveHomeName} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">ชื่อบ้านใหม่ *</label>
                <input 
                  type="text" 
                  value={newHomeName}
                  onChange={e => setNewHomeName(e.target.value)}
                  placeholder="เช่น บ้านวิเศษ, คอนโดสุขุมวิท..."
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditHomeModal(false)}
                  className="px-3 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400 text-xs font-medium"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm"
                >
                  บันทึกชื่อบ้าน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
