import { supabase } from './supabaseClient';
import { DEFAULT_HOUSE } from '../utils/constants';

export const homeService = {
  async getActiveHome() {
    const saved = localStorage.getItem('meeyoo_active_house_v2');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  },

  async joinHome(inviteCode) {
    if (!supabase) {
      return { ...DEFAULT_HOUSE, code: inviteCode.toUpperCase() };
    }
    const { data, error } = await supabase
      .from('homes')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();
    if (error) throw error;
    return data;
  }
};
