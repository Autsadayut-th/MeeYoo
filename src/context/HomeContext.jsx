import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_HOUSE } from '../utils/constants';

const HomeContext = createContext(null);

export function HomeProvider({ children }) {
  const [house, setHouse] = useState(() => {
    const saved = localStorage.getItem('meeyoo_active_house_v2');
    return saved ? JSON.parse(saved) : DEFAULT_HOUSE;
  });

  return (
    <HomeContext.Provider value={{ house, setHouse }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  return useContext(HomeContext);
}
