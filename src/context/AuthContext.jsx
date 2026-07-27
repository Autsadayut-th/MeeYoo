import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';
import { homeService } from '../services/homeService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('meeyoo_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [authView, setAuthView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('meeyoo_current_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      if (!parsedUser || !parsedUser.email) return 'login';
      const savedHouse = localStorage.getItem('meeyoo_active_house_v3');
      const parsedHouse = savedHouse ? JSON.parse(savedHouse) : null;
      if (!parsedHouse || !parsedHouse.id) return 'join_home';
      return 'app';
    } catch (e) {
      return 'login';
    }
  });

  useEffect(() => {
    if (supabase) {
      const handleUserSession = (session) => {
        if (session && session.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email || 'google.user@gmail.com',
            name: u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : 'Google User'),
          };
          setCurrentUser(userObj);
          localStorage.setItem('meeyoo_current_user', JSON.stringify(userObj));

          try {
            const savedHouse = localStorage.getItem('meeyoo_active_house_v3');
            const parsedHouse = savedHouse ? JSON.parse(savedHouse) : null;
            if (parsedHouse && parsedHouse.id) {
              homeService.checkMemberStatus(parsedHouse.id, userObj.id).then(status => {
                if (status === 'pending') {
                  setAuthView('waiting_approval');
                } else {
                  setAuthView('app');
                }
              }).catch(() => setAuthView('app'));
            } else {
              setAuthView('join_home');
            }
          } catch (e) {
            setAuthView('join_home');
          }
        }
      };

      supabase.auth.getSession().then(({ data: { session } }) => handleUserSession(session));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => handleUserSession(session));

      return () => subscription.unsubscribe();
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await authService.signInWithGoogle();
      if (res && res.user) {
        const u = res.user;
        const userObj = {
          id: u.id,
          email: u.email || 'google.user@gmail.com',
          name: u.name || (u.email ? u.email.split('@')[0] : 'Google User'),
        };
        setCurrentUser(userObj);
        localStorage.setItem('meeyoo_current_user', JSON.stringify(userObj));
        setAuthView('app');
      }
    } catch (e) {
      console.error("Google Auth error:", e);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      localStorage.removeItem('meeyoo_current_user');
      localStorage.removeItem('meeyoo_active_house_v3');
      setCurrentUser(null);
      setAuthView('login');
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, authView, setAuthView, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
