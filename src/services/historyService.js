import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const historyService = {
  async fetchHistory(homeId) {
    if (supabase) {
      const validHomeId = ensureUUID(homeId);
      try {
        const { data, error } = await supabase
          .from('stock_transactions')
          .select('*')
          .eq('home_id', validHomeId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase fetchHistory fallback to local:", e);
      }
    }
    try {
      const saved = localStorage.getItem('meeyoo_transactions_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  async addTransaction(tx, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validTxId = ensureUUID(tx.id);

        await homeService.ensureHomeExists(validHomeId);

        const qBefore = Number(tx.qty_before);
        const qAfter = Number(tx.qty_after);
        const qChange = Number(tx.change_amount);

        const { error } = await supabase.from('stock_transactions').insert([{
          id: validTxId,
          home_id: validHomeId,
          item_name: tx.item_name,
          user_name: tx.user_name,
          action_type: tx.action_type,
          qty_before: isNaN(qBefore) ? 0 : qBefore,
          qty_after: isNaN(qAfter) ? 0 : qAfter,
          change_amount: isNaN(qChange) ? 0 : qChange,
          note: tx.note || ''
        }]);
        if (error) console.error("Supabase addTransaction error:", error.message);
      } catch (e) {
        console.warn("Supabase addTransaction fallback to local:", e);
      }
    }
  },

  subscribeToHistory(homeId, onUpdate) {
    if (!supabase) return null;
    const validHomeId = ensureUUID(homeId);
    try {
      const channel = supabase
        .channel(`public:stock_transactions:${validHomeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `home_id=eq.${validHomeId}` }, () => {
          this.fetchHistory(validHomeId).then(list => onUpdate(list));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
