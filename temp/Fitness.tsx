
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/Store';
import { Exercise, WorkoutRoutine, NutrientInfo } from '../types';

const ModalOverlay = ({ children, onClose }: { children?: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] bg-white/40 backdrop-blur-md flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
        <div className="bg-[#F0F4F8]/90 backdrop-blur-xl border border-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col transition-transform duration-300" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

const ExerciseModal = ({ exercise, dayIndex, exerciseIndex, onClose, t, hydrateExerciseDetail }: { exercise: Exercise, dayIndex: number, exerciseIndex: number, onClose: () => void, t: any, hydrateExerciseDetail: any }) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!exercise.instructions || exercise.instructions.length === 0) {
            setLoading(true);
            hydrateExerciseDetail(dayIndex, exerciseIndex, exercise).then(() => setLoading(false));
        }
    }, []);

    const openVideo = () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " exercise")}`, '_blank');

    return (
        <ModalOverlay onClose={onClose}>
            <div className="p-5 border-b border-white/40 flex justify-between items-center bg-white/60 sticky top-0 z-10 backdrop-blur-md">
                <h3 className="text-slate-800 font-bold text-lg">{t('exercise_guide')}</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{exercise.name}</h2>
                <div className="flex gap-2 mb-4"><span className="px-3 py-1 bg-white/60 border border-white rounded-lg text-xs font-mono text-slate-600">{exercise.sets} Sets</span><span className="px-3 py-1 bg-white/60 border border-white rounded-lg text-xs font-mono text-slate-600">{exercise.reps} Reps</span></div>
                <button onClick={openVideo} className="w-full py-3 bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition">▶ {t('watch_tutorial')}</button>
                {loading ? <div className="text-center py-4 text-[#4ECDC4] animate-pulse">Loading details...</div> : (
                    <>
                        <div><h4 className="text-blue-500 font-bold uppercase text-xs tracking-wider mb-2">{t('target_muscles')}</h4><div className="flex flex-wrap gap-2">{exercise.targetMuscles?.map((m,i)=><span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs border border-blue-200">{m}</span>)}</div></div>
                        <div><h4 className="text-[#4ECDC4] font-bold uppercase text-xs tracking-wider mb-2">{t('steps')}</h4><ol className="space-y-2 list-decimal ml-4 text-slate-700 text-sm">{exercise.instructions?.map((s,i)=><li key={i}>{s}</li>)}</ol></div>
                        {exercise.benefits && <div className="bg-white/60 p-3 rounded-xl border border-white/50"><h4 className="text-yellow-600 font-bold text-xs uppercase mb-1">{t('benefits')}</h4><p className="text-xs text-slate-600">{exercise.benefits}</p></div>}
                    </>
                )}
            </div>
        </ModalOverlay>
    );
};

const WorkoutCard: React.FC<{ focus: string; duration: number; exercises: Exercise[]; dayIndex: number; isFavorite: boolean; onToggle: () => void; t: any; hydrateExerciseDetail: any }> = ({ focus, duration, exercises, dayIndex, isFavorite, onToggle, t, hydrateExerciseDetail }) => {
    const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
    const [selectedIdx, setSelectedIdx] = useState(0);

    return (
        <div className="glass-panel p-6 rounded-3xl mb-5 relative overflow-hidden group border-white/60">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#4ECDC4]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <button onClick={(e) => {e.stopPropagation(); onToggle();}} className={`absolute top-5 right-5 p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-100' : 'text-slate-400 bg-white/50 hover:bg-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <div className="mb-6"><h3 className="text-slate-800 font-bold text-xl">{focus}</h3><div className="flex items-center gap-2 mt-2"><span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-pulse shadow-[0_0_8px_cyan]"></span><p className="text-xs text-[#2AA198] font-bold uppercase tracking-wider">{duration} min</p></div></div>
            <div className="space-y-3">
                {exercises.map((ex, i) => (
                    <div key={i} onClick={()=>{setSelectedEx(ex); setSelectedIdx(i);}} className="flex justify-between items-center p-4 rounded-2xl bg-white/40 hover:bg-white/60 cursor-pointer border border-white/50 hover:border-[#4ECDC4]/50 transition shadow-sm">
                        <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-[#4ECDC4] border border-[#4ECDC4]/30">{i+1}</div><div><span className="text-slate-800 font-medium text-sm block">{ex.name}</span><span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{ex.sets} x {ex.reps}</span></div></div>
                        <span className="text-slate-400">ℹ️</span>
                    </div>
                ))}
            </div>
            {selectedEx && <ExerciseModal exercise={selectedEx} dayIndex={dayIndex} exerciseIndex={selectedIdx} onClose={()=>setSelectedEx(null)} t={t} hydrateExerciseDetail={hydrateExerciseDetail} />}
        </div>
    );
};

export const Fitness = () => {
    const { user, plan, t, isLoading, analyzeUserSymptoms, getNutrientData, toggleFavoriteWorkout, hydrateExerciseDetail } = useAppStore();
    const [activeTab, setActiveTab] = useState<'workout' | 'health'>('workout');
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [symptomInput, setSymptomInput] = useState('');
    const [expandedNutrient, setExpandedNutrient] = useState<string|null>(null);

    const activeDay = plan?.days?.[activeDayIndex];
    const nutrients = getNutrientData();

    return (
        <div className="h-full flex flex-col relative z-10 pb-24">
            <div className="bg-[#F0F4F8]/80 border-b border-white/50 sticky top-0 z-20 pt-4 px-4 pb-0 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-4"><h1 className="text-xl font-bold text-slate-800 tracking-wide">{t('fitness')}</h1></div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    <button onClick={() => setActiveTab('workout')} className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'workout' ? 'text-[#4ECDC4] border-[#4ECDC4]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{t('workout')}</button>
                    <button onClick={() => setActiveTab('health')} className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'health' ? 'text-[#4ECDC4] border-[#4ECDC4]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{t('symptom_checker')}</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {activeTab === 'workout' && (
                    <>
                        {plan && activeDay ? (
                            <>
                                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                                    {plan.days.map((day, idx) => <button key={idx} onClick={() => setActiveDayIndex(idx)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${idx === activeDayIndex ? 'bg-[#4ECDC4] text-white' : 'bg-white/60 text-slate-500 border border-white'}`}>{day.day}</button>)}
                                </div>
                                {activeDay.workout ? (
                                    <WorkoutCard focus={activeDay.workout.focus} duration={activeDay.workout.durationMin} exercises={activeDay.workout.exercises} dayIndex={activeDayIndex} isFavorite={user.favoriteWorkouts.some(w=>w.focus===activeDay.workout!.focus)} onToggle={()=>toggleFavoriteWorkout(activeDay.workout!)} t={t} hydrateExerciseDetail={hydrateExerciseDetail} />
                                ) : (
                                    <div className="text-center p-12 bg-white/40 rounded-3xl border border-dashed border-slate-300"><h3 className="text-xl font-bold text-slate-400">😴 {t('rest_day')}</h3></div>
                                )}
                            </>
                        ) : <p className="text-center text-slate-500 mt-10">{t('no_plan')}</p>}
                    </>
                )}

                {activeTab === 'health' && (
                    <div className="space-y-6">
                        <div className="glass-panel p-5 rounded-3xl border border-indigo-200 relative overflow-hidden bg-indigo-50/50">
                            <h2 className="text-slate-800 font-bold mb-3 flex items-center gap-2"><span className="bg-indigo-500 text-white p-1 rounded text-[10px] font-bold">AI</span> {t('symptom_checker')}</h2>
                            <textarea className="w-full bg-white/60 text-slate-800 p-4 rounded-xl text-sm mb-4 focus:outline-none border border-white/50 resize-none placeholder-slate-400" rows={3} placeholder={t('describe_symptoms')} value={symptomInput} onChange={e=>setSymptomInput(e.target.value)} />
                            <button onClick={()=>analyzeUserSymptoms(symptomInput)} disabled={isLoading || !symptomInput} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-50">{isLoading ? t('analyzing') : t('analyze')}</button>
                        </div>

                        {user.deficiencies?.length > 0 && (
                             <div className="glass-panel p-5 rounded-3xl border-red-200 bg-red-50/50">
                                <h3 className="text-red-500 font-bold mb-4 text-xs uppercase tracking-widest">{t('detected_deficiencies')}</h3>
                                <div className="space-y-3">{user.deficiencies.map((def, idx) => (
                                    <div key={idx} className="bg-white/60 p-3 rounded-xl border border-red-100"><div className="flex justify-between items-start mb-1"><span className="text-slate-800 font-bold">{def.nutrient}</span><span className="text-[10px] text-slate-400">{new Date(def.detectedAt).toLocaleDateString()}</span></div><span className="text-xs text-slate-600">{def.symptoms}</span></div>
                                ))}</div>
                             </div>
                        )}

                        <div>
                            <h3 className="text-slate-800 font-bold mb-4 pl-2 border-l-4 border-[#4ECDC4]">{t('vitamins')} & {t('minerals')}</h3>
                            <div className="space-y-3">
                                {nutrients.map(n => (
                                    <div key={n.id} onClick={() => setExpandedNutrient(expandedNutrient === n.id ? null : n.id)} className={`glass-panel rounded-2xl overflow-hidden transition-all cursor-pointer border ${expandedNutrient === n.id ? 'bg-white/80 border-[#4ECDC4]/50' : 'bg-white/40 border-white hover:bg-white/60'}`}>
                                        <div className="p-4 flex justify-between items-center"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${n.type==='Vitamin'?'bg-orange-100 text-orange-500':'bg-blue-100 text-blue-500'}`}>{n.name.charAt(0)}</div><span className="text-slate-800 font-bold">{n.name}</span></div><div className="text-slate-400">{expandedNutrient===n.id?'▲':'▼'}</div></div>
                                        {expandedNutrient===n.id && <div className="p-5 pt-0 text-sm border-t border-slate-100 mt-2 animate-fade-in"><p className="text-slate-600 text-xs mb-4">{n.benefits}</p><div className="grid grid-cols-2 gap-4"><div><span className="text-red-500 font-bold text-[10px] block">{t('deficiency_symptoms')}</span><p className="text-slate-600 text-xs">{n.deficiencySymptoms}</p></div><div><span className="text-blue-500 font-bold text-[10px] block">{t('sources')}</span><p className="text-slate-600 text-xs">{n.sources.join(', ')}</p></div></div></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
