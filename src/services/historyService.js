import { supabase } from './supabaseClient';

export const historyService = {
  async fetchHistory(homeId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('stock_transactions')
          .select('*')
          .eq('home_id', homeId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase fetchHistory fallback to local:", e);
      }
    }
    const saved = localStorage.getItem('meeyoo_transactions_v3');
    return saved ? JSON.parse(saved) : [];
  },

  async addTransaction(tx, homeId) {
    if (supabase) {
      try {
        await supabase.from('stock_transactions').insert([{
          id: tx.id,
          home_id: homeId,
          item_name: tx.item_name,
          user_name: tx.user_name,
          action_type: tx.action_type,
          qty_before: tx.qty_before,
          qty_after: tx.qty_after,
          change_amount: tx.change_amount,
          note: tx.note || ''
        }]);
      } catch (e) {
        console.warn("Supabase addTransaction fallback to local:", e);
      }
    }
  },

  subscribeToHistory(homeId, onUpdate) {
    if (!supabase) return null;
    try {
      const channel = supabase
        .channel(`public:stock_transactions:${homeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions', filter: `home_id=eq.${homeId}` }, () => {
          this.fetchHistory(homeId).then(list => onUpdate(list));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
