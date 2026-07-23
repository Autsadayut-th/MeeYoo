import { supabase } from './supabaseClient';
import { DEFAULT_HOUSE } from '../utils/constants';

export const homeService = {
  async getActiveHome() {
    const saved = localStorage.getItem('meeyoo_active_house_v3');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  },

  async createHome(homeName, user) {
    const code = 'HOME-' + Math.floor(1000 + Math.random() * 9000);
    const newHome = {
      id: 'h_' + Date.now(),
      code: code,
      name: homeName.trim() + ' 🏡',
      inviteLink: `https://meeyoo.app/invite?code=${code}`,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('homes').insert([{
          id: newHome.id,
          name: homeName.trim(),
          invite_code: code
        }]);
        if (user) {
          await supabase.from('home_members').insert([{
            home_id: newHome.id,
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
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

        if (user) {
          await supabase.from('home_members').upsert([{
            home_id: joinedHome.id,
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
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
      try {
        const { data, error } = await supabase
          .from('home_members')
          .select('*')
          .eq('home_id', homeId);
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase fetchMembers fallback to local:", err);
      }
    }

    const saved = localStorage.getItem('meeyoo_house_members_v3');
    return saved ? JSON.parse(saved) : [];
  }
};
