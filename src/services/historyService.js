import { supabase } from './supabaseClient';

export const historyService = {
  async fetchHistory(homeId) {
    if (!supabase) {
      const saved = localStorage.getItem('meeyoo_transactions_v2');
      return saved ? JSON.parse(saved) : [];
    }
    const { data, error } = await supabase.from('stock_transactions').select('*').eq('home_id', homeId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
