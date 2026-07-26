import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarcodeScannerModal } from './components/stock/BarcodeScannerModal';
import { AddEditStockModal } from './components/stock/AddEditStockModal';
import { InviteModal } from './components/home/InviteModal';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { JoinHome } from './pages/JoinHome';
import { CreateHome } from './pages/CreateHome';

import { DashboardView } from './pages/DashboardView';
import { StockView } from './pages/StockView';
import { ShoppingView } from './pages/ShoppingView';
import { HistoryView } from './pages/HistoryView';
import { MembersView } from './pages/MembersView';

import { homeService } from './services/homeService';
import { stockService } from './services/stockService';
import { historyService } from './services/historyService';
import { shoppingService } from './services/shoppingService';
import { supabase } from './services/supabaseClient';

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

  // Real Production State
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
  const [showInviteModal, setShowInviteModal] = useState(false);
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

  // Listen for Supabase Google OAuth Redirect Sign-In Session Return
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email || 'google.user@gmail.com',
            name: u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : 'Google User'),
            avatar: '👨‍💻'
          };
          setCurrentUser(userObj);
          setAuthView('app');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email || 'google.user@gmail.com',
            name: u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : 'Google User'),
            avatar: '👨‍💻'
          };
          setCurrentUser(userObj);
          setAuthView('app');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

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

  // Initial Fetch & Supabase Realtime Websocket Subscriptions for Multi-device Sync!
  useEffect(() => {
    if (house && house.id) {
      stockService.fetchItems(house.id).then(cloudItems => {
        if (cloudItems) setItems(cloudItems);
      });
      historyService.fetchHistory(house.id).then(cloudHistory => {
        if (cloudHistory) setTransactions(cloudHistory);
      });
      shoppingService.fetchShoppingList(house.id).then(cloudShopping => {
        if (cloudShopping) setShoppingList(cloudShopping);
      });
      homeService.fetchMembers(house.id).then(fetched => {
        if (fetched && fetched.length > 0) {
          setMembers(fetched);
        } else if (currentUser && currentUser.email) {
          const userWithRole = { ...currentUser, role: currentUser.role || 'เจ้าของบ้าน' };
          setMembers([userWithRole]);
        }
      });

      const subItems = stockService.subscribeToItems(house.id, (newItems) => setItems(newItems));
      const subTx = historyService.subscribeToHistory(house.id, (newTx) => setTransactions(newTx));
      const subShop = shoppingService.subscribeToShopping(house.id, (newShop) => setShoppingList(newShop));

      return () => {
        if (subItems) subItems.unsubscribe();
        if (subTx) subTx.unsubscribe();
        if (subShop) subShop.unsubscribe();
      };
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
    historyService.addTransaction(newTx, house.id);
  };

  const handleQuickUseOne = (item) => {
    if (item.quantity <= 0) return;
    triggerHaptic();
    const newQty = item.quantity - 1;
    const updated = { ...item, quantity: newQty, updated_at: new Date().toISOString() };
    
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    stockService.saveItem(updated, house.id);

    recordTransaction(item.name, 'USE', item.quantity, newQty, -1, 'กดปุ่ม "ใช้ 1"');
  };

  const handleUpdateQuantity = (item, delta) => {
    if (delta < 0 && item.quantity <= 0) return;
    triggerHaptic();
    const newQty = Math.max(0, item.quantity + delta);
    const updated = { ...item, quantity: newQty, updated_at: new Date().toISOString() };

    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    stockService.saveItem(updated, house.id);

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
      stockService.deleteItem(item.id);
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
      const updated = {
        ...editingItem,
        name: formName.trim(),
        category: formCategory,
        quantity: newQty,
        unit: formUnit,
        min_threshold: Number(formMinThreshold),
        icon: formIcon,
        barcode: formBarcode.trim(),
        updated_at: new Date().toISOString()
      };
      setItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      stockService.saveItem(updated, house.id);

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
      stockService.saveItem(newItem, house.id);
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
    shoppingService.saveShoppingItem(newShopItem, house.id);
    setShopItemName('');
    setShopItemQty(1);
  };

  const toggleShoppingPurchased = (id) => {
    triggerHaptic();
    setShoppingList(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, is_purchased: !s.is_purchased };
        shoppingService.saveShoppingItem(updated, house.id);
        return updated;
      }
      return s;
    }));
  };

  const handleRestockPurchased = (shopItem) => {
    triggerHaptic([50, 50, 100]);
    triggerConfetti();

    const existing = items.find(i => i.id === shopItem.item_id || i.name.toLowerCase() === shopItem.item_name.toLowerCase());

    if (existing) {
      const qtyBefore = existing.quantity;
      const qtyAfter = existing.quantity + shopItem.quantity_needed;
      const updated = { 
        ...existing, 
        quantity: qtyAfter,
        updated_at: new Date().toISOString() 
      };

      setItems(prev => prev.map(i => i.id === existing.id ? updated : i));
      stockService.saveItem(updated, house.id);

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
      stockService.saveItem(newItem, house.id);
      recordTransaction(newItem.name, 'RESTOCK', 0, shopItem.quantity_needed, shopItem.quantity_needed, 'เพิ่มเข้าคลังจากการซื้อของใหม่');
    }

    setShoppingList(prev => prev.filter(s => s.id !== shopItem.id));
    shoppingService.deleteShoppingItem(shopItem.id);
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

      {/* MODULAR HEADER COMPONENT */}
      <Header 
        house={house}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenScanner={() => setShowScannerModal(true)}
        currentUser={currentUser}
        onSelectMembersTab={() => setActiveTab('members')}
        triggerHaptic={triggerHaptic}
      />

      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardView 
            currentUser={currentUser}
            house={house}
            stats={stats}
            items={items}
            setActiveTab={setActiveTab}
            resetForm={resetForm}
            setShowAddModal={setShowAddModal}
            handleQuickUseOne={handleQuickUseOne}
            onOpenInviteModal={() => setShowInviteModal(true)}
            triggerHaptic={triggerHaptic}
          />
        )}

        {activeTab === 'stock' && (
          <StockView 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowScannerModal={setShowScannerModal}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoriesList={categoriesList}
            filteredItems={filteredItems}
            resetForm={resetForm}
            setShowAddModal={setShowAddModal}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            openEditModal={openEditModal}
            handleDeleteItem={handleDeleteItem}
            handleQuickUseOne={handleQuickUseOne}
            handleUpdateQuantity={handleUpdateQuantity}
            triggerHaptic={triggerHaptic}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingView 
            shopItemName={shopItemName}
            setShopItemName={setShopItemName}
            shopItemQty={shopItemQty}
            setShopItemQty={setShopItemQty}
            handleAddManualShopping={handleAddManualShopping}
            shoppingList={shoppingList}
            toggleShoppingPurchased={toggleShoppingPurchased}
            handleRestockPurchased={handleRestockPurchased}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView transactions={transactions} />
        )}

        {(activeTab === 'members' || activeTab === 'settings') && (
          <MembersView 
            house={house}
            setAuthView={setAuthView}
            currentUser={currentUser}
            members={members}
            handleSignOut={handleSignOut}
            onOpenInviteModal={() => setShowInviteModal(true)}
            triggerHaptic={triggerHaptic}
          />
        )}
      </main>

      {/* QUICK FLOATING ADD BUTTON */}
      <button 
        onClick={() => { triggerHaptic(); resetForm(); setShowAddModal(true); }}
        className="fixed right-5 bottom-20 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white text-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center active:scale-95 transition"
        title="เพิ่มสินค้าใหม่เข้าคลัง"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      {/* MODULAR BOTTOM NAVIGATION */}
      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shoppingCount={stats.shoppingCount}
        triggerHaptic={triggerHaptic}
      />

      {/* HOUSEHOLD INVITE MODAL (QR CODE & SHARE LINK) */}
      <InviteModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        house={house}
      />

      {/* BARCODE SCANNER MODAL */}
      <BarcodeScannerModal 
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleBarcodeScanned}
      />

      {/* ADD / EDIT STOCK ITEM MODAL */}
      <AddEditStockModal 
        isOpen={showAddModal}
        editingItem={editingItem}
        resetForm={resetForm}
        handleSaveItemForm={handleSaveItemForm}
        formName={formName}
        setFormName={setFormName}
        formBarcode={formBarcode}
        setFormBarcode={setFormBarcode}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formUnit={formUnit}
        setFormUnit={setFormUnit}
        formQuantity={formQuantity}
        setFormQuantity={setFormQuantity}
        formMinThreshold={formMinThreshold}
        setFormMinThreshold={setFormMinThreshold}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
        onOpenScanner={() => { setShowAddModal(false); setShowScannerModal(true); }}
      />
    </div>
  );
}
