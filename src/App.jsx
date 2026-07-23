import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarcodeScannerModal } from './components/stock/BarcodeScannerModal';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { JoinHome } from './pages/JoinHome';
import { CreateHome } from './pages/CreateHome';
import { homeService } from './services/homeService';

const DEFAULT_HOUSE = {
  id: 'h_home_8829',
  code: 'HOME-8829',
  name: 'บ้านของเรา 🏡',
  inviteLink: 'https://meeyoo.app/invite?code=HOME-8829',
  created_at: new Date().toISOString()
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Real Account Session check
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('meeyoo_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Screen Flow: Default to 'login' if user is not logged in yet!
  const [authView, setAuthView] = useState(() => {
    const savedUser = localStorage.getItem('meeyoo_current_user');
    return savedUser ? 'app' : 'login';
  });

  const [house, setHouse] = useState(() => {
    const saved = localStorage.getItem('meeyoo_active_house_v3');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  });

  // Dynamic Members List in Active House
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('meeyoo_house_members_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('meeyoo_theme') === 'dark';
  });

  // Real Production State: Strictly start EMPTY [] for all new logins/homes
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('meeyoo_items_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('meeyoo_transactions_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('meeyoo_shopping_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('ของใช้ส่วนตัว');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formUnit, setFormUnit] = useState('ชิ้น');
  const [formMinThreshold, setFormMinThreshold] = useState(1);
  const [formIcon, setFormIcon] = useState('📦');
  const [formBarcode, setFormBarcode] = useState('');

  const [shopItemName, setShopItemName] = useState('');
  const [shopItemQty, setShopItemQty] = useState(1);

  // Confetti Animation Particles State
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Touch Swipe Gesture Refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentItem = useRef(null);

  const triggerHaptic = (pattern = 35) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  };

  const toggleDarkMode = () => {
    triggerHaptic();
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('meeyoo_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const triggerConfetti = () => {
    const colors = ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#14b8a6'];
    const particles = Array.from({ length: 40 }).map((_, i) => ({
      id: i + '_' + Date.now(),
      left: Math.random() * 100 + 'vw',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.4 + 's',
      size: Math.random() * 8 + 6 + 'px'
    }));

    setConfettiParticles(particles);
    setTimeout(() => setConfettiParticles([]), 2600);
  };

  // Sync Members from Cloud or Active Session
  useEffect(() => {
    if (house && house.id) {
      homeService.fetchMembers(house.id).then(fetched => {
        if (fetched && fetched.length > 0) {
          setMembers(fetched);
        } else if (currentUser && currentUser.email) {
          const userWithRole = { ...currentUser, role: currentUser.role || 'เจ้าของบ้าน' };
          setMembers([userWithRole]);
        }
      });
    }
  }, [house, currentUser]);

  useEffect(() => {
    localStorage.setItem('meeyoo_items_v3', JSON.stringify(items));
    localStorage.setItem('meeyoo_transactions_v3', JSON.stringify(transactions));
    localStorage.setItem('meeyoo_shopping_v3', JSON.stringify(shoppingList));
    localStorage.setItem('meeyoo_active_house_v3', JSON.stringify(house));
    if (currentUser) {
      localStorage.setItem('meeyoo_current_user', JSON.stringify(currentUser));
    }
    localStorage.setItem('meeyoo_house_members_v3', JSON.stringify(members));

    if (window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('meeyoo_realtime_sync_v3');
        bc.postMessage({ type: 'DATA_SYNC' });
        bc.close();
      } catch (e) {}
    }
  }, [items, transactions, shoppingList, house, currentUser, members]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'meeyoo_items_v3' && e.newValue) setItems(JSON.parse(e.newValue));
      if (e.key === 'meeyoo_transactions_v3' && e.newValue) setTransactions(JSON.parse(e.newValue));
      if (e.key === 'meeyoo_shopping_v3' && e.newValue) setShoppingList(JSON.parse(e.newValue));
      if (e.key === 'meeyoo_house_members_v3' && e.newValue) setMembers(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorageChange);

    let bc = null;
    if (window.BroadcastChannel) {
      try {
        bc = new BroadcastChannel('meeyoo_realtime_sync_v3');
        bc.onmessage = () => {
          const i = localStorage.getItem('meeyoo_items_v3');
          const t = localStorage.getItem('meeyoo_transactions_v3');
          const s = localStorage.getItem('meeyoo_shopping_v3');
          const m = localStorage.getItem('meeyoo_house_members_v3');
          if (i) setItems(JSON.parse(i));
          if (t) setTransactions(JSON.parse(t));
          if (s) setShoppingList(JSON.parse(s));
          if (m) setMembers(JSON.parse(m));
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

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

  const recordTransaction = (itemName, actionType, qtyBefore, qtyAfter, changeAmount, note) => {
    const newTx = {
      id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
      item_name: itemName,
      user_name: currentUser ? currentUser.name : 'สมาชิกในบ้าน',
      action_type: actionType,
      qty_before: qtyBefore,
      qty_after: qtyAfter,
      change_amount: changeAmount,
      note: note || '',
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleQuickUseOne = (item) => {
    if (item.quantity <= 0) return;
    triggerHaptic();
    const newQty = item.quantity - 1;
    
    setItems(prev => prev.map(i => i.id === item.id ? { 
      ...i, 
      quantity: newQty, 
      updated_at: new Date().toISOString() 
    } : i));

    recordTransaction(item.name, 'USE', item.quantity, newQty, -1, 'กดปุ่ม "ใช้ 1"');
  };

  const handleUpdateQuantity = (item, delta) => {
    if (delta < 0 && item.quantity <= 0) return;
    triggerHaptic();
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

  const handleDeleteItem = (item) => {
    triggerHaptic();
    if (confirm(`คุณต้องการลบรายการ "${item.name}" ออกจากคลังสินค้าหรือไม่?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      recordTransaction(item.name, 'DELETE', item.quantity, 0, -item.quantity, 'ลบสินค้าออกจากระบบ');
    }
  };

  const handleTouchStart = (e, item) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentItem.current = item;
  };

  const handleTouchEnd = (e) => {
    if (!touchCurrentItem.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      if (diffX > 80 && touchCurrentItem.current.quantity > 0) {
        handleQuickUseOne(touchCurrentItem.current);
      } else if (diffX < -80) {
        openEditModal(touchCurrentItem.current);
      }
    }

    touchCurrentItem.current = null;
  };

  const handleBarcodeScanned = (scannedCode) => {
    setShowScannerModal(false);
    triggerHaptic([80, 40, 80]);

    const foundItem = items.find(i => i.barcode === scannedCode || i.id === scannedCode);

    if (foundItem) {
      setActiveTab('stock');
      setSearchQuery(foundItem.name);
      alert(`📷 พบสินค้า: "${foundItem.name}" (คงเหลือ ${foundItem.quantity} ${foundItem.unit})`);
    } else {
      resetForm();
      setFormBarcode(scannedCode);
      setShowAddModal(true);
      alert(`📷 สแกนพบรหัสบาร์โค้ดใหม่: ${scannedCode}\nกรุณากรอกชื่อสินค้าเพื่อบันทึกเข้าคลัง`);
    }
  };

  const handleSaveItemForm = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    triggerHaptic();

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
        barcode: formBarcode.trim(),
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
        barcode: formBarcode.trim(),
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
    setFormBarcode(item.barcode || '');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('ของใช้ส่วนตัว');
    setFormQuantity(1);
    setFormUnit('ชิ้น');
    setFormMinThreshold(1);
    setFormIcon('📦');
    setFormBarcode('');
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleAddManualShopping = (e) => {
    e.preventDefault();
    if (!shopItemName.trim()) return;
    triggerHaptic();

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
    triggerHaptic();
    setShoppingList(prev => prev.map(s => s.id === id ? { ...s, is_purchased: !s.is_purchased } : s));
  };

  const handleRestockPurchased = (shopItem) => {
    triggerHaptic([50, 50, 100]);
    triggerConfetti();

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
  };

  const handleSignOut = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      localStorage.removeItem('meeyoo_current_user');
      localStorage.removeItem('meeyoo_house_members_v3');
      localStorage.removeItem('meeyoo_items_v3');
      localStorage.removeItem('meeyoo_transactions_v3');
      localStorage.removeItem('meeyoo_shopping_v3');
      setCurrentUser(null);
      setMembers([]);
      setItems([]);
      setTransactions([]);
      setShoppingList([]);
      setAuthView('login');
    }
  };

  const handleHomeCreated = (newHouse) => {
    setHouse(newHouse);
    if (currentUser) {
      const ownerUser = { ...currentUser, role: 'เจ้าของบ้าน', avatar: '👨‍💻' };
      setCurrentUser(ownerUser);
      setMembers([ownerUser]);
    }
    setItems([]);
    setTransactions([]);
    setShoppingList([]);
    setAuthView('app');
  };

  const handleHomeJoined = (joinedHouse) => {
    setHouse(joinedHouse);
    if (currentUser) {
      const memberUser = { ...currentUser, role: 'สมาชิก', avatar: '👩‍🎨' };
      setCurrentUser(memberUser);
      setMembers(prev => {
        const exists = prev.some(m => m.email === memberUser.email);
        return exists ? prev : [...prev, memberUser];
      });
    }
    setAuthView('app');
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.barcode && item.barcode.includes(searchQuery));
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const categoriesList = useMemo(() => {
    const set = new Set(items.map(i => i.category));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const lowCount = items.filter(i => i.quantity <= i.min_threshold && i.quantity > 0).length;
    const outCount = items.filter(i => i.quantity === 0).length;
    const shoppingCount = shoppingList.filter(s => !s.is_purchased).length;

    return { total, lowCount, outCount, shoppingCount };
  }, [items, shoppingList]);

  // AUTH FLOW ROUTING
  if (authView === 'register') {
    return <Register onRegisterSuccess={(u) => { setCurrentUser(u); setAuthView('join_home'); }} onSwitchToLogin={() => setAuthView('login')} />;
  }

  if (authView === 'join_home') {
    return <JoinHome currentUser={currentUser} onJoinedSuccess={handleHomeJoined} onCreateHomeClick={() => setAuthView('create_home')} />;
  }

  if (authView === 'create_home') {
    return <CreateHome currentUser={currentUser} onCreateSuccess={handleHomeCreated} onJoinHomeClick={() => setAuthView('join_home')} />;
  }

  if (authView === 'login' || !currentUser) {
    return <Login onLoginSuccess={(u) => { setCurrentUser(u); setAuthView('app'); }} onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen relative pb-28 md:pb-8 pt-safe">
      {/* CONFETTI ANIMATION OVERLAY */}
      {confettiParticles.length > 0 && (
        <div className="confetti-container">
          {confettiParticles.map(p => (
            <div 
              key={p.id}
              className="confetti-particle"
              style={{
                left: p.left,
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                animationDelay: p.delay
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* PRODUCTION HEADER NAVBAR */}
      <header className="sticky top-0 z-30 bg-[#faf8f5]/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-[#e8e4df] dark:border-slate-800 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-600/20 shrink-0">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-stone-900 dark:text-white text-base leading-tight">MeeYoo</span>
                <div className="pulse-emerald" title="Real-time Sync Active"></div>
              </div>
              <div className="text-xs text-stone-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <span>{house.name}</span>
                <span className="text-[10px] bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-1.5 py-0.2 rounded font-mono">
                  {house.code}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* DARK / LIGHT MODE TOGGLE */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-full bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-amber-300 flex items-center justify-center text-sm shadow-xs transition"
              title={isDarkMode ? 'สลับเป็น Warm Light Mode' : 'สลับเป็น Warm Dark Mode'}
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {/* BARCODE SCANNER BUTTON */}
            <button 
              onClick={() => { triggerHaptic(); setShowScannerModal(true); }}
              className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm shadow-xs"
              title="สแกนบาร์โค้ดด้วยกล้องมือถือ"
            >
              <i className="fa-solid fa-barcode"></i>
            </button>

            {/* LOGGED IN USER PROFILE BADGE */}
            <div 
              onClick={() => setActiveTab('members')}
              className="flex items-center gap-1.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs cursor-pointer hover:border-emerald-500 shadow-inner transition"
              title="ดูโปรไฟล์สมาชิกร่วมบ้าน"
            >
              <span className="text-sm">{currentUser?.avatar || '👤'}</span>
              <span className="font-bold text-stone-800 dark:text-slate-200 hidden sm:inline text-[11px] truncate max-w-[80px]">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'สมาชิก'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="glass-card p-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-emerald-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{currentUser?.avatar || '👤'}</div>
                <div>
                  <div className="text-xs text-stone-500 dark:text-slate-400">เข้าสู่ระบบในชื่อ:</div>
                  <div className="font-bold text-stone-900 dark:text-white text-base">{currentUser?.name || 'สมาชิก'} ({currentUser?.role || 'เจ้าของบ้าน'})</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  triggerHaptic();
                  navigator.clipboard.writeText(house.code);
                  alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-share-nodes"></i> แชร์รหัสเชิญ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">📦 สินค้าทั้งหมด</span>
                  <i className="fa-solid fa-boxes-stacked text-emerald-600 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-stone-900 dark:text-white mt-1">{stats.total}</div>
                <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-0.5">รายการในบ้าน</div>
              </div>

              <div className="glass-card p-4 border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">⚠️ ใกล้หมด</span>
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-1">{stats.lowCount}</div>
                <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">น้อยกว่าขั้นต่ำ</div>
              </div>

              <div className="glass-card p-4 border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">🔴 หมดแล้ว</span>
                  <i className="fa-solid fa-circle-xmark text-rose-600 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-rose-800 dark:text-rose-300 mt-1">{stats.outCount}</div>
                <div className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">จำนวนคงเหลือ 0</div>
              </div>

              <div className="glass-card p-4 border-teal-200 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-700 dark:text-teal-400 font-medium">🛒 รายการซื้อ</span>
                  <i className="fa-solid fa-cart-shopping text-teal-600 text-sm"></i>
                </div>
                <div className="font-heading text-2xl font-extrabold text-teal-800 dark:text-teal-300 mt-1">{stats.shoppingCount}</div>
                <div className="text-[10px] text-teal-700/80 dark:text-teal-400/80 mt-0.5">ต้องซื้อเข้าบ้าน</div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-layer-group text-emerald-600"></i>
                  <span>รายการสินค้าในบ้าน</span>
                </h3>
                <button 
                  onClick={() => { triggerHaptic(); setActiveTab('stock'); }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  ดูทั้งหมด ({items.length}) <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
                </button>
              </div>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 dark:text-slate-500 space-y-2">
                    <i className="fa-solid fa-box-open text-3xl text-stone-300 dark:text-slate-600"></i>
                    <p className="text-xs">ยังไม่มีสินค้าในบ้านหลังนี้</p>
                    <button 
                      onClick={() => { resetForm(); setShowAddModal(true); }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      + กดเพิ่มสินค้าใหม่เข้าคลัง
                    </button>
                  </div>
                ) : (
                  items.slice(0, 5).map(item => {
                    const isOut = item.quantity === 0;
                    const isLow = item.quantity <= item.min_threshold && !isOut;
                    const gaugePct = Math.min(100, Math.round((item.quantity / (item.min_threshold * 2)) * 100));

                    return (
                      <div key={item.id} className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-xs">
                              {item.icon || '📦'}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-sm text-stone-900 dark:text-white truncate">{item.name}</div>
                              <div className="text-[11px] text-stone-500 dark:text-slate-400 flex items-center gap-2">
                                <span>{item.category}</span>
                                <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-normal'}`}>
                                  {isOut ? '🔴 หมด' : isLow ? '⚠️ ใกล้หมด' : 'ปกติ'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="font-heading font-extrabold text-lg text-stone-900 dark:text-white">{item.quantity}</span>
                              <span className="text-xs text-stone-500 dark:text-slate-400 ml-1">{item.unit}</span>
                            </div>

                            <button 
                              onClick={() => handleQuickUseOne(item)}
                              disabled={isOut}
                              className="btn-use-one text-xs px-3 py-1.5"
                            >
                              <i className="fa-solid fa-hand-holding"></i> ใช้ 1
                            </button>
                          </div>
                        </div>

                        {/* VISUAL PROGRESS GAUGE BAR */}
                        <div className="w-full bg-stone-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${gaugePct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
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
                  onClick={() => { triggerHaptic(); setShowScannerModal(true); }}
                  className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <i className="fa-solid fa-barcode text-sm"></i> สแกน
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { triggerHaptic(); setSelectedCategory(cat); }}
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
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                <i className="fa-solid fa-cart-plus text-emerald-600"></i>
                <span>เพิ่มรายการซื้อของด้วยตัวเอง</span>
              </h3>

              <form onSubmit={handleAddManualShopping} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ชื่อสินค้าที่จะซื้อ..."
                  value={shopItemName}
                  onChange={e => setShopItemName(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <input 
                  type="number" 
                  min="1"
                  placeholder="จำนวน"
                  value={shopItemQty}
                  onChange={e => setShopItemQty(e.target.value)}
                  className="w-16 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-stone-900 dark:text-white text-center focus:outline-none focus:border-emerald-500"
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                >
                  <i className="fa-solid fa-plus"></i> เพิ่ม
                </button>
              </form>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white mb-3 flex items-center justify-between">
                <span>🛒 รายการของที่ต้องซื้อเข้าบ้าน</span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400">ดึงของใกล้หมดให้อัตโนมัติ</span>
              </h3>

              <div className="space-y-2.5">
                {shoppingList.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 dark:text-slate-500 text-xs">
                    <i className="fa-solid fa-basket-shopping text-2xl mb-2 text-stone-300 dark:text-slate-600"></i>
                    <p>ไม่มีรายการที่ต้องซื้อ สินค้าในบ้านยังมีเพียงพอ!</p>
                  </div>
                ) : (
                  shoppingList.map(item => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${item.is_purchased ? 'bg-stone-50 dark:bg-slate-900/60 border-stone-200 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 shadow-xs'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button 
                          onClick={() => toggleShoppingPurchased(item.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${item.is_purchased ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 text-transparent'}`}
                        >
                          <i className="fa-solid fa-check text-xs"></i>
                        </button>
                        <div className="overflow-hidden">
                          <div className={`font-bold text-sm truncate ${item.is_purchased ? 'line-through text-stone-400 dark:text-slate-500' : 'text-stone-900 dark:text-white'}`}>
                            {item.item_name}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-slate-400">
                            {item.auto_added ? '⚡ แจ้งเตือนของใกล้หมด' : '📝 เพิ่มเอง'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-xs text-stone-700 dark:text-slate-300">ต้องซื้อ: {item.quantity_needed}</span>
                        {item.is_purchased && (
                          <button 
                            onClick={() => handleRestockPurchased(item)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs animate-bounce"
                          >
                            <i className="fa-solid fa-box-archive"></i> เติมเข้า Stock 🎉
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
            <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-emerald-600"></i>
              <span>ประวัติการเปลี่ยนแปลง Stock ทั้งหมด</span>
            </h3>

            <div className="relative pl-5 border-l-2 border-stone-200 dark:border-slate-700 space-y-4">
              {transactions.length === 0 ? (
                <p className="text-xs text-stone-400 dark:text-slate-500 py-3">ยังไม่มีบันทึกประวัติกิจกรรมในบ้านนี้</p>
              ) : (
                transactions.map(tx => {
                  const isAdd = tx.action_type === 'ADD' || tx.action_type === 'RESTOCK';
                  const isUse = tx.action_type === 'USE';
                  const dotColor = isAdd ? 'bg-emerald-600' : isUse ? 'bg-amber-600' : 'bg-rose-600';

                  return (
                    <div key={tx.id} className="relative bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl p-3 text-xs space-y-1 shadow-xs">
                      <div className={`absolute -left-[27px] top-4 w-3 h-3 rounded-full ${dotColor} border-2 border-white dark:border-slate-900`}></div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-white text-sm">
                          {tx.item_name}
                          <span className={`ml-2 text-[10px] px-2 py-0.2 rounded-full font-bold ${isAdd ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : isUse ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                            {tx.change_amount > 0 ? `+${tx.change_amount}` : tx.change_amount}
                          </span>
                        </span>
                        <span className="text-[10px] text-stone-400 dark:text-slate-500 font-mono">
                          {new Date(tx.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-stone-500 dark:text-slate-400">
                        กระทำโดย: <strong className="text-stone-800 dark:text-slate-200">{tx.user_name}</strong> ({tx.qty_before} → {tx.qty_after}) {tx.note && `• ${tx.note}`}
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
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-house-user text-emerald-600"></i>
                  <span>ข้อมูลบ้าน ({house.name})</span>
                </div>
                <button 
                  onClick={() => setAuthView('join_home')}
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                >
                  ย้าย/เปลี่ยนบ้าน
                </button>
              </h3>

              <div className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">Invitation Code (รหัสเชิญ)</div>
                  <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">{house.code}</div>
                </div>
                <button 
                  onClick={() => {
                    triggerHaptic();
                    navigator.clipboard.writeText(house.code);
                    alert(`คัดลอกรหัสเชิญ ${house.code} เรียบร้อย!`);
                  }}
                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs"
                >
                  <i className="fa-solid fa-copy"></i> คัดลอกรหัส
                </button>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white mb-3 flex items-center justify-between">
                <span>สมาชิกร่วมบ้าน ({members.length} คน)</span>
                <button 
                  onClick={handleSignOut}
                  className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> ออกจากระบบ
                </button>
              </h3>

              <div className="space-y-2">
                {members.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-slate-500 py-2">ยังไม่มีข้อมูลสมาชิก</p>
                ) : (
                  members.map((mem) => (
                    <div key={mem.id || mem.email || mem.user_email} className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 shadow-xs">
                      <div className="text-2xl">{mem.avatar || '👤'}</div>
                      <div className="flex-1">
                        <div className="font-bold text-stone-900 dark:text-white text-xs flex items-center gap-2">
                          {mem.name || mem.user_name}
                          {(mem.email === currentUser?.email || mem.user_email === currentUser?.email) && (
                            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                              บัญชีของคุณ ({mem.role || 'เจ้าของบ้าน'})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-slate-400">{mem.email || mem.user_email} • {mem.role || 'สมาชิก'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card p-4 space-y-3">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                <span>สถานะการเชื่อมระบบคลาวด์ (Automatic Realtime Cloud)</span>
              </h3>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl text-xs space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check"></i> เชื่อมต่อ Supabase Cloud อัตโนมัติพร้อมใช้งาน 100%
                </div>
                <p className="text-stone-600 dark:text-slate-400 text-[11px]">
                  ผู้ใช้ทั่วไปสามารถใช้งานตัดสต็อกและซิงค์ข้อมูลผ่านคลาวด์ได้ทันที โดยไม่ต้องตั้งค่าทางเทคนิคใดๆ
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <button 
        onClick={() => { triggerHaptic(); resetForm(); setShowAddModal(true); }}
        className="fixed right-5 bottom-20 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white text-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center active:scale-95 transition"
        title="เพิ่มสินค้าใหม่เข้าคลัง"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 h-16">
          <button 
            onClick={() => { triggerHaptic(); setActiveTab('dashboard'); }}
            className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-chart-pie text-lg mb-1"></i>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => { triggerHaptic(); setActiveTab('stock'); }}
            className={`bottom-nav-item ${activeTab === 'stock' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-boxes-stacked text-lg mb-1"></i>
            <span>Stock</span>
          </button>

          <button 
            onClick={() => { triggerHaptic(); setActiveTab('shopping'); }}
            className={`bottom-nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
          >
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-lg mb-1"></i>
              {stats.shoppingCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {stats.shoppingCount}
                </span>
              )}
            </div>
            <span>Shopping</span>
          </button>

          <button 
            onClick={() => { triggerHaptic(); setActiveTab('history'); }}
            className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-clock-rotate-left text-lg mb-1"></i>
            <span>History</span>
          </button>

          <button 
            onClick={() => { triggerHaptic(); setActiveTab('members'); }}
            className={`bottom-nav-item ${activeTab === 'members' || activeTab === 'settings' ? 'active' : ''}`}
          >
            <i className="fa-solid fa-users text-lg mb-1"></i>
            <span>Members</span>
          </button>
        </div>
      </nav>

      {/* BARCODE SCANNER MODAL */}
      <BarcodeScannerModal 
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleBarcodeScanned}
      />

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
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
                    onClick={() => { setShowAddModal(false); setShowScannerModal(true); }}
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
      )}
    </div>
  );
}
