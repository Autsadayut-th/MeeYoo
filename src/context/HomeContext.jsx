import React, { createContext, useContext, useState, useEffect } from 'react';
import { homeService } from '../services/homeService';

const HomeContext = createContext(null);

export function HomeProvider({ children }) {
  const [house, setHouse] = useState(() => {
    try {
      const saved = localStorage.getItem('meeyoo_active_house_v3');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && parsed.id && parsed.name) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('meeyoo_house_members_v3');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (house && house.id) {
      localStorage.setItem('meeyoo_active_house_v3', JSON.stringify(house));
    }
    if (Array.isArray(members) && members.length > 0) {
      localStorage.setItem('meeyoo_house_members_v3', JSON.stringify(members));
    }
  }, [house, members]);

  const updateHomeName = async (newName) => {
    if (!house || !house.id || !newName) return;
    const updatedHouse = { ...house, name: newName };
    setHouse(updatedHouse);
    localStorage.setItem('meeyoo_active_house_v3', JSON.stringify(updatedHouse));
    await homeService.updateHomeName(house.id, newName);
  };

  return (
    <HomeContext.Provider value={{
      house,
      setHouse,
      members,
      setMembers,
      pendingRequests,
      setPendingRequests,
      updateHomeName
    }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
}
