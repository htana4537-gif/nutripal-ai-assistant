
import React, { useState } from 'react';
import { AppProvider, useAppStore } from './context/Store';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Chat } from './views/Chat';
import { Nutrition } from './views/Nutrition';
import { Fitness } from './views/Fitness';
import { Progress } from './views/Progress';
import { NavBar } from './components/NavBar';
import { Language, Currency, WearableProvider } from './types';

// Profile/Settings View is now a sub-section of Progress, but we export a standalone Settings for completeness if needed.
export const Settings = () => {
    const { user, updateUser, resetApp, connectWearable, t } = useAppStore();
    const [connecting, setConnecting] = useState<string|null>(null);

    const handleConnect = (provider: WearableProvider) => {
        setConnecting(provider);
        connectWearable(provider);
        setTimeout(() => setConnecting(null), 1200);
    };

    return (
        <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl">
                    <p className="text-xs text-[#4ECDC4] uppercase tracking-widest mb-1">{t('name')}</p>
                    <p className="font-semibold text-lg text-slate-800">{user.name}</p>
                </div>
                
                {/* Connected Devices */}
                <div className="glass-panel p-5 rounded-2xl">
                    <p className="text-xs text-[#4ECDC4] uppercase tracking-widest mb-3">{t('connected_devices')}</p>
                    <div className="space-y-3">
                        {(['Apple Health', 'Google Fit', 'Garmin'] as WearableProvider[]).map(provider => {
                            const isConnected = user.connectedDevices.includes(provider);
                            return (
                                <div key={provider} className="flex justify-between items-center bg-white/40 p-3 rounded-xl border border-white/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${provider === 'Google Fit' ? 'bg-blue-500/10 text-blue-500' : provider === 'Apple Health' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                            {provider === 'Apple Health' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                                            {provider === 'Google Fit' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-2c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"/><path d="M12 6v6l4 4"/></svg>}
                                            {provider === 'Garmin' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6l-2 9h4l-2 9"/></svg>}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{provider}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleConnect(provider)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                            isConnected 
                                            ? 'bg-[#4ECDC4]/20 text-[#2AA198] hover:bg-red-500/20 hover:text-red-500' 
                                            : 'bg-white/60 text-slate-500 hover:bg-white/80'
                                        }`}
                                    >
                                        {connecting === provider ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            isConnected ? t('disconnect') : t('connect')
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Settings */}
                <div className="glass-panel p-5 rounded-2xl">
                    <p className="text-xs text-[#4ECDC4] uppercase tracking-widest mb-3">{t('lang_region')}</p>
                    <div className="flex gap-2 flex-wrap mb-4">
                        {(['en', 'ar', 'fr', 'es'] as Language[]).map(lang => (
                             <button 
                                key={lang}
                                onClick={() => updateUser({ language: lang })}
                                className={`px-4 py-2 rounded-xl text-sm transition font-medium backdrop-blur-md ${user.language === lang ? 'bg-[#4ECDC4] text-white shadow-[0_4px_15px_rgba(78,205,196,0.3)]' : 'bg-white/40 border border-white/50 text-slate-500 hover:bg-white/60'}`}
                             >
                                {lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'Español'}
                             </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl">
                     <p className="text-xs text-[#4ECDC4] uppercase tracking-widest mb-2">{t('select_curr')}</p>
                      <select 
                        className="w-full bg-white/40 border border-white/50 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                        value={user.currency} 
                        onChange={e => updateUser({ currency: e.target.value as Currency })}
                      >
                        {(['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP'] as Currency[]).map(c => <option key={c} value={c} className="bg-white text-slate-800">{c}</option>)}
                      </select>
                </div>
                
                <button 
                onClick={resetApp}
                className="mt-4 w-full border border-red-500/30 text-red-500 py-4 rounded-2xl hover:bg-red-50 hover:border-red-500/50 transition backdrop-blur-sm font-semibold"
            >
                {t('reset')}
            </button>
        </div>
    )
}

const LiquidBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#F0F4F8]">
    {/* Light Liquid Elements */}
    {/* Soft Lavender */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A06CD5] opacity-20 rounded-full filter blur-[80px] animate-blob"></div>
    {/* Electric Cyan */}
    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#4ECDC4] opacity-20 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
    {/* Living Coral */}
    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#FF6B6B] opacity-15 rounded-full filter blur-[80px] animate-blob animation-delay-4000"></div>
  </div>
);

const MainLayout = () => {
  const { currentView, user } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'onboarding': return <Onboarding />;
      case 'dashboard': return <Dashboard />;
      case 'chat': return <Chat />;
      case 'nutrition': return <Nutrition />;
      case 'fitness': return <Fitness />;
      case 'progress': return <Progress />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-full font-sans overflow-hidden relative text-slate-800" dir={user.language === 'ar' ? 'rtl' : 'ltr'}>
      <LiquidBackground />
      <div className="h-full w-full max-w-lg mx-auto relative flex flex-col">
        <div className="flex-1 overflow-hidden relative">
            <div key={currentView} className="h-full animate-liquid-enter">
                {renderView()}
            </div>
        </div>
        {currentView !== 'onboarding' && <NavBar />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
