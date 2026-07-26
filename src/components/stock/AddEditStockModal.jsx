import React from 'react';

export function AddEditStockModal({
  isOpen,
  editingItem,
  resetForm,
  handleSaveItemForm,
  formName,
  setFormName,
  formBarcode,
  setFormBarcode,
  formCategory,
  setFormCategory,
  formUnit,
  setFormUnit,
  formQuantity,
  setFormQuantity,
  formMinThreshold,
  setFormMinThreshold,
  formIcon,
  setFormIcon,
  onOpenScanner
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto pb-safe">
        <div className="flex justify-between items-center mb-4 border-b border-stone-100 dark:border-slate-800 pb-3">
          <h3 className="font-heading font-bold text-lg text-stone-900 dark:text-white">
            {editingItem ? '✏️ แก้ไขรายละเอียดสินค้า' : '➕ เพิ่มสินค้าใหม่เข้าคลัง'}
          </h3>
          <button onClick={resetForm} className="text-stone-400 hover:text-stone-800 dark:hover:text-white text-lg p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSaveItemForm} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">ชื่อสินค้า *</label>
            <input 
              type="text"
              placeholder="เช่น สบู่ก้อน, ยาสระผม..."
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>รหัสบาร์โค้ด (Barcode / QR)</span>
              <button 
                type="button"
                onClick={onOpenScanner}
                className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold hover:underline flex items-center gap-1"
              >
                <i className="fa-solid fa-barcode"></i> สแกนด้วยกล้อง
              </button>
            </label>
            <input 
              type="text"
              placeholder="เช่น 885000000001 (สแกนหรือพิมพ์ได้)"
              value={formBarcode}
              onChange={e => setFormBarcode(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">หมวดหมู่</label>
              <select 
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ของใช้ส่วนตัว">ของใช้ส่วนตัว</option>
                <option value="ของใช้ในบ้าน">ของใช้ในบ้าน</option>
                <option value="อาหารแห้ง">อาหารแห้ง</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                <option value="ยาสามัญ">ยาสามัญ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">หน่วยนับ</label>
              <input 
                type="text"
                placeholder="ชิ้น, ขวด, ก้อน"
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">จำนวนเริ่มต้น</label>
              <input 
                type="number"
                min="0"
                value={formQuantity}
                onChange={e => setFormQuantity(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">จำนวนขั้นต่ำ (Min Threshold)</label>
              <input 
                type="number"
                min="1"
                value={formMinThreshold}
                onChange={e => setFormMinThreshold(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">ไอคอนแสดงผล</label>
            <div className="flex gap-2 text-xl overflow-x-auto pb-1">
              {['🧼', '🧴', '🧻', '✨', '☕', '🥤', '🍞', '📦'].map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setFormIcon(ic)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition ${formIcon === ic ? 'bg-emerald-600 border-emerald-600 text-white scale-105 shadow-xs' : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-800 dark:text-slate-200'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400 text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20"
            >
              {editingItem ? 'บันทึกแก้ไข' : 'เพิ่มสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
