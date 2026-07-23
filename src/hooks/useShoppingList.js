import { useState, useEffect } from 'react';
import { shoppingService } from '../services/shoppingService';

export function useShoppingList(homeId) {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    shoppingService.fetchShoppingList(homeId).then(data => setShoppingList(data));
  }, [homeId]);

  return { shoppingList, setShoppingList };
}
