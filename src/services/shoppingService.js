import { supabase } from './supabaseClient';

export const shoppingService = {
  async fetchShoppingList(homeId) {
    if (!supabase) {
      const saved = localStorage.getItem('meeyoo_shopping_v2');
      return saved ? JSON.parse(saved) : [];
    }
    const { data, error } = await supabase.from('shopping_list').select('*').eq('home_id', homeId);
    if (error) throw error;
    return data;
  }
};
