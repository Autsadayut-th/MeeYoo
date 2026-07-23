import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_MEMBERS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const user = DEFAULT_MEMBERS[activeUserIndex];

  const switchUser = (index) => {
    setActiveUserIndex(index);
  };

  return (
    <AuthContext.Provider value={{ user, activeUserIndex, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
