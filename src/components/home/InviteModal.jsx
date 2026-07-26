import React, { useState } from 'react';

export function InviteModal({ isOpen, onClose, house }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !house) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://meeyoo.app';
  const inviteCode = house.code || 'HOME-8829';
  const inviteLink = `${origin}?join_code=${inviteCode}`;
  
  // High-reliability QR Code Generator URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(inviteLink)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWeb = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `เข้าร่วมบ้าน ${house.name} บน MeeYoo`,
          text: `คุณได้รับคำเชิญเข้าร่วมบ้าน "${house.name}" บนแอป MeeYoo! รหัสเชิญ: ${inviteCode}`,
          url: inviteLink
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-5 text-center relative overflow-hidden">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-400 hover:text-stone-800 dark:hover:text-white flex items-center justify-center text-sm transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* HEADER BRANDING */}
        <div className="space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl mx-auto shadow-md shadow-emerald-600/30">
            <i className="fa-solid fa-house-circle-check"></i>
          </div>
          <h3 className="font-heading font-extrabold text-xl text-stone-900 dark:text-white">
            เชิญสมาชิกร่วมบ้าน 🏡
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            {house.name}
          </p>
        </div>

        {/* QR CODE CONTAINER */}
        <div className="bg-stone-50 dark:bg-slate-800 p-4 rounded-2xl border border-stone-200 dark:border-slate-700 space-y-3">
          <div className="bg-white p-3 rounded-xl shadow-xs inline-block mx-auto border border-stone-100">
            <img 
              src={qrCodeUrl} 
              alt="Invite QR Code" 
              className="w-48 h-48 object-contain rounded-lg mx-auto"
              loading="eager"
            />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">
              สแกน QR Code เพื่อเข้าร่วมบ้านทันที
            </div>
            <div className="inline-block bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-extrabold text-sm px-3 py-1 rounded-xl">
              {inviteCode}
            </div>
          </div>
        </div>

        {/* SHARE BUTTONS */}
        <div className="space-y-2">
          <button
            onClick={handleShareWeb}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-share-nodes text-sm"></i>
            <span>แชร์ลิงก์เชิญ (LINE / Messenger)</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 active:scale-98 text-stone-700 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
          >
            <i className={`fa-solid ${copied ? 'fa-check text-emerald-600' : 'fa-link'}`}></i>
            <span>{copied ? 'คัดลอกลิงก์เรียบร้อย! ✨' : 'คัดลอกลิงก์เชิญ (Copy Link)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
