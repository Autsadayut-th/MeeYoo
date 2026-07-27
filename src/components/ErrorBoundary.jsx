import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('meeyoo_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100 dark:bg-slate-900">
          <div className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 dark:text-white">เกิดข้อผิดพลาดในการแสดงผล</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                ระบบตรวจพบข้อผิดพลาดที่ไม่คาดคิด กรุณากดปุ่มด้านล่างเพื่อโหลดหน้าจอใหม่
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>รีโหลดหน้าจอและรีเซ็ตแคช</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
