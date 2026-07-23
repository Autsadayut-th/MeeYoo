import { supabase } from './supabaseClient';

export const shoppingService = {
  async fetchShoppingList(homeId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('home_id', homeId);
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
        await supabase.from('shopping_list').upsert([{
          id: item.id,
          home_id: homeId,
          item_name: item.item_name,
          quantity_needed: item.quantity_needed,
          is_purchased: item.is_purchased,
          auto_added: item.auto_added
        }]);
      } catch (e) {
        console.warn("Supabase saveShoppingItem fallback to local:", e);
      }
    }
  },

  async deleteShoppingItem(itemId) {
    if (supabase) {
      try {
        await supabase.from('shopping_list').delete().eq('id', itemId);
      } catch (e) {
        console.warn("Supabase deleteShoppingItem fallback to local:", e);
      }
    }
  },

  subscribeToShopping(homeId, onUpdate) {
    if (!supabase) return null;
    try {
      const channel = supabase
        .channel(`public:shopping_list:${homeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list', filter: `home_id=eq.${homeId}` }, () => {
          this.fetchShoppingList(homeId).then(list => onUpdate(list));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
