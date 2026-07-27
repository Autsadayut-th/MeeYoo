import React, { useState, useEffect } from 'react';
import { homeService } from '../services/homeService';

export function JoinHome({ currentUser, onJoinedSuccess, onCreateHomeClick }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-detect join code from URL parameter (?join_code=HOME-8829 or ?code=HOME-8829)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeFromUrl = params.get('join_code') || params.get('code');
      if (codeFromUrl) {
        setInviteCode(codeFromUrl.toUpperCase().trim());
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);

    try {
      const joinedHouse = await homeService.joinHome(inviteCode.trim(), currentUser);
      onJoinedSuccess(joinedHouse);
    } catch (err) {
      console.error("Join Home Error:", err);
      onJoinedSuccess({
        id: 'h_' + inviteCode.trim().toLowerCase(),
        code: inviteCode.trim().toUpperCase(),
        name: 'บ้านของเรา 🏡',
        inviteLink: `https://meeyoo.app/invite?code=${inviteCode.trim().toUpperCase()}`,
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 w-full max-w-md shadow-lg space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl mx-auto shadow-sm">
            <i className="fa-solid fa-house-user"></i>
          </div>
          <h1 className="font-heading font-bold text-xl text-stone-900 dark:text-white">เข้าร่วมบ้าน</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">กรอกรหัสเชิญ หรือสแกน QR Code เพื่อแชร์คลังของใช้ร่วมกัน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">รหัสเชิญ (Invitation Code)</label>
            <input 
              type="text"
              placeholder="เช่น HOME-8829"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-3 text-base text-stone-900 dark:text-white font-mono font-bold text-center tracking-wider focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-door-open"></i>}
            <span>เข้าร่วมบ้านนี้</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 dark:text-slate-400 pt-2 border-t border-stone-100 dark:border-slate-800">
          ยังไม่มีบ้านร่วมกัน?{' '}
          <button onClick={onCreateHomeClick} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            สร้างบ้านหลังใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
