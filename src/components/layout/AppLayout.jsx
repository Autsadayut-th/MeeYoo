import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';

export function AppLayout({ house, currentUser, activeUserIndex, switchUser, activeTab, setActiveTab, shoppingCount, children }) {
  return (
    <div className="min-h-screen relative pb-28 md:pb-8 pt-safe">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Navbar 
        house={house} 
        currentUser={currentUser} 
        activeUserIndex={activeUserIndex} 
        switchUser={switchUser} 
      />

      <div className="flex">
        <Sidebar 
          house={house} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          shoppingCount={shoppingCount} 
          currentUser={currentUser} 
        />

        <main className="flex-1 max-w-4xl mx-auto px-4 pt-4">
          {children}
        </main>
      </div>

      <MobileNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        shoppingCount={shoppingCount} 
      />
    </div>
  );
}
