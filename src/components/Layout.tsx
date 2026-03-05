import React from 'react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  
  // Dynamic background based on gender
  const bgClass = currentUser.gender === 'male' 
    ? 'bg-blue-50 text-slate-900' 
    : 'bg-pink-50 text-slate-900';

  return (
    <div className={`h-[100dvh] w-full flex flex-col ${bgClass} transition-colors duration-500 overflow-hidden`}>
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};
