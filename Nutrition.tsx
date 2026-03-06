
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../context/Store';
import { generateWeeklyPlan, analyzeNutritionLabel } from '../services/geminiService';
import { Meal, FoodCategory, FoodItem, LabelAnalysis } from '../types';

// --- Shared Components ---
const ModalOverlay = ({ children, onClose }: { children?: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
        <div className="bg-[#F0F4F8]/90 backdrop-blur-xl border border-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col transition-transform duration-300" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

const ChefIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
);

// --- Sub-Components ---

const MealCard: React.FC<{ 
    title: string; 
    meals: Meal[]; 
    dayIndex: number; 
    mealType: 'breakfast'|'lunch'|'dinner'|'snack'; 
    isFavorite: (m: Meal) => boolean; 
    onToggle: (m: Meal) => void; 
    onLog: (m: Meal) => void; 
    t: any;
    hydrateMealDetail: any;
    openRecipe: (meal: Meal, type: any, idx: number) => void;
}> = ({ title, meals, dayIndex, mealType, isFavorite, onToggle, onLog, t, hydrateMealDetail, openRecipe }) => {
    const { analyzeCustomMeal, logConsumedMeal, toggleFavoriteMeal } = useAppStore();
    const [selectedOption, setSelectedOption] = useState<number | 'custom'>(0);
    const [eaten, setEaten] = useState(false);
    
    // Animation states
    const [heartAnimating, setHeartAnimating] = useState(false);
    
    // Custom Meal State
    const [customType, setCustomType] = useState('');
    const [customQty, setCustomQty] = useState('');
    const [customMeal, setCustomMeal] = useState<Meal | null>(null);
    const [analyzingCustom, setAnalyzingCustom] = useState(false);
    
    const currentMeal = selectedOption === 'custom' ? customMeal : (meals && meals.length > 0 ? meals[selectedOption as number] : null);

    const handleLog = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMeal && !eaten) {
            onLog(currentMeal);
            setEaten(true);
        }
    }

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMeal) {
            setHeartAnimating(true);
            onToggle(currentMeal);
            setTimeout(() => setHeartAnimating(false), 400); // Reset animation
        }
    }
    
    const handleAnalyzeCustom = async () => {
        if(!customType || !customQty) return;
        setAnalyzingCustom(true);
        const text = `${customQty} ${customType}`;
        const result = await analyzeCustomMeal(text);
        setCustomMeal(result);
        setAnalyzingCustom(false);
    }

    return (
        <div className={`glass-panel p-0 rounded-3xl mb-5 overflow-hidden transition-all duration-500 ease-out group ${eaten ? 'border-[#4ECDC4] bg-[#4ECDC4]/5 shadow-[0_0_25px_rgba(78,205,196,0.15)] ring-1 ring-[#4ECDC4]/50 scale-[1.01]' : 'hover:border-[#4ECDC4]/50 hover:shadow-lg'}`}>
            {/* Header */}
            <div className="flex items-center justify-between bg-white/40 px-5 py-3 border-b border-white/50">
                <h4 className="text-[#4ECDC4] text-xs uppercase font-bold tracking-widest">{title}</h4>
                <div className="flex bg-slate-100 rounded-lg p-0.5 overflow-x-auto scrollbar-hide max-w-[200px]">
                    {meals && meals.map((_, idx) => (
                        <button key={idx} onClick={() => setSelectedOption(idx)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${selectedOption === idx ? 'bg-[#4ECDC4] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t('option')} {idx + 1}</button>
                    ))}
                        <button onClick={() => setSelectedOption('custom')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${selectedOption === 'custom' ? 'bg-[#A06CD5] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t('custom_option')}</button>
                </div>
            </div>

            <div className="p-5 relative">
                {selectedOption === 'custom' ? (
                    !customMeal ? (
                        <div className="space-y-3">
                            <input type="text" value={customType} onChange={e => setCustomType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs" placeholder={t('enter_type')} />
                            <input type="text" value={customQty} onChange={e => setCustomQty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs" placeholder={t('enter_qty')} />
                            <button onClick={handleAnalyzeCustom} disabled={analyzingCustom || !customType} className="w-full py-3 bg-[#A06CD5] hover:bg-[#8e5bc0] text-white rounded-xl font-bold text-xs flex justify-center items-center">{analyzingCustom ? '...' : t('analyze')}</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div><h3 className="text-slate-800 font-bold">{customMeal.name}</h3><p className="text-[10px] text-slate-500">{customMeal.calories} Kcal</p></div>
                                <button onClick={() => setCustomMeal(null)} className="text-xs text-slate-500 hover:text-slate-700">Edit</button>
                            </div>
                            <button onClick={() => { logConsumedMeal(customMeal); setEaten(true); }} disabled={eaten} className={`w-full py-2 rounded-xl text-xs font-bold transition ${eaten ? 'bg-[#4ECDC4] text-white' : 'bg-[#4ECDC4]/20 text-[#2AA198]'}`}>{eaten ? t('consumed') : t('log_this_meal')}</button>
                        </div>
                    )
                ) : (
                    currentMeal && (
                        <div className="relative">
                            <button 
                                onClick={handleToggleFavorite} 
                                className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-300 z-10 active:scale-90 ${isFavorite(currentMeal) ? 'text-red-500 bg-red-100 shadow-sm' : 'text-slate-400 bg-white/50 hover:bg-white'} ${heartAnimating ? 'scale-125 rotate-12' : 'scale-100'}`}
                            >
                                <HeartIcon filled={isFavorite(currentMeal)} />
                            </button>
                            
                            <h3 className="text-slate-800 font-bold text-lg leading-tight mb-2 pr-8">{currentMeal.name}</h3>
                            <div className="flex items-center gap-3 mb-4"><span className="text-xl font-bold text-slate-800">{currentMeal.calories}<span className="text-[10px] text-slate-500 ml-1 font-normal uppercase">Kcal</span></span></div>
                            <div className="space-y-1.5 mb-4">
                                {/* Macros */}
                                <div className="flex items-center gap-2 text-[10px]"><span className="w-8 font-bold text-slate-500">P</span><div className="flex-1 h-1.5 bg-slate-200 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((currentMeal.protein/50)*100, 100)}%` }}></div></div><span className="w-6 text-right text-blue-600">{currentMeal.protein}</span></div>
                                <div className="flex items-center gap-2 text-[10px]"><span className="w-8 font-bold text-slate-500">C</span><div className="flex-1 h-1.5 bg-slate-200 rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min((currentMeal.carbs/100)*100, 100)}%` }}></div></div><span className="w-6 text-right text-orange-600">{currentMeal.carbs}</span></div>
                                <div className="flex items-center gap-2 text-[10px]"><span className="w-8 font-bold text-slate-500">F</span><div className="flex-1 h-1.5 bg-slate-200 rounded-full"><div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((currentMeal.fats/40)*100, 100)}%` }}></div></div><span className="w-6 text-right text-yellow-600">{currentMeal.fats}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openRecipe(currentMeal, mealType, selectedOption as number)} className="flex-1 py-3 bg-white/60 text-[#2AA198] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#4ECDC4] hover:text-white transition border border-white"><ChefIcon /> {t('view_recipe')}</button>
                                <button 
                                    onClick={handleLog} 
                                    disabled={eaten} 
                                    className={`px-4 rounded-xl flex items-center justify-center transition-all duration-500 ${eaten ? 'bg-[#4ECDC4] text-white w-12 scale-105' : 'bg-white/60 text-[#4ECDC4] border border-white hover:bg-[#4ECDC4] hover:text-white w-12 hover:w-14'}`}
                                >
                                    {eaten ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-[scale-in_0.3s_ease-out]"><polyline points="20 6 9 17 4 12"/></svg>
                                    ) : '+'}
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
            
             {/* Subtle splash effect for logging */}
             {eaten && (
                 <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#4ECDC4]/5 rounded-full animate-pulse opacity-0"></div>
                 </div>
             )}
        </div>
    );
};

const RecipeModal = ({ meal, onClose, t }: { meal: Meal, onClose: () => void, t: any }) => (
    <ModalOverlay onClose={onClose}>
        <div className="p-5 border-b border-white/40 flex justify-between items-center bg-white/60 sticky top-0 z-10 backdrop-blur-md">
            <h3 className="text-slate-800 font-bold text-lg">{t('view_recipe')}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] to-[#2AA198]">{meal.name}</h2>
            <div className="grid grid-cols-3 gap-3"><div className="glass-panel p-3 rounded-2xl text-center bg-white/60"><span className="block text-2xl font-bold text-slate-800">{meal.calories}</span><span className="text-[10px] text-slate-500 uppercase">Kcal</span></div><div className="glass-panel p-3 rounded-2xl text-center bg-white/60"><span className="block text-2xl font-bold text-blue-500">{meal.protein}g</span><span className="text-[10px] text-slate-500 uppercase">Prot</span></div><div className="glass-panel p-3 rounded-2xl text-center bg-white/60"><span className="block text-2xl font-bold text-orange-500">{meal.carbs}g</span><span className="text-[10px] text-slate-500 uppercase">Carb</span></div></div>
            <div><h4 className="text-[#4ECDC4] font-bold uppercase text-xs tracking-wider mb-2">{t('ingredients')}</h4><ul className="space-y-2">{meal.ingredients.map((ing, i) => <li key={i} className="flex justify-between text-sm text-slate-700 bg-white/60 p-3 rounded-xl border border-white/50"><span>{ing.item}</span><span className="text-[#2AA198] font-bold">{ing.amount}</span></li>)}</ul></div>
            <div><h4 className="text-[#4ECDC4] font-bold uppercase text-xs tracking-wider mb-2">{t('instructions')}</h4>{meal.steps && meal.steps.length > 0 ? <ol className="space-y-4 ml-4 list-decimal text-slate-700 text-sm">{meal.steps.map((s,i) => <li key={i}>{s}</li>)}</ol> : <p className="text-slate-500 italic">Loading...</p>}</div>
            {meal.tips && <div className="bg-yellow-100/50 p-4 rounded-2xl border border-yellow-200"><h4 className="text-yellow-600 font-bold text-xs uppercase mb-1">💡 {t('tips')}</h4><p className="text-slate-700 text-xs italic">"{meal.tips}"</p></div>}
        </div>
    </ModalOverlay>
);

const FoodCard: React.FC<{ item: FoodItem; currency: string; t: any; getLocalizedName: any; getFoodImage: any; onUpdate: any; onToggleAvailability: any }> = ({ item, currency, t, getLocalizedName, getFoodImage, onUpdate, onToggleAvailability }) => (
    <div className={`glass-panel p-4 rounded-2xl flex flex-col gap-3 relative transition-all duration-300 ${item.isAvailable ? 'bg-emerald-50/50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'hover:bg-white/40 opacity-70 grayscale'}`}>
        <div className="flex justify-between items-start">
            <div className="bg-white/60 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white/50">{getFoodImage(item.name)}</div>
            <div className="flex flex-col items-end"><span className="text-[9px] text-[#4ECDC4] uppercase tracking-widest font-bold">{t(item.category as any) || item.category}</span><span className="text-[10px] text-slate-400 mt-1">{item.caloriesPer100g} kcal/100g</span></div>
        </div>
        <h3 className="text-slate-800 font-bold text-sm truncate">{getLocalizedName(item.name)}</h3>
        <button onClick={() => onToggleAvailability(item.id)} className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${item.isAvailable ? 'bg-[#4ECDC4] text-white' : 'bg-slate-200 text-slate-500'}`}>{item.isAvailable ? t('available') : t('not_available')}</button>
        {item.isAvailable && <div className="flex justify-between items-center text-xs mt-2"><span className="text-slate-500">{t('price')}</span><span className="text-[#2AA198] font-mono font-bold">{item.price} {currency}</span></div>}
    </div>
);

export const Nutrition = () => {
    const { user, plan, setPlan, setLoading, isLoading, toggleFavoriteMeal, logConsumedMeal, hydrateMealDetail, generateShoppingList, updateFoodItem, addFoodItem, toggleFoodAvailability, refreshFoodPrices, calculateFoodEfficiency, t, getLocalizedFoodName, getFoodImage } = useAppStore();
    const [activeTab, setActiveTab] = useState<'plan' | 'database' | 'economy' | 'shopping'>('plan');
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
    const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const newPlan = await generateWeeklyPlan(user);
        if (newPlan) setPlan(newPlan);
        setLoading(false);
    };

    const openRecipe = async (meal: Meal, type: any, idx: number) => {
        setSelectedRecipe(meal);
        if (!meal.steps || meal.steps.length === 0) {
            await hydrateMealDetail(activeDayIndex, type, idx, meal);
        }
    };
    
    useEffect(() => {
        if (selectedRecipe && plan && plan.days[activeDayIndex]) {
            const types = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
            for (const type of types) {
                const found = plan.days[activeDayIndex].meals[type].find(m => m.name === selectedRecipe.name);
                if (found) { setSelectedRecipe(found); break; }
            }
        }
    }, [plan]);

    const filteredFoods = useMemo(() => {
        return user.foodDatabase.filter(food => {
            const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
            const matchesSearch = getLocalizedFoodName(food.name).toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAvailability = !showAvailableOnly || food.isAvailable;
            return matchesCategory && matchesSearch && matchesAvailability;
        }).sort((a, b) => (a.isAvailable === b.isAvailable) ? b.preference - a.preference : (a.isAvailable ? -1 : 1));
    }, [user.foodDatabase, selectedCategory, searchTerm, showAvailableOnly]);

    const proteinRankings = useMemo(() => calculateFoodEfficiency('protein'), [user.foodDatabase]);
    const energyRankings = useMemo(() => calculateFoodEfficiency('calories'), [user.foodDatabase]);
    const shoppingList = useMemo(() => generateShoppingList(), [plan]);

    const activeDay = plan?.days?.[activeDayIndex];
    const categories: FoodCategory[] = ['Vegetables', 'Fruits', 'Proteins', 'Carbs', 'Dairy', 'Fats', 'Beverages', 'Snacks'];

    return (
        <div className="h-full flex flex-col relative z-10 pb-24">
            {/* Header */}
            <div className="bg-[#F0F4F8]/80 border-b border-white/50 sticky top-0 z-20 pt-4 px-4 pb-0 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800 tracking-wide">{t('nutrition')}</h1>
                    {activeTab === 'plan' && <button onClick={handleGenerate} className="text-[10px] text-[#4ECDC4] border border-[#4ECDC4]/30 px-3 py-1.5 rounded-full hover:bg-[#4ECDC4]/10 transition">{t('regenerate')}</button>}
                    {activeTab === 'database' && <button onClick={async () => { setIsRefreshingPrices(true); await refreshFoodPrices(); setIsRefreshingPrices(false); }} className="text-[10px] text-[#2AA198] flex items-center gap-1">{isRefreshingPrices ? '...' : t('refresh_prices')}</button>}
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {['plan', 'database', 'economy', 'shopping'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-sm font-bold border-b-2 transition capitalize ${activeTab === tab ? 'text-[#4ECDC4] border-[#4ECDC4]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{tab === 'plan' ? t('diet') : tab === 'database' ? t('food_db') : tab === 'economy' ? t('smart_economy') : t('shopping_list')}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {activeTab === 'plan' && (
                    <>
                        {plan && activeDay ? (
                            <>
                                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                                    {plan.days.map((day, idx) => (
                                        <button key={idx} onClick={() => setActiveDayIndex(idx)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${idx === activeDayIndex ? 'bg-[#4ECDC4] text-white' : 'bg-white/60 text-slate-500 border border-white'}`}>{day.day}</button>
                                    ))}
                                </div>
                                <MealCard title={t('breakfast')} meals={activeDay.meals.breakfast} dayIndex={activeDayIndex} mealType="breakfast" isFavorite={(m)=>user.favoriteMeals.some(f=>f.name===m.name)} onToggle={toggleFavoriteMeal} onLog={logConsumedMeal} t={t} hydrateMealDetail={hydrateMealDetail} openRecipe={openRecipe} />
                                <MealCard title={t('lunch')} meals={activeDay.meals.lunch} dayIndex={activeDayIndex} mealType="lunch" isFavorite={(m)=>user.favoriteMeals.some(f=>f.name===m.name)} onToggle={toggleFavoriteMeal} onLog={logConsumedMeal} t={t} hydrateMealDetail={hydrateMealDetail} openRecipe={openRecipe} />
                                <MealCard title={t('dinner')} meals={activeDay.meals.dinner} dayIndex={activeDayIndex} mealType="dinner" isFavorite={(m)=>user.favoriteMeals.some(f=>f.name===m.name)} onToggle={toggleFavoriteMeal} onLog={logConsumedMeal} t={t} hydrateMealDetail={hydrateMealDetail} openRecipe={openRecipe} />
                                <MealCard title={t('snack')} meals={activeDay.meals.snack} dayIndex={activeDayIndex} mealType="snack" isFavorite={(m)=>user.favoriteMeals.some(f=>f.name===m.name)} onToggle={toggleFavoriteMeal} onLog={logConsumedMeal} t={t} hydrateMealDetail={hydrateMealDetail} openRecipe={openRecipe} />
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 mb-4">{t('no_plan')}</p>
                                <button onClick={handleGenerate} className="bg-[#4ECDC4] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition">{t('generate_plan')}</button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'database' && (
                    <>
                        <div className="flex gap-2 mb-4">
                            <input type="text" placeholder={t('search_food')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 bg-white/60 border border-white/80 rounded-xl px-4 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]" />
                            <button onClick={() => setShowAvailableOnly(!showAvailableOnly)} className={`px-3 rounded-xl border text-xs ${showAvailableOnly ? 'bg-[#4ECDC4]/20 border-[#4ECDC4] text-[#2AA198]' : 'bg-white/60 border-white/80 text-slate-500'}`}>{t('in_stock')}</button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            <button onClick={() => setSelectedCategory('All')} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${selectedCategory === 'All' ? 'bg-[#1A202C] text-white' : 'bg-white/60 text-slate-500'}`}>{t('all')}</button>
                            {categories.map(c => <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${selectedCategory === c ? 'bg-[#4ECDC4] text-white' : 'bg-white/60 text-slate-500'}`}>{t(c as any)||c}</button>)}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {filteredFoods.map(item => (
                                <FoodCard key={item.id} item={item} currency={user.currency} t={t} getLocalizedName={getLocalizedFoodName} getFoodImage={getFoodImage} onUpdate={updateFoodItem} onToggleAvailability={toggleFoodAvailability} />
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'economy' && (
                    <div className="space-y-6">
                        <div className="glass-panel p-5 rounded-3xl">
                            <h3 className="text-slate-800 font-bold mb-4">🥩 {t('best_protein_value')}</h3>
                            {proteinRankings.slice(0, 5).map((e, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/50 last:border-0">
                                    <div className="flex items-center gap-3"><span className="text-slate-400 font-bold text-xs">{i+1}</span><div><p className="text-slate-800 text-sm font-bold">{getLocalizedFoodName(e.item.name)}</p><p className="text-[10px] text-slate-500">{e.item.proteinPer100g}g Prot/100g</p></div></div>
                                    <div className="text-right"><p className="text-[#4ECDC4] font-mono font-bold text-sm">{e.costPerGramProtein.toFixed(3)}</p><p className="text-[9px] text-slate-500">{user.currency}/g</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="glass-panel p-5 rounded-3xl">
                            <h3 className="text-slate-800 font-bold mb-4">⚡ {t('cheapest_energy')}</h3>
                            {energyRankings.slice(0, 5).map((e, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/50 last:border-0">
                                    <div className="flex items-center gap-3"><span className="text-slate-400 font-bold text-xs">{i+1}</span><div><p className="text-slate-800 text-sm font-bold">{getLocalizedFoodName(e.item.name)}</p><p className="text-[10px] text-slate-500">{e.item.caloriesPer100g} kcal/100g</p></div></div>
                                    <div className="text-right"><p className="text-blue-500 font-mono font-bold text-sm">{e.costPer100kcal.toFixed(3)}</p><p className="text-[9px] text-slate-500">{user.currency}/100kcal</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'shopping' && (
                    <div className="space-y-4">
                        {Object.entries(shoppingList).length === 0 ? <p className="text-center text-slate-500 mt-10">{t('no_plan')}</p> : 
                            Object.entries(shoppingList).map(([cat, items]) => (
                                <div key={cat} className="glass-panel p-4 rounded-2xl">
                                    <h4 className="text-[#4ECDC4] font-bold text-xs uppercase tracking-wider mb-2">{cat}</h4>
                                    <ul className="space-y-1">
                                        {(items as string[]).map((it, i) => <li key={i} className="text-sm text-slate-700 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>{it}</li>)}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>

            {selectedRecipe && <RecipeModal meal={selectedRecipe} onClose={() => setSelectedRecipe(null)} t={t} />}
        </div>
    );
};
