
import React, { useState } from 'react';
import { useAppStore } from '../context/Store';
import { Gender, Goal, ActivityLevel, Language, Currency } from '../types';

export const Onboarding = () => {
  const { updateUser, user, t, navigate } = useAppStore();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else {
        updateUser({ onboarded: true });
        navigate('dashboard');
    }
  };

  const GlassInput = (props: any) => (
      <input 
        {...props}
        className={`w-full bg-white/50 border border-white/80 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:bg-white/80 transition-all backdrop-blur-sm ${props.className}`} 
      />
  );
  
  const GlassSelect = ({children, ...props}: any) => (
      <div className="relative">
          <select 
            {...props}
            className={`w-full appearance-none bg-white/50 border border-white/80 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] transition-all backdrop-blur-sm ${props.className}`}
          >
              {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4ECDC4]">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
      </div>
  );

  const LabelClass = "block text-xs font-bold text-[#FF6B6B] uppercase tracking-widest mb-2 ml-1";
  
  const COUNTRIES = ['Egypt', 'Saudi Arabia', 'UAE', 'USA', 'UK', 'France', 'Spain', 'Germany', 'Canada', 'Other'];

  return (
    <div className="h-full flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md flex flex-col h-full justify-center">
        
        {/* Progress Bar */}
        <div className="absolute top-10 left-6 right-6 flex gap-2">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#4ECDC4] shadow-[0_0_10px_rgba(78,205,196,0.5)]' : 'bg-slate-200'}`}></div>
            ))}
        </div>

        <div className="text-center mb-6 mt-10">
           <div className="relative flex items-center justify-center w-full mb-6">
               <div className="absolute w-40 h-40 bg-gradient-to-br from-[#4ECDC4] to-[#A06CD5] rounded-full blur-3xl opacity-50 animate-pulse"></div>
               <img 
                   src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop" 
                   alt="AI GYM Logo" 
                   className="relative w-40 h-40 object-cover rounded-full shadow-2xl border-4 border-white/80 z-10"
               />
           </div>
           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] drop-shadow-sm">AI GYM</h1>
           <p className="text-slate-500 mt-2 font-light">Liquid Intelligence. Solid Results.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl shadow-xl backdrop-blur-2xl border-t border-white/60 relative overflow-hidden transition-all duration-500 min-h-[350px] flex flex-col justify-center">
          
          {step === 1 && (
             <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 text-center">{t('lang_region')}</h2>
                
                <div>
                    <label className={LabelClass}>{t('select_lang')}</label>
                    <div className="grid grid-cols-2 gap-3">
                    {(['en', 'ar', 'fr', 'es'] as Language[]).map(lang => (
                        <button 
                        key={lang}
                        onClick={() => updateUser({ language: lang })}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all ${user.language === lang ? 'bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#2AA198]' : 'bg-white/50 border-white/60 text-slate-500 hover:bg-white/80'}`}
                        >
                        {lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'Español'}
                        </button>
                    ))}
                    </div>
                </div>

                <div>
                    <label className={LabelClass}>{t('select_country')}</label>
                    <GlassSelect value={user.country || 'Other'} onChange={(e: any) => updateUser({ country: e.target.value })}>
                        <option value="" disabled className="bg-white text-slate-800">{t('country_placeholder')}</option>
                        {COUNTRIES.map(c => <option key={c} value={c} className="bg-white text-slate-800">{c}</option>)}
                    </GlassSelect>
                </div>

                <div>
                    <label className={LabelClass}>{t('select_curr')}</label>
                    <GlassSelect value={user.currency} onChange={(e: any) => updateUser({ currency: e.target.value as Currency })}>
                        {(['USD', 'EUR', 'GBP', 'SAR', 'AED', 'EGP'] as Currency[]).map(c => <option key={c} value={c} className="bg-white text-slate-800">{c}</option>)}
                    </GlassSelect>
                </div>
             </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 text-center">{t('basics')}</h2>
              
              <div>
                  <label className={LabelClass}>{t('name')}</label>
                  <GlassInput type="text" placeholder={t('name')} value={user.name} onChange={(e:any) => updateUser({ name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LabelClass}>{t('age')}</label>
                  <GlassInput type="number" value={user.age} onChange={(e:any) => updateUser({ age: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={LabelClass}>{t('gender')}</label>
                  <GlassSelect value={user.gender} onChange={(e:any) => updateUser({ gender: e.target.value as Gender })}>
                    {Object.values(Gender).map(g => <option key={g} value={g} className="bg-white text-slate-800">{g}</option>)}
                  </GlassSelect>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 text-center">{t('body_stats')}</h2>
              
              <div>
                  <label className={LabelClass}>{t('height')} <span className="text-slate-800 text-lg ml-2">{user.height} cm</span></label>
                  <input 
                    type="range" min="100" max="250" 
                    value={user.height} 
                    onChange={e => updateUser({ height: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4ECDC4] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                      <span>100cm</span><span>175cm</span><span>250cm</span>
                  </div>
              </div>

              <div>
                  <label className={LabelClass}>{t('weight')} <span className="text-slate-800 text-lg ml-2">{user.weight} kg</span></label>
                  <input 
                    type="range" min="30" max="200" 
                    value={user.weight} 
                    onChange={e => updateUser({ weight: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B6B] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                      <span>30kg</span><span>115kg</span><span>200kg</span>
                  </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 text-center">{t('goals_lifestyle')}</h2>
              
              <div>
                  <label className={LabelClass}>{t('primary_goal')}</label>
                  <GlassSelect value={user.goal} onChange={(e:any) => updateUser({ goal: e.target.value as Goal })}>
                    {Object.values(Goal).map(g => <option key={g} value={g} className="bg-white text-slate-800">{g}</option>)}
                  </GlassSelect>
              </div>

              <div>
                  <label className={LabelClass}>{t('activity_level')}</label>
                  <GlassSelect value={user.activityLevel} onChange={(e:any) => updateUser({ activityLevel: e.target.value as ActivityLevel })}>
                    {Object.values(ActivityLevel).map(a => <option key={a} value={a} className="bg-white text-slate-800">{a}</option>)}
                  </GlassSelect>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-slate-800 text-center">{t('daily_intake')}</h2>
                
                <div>
                  <label className={LabelClass}>{t('meals_per_day')} <span className="text-slate-800 text-lg ml-2">{user.targetMealsPerDay}</span></label>
                  <input 
                    type="range" min="1" max="8" step="1"
                    value={user.targetMealsPerDay} 
                    onChange={e => updateUser({ targetMealsPerDay: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#A06CD5] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                      <span>1</span><span>4</span><span>8</span>
                  </div>
                </div>

                <div>
                  <label className={LabelClass}>{t('water_per_day')} <span className="text-slate-800 text-lg ml-2">{user.targetWaterPerDay} L</span></label>
                  <input 
                    type="range" min="1" max="5" step="0.5"
                    value={user.targetWaterPerDay} 
                    onChange={e => updateUser({ targetWaterPerDay: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4ECDC4] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                      <span>1L</span><span>3L</span><span>5L</span>
                  </div>
                </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 text-center">{t('preferences')}</h2>
              
              <label className="flex items-center space-x-4 p-4 rounded-2xl cursor-pointer border border-white/60 bg-white/40 hover:bg-white/60 transition group">
                <input 
                  type="checkbox" 
                  checked={user.budgetMode} 
                  onChange={e => updateUser({ budgetMode: e.target.checked })} 
                  className="w-6 h-6 text-[#4ECDC4] rounded focus:ring-[#4ECDC4] bg-slate-100 border-slate-300" 
                />
                <div className="flex-1">
                     <span className="text-[#2AA198] font-bold block mb-1">{t('enable_budget')}</span>
                     <span className="text-xs text-slate-500">{t('budget_desc')}</span>
                </div>
              </label>

              <div>
                  <label className={LabelClass}>{t('diet_restrictions')}</label>
                  <GlassInput 
                    type="text" 
                    placeholder={t('diet_placeholder')} 
                    value={user.dietaryRestrictions.join(', ')} 
                    onChange={(e:any) => updateUser({ dietaryRestrictions: e.target.value.split(',').map((s:string) => s.trim()) })} 
                  />
              </div>
            </div>
          )}
        </div>

        <button 
            onClick={handleNext}
            className="w-full mt-6 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF8787] hover:to-[#5FDED5] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(78,205,196,0.3)] relative overflow-hidden group"
          >
            <span className="relative z-10">{step === 6 ? t('start_journey') : t('next')}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  );
};
