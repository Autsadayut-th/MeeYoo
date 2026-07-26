import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const shoppingService = {
  async fetchShoppingList(homeId) {
    if (supabase) {
      const validHomeId = ensureUUID(homeId);
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('home_id', validHomeId);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase fetchShoppingList fallback to local:", e);
      }
    }
    const saved = localStorage.getItem('meeyoo_shopping_v3');
    return saved ? JSON.parse(saved) : [];
  },

  async saveShoppingItem(item, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validItemId = ensureUUID(item.id);

        await homeService.ensureHomeExists(validHomeId);

        const { error } = await supabase.from('shopping_list').upsert([{
          id: validItemId,
          home_id: validHomeId,
          item_name: item.item_name,
          quantity_needed: Number(item.quantity_needed),
          is_purchased: Boolean(item.is_purchased),
          auto_added: Boolean(item.auto_added)
        }]);
        if (error) console.error("Supabase saveShoppingItem error:", error.message);
      } catch (e) {
        console.warn("Supabase saveShoppingItem fallback to local:", e);
      }
    }
  },

  async deleteShoppingItem(itemId) {
    if (supabase) {
      const validItemId = ensureUUID(itemId);
      try {
        const { error } = await supabase.from('shopping_list').delete().eq('id', validItemId);
        if (error) console.error("Supabase deleteShoppingItem error:", error.message);
      } catch (e) {
        console.warn("Supabase deleteShoppingItem fallback to local:", e);
      }
    }
  },

  subscribeToShopping(homeId, onUpdate) {
    if (!supabase) return null;
    const validHomeId = ensureUUID(homeId);
    try {
      const channel = supabase
        .channel(`public:shopping_list:${validHomeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list', filter: `home_id=eq.${validHomeId}` }, () => {
          this.fetchShoppingList(validHomeId).then(list => onUpdate(list));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
