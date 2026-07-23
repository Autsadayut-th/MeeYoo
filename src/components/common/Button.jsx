import React from 'react';

/**
 * Button Component - ปุ่มกดมาตรฐานประจำระบบ MeeYoo
 * 
 * @param {React.ReactNode} children - ข้อความหรือไอคอนภายในปุ่ม
 * @param {Function} onClick - ฟังก์ชันทำงานเมื่อคลิกปุ่ม
 * @param {'primary' | 'emerald' | 'amber' | 'danger' | 'ghost'} variant - รูปแบบสีปุ่ม
 * @param {'sm' | 'md' | 'lg'} size - ขนาดของปุ่ม
 * @param {string} className - คลาส CSS เพิ่มเติม
 */
export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = "font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
    emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30",
    amber: "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/20",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    ghost: "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
