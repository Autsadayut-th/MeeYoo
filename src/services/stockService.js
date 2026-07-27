import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const stockService = {
  async fetchItems(homeId) {
    const validHomeId = ensureUUID(homeId);

    if (supabase) {
      try {
        await homeService.ensureHomeExists(validHomeId);
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('home_id', validHomeId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          // If Cloud returns items (or 0 items for a new house), check if we need one-time push of old local storage items
          if (data.length === 0) {
            try {
              const saved = localStorage.getItem('meeyoo_items_v3');
              const localItems = saved ? JSON.parse(saved) : [];
              if (localItems.length > 0) {
                for (const item of localItems) {
                  await this.saveItem(item, validHomeId);
                }
                localStorage.removeItem('meeyoo_items_v3');
                const { data: freshCloudData } = await supabase
                  .from('items')
                  .select('*')
                  .eq('home_id', validHomeId)
                  .order('created_at', { ascending: false });
                if (freshCloudData) return freshCloudData;
              }
            } catch (e) {}
          }
          return data;
        } else if (error) {
          console.error("Supabase fetchItems error:", error.message);
        }
      } catch (e) {
        console.warn("Supabase fetchItems warning:", e);
      }
    }

    // Pure fallback if offline
    try {
      const saved = localStorage.getItem('meeyoo_items_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  async saveItem(item, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validItemId = ensureUUID(item.id);

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
        console.warn("Supabase saveItem warning:", e);
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
        console.warn("Supabase deleteItem warning:", e);
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
