import { supabase } from './supabaseClient';

export const authService = {
  async signIn(email, password) {
    if (!supabase) {
      return { user: { id: 'demo-user', email, name: email.split('@')[0] } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email, password) {
    if (!supabase) {
      return { user: { id: 'demo-user', email, name: email.split('@')[0] } };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
};
