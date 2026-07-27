import { useState, useEffect, useCallback } from 'react';
import { shoppingService } from '../services/shoppingService';

export function useShoppingList(homeId) {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadShoppingList = useCallback(async () => {
    if (!homeId) return;
    setLoading(true);
    try {
      const data = await shoppingService.fetchShoppingList(homeId);
      if (Array.isArray(data)) {
        setShoppingList(data);
      }
    } catch (e) {
      console.warn("useShoppingList fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const saveShoppingItem = async (item) => {
    if (!homeId) return null;
    const fresh = await shoppingService.saveShoppingItem(item, homeId);
    if (Array.isArray(fresh) && fresh.length > 0) {
      setShoppingList(fresh);
    }
    return fresh;
  };

  const togglePurchased = async (item) => {
    if (!homeId) return;
    const updated = { ...item, is_purchased: !item.is_purchased };
    setShoppingList(prev => prev.map(i => i.id === item.id ? updated : i));
    await shoppingService.saveShoppingItem(updated, homeId);
  };

  const deleteShoppingItem = async (itemId) => {
    if (!homeId) return null;
    setShoppingList(prev => prev.filter(i => i.id !== itemId));
    const fresh = await shoppingService.deleteShoppingItem(itemId, homeId);
    if (Array.isArray(fresh)) {
      setShoppingList(fresh);
    }
    return fresh;
  };

  return {
    shoppingList,
    setShoppingList,
    loading,
    loadShoppingList,
    saveShoppingItem,
    togglePurchased,
    deleteShoppingItem
  };
}
