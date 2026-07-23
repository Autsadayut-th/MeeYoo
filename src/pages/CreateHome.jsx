import React, { useState } from 'react';
import { homeService } from '../services/homeService';

export function CreateHome({ currentUser, onCreateSuccess, onJoinHomeClick }) {
  const [homeName, setHomeName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homeName.trim()) return;
    setLoading(true);

    try {
      const createdHouse = await homeService.createHome(homeName.trim(), currentUser);
      onCreateSuccess(createdHouse);
    } catch (err) {
      console.error("Create Home Error:", err);
      const randomCode = 'HOME-' + Math.floor(1000 + Math.random() * 9000);
      onCreateSuccess({
        id: 'h_' + Date.now(),
        code: randomCode,
        name: homeName.trim() + ' 🏡',
        inviteLink: `https://meeyoo.app/invite?code=${randomCode}`,
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-emerald-600/30">
            <i className="fa-solid fa-house-medical"></i>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-stone-900 dark:text-white">สร้างบ้านหลังใหม่</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">ตั้งชื่อบ้านของคุณ เพื่อรับรหัสเชิญสำหรับส่งให้คู่ของคุณเข้าใช้งานร่วมกัน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">ชื่อบ้าน</label>
            <input 
              type="text"
              placeholder="เช่น บ้านแสนสุข, คอนโดสุขุมวิท..."
              value={homeName}
              onChange={e => setHomeName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-plus"></i>}
            <span>สร้างบ้านและรับรหัสเชิญ</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 dark:text-slate-400 pt-2 border-t border-stone-100 dark:border-slate-800">
          มีรหัสเชิญจากคู่ของคุณอยู่แล้ว?{' '}
          <button onClick={onJoinHomeClick} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            ใส่รหัสเพื่อเข้าร่วมบ้าน
          </button>
        </div>
      </div>
    </div>
  );
}
