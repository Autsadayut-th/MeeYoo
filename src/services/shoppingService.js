import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const shoppingService = {
  async fetchShoppingList(homeId) {
    const validHomeId = ensureUUID(homeId);

    if (supabase) {
      try {
        await homeService.ensureHomeExists(validHomeId);
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('home_id', validHomeId);

        if (!error && Array.isArray(data)) {
          if (data.length === 0) {
            try {
              const saved = localStorage.getItem('meeyoo_shopping_v3');
              const localList = saved ? JSON.parse(saved) : [];
              if (localList.length > 0) {
                for (const item of localList) {
                  await this.saveShoppingItem(item, validHomeId);
                }
                localStorage.removeItem('meeyoo_shopping_v3');
                const { data: freshData } = await supabase
                  .from('shopping_list')
                  .select('*')
                  .eq('home_id', validHomeId);
                if (freshData) return freshData;
              }
            } catch (e) {}
          }
          return data;
        }
      } catch (e) {
        console.warn("Supabase fetchShoppingList warning:", e);
      }
    }

    try {
      const saved = localStorage.getItem('meeyoo_shopping_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  async saveShoppingItem(item, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validItemId = ensureUUID(item.id);

        await homeService.ensureHomeExists(validHomeId);

        const qtyNeeded = Number(item.quantity_needed);

        const { error } = await supabase.from('shopping_list').upsert([{
          id: validItemId,
          home_id: validHomeId,
          item_name: item.item_name,
          quantity_needed: isNaN(qtyNeeded) ? 1 : Math.max(1, qtyNeeded),
          is_purchased: Boolean(item.is_purchased),
          auto_added: Boolean(item.auto_added)
        }]);
        if (error) console.error("Supabase saveShoppingItem error:", error.message);
      } catch (e) {
        console.warn("Supabase saveShoppingItem warning:", e);
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
        console.warn("Supabase deleteShoppingItem warning:", e);
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
