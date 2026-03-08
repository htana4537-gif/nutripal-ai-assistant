
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../context/Store';
import { Meal } from '../types';

const StatBar = ({ label, level, xp, maxXP, color }: { label: string, level: number, xp: number, maxXP: number, color: string }) => (
    <div className="mb-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <span className={color}>{label} <span className="text-[#1A202C] ml-1">Lv.{level}</span></span>
            <span className="text-[#1A202C]/50">{xp}/{maxXP} XP</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{background: 'rgba(26, 32, 44, 0.08)'}}>
            <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${Math.min((xp / maxXP) * 100, 100)}%` }}></div>
        </div>
    </div>
);

export const Dashboard = () => {
  const { user, navigate, getDailyNutrition, analyzeCustomMeal, logConsumedMeal, toggleFavoriteMeal, syncHealthData, activateDamageControl, activateTravelMode, analyzeActivity, logManualActivity, isLoading, t } = useAppStore();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [customLogText, setCustomLogText] = useState('');
  const [analyzedMeal, setAnalyzedMeal] = useState<Meal | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [waterIntake, setWaterIntake] = useState(0);
  const [drinkName, setDrinkName] = useState('');
  const [sugarSpoons, setSugarSpoons] = useState(0);
  const [additives, setAdditives] = useState('');
  const [analyzingDrink, setAnalyzingDrink] = useState(false);

  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [analyzedActivity, setAnalyzedActivity] = useState<{name: string, calories: number} | null>(null);
  const [analyzingActivity, setAnalyzingActivity] = useState(false);

  // Interaction State for Liquid Card
  const [waveOffset, setWaveOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (user.connectedDevices.length > 0) {
          setIsSyncing(true);
          syncHealthData().then(() => setIsSyncing(false));
      }
  }, []);

  const getGreeting = () => t('greeting');

  const dailyNutrition = getDailyNutrition();
  const caloriesConsumed = dailyNutrition.calories;
  
  const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + (user.gender === 'Male' ? 5 : -161);
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };
  const tdee = bmr * (activityMultipliers[user.activityLevel] || 1.2);
  
  const baseCalorieTarget = Math.round(user.goal === 'Lose Weight' ? tdee - 500 : user.goal === 'Build Muscle' ? tdee + 300 : tdee);
  const activeCalories = user.dailyStats?.activeCalories || 0;
  const damageControlMod = user.specialMode === 'DamageControl' ? -300 : 0;
  const totalCalorieTarget = baseCalorieTarget + activeCalories + damageControlMod;

  const fillPercent = Math.min((caloriesConsumed / totalCalorieTarget) * 100, 100);

  const firstName = user.name ? user.name.split(' ')[0] : '';

  const handleAnalyze = async () => {
      if (!customLogText.trim()) return;
      setAnalyzing(true);
      const result = await analyzeCustomMeal(customLogText);
      setAnalyzedMeal(result);
      setAnalyzing(false);
  };

  const handleConfirmLog = () => {
      if (analyzedMeal) {
          logConsumedMeal(analyzedMeal);
          setAnalyzedMeal(null);
          setCustomLogText('');
          setShowLogModal(false);
      }
  };

  const handleLogDrink = async () => {
      if (!drinkName) return;
      setAnalyzingDrink(true);
      const description = `${drinkName} with ${sugarSpoons} spoons of sugar${additives ? ` and ${additives}` : ''}`;
      const result = await analyzeCustomMeal(description);
      if (result) {
          logConsumedMeal(result);
          setDrinkName('');
          setSugarSpoons(0);
          setAdditives('');
          setShowDrinkModal(false);
      }
      setAnalyzingDrink(false);
  };

  const handleAnalyzeActivity = async () => {
      if (!activityName || !duration) return;
      setAnalyzingActivity(true);
      const result = await analyzeActivity(activityName, duration);
      setAnalyzedActivity(result);
      setAnalyzingActivity(false);
  };

  const handleLogActivity = () => {
      if (analyzedActivity) {
          logManualActivity(analyzedActivity.calories);
          setAnalyzedActivity(null);
          setActivityName('');
          setDuration('');
          setShowActivityModal(false);
      }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Calculate offset based on center
      const offsetX = (x - rect.width / 2) / 10;
      const offsetY = (y - rect.height / 2) / 10;
      
      setWaveOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
      setWaveOffset({ x: 0, y: 0 });
  };

  const rpg = user.rpgStats || { level: 1, currentXP: 0, nextLevelXP: 500, title: 'Novice', attributes: { strength: {level:1, xp:0, maxXP:100}, agility: {level:1, xp:0, maxXP:100}, endurance: {level:1, xp:0, maxXP:100}, intelligence: {level:1, xp:0, maxXP:100}, mana: {level:1, xp:0, maxXP:100} } };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="h-full overflow-y-auto pb-28 p-6 relative z-10">
      {/* Background Image with 10% Blur */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1740&auto=format&fit=crop" 
            alt="Dashboard Background" 
            className="absolute inset-0 w-full h-full object-cover blur-[3px]"
         />
         <div className="absolute inset-0 bg-black/20 backdrop-blur-[0px]"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-2 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{getGreeting()}, {firstName}!</h1>
          <p className="text-sm text-white/90 font-medium mt-1 drop-shadow-sm">{t('goal_msg')}</p>
        </div>
        <div className="relative">
            <div className="absolute inset-0 rounded-full blur-lg opacity-40 animate-pulse"
                 style={{background: 'linear-gradient(135deg, #4ECDC4, #A06CD5)'}}></div>
            <div className="relative rounded-full p-[2px]"
                 style={{background: 'linear-gradient(135deg, #4ECDC4, #A06CD5)'}}>
                <img src={`https://picsum.photos/seed/${user.name}/50/50`} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-white text-[#FF6B6B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FF6B6B]/30 shadow-sm">Lvl.{rpg.level}</span>
        </div>
      </div>

      {/* Sync Status */}
      {isSyncing && (
          <div className="flex justify-center mb-4 relative z-10">
              <span className="text-[10px] px-4 py-2 rounded-full text-[#4ECDC4] flex items-center gap-2 animate-pulse font-semibold"
                    style={glassStyle}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                  {t('syncing')}
              </span>
          </div>
      )}

      {/* SPECIAL MODES */}
      {user.specialMode === 'DamageControl' && (
          <div className="p-5 rounded-3xl mb-6 flex items-start gap-3 animate-pulse-glow relative z-10"
               style={{...glassStyle, background: 'rgba(255, 235, 235, 0.7)', border: '1.5px solid rgba(255, 107, 107, 0.3)'}}>
              <div className="p-2 rounded-2xl text-[#FF6B6B]" style={{background: 'rgba(255, 107, 107, 0.15)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div>
                  <h3 className="text-[#FF6B6B] font-bold text-sm uppercase tracking-wider">{t('damage_control_active')}</h3>
                  <p className="text-[#1A202C]/80 text-xs mt-1 font-medium">{t('damage_control_msg')}</p>
              </div>
          </div>
      )}

      {user.specialMode === 'Travel' && (
          <div className="p-5 rounded-3xl mb-6 flex items-start gap-3 relative z-10"
               style={{...glassStyle, background: 'rgba(235, 255, 252, 0.7)', border: '1.5px solid rgba(78, 205, 196, 0.3)'}}>
              <div className="p-2 rounded-2xl text-[#4ECDC4]" style={{background: 'rgba(78, 205, 196, 0.15)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                  <h3 className="text-[#4ECDC4] font-bold text-sm uppercase tracking-wider">{t('travel_active')}</h3>
                  <p className="text-[#1A202C]/80 text-xs mt-1 font-medium">{t('travel_msg')}</p>
              </div>
          </div>
      )}

      {/* Sedentary Savior */}
      {user.activityLevel === 'Sedentary' && (
           <div className="p-5 rounded-3xl mb-6 flex items-center justify-between relative z-10"
                style={{...glassStyle, background: 'rgba(245, 235, 255, 0.7)', border: '1.5px solid rgba(160, 108, 213, 0.3)'}}>
               <div className="flex gap-3 items-center">
                    <div className="p-2 rounded-2xl text-2xl" style={{background: 'rgba(160, 108, 213, 0.15)'}}>🧘‍♂️</div>
                    <div>
                        <h3 className="text-[#A06CD5] font-bold text-sm uppercase tracking-wider">{t('sedentary_savior')}</h3>
                        <p className="text-[#1A202C]/80 text-xs mt-1 font-medium">{t('stretch_msg')}</p>
                    </div>
               </div>
               <button className="px-4 py-2 rounded-xl text-[10px] font-bold text-white shadow-md hover:shadow-lg transition"
                       style={{background: 'linear-gradient(135deg, #A06CD5, #8E5BC0)'}}>{t('stretch_now')}</button>
           </div>
      )}

      {/* Hero Mode (RPG) */}
      <div className="p-6 rounded-3xl mb-6 relative overflow-hidden group z-10" style={glassStyle}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-20"
               style={{background: 'linear-gradient(135deg, #A06CD5, #FF6B6B)'}}></div>
          
          <div className="flex justify-between items-end mb-5 relative z-10">
              <div>
                  <h3 className="text-[#1A202C] font-bold text-lg flex items-center gap-2">
                      <span className="text-xl">⚔️</span> {t('hero_mode')}
                  </h3>
                  <p className="text-[10px] text-[#A06CD5] font-mono tracking-wider font-bold mt-1">{rpg.title} • {t('level')} {rpg.level}</p>
              </div>
              <div className="text-right">
                  <span className="text-2xl font-bold text-[#1A202C] block leading-none">{rpg.currentXP}</span>
                  <span className="text-xs text-[#1A202C]/60 uppercase tracking-widest font-semibold">/ {rpg.nextLevelXP} XP</span>
              </div>
          </div>
          
          <div className="h-2.5 rounded-full overflow-hidden mb-6 relative z-10" style={{background: 'rgba(26, 32, 44, 0.08)'}}>
               <div className="h-full" style={{
                 background: 'linear-gradient(90deg, #A06CD5, #FF6B6B)',
                 width: `${Math.min((rpg.currentXP / rpg.nextLevelXP) * 100, 100)}%`
               }}></div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 relative z-10">
               <StatBar label={t('str')} level={rpg.attributes.strength.level} xp={rpg.attributes.strength.xp} maxXP={rpg.attributes.strength.maxXP} color="text-[#FF6B6B]" />
               <StatBar label={t('agi')} level={rpg.attributes.agility.level} xp={rpg.attributes.agility.xp} maxXP={rpg.attributes.agility.maxXP} color="text-[#4ECDC4]" />
               <StatBar label={t('end')} level={rpg.attributes.endurance.level} xp={rpg.attributes.endurance.xp} maxXP={rpg.attributes.endurance.maxXP} color="text-[#FF8E8E]" />
               <StatBar label={t('int')} level={rpg.attributes.intelligence.level} xp={rpg.attributes.intelligence.xp} maxXP={rpg.attributes.intelligence.maxXP} color="text-[#4ECDC4]" />
               <div className="col-span-2">
                   <StatBar label={t('mana')} level={rpg.attributes.mana.level} xp={rpg.attributes.mana.xp} maxXP={rpg.attributes.mana.maxXP} color="text-[#A06CD5]" />
               </div>
          </div>
      </div>

      {/* Interactive Red/Orange Liquid Calorie Card */}
      <div 
        ref={cardRef}
        className="mb-6 relative h-52 rounded-3xl overflow-hidden group cursor-pointer z-10 transition-transform duration-100 ease-out" 
        onClick={() => navigate('nutrition')} 
        style={glassStyle}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
         <div className="absolute bottom-0 left-0 w-[110%] transition-transform duration-300 ease-out z-0" 
              style={{ 
                height: `${Math.max(20, fillPercent)}%`, // Ensure some liquid always shows
                transform: `translate(${waveOffset.x * 2}px, ${waveOffset.y}px)`,
                background: 'linear-gradient(to top, rgba(255, 107, 107, 0.6), rgba(255, 142, 142, 0.2))'
              }}>
             <div className="absolute -top-6 left-[-10%] w-[200%] h-12 animate-wave opacity-70"
                  style={{
                    background: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGw0OCA4Ljg1YzQ4IDguODYgMTQ0IDI2LjU4IDI0MCAyNi41OHMyNDAtMTcuNzIgMzM2LTE3LjcyIDIzOS43IDE3LjcyIDMzNiAxNy43MkwxMjAwIDB2MTIwSDB6IiBmaWxsPSJyZ2JhKDI1NSwgNTAsIDUwLCAwLjQpIi8+PC9zdmc+')",
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: '50% 100%'
                  }}></div>
            <div className="absolute -top-4 left-0 w-[200%] h-10 animate-wave opacity-50 animation-delay-2000"
                  style={{
                    animationDuration: '7s',
                    background: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGw0OCA4Ljg1YzQ4IDguODYgMTQ0IDI2LjU4IDI0MCAyNi41OHMyNDAtMTcuNzIgMzM2LTE3LjcyIDIzOS43IDE3LjcyIDMzNiAxNy43MkwxMjAwIDB2MTIwSDB6IiBmaWxsPSJyZ2JhKDI1NSwgMTQwLCAwLCAwLjMpIi8+PC9zdmc+')",
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: '50% 100%'
                  }}></div>
         </div>
         <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
             <div className="flex justify-between items-start">
                 <div>
                     <h2 className="text-[#1A202C] font-bold text-lg mb-1">Calories</h2>
                     <p className="text-[#1A202C]/60 text-xs font-semibold">{t('consumed')}</p>
                 </div>
                 <div className="p-2.5 rounded-full backdrop-blur-md shadow-sm" style={{background: 'rgba(255, 255, 255, 0.6)'}}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF6B6B]"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4.143-3-6 1.958 1.958 3.036 4.036 5 6 .482.482.946.946 1.5 1.5.091.091.182.182.273.273"/></svg>
                 </div>
             </div>
             <div style={{ transform: `translate(${waveOffset.x}px, ${waveOffset.y}px)`, transition: 'transform 0.2s ease-out' }}>
                 <span className="text-4xl font-bold text-[#1A202C]">{caloriesConsumed.toFixed(0)}</span>
                 <span className="text-sm text-[#1A202C]/60 ml-2 font-bold">/ {totalCalorieTarget} kcal</span>
                 {activeCalories > 0 && <span className="text-[10px] block text-[#FF6B6B] font-bold mt-1.5">(+{activeCalories} active)</span>}
             </div>
         </div>
      </div>

      {/* Sleep & Recovery (Only Visible if Device Connected) */}
      {user.connectedDevices && user.connectedDevices.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6 z-10 relative">
            <div className="p-5 rounded-3xl relative overflow-hidden" style={glassStyle}>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 rounded-xl" style={{background: 'rgba(160, 108, 213, 0.15)', color: '#A06CD5'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.35 2.15a.5.5 0 0 1 .45.85 11 11 0 1 0 9.2 9.2.5.5 0 0 1 .85.45A12 12 0 1 1 12.35 2.15z"/></svg>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A202C]/60">{t('sleep_analysis')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#1A202C]">{user.dailyStats?.sleepHours}</span>
                    <span className="text-xs text-[#1A202C]/50 font-semibold">hrs</span>
                </div>
                <div className={`text-[10px] mt-2 px-2 py-1 rounded-lg inline-block font-bold ${user.dailyStats?.sleepQuality === 'Poor' ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}
                        style={{background: user.dailyStats?.sleepQuality === 'Poor' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(78, 205, 196, 0.15)'}}>
                    {user.dailyStats?.sleepQuality}
                </div>
            </div>
            <div className="p-5 rounded-3xl relative overflow-hidden" style={glassStyle}>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 rounded-xl" style={{background: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A202C]/60">{t('active_calories')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#1A202C]">{activeCalories}</span>
                    <span className="text-xs text-[#1A202C]/50 font-semibold">kcal</span>
                </div>
                <div className="text-[10px] text-[#1A202C]/50 mt-2 font-medium">
                    {user.dailyStats?.steps} {t('step_count')}
                </div>
            </div>
        </div>
      )}

      {/* Water Tracker */}
      <div className="p-6 rounded-3xl mb-6 flex items-center justify-between z-10 relative" 
           style={glassStyle}>
          <div>
              <h3 className="text-[#4ECDC4] font-bold text-sm uppercase tracking-wider mb-1.5">{t('water_tracker')}</h3>
              <p className="text-[#1A202C] text-xl font-bold">{waterIntake.toFixed(1)} <span className="text-[#1A202C]/50 text-sm">/ {user.targetWaterPerDay} L</span></p>
          </div>
          <div className="flex items-center gap-3">
              <button onClick={() => setWaterIntake(Math.max(0, waterIntake - 0.25))} className="p-2.5 rounded-full text-[#1A202C] border transition-all hover:scale-105" style={{background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)'}}>-</button>
              <div className="h-12 w-12 rounded-full flex items-center justify-center border text-xl shadow-sm" style={{background: 'rgba(78, 205, 196, 0.15)', border: '1.5px solid rgba(78, 205, 196, 0.3)', color: '#4ECDC4'}}>💧</div>
              <button onClick={() => setWaterIntake(waterIntake + 0.25)} className="p-2.5 rounded-full text-[#1A202C] border transition-all hover:scale-105" style={{background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)'}}>+</button>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 z-10 relative">
        <h2 className="text-lg font-bold text-white mb-4 pl-1 flex items-center gap-2 drop-shadow-md">
            <span className="w-1 h-6 rounded-full" style={{background: 'linear-gradient(to bottom, #4ECDC4, #2AA198)'}}></span>
            {t('quick_actions')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowLogModal(true)} className="p-6 rounded-3xl text-left shadow-lg hover:scale-[1.02] transition-all border"
                    style={{background: 'linear-gradient(135deg, #4ECDC4, #2AA198)', border: '1.5px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.25)'}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm border" style={{background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-white font-bold text-sm">{t('log_meal')}</h3>
                <p className="text-white/90 text-xs mt-1">{t('log_meal_desc')}</p>
            </button>
            <button onClick={() => setShowActivityModal(true)} className="p-6 rounded-3xl text-left hover:scale-[1.02] transition-all"
                    style={glassStyle}>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border" style={{background: 'rgba(255, 107, 107, 0.15)', border: '1.5px solid rgba(255, 107, 107, 0.2)'}}>
                    <span className="text-2xl">🏃‍♂️</span>
                </div>
                <h3 className="text-[#1A202C] font-bold text-sm">{t('log_activity')}</h3>
                <p className="text-[#1A202C]/60 text-xs mt-1">{t('log_activity_desc')}</p>
            </button>
            <button onClick={() => setShowDrinkModal(true)} className="p-6 rounded-3xl text-left hover:scale-[1.02] transition-all"
                    style={glassStyle}>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border" style={{background: 'rgba(78, 205, 196, 0.15)', border: '1.5px solid rgba(78, 205, 196, 0.2)'}}>
                    <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-[#1A202C] font-bold text-sm">{t('log_drink')}</h3>
                <p className="text-[#1A202C]/60 text-xs mt-1 font-medium">Coffee, Tea, etc.</p>
            </button>
            
            <button onClick={activateDamageControl} className="p-6 rounded-3xl text-left hover:scale-[1.02] transition-all"
                    style={glassStyle}>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border" style={{background: 'rgba(255, 107, 107, 0.2)', border: '1.5px solid rgba(255, 107, 107, 0.3)'}}>
                    <span className="text-2xl">🚨</span>
                </div>
                <h3 className="text-[#FF6B6B] font-bold text-sm">{t('damage_control')}</h3>
                <p className="text-[#1A202C]/60 text-xs mt-1 font-medium">{t('i_overate')}</p>
            </button>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
          <div className="fixed inset-0 z-[60] backdrop-blur-lg flex items-end sm:items-center justify-center animate-fade-in" style={{background: 'rgba(0, 0, 0, 0.4)'}}>
              <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[85vh] flex flex-col"
                   style={{...glassStyle, background: 'rgba(255, 255, 255, 0.85)'}}>
                  <button onClick={() => setShowActivityModal(false)} className="absolute top-4 right-4 text-[#1A202C]/60 hover:text-[#1A202C]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <h3 className="text-xl font-bold text-[#1A202C] mb-6">{t('log_activity')}</h3>
                  <div className="space-y-4">
                       <div>
                           <label className="text-xs text-[#FF6B6B] font-bold uppercase tracking-wider block mb-2">{t('activity_name')}</label>
                           <input type="text" value={activityName} onChange={e => setActivityName(e.target.value)} className="w-full p-3 rounded-2xl text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="e.g. Soccer, Running" style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}} />
                       </div>
                       <div>
                           <label className="text-xs text-[#1A202C]/60 font-semibold block mb-2">{t('duration_min')}</label>
                           <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 rounded-2xl text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="60" style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}} />
                       </div>

                       {analyzedActivity ? (
                           <div className="p-5 rounded-2xl text-center animate-fade-in" style={{background: 'rgba(255, 107, 107, 0.12)', border: '1.5px solid rgba(255, 107, 107, 0.25)'}}>
                               <p className="text-[#1A202C]/70 text-sm mb-1">{analyzedActivity.name}</p>
                               <p className="text-3xl font-bold text-[#FF6B6B]">{analyzedActivity.calories} <span className="text-xs text-[#1A202C]/50 font-normal">KCAL</span></p>
                           </div>
                       ) : null}

                       {!analyzedActivity ? (
                           <button onClick={handleAnalyzeActivity} disabled={analyzingActivity || !activityName || !duration} className="w-full py-3 text-white rounded-2xl font-bold shadow-lg flex justify-center items-center gap-2 transition hover:scale-[1.02] disabled:opacity-40" style={{background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)', boxShadow: '0 8px 32px 0 rgba(255, 107, 107, 0.25)'}}>
                                {analyzingActivity ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                                {t('analyze')}
                           </button>
                       ) : (
                           <button onClick={handleLogActivity} className="w-full py-3 text-white rounded-2xl font-bold shadow-lg transition hover:scale-[1.02]" style={{background: 'linear-gradient(135deg, #4ECDC4, #2AA198)', boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.25)'}}>
                                {t('log_this_activity')}
                           </button>
                       )}
                  </div>
              </div>
          </div>
      )}

      {/* Drink Modal */}
      {showDrinkModal && (
          <div className="fixed inset-0 z-[60] backdrop-blur-lg flex items-end sm:items-center justify-center animate-fade-in" style={{background: 'rgba(0, 0, 0, 0.4)'}}>
              <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[85vh] flex flex-col"
                   style={{...glassStyle, background: 'rgba(255, 255, 255, 0.85)'}}>
                  <button onClick={() => setShowDrinkModal(false)} className="absolute top-4 right-4 text-[#1A202C]/60 hover:text-[#1A202C]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <h3 className="text-xl font-bold text-[#1A202C] mb-6">{t('log_drink')}</h3>
                  <div className="space-y-4">
                       <div>
                           <label className="text-xs text-[#4ECDC4] font-bold uppercase tracking-wider block mb-2">{t('drink_name')}</label>
                           <input type="text" value={drinkName} onChange={e => setDrinkName(e.target.value)} className="w-full p-3 rounded-2xl text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]" placeholder="e.g. Green Tea" style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-[#1A202C]/60 font-semibold block mb-2">{t('sugar_spoons')}</label>
                                <div className="flex items-center gap-2 rounded-2xl p-2" style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}}>
                                    <button onClick={() => setSugarSpoons(Math.max(0, sugarSpoons - 0.5))} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-[#1A202C] font-bold shadow-sm">-</button>
                                    <span className="flex-1 text-center font-mono text-[#1A202C]">{sugarSpoons}</span>
                                    <button onClick={() => setSugarSpoons(sugarSpoons + 0.5)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-[#1A202C] font-bold shadow-sm">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-[#1A202C]/60 font-semibold block mb-2">{t('additives')}</label>
                                <input type="text" value={additives} onChange={e => setAdditives(e.target.value)} className="w-full p-3 rounded-2xl text-[#1A202C] text-sm" placeholder="Milk, Cream..." style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}} />
                            </div>
                       </div>
                       <button onClick={handleLogDrink} disabled={analyzingDrink || !drinkName} className="w-full py-4 mt-4 text-white rounded-2xl font-bold shadow-lg flex justify-center items-center gap-2 transition hover:scale-[1.02] disabled:opacity-40" style={{background: 'linear-gradient(135deg, #4ECDC4, #2AA198)', boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.25)'}}>
                            {analyzingDrink ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                            {t('log_this_meal')}
                        </button>
                  </div>
              </div>
          </div>
      )}

      {/* Meal Log Modal */}
      {showLogModal && (
          <div className="fixed inset-0 z-[60] backdrop-blur-lg flex items-end sm:items-center justify-center animate-fade-in" style={{background: 'rgba(0, 0, 0, 0.4)'}}>
              <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[85vh] flex flex-col"
                   style={{...glassStyle, background: 'rgba(255, 255, 255, 0.85)'}}>
                  <button onClick={() => setShowLogModal(false)} className="absolute top-4 right-4 text-[#1A202C]/60 hover:text-[#1A202C]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <h3 className="text-xl font-bold text-[#1A202C] mb-4">{t('analyze_food')}</h3>
                  {!analyzedMeal ? (
                      <>
                        <textarea className="w-full p-4 rounded-2xl text-[#1A202C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] mb-4 h-32 resize-none" placeholder={t('food_log_placeholder')} value={customLogText} onChange={(e) => setCustomLogText(e.target.value)} style={{background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.9)'}} />
                        <button onClick={handleAnalyze} disabled={analyzing || !customLogText} className="w-full py-3 text-white rounded-2xl font-bold shadow-lg disabled:opacity-40 flex justify-center items-center transition hover:scale-[1.02]" style={{background: 'linear-gradient(135deg, #4ECDC4, #2AA198)', boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.25)'}}>
                            {analyzing ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span> : null}
                            {analyzing ? t('analyzing') : t('analyze')}
                        </button>
                      </>
                  ) : (
                      <div className="animate-fade-in">
                           <div className="mb-4 text-center">
                               <div className="text-3xl mb-2">🥗</div>
                               <h4 className="text-[#1A202C] font-bold text-lg">{analyzedMeal.name}</h4>
                               <p className="text-[#1A202C]/60 text-xs mt-1">{analyzedMeal.description}</p>
                           </div>
                           <div className="grid grid-cols-4 gap-3 mb-6">
                               <div className="p-3 rounded-2xl text-center" style={{background: 'rgba(255, 255, 255, 0.6)'}}><span className="block text-lg font-bold text-[#1A202C]">{analyzedMeal.calories}</span><span className="text-[9px] text-[#1A202C]/50 uppercase">Kcal</span></div>
                               <div className="p-3 rounded-2xl text-center" style={{background: 'rgba(78, 205, 196, 0.15)'}}><span className="block text-lg font-bold text-[#4ECDC4]">{analyzedMeal.protein}</span><span className="text-[9px] text-[#1A202C]/50 uppercase">Prot</span></div>
                               <div className="p-3 rounded-2xl text-center" style={{background: 'rgba(255, 107, 107, 0.15)'}}><span className="block text-lg font-bold text-[#FF6B6B]">{analyzedMeal.carbs}</span><span className="text-[9px] text-[#1A202C]/50 uppercase">Carb</span></div>
                               <div className="p-3 rounded-2xl text-center" style={{background: 'rgba(255, 142, 142, 0.15)'}}><span className="block text-lg font-bold text-[#FF8E8E]">{analyzedMeal.fats}</span><span className="text-[9px] text-[#1A202C]/50 uppercase">Fat</span></div>
                           </div>
                           <div className="space-y-3">
                                <button onClick={handleConfirmLog} className="w-full py-3 text-white rounded-2xl font-bold transition hover:scale-[1.02]" style={{background: 'linear-gradient(135deg, #4ECDC4, #2AA198)', boxShadow: '0 8px 32px 0 rgba(78, 205, 196, 0.25)'}}>{t('log_this_meal')}</button>
                                <button onClick={() => { toggleFavoriteMeal(analyzedMeal); handleConfirmLog(); }} className="w-full py-3 text-[#4ECDC4] rounded-2xl font-bold border transition hover:scale-[1.02]" style={{background: 'rgba(255, 255, 255, 0.7)', border: '1.5px solid rgba(78, 205, 196, 0.4)'}}>{t('add_to_fav')}</button>
                           </div>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
