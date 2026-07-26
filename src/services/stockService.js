import { supabase } from './supabaseClient';
import { homeService } from './homeService';
import { ensureUUID } from '../utils/constants';

export const stockService = {
  async fetchItems(homeId) {
    if (supabase) {
      const validHomeId = ensureUUID(homeId);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('home_id', validHomeId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        if (error) console.error("Supabase fetchItems error:", error.message);
      } catch (e) {
        console.warn("Supabase fetchItems fallback to local:", e);
      }
    }
    const saved = localStorage.getItem('meeyoo_items_v3');
    return saved ? JSON.parse(saved) : [];
  },

  async saveItem(item, homeId) {
    if (supabase) {
      try {
        const validHomeId = ensureUUID(homeId);
        const validItemId = ensureUUID(item.id);

        // Ensure home row exists in Supabase DB to prevent FK violation error
        await homeService.ensureHomeExists(validHomeId);

        const payload = {
          id: validItemId,
          home_id: validHomeId,
          name: item.name,
          category: item.category,
          quantity: Number(item.quantity),
          unit: item.unit,
          min_threshold: Number(item.min_threshold),
          icon: item.icon || '📦',
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
