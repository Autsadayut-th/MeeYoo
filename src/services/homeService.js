import { supabase } from './supabaseClient';
import { DEFAULT_HOUSE, ensureUUID } from '../utils/constants';

export const homeService = {
  async getActiveHome() {
    const saved = localStorage.getItem('meeyoo_active_house_v3');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  },

  async ensureHomeExists(homeId = '88290000-0000-0000-0000-000000000000', name = 'บ้านของเรา 🏡', code = 'HOME-8829') {
    if (!supabase) return;
    const validHomeId = ensureUUID(homeId);
    try {
      const { data } = await supabase.from('homes').select('id').eq('id', validHomeId).single();
      if (!data) {
        await supabase.from('homes').upsert([{
          id: validHomeId,
          name: name,
          invite_code: code
        }]);
      }
    } catch (e) {
      console.warn("Supabase ensureHomeExists warning:", e);
    }
  },

  async createHome(homeName, user) {
    const code = 'HOME-' + Math.floor(1000 + Math.random() * 9000);
    const validId = crypto.randomUUID ? crypto.randomUUID() : '88290000-0000-0000-0000-' + Date.now().toString(16).padStart(12, '0');
    
    const newHome = {
      id: validId,
      code: code,
      name: homeName.trim() + ' 🏡',
      inviteLink: `https://meeyoo.app/invite?code=${code}`,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('homes').upsert([{
          id: newHome.id,
          name: homeName.trim(),
          invite_code: code
        }]);
        if (error) console.error("Supabase createHome error:", error);

        if (user && user.id) {
          const validUserId = ensureUUID(user.id);
          await supabase.from('home_members').upsert([{
            home_id: newHome.id,
            user_id: validUserId,
            user_email: user.email || 'user@meeyoo.app',
            user_name: user.name || 'เจ้าของบ้าน',
            role: 'เจ้าของบ้าน'
          }]);
        }
      } catch (err) {
        console.warn("Supabase createHome fallback to local:", err);
      }
    }

    return newHome;
  },

  async joinHome(inviteCode, user) {
    const uppercaseCode = inviteCode.toUpperCase().trim();
    let joinedHome = { ...DEFAULT_HOUSE, code: uppercaseCode };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('homes')
          .select('*')
          .eq('invite_code', uppercaseCode)
          .single();
        if (data) joinedHome = data;

        if (user && user.id) {
          const validUserId = ensureUUID(user.id);
          await supabase.from('home_members').upsert([{
            home_id: joinedHome.id,
            user_id: validUserId,
            user_email: user.email || 'user@meeyoo.app',
            user_name: user.name || 'สมาชิก',
            role: 'สมาชิก'
          }]);
        }
      } catch (err) {
        console.warn("Supabase joinHome fallback to local:", err);
      }
    }

    return joinedHome;
  },

  async fetchMembers(homeId) {
    if (supabase) {
      const validHomeId = ensureUUID(homeId);
      try {
        const { data, error } = await supabase
          .from('home_members')
          .select('*')
          .eq('home_id', validHomeId);
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase fetchMembers fallback to local:", err);
      }
    }

    const saved = localStorage.getItem('meeyoo_house_members_v3');
    return saved ? JSON.parse(saved) : [];
  }
};
