import { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';

export function useStock(homeId) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    stockService.fetchItems(homeId).then(data => setItems(data));
  }, [homeId]);

  return { items, setItems };
}
