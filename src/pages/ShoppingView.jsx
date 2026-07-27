import React from 'react';

export function ShoppingView({
  shopItemName,
  setShopItemName,
  shopItemQty,
  setShopItemQty,
  handleAddManualShopping,
  shoppingList,
  toggleShoppingPurchased,
  handleRestockPurchased
}) {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white mb-3 flex items-center gap-2">
          <i className="fa-solid fa-cart-plus text-emerald-600 text-xs"></i>
          <span>เพิ่มรายการซื้อของ</span>
        </h3>

        <form onSubmit={handleAddManualShopping} className="flex gap-2">
          <input 
            type="text" 
            placeholder="ชื่อสินค้าที่จะซื้อ..."
            value={shopItemName}
            onChange={e => setShopItemName(e.target.value)}
            className="flex-1 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <input 
            type="number" 
            min="1"
            placeholder="จำนวน"
            value={shopItemQty}
            onChange={e => setShopItemQty(e.target.value)}
            className="w-16 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs text-stone-900 dark:text-white text-center focus:outline-none focus:border-emerald-500"
          />
          <button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
          >
            <i className="fa-solid fa-plus"></i> เพิ่ม
          </button>
        </form>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-heading font-semibold text-sm text-stone-900 dark:text-white mb-3 flex items-center justify-between">
          <span>รายการของที่ต้องซื้อ</span>
          <span className="text-[11px] text-stone-400 dark:text-slate-500 font-normal">ดึงของใกล้หมดอัตโนมัติ</span>
        </h3>

        <div className="space-y-2">
          {shoppingList.length === 0 ? (
            <div className="py-8 text-center text-stone-400 dark:text-slate-500 text-xs">
              <i className="fa-solid fa-basket-shopping text-xl mb-2 text-stone-300 dark:text-slate-600"></i>
              <p>ไม่มีรายการที่ต้องซื้อ สินค้ายังมีเพียงพอ</p>
            </div>
          ) : (
            shoppingList.map(item => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition ${item.is_purchased ? 'bg-stone-50 dark:bg-slate-900/60 border-stone-200 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button 
                    onClick={() => toggleShoppingPurchased(item.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition ${item.is_purchased ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 dark:border-slate-600 text-transparent'}`}
                  >
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </button>
                  <div className="overflow-hidden">
                    <div className={`font-semibold text-sm truncate ${item.is_purchased ? 'line-through text-stone-400 dark:text-slate-500' : 'text-stone-900 dark:text-white'}`}>
                      {item.item_name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-slate-400">
                      {item.auto_added ? 'แจ้งเตือนของใกล้หมด' : 'เพิ่มเอง'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-medium text-xs text-stone-600 dark:text-slate-300">ต้องซื้อ: {item.quantity_needed}</span>
                  {item.is_purchased && (
                    <button 
                      onClick={() => handleRestockPurchased(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition"
                    >
                      <i className="fa-solid fa-box-archive"></i> เติมเข้าคลัง
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
