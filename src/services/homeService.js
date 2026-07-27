import { supabase } from './supabaseClient';
import { ensureUUID } from '../utils/constants';

export const homeService = {
  async getActiveHome() {
    try {
      const saved = localStorage.getItem('meeyoo_active_house_v3');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  async ensureHomeExists(homeId, name, code) {
    if (!supabase || !homeId) return;
    const validHomeId = ensureUUID(homeId);
    try {
      const { data } = await supabase.from('homes').select('id').eq('id', validHomeId).single();
      if (!data) {
        // Only create if we have a valid name and code
        const homeName = name || 'บ้านของเรา';
        const homeCode = code || ('HOME-' + validHomeId.slice(-4).toUpperCase());
        const { error } = await supabase.from('homes').upsert([{
          id: validHomeId,
          name: homeName,
          invite_code: homeCode
        }], { onConflict: 'id' });
        if (error) {
          console.error("ensureHomeExists upsert error:", error.message);
        }
      }
    } catch (e) {
      // PGRST116 = no rows returned from .single(), meaning home doesn't exist yet
      if (e?.code === 'PGRST116') {
        const homeName = name || 'บ้านของเรา';
        const homeCode = code || ('HOME-' + validHomeId.slice(-4).toUpperCase());
        try {
          await supabase.from('homes').upsert([{
            id: validHomeId,
            name: homeName,
            invite_code: homeCode
          }], { onConflict: 'id' });
        } catch (innerErr) {
          console.warn("ensureHomeExists inner upsert warning:", innerErr);
        }
      } else {
        console.warn("ensureHomeExists warning:", e);
      }
    }
  },

  async addMember(homeId, user, role = 'สมาชิก', status = 'approved') {
    if (!supabase || !user) return;
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(user.id);
    await this.ensureHomeExists(validHomeId);

    const payload = {
      home_id: validHomeId,
      user_id: validUserId,
      user_email: user.email || 'user@meeyoo.app',
      user_name: user.name || (role === 'เจ้าของบ้าน' ? 'เจ้าของบ้าน' : 'สมาชิก'),
      role: role,
      status: status
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

  async createHome(name, ownerUser) {
    const randomCode = 'HOME-' + Math.floor(1000 + Math.random() * 9000);
    const validHomeId = ensureUUID('home_' + randomCode);

    const newHome = {
      id: validHomeId,
      name: name,
      code: randomCode,
      invite_code: randomCode,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('homes').upsert([{
          id: validHomeId,
          name: name,
          invite_code: randomCode
        }], { onConflict: 'id' });

        if (error) console.error("Supabase createHome error:", error.message);

        if (ownerUser) {
          await this.addMember(validHomeId, ownerUser, 'เจ้าของบ้าน', 'approved');
        }
      } catch (err) {
        console.warn("Supabase createHome fallback to local:", err);
      }
    }

    localStorage.setItem('meeyoo_active_house_v3', JSON.stringify(newHome));
    return newHome;
  },

  async joinHome(inviteCode, user) {
    const uppercaseCode = inviteCode.toUpperCase().trim();
    const validHomeId = ensureUUID('home_' + uppercaseCode);

    let joinedHome = {
      id: validHomeId,
      code: uppercaseCode,
      name: `บ้าน ${uppercaseCode}`,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        // First try to find home by invite_code
        const { data } = await supabase
          .from('homes')
          .select('*')
          .eq('invite_code', uppercaseCode)
          .single();
        if (data) {
          // Use the ACTUAL id from the database, not our computed one
          joinedHome = {
            ...data,
            id: data.id,
            code: data.invite_code || data.code || uppercaseCode
          };
        }
      } catch (err) {
        console.warn("Supabase joinHome lookup:", err?.message || err);
      }

      // If home doesn't exist in DB yet, create it with our deterministic ID
      if (!joinedHome.id || joinedHome.id === validHomeId) {
        await this.ensureHomeExists(validHomeId, joinedHome.name, uppercaseCode);
        joinedHome.id = validHomeId;
      }

      if (user) {
        await this.addMember(joinedHome.id, user, 'สมาชิก', 'pending');
      }
    }

    localStorage.setItem('meeyoo_active_house_v3', JSON.stringify(joinedHome));
    return { ...joinedHome, membershipStatus: 'pending' };
  },

  async approveMember(homeId, userId) {
    if (!supabase) return;
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(userId);
    try {
      const { error } = await supabase
        .from('home_members')
        .update({ status: 'approved' })
        .eq('home_id', validHomeId)
        .eq('user_id', validUserId);
      if (error) console.error("Supabase approveMember error:", error);
    } catch (e) {
      console.warn("Supabase approveMember warning:", e);
    }
  },

  async rejectMember(homeId, userId) {
    if (!supabase) return;
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(userId);
    try {
      const { error } = await supabase
        .from('home_members')
        .delete()
        .eq('home_id', validHomeId)
        .eq('user_id', validUserId);
      if (error) console.error("Supabase rejectMember error:", error);
    } catch (e) {
      console.warn("Supabase rejectMember warning:", e);
    }
  },

  async updateMemberProfile(homeId, userId, newName, avatarUrl) {
    if (!userId) return;
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(userId);
    if (supabase) {
      try {
        await supabase
          .from('home_members')
          .update({
            user_name: newName,
            avatar_url: avatarUrl || ''
          })
          .eq('home_id', validHomeId)
          .eq('user_id', validUserId);
      } catch (e) {
        console.warn("Supabase updateMemberProfile warning:", e);
      }
    }
  },

  async updateHomeName(homeId, newName) {
    if (!homeId || !newName.trim()) return;
    const validHomeId = ensureUUID(homeId);
    if (supabase) {
      try {
        await supabase
          .from('homes')
          .update({ name: newName.trim() })
          .eq('id', validHomeId);
      } catch (e) {
        console.warn("Supabase updateHomeName warning:", e);
      }
    }
  },

  async checkMemberStatus(homeId, userId) {
    if (!supabase || !userId) return 'approved';
    const validHomeId = ensureUUID(homeId);
    const validUserId = ensureUUID(userId);
    try {
      const { data } = await supabase
        .from('home_members')
        .select('status')
        .eq('home_id', validHomeId)
        .eq('user_id', validUserId)
        .single();
      if (data && data.status) return data.status;
    } catch (e) {}
    return 'approved';
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
          const approved = data.filter(m => !m.status || m.status === 'approved');
          return approved.map(m => ({
            id: m.user_id || m.id,
            email: m.user_email || m.email || 'user@meeyoo.app',
            name: m.user_name || m.name || 'สมาชิก',
            role: m.role || 'สมาชิก',
            status: m.status || 'approved',
            avatar_url: m.avatar_url || ''
          }));
        }
      } catch (err) {
        console.warn("Supabase fetchMembers fallback to local:", err);
      }
    }

    const saved = localStorage.getItem('meeyoo_house_members_v3');
    return saved ? JSON.parse(saved) : [];
  },

  async fetchPendingMembers(homeId) {
    if (!supabase) return [];
    const validHomeId = ensureUUID(homeId);
    try {
      const { data, error } = await supabase
        .from('home_members')
        .select('*')
        .eq('home_id', validHomeId)
        .eq('status', 'pending');
      if (!error && data) {
        return data.map(m => ({
          id: m.user_id || m.id,
          email: m.user_email || m.email || 'user@meeyoo.app',
          name: m.user_name || m.name || 'สมาชิก',
          role: m.role || 'สมาชิก',
          status: 'pending',
          avatar_url: m.avatar_url || ''
        }));
      }
    } catch (err) {}
    return [];
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


