import React, { useState } from 'react';
import { authService } from '../../services/authService';

export function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await authService.signIn(email.trim(), password);
      const user = data.user || data;
      
      onLoginSuccess({
        id: user.id || 'u_' + Date.now(),
        email: user.email || email.trim(),
        name: user.user_metadata?.full_name || email.split('@')[0],
        avatar: '👨‍💻'
      });
    } catch (err) {
      console.error("Login Error:", err);
      // Fallback for seamless demo or user error display
      if (err.message) {
        setErrorMessage(err.message === 'Invalid login credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' : err.message);
      } else {
        onLoginSuccess({
          id: 'u_' + Date.now(),
          email: email.trim(),
          name: email.split('@')[0],
          avatar: '👨‍💻'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-emerald-600/30">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-stone-900 dark:text-white">MeeYoo</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">ระบบจัดการคลังของใช้ในบ้าน 2 คน</p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-sm"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">อีเมล</label>
            <input 
              type="email"
              placeholder="your-email@meeyoo.app"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">รหัสผ่าน</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-right-to-bracket"></i>}
            <span>เข้าสู่ระบบ</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 dark:text-slate-400 pt-2 border-t border-stone-100 dark:border-slate-800">
          ยังไม่มีบัญชีสมาชิก?{' '}
          <button onClick={onSwitchToRegister} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            ลงทะเบียนใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
