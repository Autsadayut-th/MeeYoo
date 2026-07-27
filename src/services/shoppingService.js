import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const shoppingService = {
  async fetchShoppingList(homeId) {
    const validHomeId = ensureUUID(homeId);
    let cloudList = null;

    if (supabase) {
      try {
        await homeService.ensureHomeExists(validHomeId);
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('home_id', validHomeId);

        if (!error && data) {
          cloudList = data;
        }
      } catch (e) {
        console.warn("Supabase fetchShoppingList warning:", e);
      }
    }

    if (cloudList && cloudList.length > 0) {
      try {
        localStorage.setItem('meeyoo_shopping_v3', JSON.stringify(cloudList));
      } catch (e) {}
      return cloudList;
    }

    try {
      const saved = localStorage.getItem('meeyoo_shopping_v3');
      const localList = saved ? JSON.parse(saved) : [];
      if (localList.length > 0 && supabase) {
        for (const item of localList) {
          await this.saveShoppingItem(item, validHomeId);
        }
        const { data } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('home_id', validHomeId);
        if (data && data.length > 0) return data;
      }
      return localList;
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
