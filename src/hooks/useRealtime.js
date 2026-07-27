import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ensureUUID } from '../utils/constants';

export function useRealtime({ houseId, onItemsChange, onShoppingChange, onHistoryChange, onMembersChange }) {
  useEffect(() => {
    if (!supabase || !houseId) return;
    const validHomeId = ensureUUID(houseId);

    // Items Channel
    const itemsChannel = supabase
      .channel(`realtime:items:${validHomeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `home_id=eq.${validHomeId}` }, (payload) => {
        if (onItemsChange) onItemsChange(payload);
      })
      .subscribe();

    // Shopping List Channel
    const shoppingChannel = supabase
      .channel(`realtime:shopping:${validHomeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list', filter: `home_id=eq.${validHomeId}` }, (payload) => {
        if (onShoppingChange) onShoppingChange(payload);
      })
      .subscribe();

    // History Channel
    const historyChannel = supabase
      .channel(`realtime:history:${validHomeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `home_id=eq.${validHomeId}` }, (payload) => {
        if (onHistoryChange) onHistoryChange(payload);
      })
      .subscribe();

    // Members Channel
    const membersChannel = supabase
      .channel(`realtime:members:${validHomeId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'home_members', filter: `home_id=eq.${validHomeId}` }, (payload) => {
        if (onMembersChange) onMembersChange(payload);
      })
      .subscribe();

    return () => {
      if (itemsChannel) itemsChannel.unsubscribe();
      if (shoppingChannel) shoppingChannel.unsubscribe();
      if (historyChannel) historyChannel.unsubscribe();
      if (membersChannel) membersChannel.unsubscribe();
    };
  }, [houseId, onItemsChange, onShoppingChange, onHistoryChange, onMembersChange]);
}
