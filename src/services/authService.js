import { supabase } from './supabaseClient';

export const authService = {
  async signInWithGoogle() {
    const isDemoKey = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('meeyoo-demo.supabase.co');

    if (!supabase || isDemoKey) {
      return { 
        user: { 
          id: 'u_google_' + Date.now(), 
          email: 'google.user@gmail.com', 
          name: 'Google User 🌐', 
          avatar: '👨‍💻' 
        } 
      };
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
      return { 
        user: { 
          id: 'u_google_' + Date.now(), 
          email: 'google.user@gmail.com', 
          name: 'Google User 🌐', 
          avatar: '👨‍💻' 
        } 
      };
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
