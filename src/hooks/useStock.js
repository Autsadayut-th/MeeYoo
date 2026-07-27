import { useState, useEffect, useCallback } from 'react';
import { stockService } from '../services/stockService';

export function useStock(homeId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    if (!homeId) return;
    setLoading(true);
    try {
      const data = await stockService.fetchItems(homeId);
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (e) {
      console.warn("useStock fetchItems error:", e);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const saveItem = async (item) => {
    if (!homeId) return null;
    const fresh = await stockService.saveItem(item, homeId);
    if (Array.isArray(fresh) && fresh.length > 0) {
      setItems(fresh);
    }
    return fresh;
  };

  const deleteItem = async (itemId) => {
    if (!homeId) return null;
    setItems(prev => prev.filter(i => i.id !== itemId));
    const fresh = await stockService.deleteItem(itemId, homeId);
    if (Array.isArray(fresh)) {
      setItems(fresh);
    }
    return fresh;
  };

  const updateQuantity = async (item, delta) => {
    if (!homeId) return;
    const newQty = Math.max(0, item.quantity + delta);
    const updated = { ...item, quantity: newQty, updated_at: new Date().toISOString() };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    await stockService.saveItem(updated, homeId);
  };

  const quickUseOne = async (item) => {
    if (item.quantity <= 0 || !homeId) return;
    const newQty = item.quantity - 1;
    const updated = { ...item, quantity: newQty, updated_at: new Date().toISOString() };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    await stockService.saveItem(updated, homeId);
  };

  return {
    items,
    setItems,
    loading,
    loadItems,
    saveItem,
    deleteItem,
    updateQuantity,
    quickUseOne
  };
}
