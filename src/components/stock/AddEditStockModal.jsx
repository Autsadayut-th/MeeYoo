import React from 'react';
import { compressImage } from '../../utils/constants';

export function AddEditStockModal({
  isOpen,
  editingItem,
  resetForm,
  handleSaveItemForm,
  onDeleteItem,
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
  formImageUrl,
  setFormImageUrl,
  onOpenScanner
}) {
  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, (base64Str) => {
        setFormImageUrl(base64Str);
      }, 600, 600, 0.8);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="glass-card bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 rounded-t-xl sm:rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto pb-safe">
        <div className="flex justify-between items-center mb-4 border-b border-stone-100 dark:border-slate-800 pb-3">
          <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white">
            {editingItem ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h3>
          <button onClick={resetForm} className="text-stone-400 hover:text-stone-800 dark:hover:text-white text-sm p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSaveItemForm} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">ชื่อสินค้า *</label>
            <input 
              type="text"
              placeholder="เช่น สบู่ก้อน, ยาสระผม..."
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">รูปภาพสินค้า (อัปโหลดรูปหรือใส่ลิงก์)</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {formImageUrl ? (
                  <img src={formImageUrl} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{formIcon || '📦'}</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input 
                  type="text" 
                  placeholder="วาง URL รูปภาพสินค้า..."
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <label className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>เลือกรูปภาพจากเครื่อง</span>
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                </label>
                {formImageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('')}
                    className="ml-3 text-[11px] text-rose-500 hover:underline"
                  >
                    ลบรูป
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>บาร์โค้ด</span>
              <button 
                type="button"
                onClick={onOpenScanner}
                className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium hover:underline flex items-center gap-1"
              >
                <i className="fa-solid fa-barcode"></i> สแกนด้วยกล้อง
              </button>
            </label>
            <input 
              type="text"
              placeholder="สแกนหรือพิมพ์รหัสบาร์โค้ด"
              value={formBarcode}
              onChange={e => setFormBarcode(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs text-stone-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">หมวดหมู่</label>
              <select 
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ของใช้ส่วนตัว">ของใช้ส่วนตัว</option>
                <option value="ของใช้ในบ้าน">ของใช้ในบ้าน</option>
                <option value="อาหารแห้ง">อาหารแห้ง</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                <option value="ยาสามัญ">ยาสามัญ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">หน่วยนับ</label>
              <input 
                type="text"
                placeholder="ชิ้น, ขวด, ก้อน"
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">จำนวนเริ่มต้น</label>
              <input 
                type="number"
                min="0"
                value={formQuantity}
                onChange={e => setFormQuantity(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">ขั้นต่ำ</label>
              <input 
                type="number"
                min="1"
                value={formMinThreshold}
                onChange={e => setFormMinThreshold(e.target.value)}
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">วันหมดอายุ (ถ้ามี)</label>
            <input 
              type="date"
              value={formExpiryDate || ''}
              onChange={e => setFormExpiryDate && setFormExpiryDate(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">ไอคอน (สำรองถ้าไม่มีรูป)</label>
            <div className="flex gap-2 text-xl overflow-x-auto pb-1">
              {['🧼', '🧴', '🧻', '✨', '☕', '🥤', '🍞', '📦'].map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setFormIcon(ic)}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition ${formIcon === ic ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-slate-800">
            {editingItem ? (
              <button 
                type="button" 
                onClick={() => { resetForm(); onDeleteItem && onDeleteItem(editingItem); }}
                className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can"></i> ลบสินค้า
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400 text-xs font-medium hover:bg-stone-50 dark:hover:bg-slate-800 transition"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-sm transition"
              >
                {editingItem ? 'บันทึก' : 'เพิ่มสินค้า'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
