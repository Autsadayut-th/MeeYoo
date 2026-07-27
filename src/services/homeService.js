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

  async addMember(homeId, user, role = 'สมาชิก') {
    if (!supabase || !user) return;
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(user.id);
    await this.ensureHomeExists(validHomeId);

    const payload = {
      home_id: validHomeId,
      user_id: validUserId,
      user_email: user.email || 'user@meeyoo.app',
      user_name: user.name || (role === 'เจ้าของบ้าน' ? 'เจ้าของบ้าน' : 'สมาชิก'),
      role: role
    };

    try {
      const { error } = await supabase.from('home_members').upsert([payload], { onConflict: 'home_id,user_id' });
      if (error) {
        console.error("Supabase addMember error:", error.message);
      }
    } catch (e) {
      console.warn("Supabase addMember warning:", e);
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

        if (user) {
          await this.addMember(newHome.id, user, 'เจ้าของบ้าน');
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
          await this.addMember(joinedHome.id, user, 'สมาชิก');
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
        if (!error && data && data.length > 0) {
          return data.map(m => ({
            id: m.user_id || m.id,
            email: m.user_email || m.email || 'user@meeyoo.app',
            name: m.user_name || m.name || 'สมาชิก',
            role: m.role || 'สมาชิก'
          }));
        }
      } catch (err) {
        console.warn("Supabase fetchMembers fallback to local:", err);
      }
    }

    const saved = localStorage.getItem('meeyoo_house_members_v3');
    return saved ? JSON.parse(saved) : [];
  },

  subscribeToMembers(homeId, onUpdate) {
    if (!supabase) return null;
    const validHomeId = ensureUUID(homeId);
    try {
      const channel = supabase
        .channel(`public:home_members:${validHomeId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'home_members', filter: `home_id=eq.${validHomeId}` }, () => {
          this.fetchMembers(validHomeId).then(list => onUpdate(list));
        })
        .subscribe();
      return channel;
    } catch (e) {
      return null;
    }
  }
};

