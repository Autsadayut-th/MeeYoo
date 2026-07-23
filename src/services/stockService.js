import { supabase } from './supabaseClient';

export const stockService = {
  async fetchItems(homeId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('home_id', homeId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
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
        const payload = {
          id: item.id,
          home_id: homeId,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          min_threshold: item.min_threshold,
          icon: item.icon,
          barcode: item.barcode,
          updated_at: new Date().toISOString()
        };
        await supabase.from('items').upsert([payload]);
      } catch (e) {
        console.warn("Supabase saveItem fallback to local:", e);
      }
    }
  },

  async deleteItem(itemId) {
    if (supabase) {
      try {
        await supabase.from('items').delete().eq('id', itemId);
      } catch (e) {
        console.warn("Supabase deleteItem fallback to local:", e);
      }
    }
  },

  subscribeToItems(homeId, onUpdate) {
    if (!supabase) return null;
    try {
      const channel = supabase
        .channel(`public:items:${homeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `home_id=eq.${homeId}` }, () => {
          this.fetchItems(homeId).then(items => onUpdate(items));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};
