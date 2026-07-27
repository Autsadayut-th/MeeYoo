import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const stockService = {
  async fetchItems(homeId) {
    const validHomeId = ensureUUID(homeId);
    let cloudItems = null;

    if (supabase) {
      try {
        await homeService.ensureHomeExists(validHomeId);
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('home_id', validHomeId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          cloudItems = data;
        } else if (error) {
          console.error("Supabase fetchItems error:", error.message);
        }
      } catch (e) {
        console.warn("Supabase fetchItems warning:", e);
      }
    }

    if (cloudItems && cloudItems.length > 0) {
      try {
        localStorage.setItem('meeyoo_items_v3', JSON.stringify(cloudItems));
      } catch (e) {}
      return cloudItems;
    }

    // Auto-sync migration: If Cloud has 0 items but LocalStorage has local items, push local items to Supabase Cloud!
    try {
      const saved = localStorage.getItem('meeyoo_items_v3');
      const localItems = saved ? JSON.parse(saved) : [];
      if (localItems.length > 0 && supabase) {
        for (const item of localItems) {
          await this.saveItem(item, validHomeId);
        }
        const { data } = await supabase
          .from('items')
          .select('*')
          .eq('home_id', validHomeId)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) return data;
      }
      return localItems;
    } catch (e) {
      return [];
    }
  },

  async saveItem(item, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validItemId = ensureUUID(item.id);

        // Ensure home row exists in Supabase DB to prevent FK violation error
        await homeService.ensureHomeExists(validHomeId);

        const qty = Number(item.quantity);
        const minThresh = Number(item.min_threshold);

        const payload = {
          id: validItemId,
          home_id: validHomeId,
          name: item.name,
          category: item.category,
          quantity: isNaN(qty) ? 1 : Math.max(0, qty),
          unit: item.unit,
          min_threshold: isNaN(minThresh) ? 1 : Math.max(0, minThresh),
          icon: item.icon || '📦',
          image_url: item.image_url || '',
          barcode: item.barcode || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('items').upsert([payload]);
        if (error) {
          console.error("Supabase saveItem Error:", error.message, error.details);
        } else {
          console.log("Supabase saveItem Success:", item.name);
        }
      } catch (e) {
        console.warn("Supabase saveItem fallback to local:", e);
      }
    }
  },

  async deleteItem(itemId) {
    if (supabase) {
      const validItemId = ensureUUID(itemId);
      try {
        const { error } = await supabase.from('items').delete().eq('id', validItemId);
        if (error) console.error("Supabase deleteItem error:", error.message);
      } catch (e) {
        console.warn("Supabase deleteItem fallback to local:", e);
      }
    }
  },

  subscribeToItems(homeId, onUpdate) {
    if (!supabase) return null;
    const validHomeId = ensureUUID(homeId);
    try {
      const channel = supabase
        .channel(`public:items:${validHomeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `home_id=eq.${validHomeId}` }, () => {
          this.fetchItems(validHomeId).then(items => onUpdate(items));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
