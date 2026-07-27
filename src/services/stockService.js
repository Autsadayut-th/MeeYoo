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
          return data;
        } else if (error) {
          console.error("Supabase fetchItems error:", error.message);
        }
      } catch (e) {
        console.warn("Supabase fetchItems warning:", e);
      }
    }

    try {
      const saved = localStorage.getItem('meeyoo_items_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  async saveItem(item, homeId) {
    if (!homeId) return null;
    const validHomeId = ensureUUID(homeId);
    const validItemId = ensureUUID(item.id);

    if (supabase) {
      try {
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

        const { error } = await supabase.from('items').upsert([payload], { onConflict: 'id' });
        if (error) {
          console.error("Supabase saveItem Error:", error.message, error.details);
        } else {
          console.log("Supabase saveItem Success:", item.name);
        }

        return await this.fetchItems(validHomeId);
      } catch (e) {
        console.warn("Supabase saveItem warning:", e);
      }
    }
    return null;
  },

  async deleteItem(itemId, homeId) {
    const validItemId = ensureUUID(itemId);
    if (supabase) {
      try {
        const { error } = await supabase.from('items').delete().eq('id', validItemId);
        if (error) console.error("Supabase deleteItem error:", error.message);
      } catch (e) {
        console.warn("Supabase deleteItem warning:", e);
      }
    }
    if (homeId) return await this.fetchItems(homeId);
    return null;
  },

  subscribeToItems(homeId, onUpdate) {
    if (!supabase) return null;
    const validHomeId = ensureUUID(homeId);
    try {
      const channel = supabase
        .channel(`public:items:${validHomeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `home_id=eq.${validHomeId}` }, () => {
          this.fetchItems(validHomeId).then(items => {
            if (Array.isArray(items)) onUpdate(items);
          });
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
