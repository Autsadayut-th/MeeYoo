import React, { useState, useEffect, useMemo } from 'react';

// Sample Initial Mock Data for Demo & Multi-Tab Testing
const DEFAULT_HOUSE = {
  id: 'h_home_8829',
  code: 'HOME-8829',
  name: 'บ้านของเรา 🏡',
  inviteLink: 'https://meeyoo.app/invite?code=HOME-8829',
  created_at: new Date().toISOString()
};

const DEFAULT_MEMBERS = [
  { id: 'u1', name: 'User 1 (คุณสมชาย)', email: 'user1@meeyoo.app', role: 'เจ้าของบ้าน', avatar: '👨‍💻' },
  { id: 'u2', name: 'User 2 (คุณสมหญิง)', email: 'user2@meeyoo.app', role: 'สมาชิก', avatar: '👩‍🎨' }
];

const DEFAULT_ITEMS = [
  { 
    id: '1', 
    name: 'สบู่ก้อน นกแก้ว', 
    category: 'ของใช้ส่วนตัว', 
    quantity: 2, 
    unit: 'ก้อน', 
    min_threshold: 1, 
    icon: '🧼',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  { 
    id: '2', 
    name: 'ยาสระผม Sunsilk', 
    category: 'ของใช้ส่วนตัว', 
    quantity: 1, 
    unit: 'ขวด', 
    min_threshold: 1, 
    icon: '🧴',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  { 
    id: '3', 
    name: 'โลชั่นทาผิว Nivea', 
    category: 'ของใช้ส่วนตัว', 
    quantity: 2, 
    unit: 'ขวด', 
    min_threshold: 1, 
    icon: '🧴',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  { 
    id: '4', 
    name: 'ครีมบำรุงผิวหน้า', 
    category: 'ของใช้ส่วนตัว', 
    quantity: 2, 
    unit: 'กระปุก', 
    min_threshold: 1, 
    icon: '✨',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  { 
    id: '5', 
    name: 'ทิชชู่ม้วน (แพ็ค 6 ม้วน)', 
    category: 'ของใช้ในบ้าน', 
    quantity: 0, 
    unit: 'แพ็ค', 
    min_threshold: 2, 
    icon: '🧻',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString()
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 't1',
    item_name: 'ยาสระผม Sunsilk',
    user_name: 'User 1 (คุณสมชาย)',
    action_type: 'USE',
    qty_before: 2,
    qty_after: 1,
    change_amount: -1,
    note: 'กดปุ่ม "ใช้ 1"',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 't2',
    item_name: 'สบู่ก้อน นกแก้ว',
    user_name: 'User 2 (คุณสมหญิง)',
    action_type: 'ADD',
    qty_before: 1,
    qty_after: 3,
    change_amount: 2,
    note: 'ซื้อมาเติมเพิ่ม 2 ก้อน',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const DEFAULT_SHOPPING_LIST = [
  { id: 's1', item_id: '5', item_name: 'ทิชชู่ม้วน (แพ็ค 6 ม้วน)', quantity_needed: 2, is_purchased: false, auto_added: true },
  { id: 's2', item_id: '2', item_name: 'ยาสระผม Sunsilk', quantity_needed: 1, is_purchased: false, auto_added: true }
];

export default function App() {
  // Supabase Credentials State
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('meeyoo_sb_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('meeyoo_sb_key') || '');
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Active Navigation Tab: 'dashboard' | 'stock' | 'shopping' | 'history' | 'members' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // User Persona Switcher (0 = User 1, 1 = User 2)
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const currentUser = DEFAULT_MEMBERS[activeUserIndex];

  // Active House State
  const [house, setHouse] = useState(() => {
    const saved = localStorage.getItem('meeyoo_active_house_v2');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  });

  // Stock Items State
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('meeyoo_items_v2');
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  // Transactions Log State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('meeyoo_transactions_v2');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  // Shopping List State
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('meeyoo_shopping_v2');
    return saved ? JSON.parse(saved) : DEFAULT_SHOPPING_LIST;
  });

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals Control
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State for Add / Edit Item
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('ของใช้ส่วนตัว');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formUnit, setFormUnit] = useState('ชิ้น');
  const [formMinThreshold, setFormMinThreshold] = useState(1);
  const [formIcon, setFormIcon] = useState('📦');

  // Form State for Manual Shopping Addition
  const [shopItemName, setShopItemName] = useState('');
  const [shopItemQty, setShopItemQty] = useState(1);

  // Initialize Supabase Client if keys exist
  useEffect(() => {
    if (supabaseUrl && supabaseKey && window.supabase) {
      try {
        const client = window.supabase.createClient(supabaseUrl, supabaseKey);
        setSupabaseClient(client);
      } catch (err) {
        console.error("Supabase Error:", err);
      }
    }
  }, [supabaseUrl, supabaseKey]);

  // Sync state to LocalStorage and Multi-Tab Realtime Broadcast
  useEffect(() => {
    localStorage.setItem('meeyoo_items_v2', JSON.stringify(items));
    localStorage.setItem('meeyoo_transactions_v2', JSON.stringify(transactions));
    localStorage.setItem('meeyoo_shopping_v2', JSON.stringify(shoppingList));
    localStorage.setItem('meeyoo_active_house_v2', JSON.stringify(house));

    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('meeyoo_realtime_sync_v2');
      bc.postMessage({ type: 'DATA_SYNC' });
      bc.close();
    }
  }, [items, transactions, shoppingList, house]);

  // Listen for Realtime Multi-Tab Sync Events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'meeyoo_items_v2' && e.newValue) setItems(JSON.parse(e.newValue));
      if (e.key === 'meeyoo_transactions_v2' && e.newValue) setTransactions(JSON.parse(e.newValue));
      if (e.key === 'meeyoo_shopping_v2' && e.newValue) setShoppingList(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorageChange);

    let bc = null;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('meeyoo_realtime_sync_v2');
      bc.onmessage = () => {
        const i = localStorage.getItem('meeyoo_items_v2');
        const t = localStorage.getItem('meeyoo_transactions_v2');
        const s = localStorage.getItem('meeyoo_shopping_v2');
        if (i) setItems(JSON.parse(i));
        if (t) setTransactions(JSON.parse(t));
        if (s) setShoppingList(JSON.parse(s));
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

  // Automatic Low Stock Trigger: Synchronizes items with Shopping List
  useEffect(() => {
    const lowOrOutItems = items.filter(item => item.quantity <= item.min_threshold);
    
    setShoppingList(prev => {
      const manualEntries = prev.filter(s => !s.auto_added);
      const autoEntries = lowOrOutItems.map(item => {
        const existing = prev.find(s => s.item_id === item.id || s.item_name === item.name);
        return {
          id: existing ? existing.id : 'auto_' + item.id,
          item_id: item.id,
          item_name: item.name,
          quantity_needed: Math.max(item.min_threshold * 2 - item.quantity, 1),
          is_purchased: existing ? existing.is_purchased : false,
          auto_added: true
        };
      });
      return [...autoEntries, ...manualEntries];
    });
  }, [items]);

  // Log Stock Transaction Activity
  const recordTransaction = (itemName, actionType, qtyBefore, qtyAfter, changeAmount, note) => {
    const newTx = {
      id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
      item_name: itemName,
      user_name: currentUser.name,
      action_type: actionType,
      qty_before: qtyBefore,
      qty_after: qtyAfter,
      change_amount: changeAmount,
      note: note || '',
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Stock Actions: Quick "ใช้ 1" Button
  const handleQuickUseOne = (item) => {
    if (item.quantity <= 0) return;
    const newQty = item.quantity - 1;
    
    setItems(prev => prev.map(i => i.id === item.id ? { 
      ...i, 
      quantity: newQty, 
      updated_at: new Date().toISOString() 
    } : i));

    recordTransaction(item.name, 'USE', item.quantity, newQty, -1, 'กดปุ่ม "ใช้ 1"');
  };

  // Stock Actions: Stepper +1 / -1 Button
  const handleUpdateQuantity = (item, delta) => {
    if (delta < 0 && item.quantity <= 0) return;
    const newQty = Math.max(0, item.quantity + delta);

    setItems(prev => prev.map(i => i.id === item.id ? { 
      ...i, 
      quantity: newQty, 
      updated_at: new Date().toISOString() 
    } : i));

    recordTransaction(
      item.name, 
      delta > 0 ? 'ADD' : 'USE', 
      item.quantity, 
      newQty, 
      delta, 
      delta > 0 ? 'เพิ่มจำนวนสินค้า' : 'ลดจำนวนสินค้า'
    );
  };

  // Stock Actions: Delete Item
  const handleDeleteItem = (item) => {
    if (confirm(`คุณต้องการลบรายการ "${item.name}" ออกจากคลังสินค้าหรือไม่?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      recordTransaction(item.name, 'DELETE', item.quantity, 0, -item.quantity, 'ลบสินค้าออกจากระบบ');
    }
  };

  // Stock Actions: Create / Edit Form Submit
  const handleSaveItemForm = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const newQty = Number(formQuantity);
      setItems(prev => prev.map(i => i.id === editingItem.id ? {
        ...i,
        name: formName.trim(),
        category: formCategory,
        quantity: newQty,
        unit: formUnit,
        min_threshold: Number(formMinThreshold),
        icon: formIcon,
        updated_at: new Date().toISOString()
      } : i));

      recordTransaction(formName.trim(), 'UPDATE', editingItem.quantity, newQty, newQty - editingItem.quantity, 'แก้ไขรายละเอียดสินค้า');
    } else {
      const newItem = {
        id: 'item_' + Date.now(),
        name: formName.trim(),
        category: formCategory,
        quantity: Number(formQuantity),
        unit: formUnit,
        min_threshold: Number(formMinThreshold),
        icon: formIcon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setItems(prev => [newItem, ...prev]);
      recordTransaction(newItem.name, 'ADD', 0, newItem.quantity, newItem.quantity, 'เพิ่มสินค้าใหม่เข้าคลัง');
    }

    resetForm();
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormMinThreshold(item.min_threshold);
    setFormIcon(item.icon || '📦');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('ของใช้ส่วนตัว');
    setFormQuantity(1);
    setFormUnit('ชิ้น');
    setFormMinThreshold(1);
    setFormIcon('📦');
    setEditingItem(null);
    setShowAddModal(false);
  };

  // Shopping List Actions
  const handleAddManualShopping = (e) => {
    e.preventDefault();
    if (!shopItemName.trim()) return;

    const newShopItem = {
      id: 'manual_' + Date.now(),
      item_name: shopItemName.trim(),
      quantity_needed: Number(shopItemQty),
      is_purchased: false,
      auto_added: false
    };

    setShoppingList(prev => [newShopItem, ...prev]);
    setShopItemName('');
    setShopItemQty(1);
  };

  const toggleShoppingPurchased = (id) => {
    setShoppingList(prev => prev.map(s => s.id === id ? { ...s, is_purchased: !s.is_purchased } : s));
  };

  const handleRestockPurchased = (shopItem) => {
    const existing = items.find(i => i.id === shopItem.item_id || i.name.toLowerCase() === shopItem.item_name.toLowerCase());

    if (existing) {
      const qtyBefore = existing.quantity;
      const qtyAfter = existing.quantity + shopItem.quantity_needed;

      setItems(prev => prev.map(i => i.id === existing.id ? { 
        ...i, 
        quantity: qtyAfter,
        updated_at: new Date().toISOString() 
      } : i));

      recordTransaction(existing.name, 'RESTOCK', qtyBefore, qtyAfter, shopItem.quantity_needed, 'เติมเข้าคลังจากการซื้อของใหม่');
    } else {
      const newItem = {
        id: 'item_' + Date.now(),
        name: shopItem.item_name,
        category: 'ของใช้ทั่วไป',
        quantity: shopItem.quantity_needed,
        unit: 'ชิ้น',
        min_threshold: 1,
        icon: '🛒',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setItems(prev => [newItem, ...prev]);
      recordTransaction(newItem.name, 'RESTOCK', 0, shopItem.quantity_needed, shopItem.quantity_needed, 'เพิ่มเข้าคลังจากการซื้อของใหม่');
    }

    setShoppingList(prev => prev.filter(s => s.id !== shopItem.id));
    alert(`เติม "${shopItem.item_name}" จำนวน ${shopItem.quantity_needed} กลับเข้าคลังสินค้าเรียบร้อย!`);
  };

  // Filtered Items Computation
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const categoriesList = useMemo(() => {
    const set = new Set(items.map(i => i.category));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const total = items.length;
    const lowCount = items.filter(i => i.quantity <= i.min_threshold && i.quantity > 0).length;
    const outCount = items.filter(i => i.quantity === 0).length;
    const shoppingCount = shoppingList.filter(s => !s.is_purchased).length;

    return { total, lowCount, outCount, shoppingCount };
  }, [items, shoppingList]);

  return (
    <div className="min-h-screen relative pb-28 md:pb-8 pt-safe">
      {/* Background Lighting Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* MOBILE TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-500/20 shrink-0">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-white text-base leading-tight">MeeYoo</span>
                <div className="pulse-emerald" title="Real-time Sync Enabled"></div>
              </div>
              <div className="text-xs text-indigo-300 font-medium flex items-center gap-1">
                <span>{house.name}</span>
                <span className="text-[10px] bg-indigo-950 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono">
                  {house.code}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 border border-white/15 rounded-full p-1 shadow-inner">
            <button 
              onClick={() => setActiveUserIndex(0)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 0 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
              title="สลับเป็น User 1"
            >
              👨‍💻 U1
            </button>
            <button 
              onClick={() => setActiveUserIndex(1)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${activeUserIndex === 1 ? 'bg-pink-600 text-white shadow' : 'text-slate-400'}`}
              title="สลับเป็น User 2"
            >
              👩‍🎨 U2
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="glass-card p-4 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border-indigo-500/30">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{currentUser.avatar}</div>
                <div>
                  <div className="text-xs text-slate-400">กำลังใช้งานโดย:</div>
                  <div className="font-bold text-white text-base">{currentUser.name}</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(house.code);
                  alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
                }}
                className="bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-share-nodes"></i> แชร์รหัสเชิญ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">📦 สินค้าทั้งหมด</span>
                  <i className="fa-solid fa-boxes-stacked text-indigo-400 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">รายการในบ้าน</div>
              </div>

              <div className="glass-card p-4 border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-medium">⚠️ ใกล้หมด</span>
                  <i className="fa-solid fa-triangle-exclamation text-amber-400 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-amber-300 mt-1">{stats.lowCount}</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">น้อยกว่าขั้นต่ำ</div>
              </div>

              <div className="glass-card p-4 border-rose-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-400 font-medium">🔴 หมดแล้ว</span>
                  <i className="fa-solid fa-circle-xmark text-rose-400 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-rose-400 mt-1">{stats.outCount}</div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">จำนวนคงเหลือ 0</div>
              </div>

              <div className="glass-card p-4 border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400 font-medium">🛒 รายการซื้อ</span>
                  <i className="fa-solid fa-cart-shopping text-cyan-400 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-cyan-300 mt-1">{stats.shoppingCount}</div>
                <div className="text-[10px] text-cyan-400/80 mt-0.5">ต้องซื้อเข้าบ้าน</div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-indigo-400"></i>
                  <span>รายการสินค้าในบ้าน</span>
                </h3>
                <button 
                  onClick={() => setActiveTab('stock')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  ดูทั้งหมด ({items.length}) <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
                </button>
              </div>

              <div className="space-y-3">
                {items.slice(0, 5).map(item => {
                  const isOut = item.quantity === 0;
                  const isLow = item.quantity <= item.min_threshold && !isOut;

                  return (
                    <div key={item.id} className="bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-xl shrink-0">
                          {item.icon || '📦'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-sm text-slate-100 truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{item.category}</span>
                            <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                              {isOut ? '🔴 หมด' : isLow ? '⚠️ ใกล้หมด' : 'ปกติ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-heading font-extrabold text-lg text-white">{item.quantity}</span>
                          <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                        </div>

                        <button 
                          onClick={() => handleQuickUseOne(item)}
                          disabled={isOut}
                          className="btn-use-one text-xs px-3 py-1.5"
                          title="กดใช้ 1"
                        >
                          <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า หรือหมวดหมู่..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white shadow' : 'bg-slate-900/80 border-white/10 text-slate-400'}`}
                  >
                    {cat === 'ALL' ? 'ทุกหมวดหมู่' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="glass-card p-8 text-center text-slate-400">
                  <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-500"></i>
                  <p className="text-sm">ไม่พบรายการสินค้าที่ค้นหา</p>
                </div>
              ) : (
                filteredItems.map(item => {
                  const isOut = item.quantity === 0;
                  const isLow = item.quantity <= item.min_threshold && !isOut;
                  const statusBarClass = isOut ? 'status-bar-out' : isLow ? 'status-bar-low' : 'status-bar-ok';

                  return (
                    <div key={item.id} className="glass-card relative overflow-hidden p-4 space-y-3">
                      <div className={`absolute top-0 left-0 right-0 h-1 ${statusBarClass}`}></div>

                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                            {item.icon || '📦'}
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-base text-white">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.3 rounded-full text-slate-400">
                                {item.category}
                              </span>
                              <span className={`text-[10px] px-2 py-0.3 rounded-full font-bold ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                                {isOut ? '🔴 หมดแล้ว' : isLow ? '⚠️ ใกล้หมด' : 'ปกติ'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="text-slate-400 hover:text-indigo-400 p-2 rounded-lg hover:bg-white/5 text-sm"
                            title="แก้ไข"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item)}
                            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 text-sm"
                            title="ลบ"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`font-heading text-3xl font-extrabold ${isOut ? 'text-rose-400' : isLow ? 'text-amber-300' : 'text-white'}`}>
                            {item.quantity}
                          </span>
                          <span className="text-xs text-slate-400">{item.unit}</span>
                          <span className="text-[10px] text-slate-500 ml-1">(ขั้นต่ำ {item.min_threshold})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleQuickUseOne(item)}
                            disabled={isOut}
                            className="btn-use-one px-3 py-2 text-xs"
                          >
                            <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                          </button>

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleUpdateQuantity(item, -1)}
                              disabled={isOut}
                              className="stepper-btn text-base"
                              title="ลด 1"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => handleUpdateQuantity(item, 1)}
                              className="stepper-btn text-base"
                              title="เพิ่ม 1"
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
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
                <i className="fa-solid fa-cart-plus text-cyan-400"></i>
                <span>เพิ่มรายการซื้อของด้วยตัวเอง</span>
              </h3>

              <form onSubmit={handleAddManualShopping} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ชื่อสินค้าที่จะซื้อ..."
                  value={shopItemName}
                  onChange={e => setShopItemName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <input 
                  type="number" 
                  min="1"
                  placeholder="จำนวน"
                  value={shopItemQty}
                  onChange={e => setShopItemQty(e.target.value)}
                  className="w-16 bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                />
                <button 
                  type="submit"
                  className="bg-cyan-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  <i className="fa-solid fa-plus"></i> เพิ่ม
                </button>
              </form>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-base text-white mb-3 flex items-center justify-between">
                <span>🛒 รายการของที่ต้องซื้อเข้าบ้าน</span>
                <span className="text-[11px] text-slate-400">ดึงของใกล้หมดให้อัตโนมัติ</span>
              </h3>

              <div className="space-y-2.5">
                {shoppingList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <i className="fa-solid fa-basket-shopping text-2xl mb-2 text-slate-500"></i>
                    <p>ไม่มีรายการที่ต้องซื้อ สินค้าในบ้านยังมีเพียงพอ!</p>
                  </div>
                ) : (
                  shoppingList.map(item => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${item.is_purchased ? 'bg-slate-950/40 border-white/5 opacity-55' : 'bg-slate-900/80 border-white/10'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button 
                          onClick={() => toggleShoppingPurchased(item.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${item.is_purchased ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500 text-transparent'}`}
                        >
                          <i className="fa-solid fa-check text-xs"></i>
                        </button>
                        <div className="overflow-hidden">
                          <div className={`font-bold text-sm truncate ${item.is_purchased ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {item.item_name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.auto_added ? '⚡ แจ้งเตือนของใกล้หมด' : '📝 เพิ่มเอง'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-xs text-slate-200">ต้องซื้อ: {item.quantity_needed}</span>
                        {item.is_purchased && (
                          <button 
                            onClick={() => handleRestockPurchased(item)}
                            className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <i className="fa-solid fa-box-archive"></i> เติมเข้า Stock
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass-card p-4">
            <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-indigo-400"></i>
              <span>ประวัติการเปลี่ยนแปลง Stock ทั้งหมด</span>
            </h3>

            <div className="relative pl-5 border-l-2 border-white/10 space-y-4">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">ยังไม่มีบันทึกประวัติกิจกรรม</p>
              ) : (
                transactions.map(tx => {
                  const isAdd = tx.action_type === 'ADD' || tx.action_type === 'RESTOCK';
                  const isUse = tx.action_type === 'USE';
                  const dotColor = isAdd ? 'bg-emerald-500' : isUse ? 'bg-amber-500' : 'bg-rose-500';

                  return (
                    <div key={tx.id} className="relative bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs space-y-1">
                      <div className={`absolute -left-[27px] top-4 w-3 h-3 rounded-full ${dotColor} border-2 border-slate-950`}></div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">
                          {tx.item_name}
                          <span className={`ml-2 text-[10px] px-2 py-0.2 rounded-full ${isAdd ? 'bg-emerald-500/20 text-emerald-300' : isUse ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {tx.change_amount > 0 ? `+${tx.change_amount}` : tx.change_amount}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(tx.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-slate-400">
                        กระทำโดย: <strong className="text-slate-200">{tx.user_name}</strong> ({tx.qty_before} → {tx.qty_after}) {tx.note && `• ${tx.note}`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {(activeTab === 'members' || activeTab === 'settings') && (
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-3">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <i className="fa-solid fa-house-user text-indigo-400"></i>
                <span>ข้อมูลบ้าน ({house.name})</span>
              </h3>

              <div className="bg-slate-900 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Invitation Code (รหัสเชิญ)</div>
                  <div className="font-mono text-lg font-bold text-indigo-400">{house.code}</div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(house.code);
                    alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
                  }}
                  className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  <i className="fa-solid fa-copy"></i> คัดลอกรหัส
                </button>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-sm text-white mb-3">
                สมาชิกในบ้าน ({DEFAULT_MEMBERS.length} / 2 คน)
              </h3>

              <div className="space-y-2">
                {DEFAULT_MEMBERS.map((mem, idx) => (
                  <div key={mem.id} className="bg-slate-900 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                    <div className="text-2xl">{mem.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                        {mem.name}
                        {idx === activeUserIndex && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold">
                            กำลังใช้งาน
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{mem.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 space-y-3">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <i className="fa-solid fa-cloud text-emerald-400"></i>
                <span>ตั้งค่า Supabase Cloud Realtime</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Supabase URL</label>
                  <input 
                    type="text"
                    placeholder="https://xyz.supabase.co"
                    value={supabaseUrl}
                    onChange={e => {
                      setSupabaseUrl(e.target.value);
                      localStorage.setItem('meeyoo_sb_url', e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Supabase Anon Key</label>
                  <input 
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={supabaseKey}
                    onChange={e => {
                      setSupabaseKey(e.target.value);
                      localStorage.setItem('meeyoo_sb_key', e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button 
                  onClick={() => alert('บันทึกการตั้งค่า Supabase เรียบร้อยแล้ว!')}
                  className="w-full bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl mt-2"
                >
                  บันทึกการตั้งค่า Supabase
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <button 
        onClick={() => { resetForm(); setShowAddModal(true); }}
        className="fixed right-5 bottom-20 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-2xl shadow-2xl shadow-indigo-600/50 flex items-center justify-center active:scale-95 transition"
        title="เพิ่มสินค้าใหม่เข้าคลัง"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 h-16">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-chart-pie text-lg mb-1"></i>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('stock')}
            className={`bottom-nav-item ${activeTab === 'stock' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-boxes-stacked text-lg mb-1"></i>
            <span>Stock</span>
          </button>

          <button 
            onClick={() => setActiveTab('shopping')}
            className={`bottom-nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
          >
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-lg mb-1"></i>
              {stats.shoppingCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {stats.shoppingCount}
                </span>
              )}
            </div>
            <span>Shopping</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-clock-rotate-left text-lg mb-1"></i>
            <span>History</span>
          </button>

          <button 
            onClick={() => setActiveTab('members')}
            className={`bottom-nav-item ${activeTab === 'members' || activeTab === 'settings' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-users text-lg mb-1"></i>
            <span>Members</span>
          </button>
        </div>
      </nav>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="glass-card bg-slate-900 border border-white/15 p-5 rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto pb-safe">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                {editingItem ? '✏️ แก้ไขรายละเอียดสินค้า' : '➕ เพิ่มสินค้าใหม่เข้าคลัง'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white text-lg p-1">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveItemForm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ชื่อสินค้า *</label>
                <input 
                  type="text"
                  placeholder="เช่น สบู่ก้อน, ยาสระผม..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">หมวดหมู่</label>
                  <select 
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ของใช้ส่วนตัว" className="bg-slate-900">ของใช้ส่วนตัว</option>
                    <option value="ของใช้ในบ้าน" className="bg-slate-900">ของใช้ในบ้าน</option>
                    <option value="อาหารแห้ง" className="bg-slate-900">อาหารแห้ง</option>
                    <option value="เครื่องดื่ม" className="bg-slate-900">เครื่องดื่ม</option>
                    <option value="ยาสามัญ" className="bg-slate-900">ยาสามัญ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">หน่วยนับ</label>
                  <input 
                    type="text"
                    placeholder="ชิ้น, ขวด, ก้อน"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">จำนวนเริ่มต้น</label>
                  <input 
                    type="number"
                    min="0"
                    value={formQuantity}
                    onChange={e => setFormQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">จำนวนขั้นต่ำ (Min Threshold)</label>
                  <input 
                    type="number"
                    min="1"
                    value={formMinThreshold}
                    onChange={e => setFormMinThreshold(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ไอคอนแสดงผล</label>
                <div className="flex gap-2 text-xl overflow-x-auto pb-1">
                  {['🧼', '🧴', '🧻', '✨', '☕', '🥤', '🍞', '📦'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setFormIcon(ic)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition ${formIcon === ic ? 'bg-indigo-600 border-indigo-400 scale-105' : 'bg-slate-950 border-white/10'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  {editingItem ? 'บันทึกแก้ไข' : 'เพิ่มสินค้า'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
