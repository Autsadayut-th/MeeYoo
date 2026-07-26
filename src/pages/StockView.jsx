import React from 'react';

export function StockView({
  searchQuery,
  setSearchQuery,
  setShowScannerModal,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
  filteredItems,
  resetForm,
  setShowAddModal,
  handleTouchStart,
  handleTouchEnd,
  openEditModal,
  handleDeleteItem,
  handleQuickUseOne,
  handleUpdateQuantity,
  triggerHaptic
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"></i>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อสินค้า หมวดหมู่ หรือบาร์โค้ด..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <button 
            onClick={() => { if (triggerHaptic) triggerHaptic(); setShowScannerModal(true); }}
            className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <i className="fa-solid fa-barcode text-sm"></i> สแกน
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => { if (triggerHaptic) triggerHaptic(); setSelectedCategory(cat); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${selectedCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300'}`}
            >
              {cat === 'ALL' ? 'ทุกหมวดหมู่' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="glass-card p-8 text-center text-stone-400 space-y-2">
            <i className="fa-solid fa-box-open text-3xl text-stone-400"></i>
            <p className="text-sm">ยังไม่มีรายการสินค้าในคลัง</p>
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
            >
              + เพิ่มสินค้าใหม่เข้าคลัง
            </button>
          </div>
        ) : (
          filteredItems.map(item => {
            const isOut = item.quantity === 0;
            const isLow = item.quantity <= item.min_threshold && !isOut;
            const statusBarClass = isOut ? 'status-bar-out' : isLow ? 'status-bar-low' : 'status-bar-ok';
            const gaugePct = Math.min(100, Math.round((item.quantity / (item.min_threshold * 2)) * 100));

            return (
              <div 
                key={item.id} 
                onTouchStart={e => handleTouchStart(e, item)}
                onTouchEnd={handleTouchEnd}
                className="glass-card relative overflow-hidden p-4 space-y-3 touch-pan-y"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${statusBarClass}`}></div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0">
                      {item.icon || '📦'}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-2 py-0.3 rounded-full text-stone-600 dark:text-slate-400">
                          {item.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.3 rounded-full font-bold ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                          {isOut ? '🔴 หมดแล้ว' : isLow ? '⚠️ ใกล้หมด' : 'ปกติ'}
                        </span>
                        {item.barcode && (
                          <span className="text-[9px] font-mono bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 px-1.5 py-0.2 rounded border border-stone-200 dark:border-slate-700">
                            <i className="fa-solid fa-barcode text-[8px] mr-1"></i>{item.barcode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="text-stone-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-sm"
                      title="แก้ไข (หรือปัดซ้าย)"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item)}
                      className="text-stone-400 hover:text-rose-600 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-sm"
                      title="ลบ"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                {/* VISUAL PROGRESS GAUGE BAR */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-400 dark:text-slate-500">
                    <span>ระดับคลังคงเหลือ</span>
                    <span>{gaugePct}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${gaugePct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 dark:border-slate-700/60 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-heading text-3xl font-extrabold ${isOut ? 'text-rose-600 dark:text-rose-400' : isLow ? 'text-amber-700 dark:text-amber-400' : 'text-stone-900 dark:text-white'}`}>
                      {item.quantity}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-slate-400">{item.unit}</span>
                    <span className="text-[10px] text-stone-400 dark:text-slate-500 ml-1">(ขั้นต่ำ {item.min_threshold})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleQuickUseOne(item)}
                      disabled={isOut}
                      className="btn-use-one px-3.5 py-2 text-xs"
                      title="กดใช้ 1 (หรือปัดการ์ดไปทางขวา 👉)"
                    >
                      <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                    </button>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item, -1)}
                        disabled={isOut}
                        className="stepper-btn text-base"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className="stepper-btn text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
