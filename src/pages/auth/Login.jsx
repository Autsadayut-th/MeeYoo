import React, { useState } from 'react';
import { authService } from '../../services/authService';

export function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [useRealOAuth, setUseRealOAuth] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await authService.signInWithGoogle(useRealOAuth);
      if (data && data.user) {
        const user = data.user;
        onLoginSuccess({
          id: user.id || 'u_' + Date.now(),
          email: user.email || 'user@google.com',
          name: user.user_metadata?.full_name || user.name || 'สมาชิก Google 🌐',
          avatar: user.user_metadata?.avatar_url ? '👤' : '👨‍💻'
        });
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setErrorMessage(err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาตรวจสอบการตั้งค่า');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-6 text-center">
        
        {/* LOGO & BRANDING */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-emerald-600/30">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">MeeYoo</h1>
            <p className="text-xs font-medium text-stone-500 dark:text-slate-400 mt-1">
              ระบบจัดการคลังของใช้และของกินในบ้าน สำหรับคุณและคู่รัก 🏡
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs p-3.5 rounded-2xl flex items-center gap-2 text-left">
            <i className="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SINGLE GOOGLE LOGIN BUTTON */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-800 dark:text-white font-bold text-sm py-3.5 px-4 rounded-2xl border border-stone-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden active:scale-98"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin text-emerald-600 dark:text-emerald-400 text-lg"></i>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>เข้าสู่ระบบด้วย Google</span>
              </>
            )}
          </button>

          {/* OPTIONAL DIRECT SUPABASE OAUTH CHECKBOX */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-slate-400">
            <input 
              type="checkbox"
              id="realOAuth"
              checked={useRealOAuth}
              onChange={e => setUseRealOAuth(e.target.checked)}
              className="rounded accent-emerald-600"
            />
            <label htmlFor="realOAuth" className="cursor-pointer">
              เชื่อมต่อผ่าน Supabase Cloud OAuth Direct
            </label>
          </div>
        </div>

        {/* SECURITY FOOTER BADGE */}
        <div className="pt-4 border-t border-stone-100 dark:border-slate-800 text-[11px] text-stone-400 dark:text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <i className="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-500"></i>
          <span>ระบบเข้าสู่ระบบปลอดภัย ป้องกันข้อมูลสูญหาย</span>
        </div>

      </div>
    </div>
  );
}
