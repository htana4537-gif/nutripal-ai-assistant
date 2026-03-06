
import React from 'react';
import { useAppStore } from '../context/Store';

// Simple Icons as SVGs
const Icons = {
  Home: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Chat: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>,
  Fitness: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Body: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.83 14.73a4.73 4.73 0 0 0-9.66 0c0 1.25.43 2.45 1.15 3.4L16 22l3.68-3.87c.72-.95 1.15-2.15 1.15-3.4Z"/><path d="M16 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M8 8v12"/><path d="M4 12h8"/></svg>,
  Nutrition: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 21.73a2 2 0 0 0 2.9 0l7.1-7.1a2 2 0 0 0 0-2.8L13 3.8a2 2 0 0 0-2.8 0L2.2 11.8a2 2 0 0 0 0 2.8zM7 7h10"/></svg>,
};

export const NavBar = () => {
  const { currentView, navigate, t } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: t('home'), icon: Icons.Home },
    { id: 'nutrition', label: t('nutrition'), icon: Icons.Nutrition },
    { id: 'fitness', label: t('fitness'), icon: Icons.Fitness },
    { id: 'chat', label: t('coach'), icon: Icons.Chat },
    { id: 'progress', label: t('profile'), icon: Icons.Body },
  ] as const;

  return (
    <div className="absolute bottom-6 left-6 right-6 z-50">
      {/* Floating Frosted White Glass Dock */}
      <div className="flex justify-around items-center h-20 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.1)] px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="group relative flex flex-col items-center justify-center w-full h-full"
            >
              <div className={`transition-all duration-300 transform ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                {/* Glow behind icon */}
                {isActive && (
                    <div className="absolute inset-0 bg-[#4ECDC4]/30 blur-xl rounded-full"></div>
                )}
                {/* Icon Color Logic */}
                <item.icon className={`relative z-10 h-6 w-6 mb-1 transition-all duration-300 ${isActive ? 'stroke-[#FF6B6B] drop-shadow-[0_0_5px_rgba(255,107,107,0.5)]' : 'stroke-slate-400 group-hover:stroke-slate-600'}`} />
              </div>
              
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-[#FF6B6B] opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100 absolute -bottom-2 group-hover:bottom-1'}`}>
                {item.label}
              </span>

              {/* Liquid Ripple Indicator for Active State */}
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-[#FF6B6B] rounded-full shadow-[0_0_8px_#FF6B6B]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
