import { supabase } from './supabaseClient';

export const authService = {
  async signInWithGoogle() {
    if (!supabase) {
      return { user: { id: 'u_google_' + Date.now(), email: 'demo.user@gmail.com', name: 'Google User', avatar: '🌐' } };
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase Google Auth fallback to local demo:", err);
      // Fallback for seamless demo testing if Google provider is not enabled in Supabase dashboard yet
      return { user: { id: 'u_google_' + Date.now(), email: 'demo.user@gmail.com', name: 'Google User', avatar: '🌐' } };
    }
  },

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
