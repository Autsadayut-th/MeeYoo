import { supabase } from './supabaseClient';

export const stockService = {
  async fetchItems(homeId) {
    if (!supabase) {
      const saved = localStorage.getItem('meeyoo_items_v2');
      return saved ? JSON.parse(saved) : [];
    }
    const { data, error } = await supabase.from('items').select('*').eq('home_id', homeId);
    if (error) throw error;
    return data;
  }
};
