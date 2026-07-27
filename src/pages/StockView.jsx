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
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า หมวดหมู่ หรือบาร์โค้ด..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={() => { if (triggerHaptic) triggerHaptic(); setShowScannerModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5 shrink-0 transition"
          >
            <i className="fa-solid fa-barcode text-sm"></i> สแกน
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => { if (triggerHaptic) triggerHaptic(); setSelectedCategory(cat); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition ${selectedCategory === cat ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300'}`}
            >
              {cat === 'ALL' ? 'ทุกหมวดหมู่' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="glass-card p-8 text-center text-stone-400 space-y-2">
            <i className="fa-solid fa-box-open text-2xl text-stone-300"></i>
            <p className="text-sm">ยังไม่มีรายการสินค้าในคลัง</p>
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              + เพิ่มสินค้าใหม่
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        item.icon || <i className="fa-solid fa-cube text-stone-400"></i>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white">{item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-1.5 py-px rounded text-stone-600 dark:text-slate-400">
                          {item.category}
                        </span>
                        <span className={`text-[10px] px-1.5 py-px rounded font-semibold ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                          {isOut ? 'หมดแล้ว' : isLow ? 'ใกล้หมด' : 'ปกติ'}
                        </span>
                        {item.barcode && (
                          <span className="text-[9px] font-mono bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 px-1.5 py-px rounded border border-stone-200 dark:border-slate-700">
                            <i className="fa-solid fa-barcode text-[8px] mr-1"></i>{item.barcode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="text-stone-400 hover:text-emerald-600 p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 text-sm transition"
                      title="แก้ไข"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 text-sm transition"
                      title="ลบ"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-stone-400 dark:text-slate-500">
                    <span>คงเหลือ</span>
                    <span>{gaugePct}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${gaugePct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 dark:border-slate-700/60 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-heading text-2xl font-bold ${isOut ? 'text-rose-600 dark:text-rose-400' : isLow ? 'text-amber-700 dark:text-amber-400' : 'text-stone-900 dark:text-white'}`}>
                      {item.quantity}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-slate-400">{item.unit}</span>
                    <span className="text-[10px] text-stone-400 dark:text-slate-500">(ขั้นต่ำ {item.min_threshold})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleQuickUseOne(item)}
                      disabled={isOut}
                      className="btn-use-one px-3 py-2 text-xs"
                      title="กดใช้ 1"
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
