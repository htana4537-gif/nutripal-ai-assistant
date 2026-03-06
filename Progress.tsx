
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../context/Store';
import { Settings } from '../App';
import { HealthStats, ConsumedLog } from '../types';

// --- VISUAL COMPONENTS ---

// Fixed ModernGlassCard children prop type to be optional to resolve TypeScript errors
const ModernGlassCard = ({ children, className = "", onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className={`relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.05)] rounded-[2.5rem] overflow-hidden ${className}`}
    >
        {children}
    </div>
);

const CircularGauge = ({ value, min, max, label, unit, colorStart, colorEnd }: { value: number, min: number, max: number, label: string, unit: string, colorStart: string, colorEnd: string }) => {
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percent = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const strokeDashoffset = circumference - percent * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative">
            <svg height={radius * 2.5} width={radius * 2.5} className="rotate-[-90deg]">
                <defs>
                    <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colorStart} />
                        <stop offset="100%" stopColor={colorEnd} />
                    </linearGradient>
                </defs>
                <circle
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius * 1.25}
                    cy={radius * 1.25}
                />
                <circle
                    stroke={`url(#grad-${label})`}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius * 1.25}
                    cy={radius * 1.25}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800 tracking-tighter">{value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{unit}</span>
            </div>
            {/* Decorative dot on the ring */}
            {/* We could calculate position, but for simplicity in SVG, we use dasharray. */}
        </div>
    );
};

const WaveLineChart = ({ data, color }: { data: number[], color: string }) => {
    // Simple SVG path generator
    const width = 200;
    const height = 50;
    const max = Math.max(...data, 1);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d / max) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-full overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {data.map((d, i) => {
                 const x = (i / (data.length - 1)) * width;
                 const y = height - (d / max) * height;
                 return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />
            })}
        </svg>
    )
};

const VerticalBarChart = ({ data, labels, colorStart, colorEnd }: { data: number[], labels: string[], colorStart: string, colorEnd: string }) => {
    const max = Math.max(...data, 100);
    return (
        <div className="flex justify-between items-end h-full w-full gap-2">
            {data.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
                    <div className="w-full bg-white/30 rounded-t-lg relative overflow-hidden transition-all duration-500 hover:bg-white/50" style={{ height: '100%' }}>
                         <div 
                            className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700 ease-out"
                            style={{ 
                                height: `${(val / max) * 100}%`,
                                background: `linear-gradient(to top, ${colorStart}, ${colorEnd})`
                            }}
                         ></div>
                         {/* Tooltip */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 text-[9px] bg-slate-800 text-white px-1.5 rounded transition-opacity">{val}</div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{labels[i]}</span>
                </div>
            ))}
        </div>
    )
}

const HydrationCapsules = ({ current, target }: { current: number, target: number }) => {
    // 10 capsules total for visual
    const totalCapsules = 10;
    const filledCount = Math.min(Math.round((current / target) * totalCapsules), totalCapsules);
    
    return (
        <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalCapsules }).map((_, i) => (
                <div key={i} className={`h-8 rounded-lg transition-all duration-300 ${i < filledCount ? 'bg-gradient-to-b from-[#4ECDC4] to-[#2AA198] shadow-[0_0_10px_rgba(78,205,196,0.4)]' : 'bg-white/40'}`}></div>
            ))}
        </div>
    )
}

export const Progress = () => {
    const { user, addProgressPhoto, t, getDailyNutrition } = useAppStore();
    const [activeTab, setActiveTab] = useState<'stats' | 'gallery' | 'camera' | 'settings'>('stats');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGhostMode, setIsGhostMode] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackIndex, setPlaybackIndex] = useState(0);

    // --- Stats Data Calculation ---
    const calculateStats = () => {
        const history = user.healthHistory || [];
        const consumedHistory = user.consumedHistory || [];
        
        // Last 7 Days Date Labels
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Dates = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });
        
        const labels = last7Dates.map(d => days[d.getDay()]);

        // Calories Data
        const caloriesData = last7Dates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const logs = consumedHistory.filter(l => l.date === dateStr);
            return logs.reduce((acc, log) => acc + (log.meal.calories || 0), 0);
        });

        // Activity Data
        const activityData = last7Dates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const stat = history.find(h => h.date === dateStr);
            return stat ? stat.activeCalories : (dateStr === user.dailyStats.date ? user.dailyStats.activeCalories : 0);
        });

        // Current Snapshot
        const daily = getDailyNutrition();
        const burned = user.dailyStats.activeCalories || 0;
        const water = 2.1; // Mock current if not tracked perfectly in context for display, or hook up state
        // Simulation for Heart Rate based on activity level
        const baseHR = user.activityLevel === 'Very Active' ? 55 : 70;
        const currentHR = baseHR + Math.floor(Math.random() * 10) + (burned > 500 ? 10 : 0);

        return { labels, caloriesData, activityData, daily, burned, currentHR };
    };

    const stats = calculateStats();
    const today = new Date();
    const dateString = `SAT ${today.getDate()} ${today.getHours().toString().padStart(2,'0')}:${today.getMinutes().toString().padStart(2,'0')}`; // Mock day name for design match, or dynamic
    
    // Camera Logic
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error", err);
            alert("Could not access camera");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.6);
                const base64 = dataUrl.split(',')[1];
                addProgressPhoto(base64);
                setActiveTab('gallery');
                stopCamera();
            }
        }
    };

    useEffect(() => {
        if (activeTab === 'camera') startCamera();
        else stopCamera();
        return () => stopCamera();
    }, [activeTab]);

    useEffect(() => {
        let interval: any;
        if (isPlaying && user.progressPhotos && user.progressPhotos.length > 0) {
            interval = setInterval(() => {
                setPlaybackIndex(prev => (prev + 1) % user.progressPhotos.length);
            }, 600);
        }
        return () => clearInterval(interval);
    }, [isPlaying, user.progressPhotos]);

    const sortedPhotos = [...(user.progressPhotos || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latestPhoto = sortedPhotos.length > 0 ? sortedPhotos[sortedPhotos.length - 1] : null;

    return (
        <div className="h-full flex flex-col relative z-10 pb-24">
             {/* Header Navigation for Tabs */}
             <div className="bg-white/10 sticky top-0 z-30 pt-4 px-6 pb-2 backdrop-blur-md border-b border-white/20">
                 <div className="flex justify-between items-center mb-2">
                     <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('profile')}</h1>
                     <div className="flex gap-2 text-[10px] font-mono text-slate-400">
                         {activeTab === 'stats' && <span>{dateString.replace('SAT', ['SUN','MON','TUE','WED','THU','FRI','SAT'][today.getDay()])}</span>}
                     </div>
                 </div>
                 <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                     <button onClick={() => setActiveTab('stats')} className={`pb-2 text-lg font-bold transition-all ${activeTab === 'stats' ? 'text-slate-800 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>{t('statistics')}</button>
                     <button onClick={() => setActiveTab('gallery')} className={`pb-2 text-lg font-bold transition-all ${activeTab === 'gallery' ? 'text-slate-800 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>{t('body_transformation')}</button>
                     <button onClick={() => setActiveTab('settings')} className={`pb-2 text-lg font-bold transition-all ${activeTab === 'settings' ? 'text-slate-800 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>{t('settings')}</button>
                 </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {activeTab === 'stats' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Header Profile Section */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{t('greeting')} <span className="text-[#4ECDC4]">{user.name.split(' ')[0]}!</span></h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Run + Bike Kcal</span>
                                    <span className="text-2xl font-bold text-[#A06CD5] leading-none">{(stats.burned * 7.5).toFixed(0)}</span>
                                    <span className="text-[9px] text-slate-400 italic font-serif">by AI Coach</span>
                                </div>
                            </div>
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                <img src={`https://picsum.photos/seed/${user.name}/200`} alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#4ECDC4]/30 to-purple-500/30 mix-blend-overlay"></div>
                            </div>
                        </div>

                        {/* ROW 1: Heart Rate (Big) & Device Info */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Heart Rate Card */}
                            <ModernGlassCard className="col-span-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/60 to-purple-50/40">
                                <div className="flex justify-between w-full mb-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-red-500 animate-pulse">♥</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
                                    </div>
                                    <span className="text-[10px] text-slate-300">●●●</span>
                                </div>
                                <CircularGauge 
                                    value={stats.currentHR} 
                                    min={40} 
                                    max={180} 
                                    label="hr" 
                                    unit="bpm" 
                                    colorStart="#4ECDC4" 
                                    colorEnd="#A06CD5" 
                                />
                                <div className="flex justify-between w-full mt-4 text-[10px] font-medium text-slate-400">
                                    <span>60<br/>min</span>
                                    <span className="text-slate-800 text-xs">{stats.currentHR}<br/>avg</span>
                                    <span>185<br/>max</span>
                                </div>
                            </ModernGlassCard>

                            <div className="flex flex-col gap-4">
                                {/* Device Card */}
                                <ModernGlassCard className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Device</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="text-2xl opacity-80">⌚</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{user.connectedDevices[0] || 'No Device'}</p>
                                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                                <span className="text-emerald-500">⚡</span> 84% Battery
                                            </div>
                                        </div>
                                    </div>
                                </ModernGlassCard>

                                {/* Hydration Card */}
                                <ModernGlassCard className="p-4 flex-1 flex flex-col justify-between relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                                     <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Hydration</span>
                                        <span className="text-xs font-bold text-blue-500">2.1L</span>
                                    </div>
                                    <HydrationCapsules current={2.1} target={user.targetWaterPerDay} />
                                </ModernGlassCard>
                            </div>
                        </div>

                        {/* ROW 2: Calories Chart */}
                        <ModernGlassCard className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#4ECDC4] text-lg">🔥</span>
                                    <span className="text-sm font-bold text-slate-700">Calories</span>
                                </div>
                                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">Weekly Avg</span>
                            </div>
                            <div className="h-32 w-full">
                                <VerticalBarChart 
                                    data={stats.caloriesData} 
                                    labels={stats.labels} 
                                    colorStart="#A06CD5" 
                                    colorEnd="#4ECDC4" 
                                />
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-3">
                                <span>Consumed: <b className="text-slate-800">{stats.daily.calories}</b></span>
                                <span>Remaining: <b className="text-slate-800">{Math.max(0, 2500 - stats.daily.calories)}</b></span>
                            </div>
                        </ModernGlassCard>

                        {/* ROW 3: Program Pace & Activity */}
                        <div className="grid grid-cols-1 gap-4">
                            <ModernGlassCard className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                     <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                         <span className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full"></span> Program Pace
                                     </span>
                                     <div className="flex gap-2">
                                         <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">run</span>
                                         <span className="text-[9px] font-bold text-white bg-[#4ECDC4] px-2 py-0.5 rounded-full">bike</span>
                                     </div>
                                </div>
                                <div className="h-24 w-full">
                                    <WaveLineChart data={stats.activityData} color="#4ECDC4" />
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800">13.6 <span className="text-sm text-slate-400 font-normal">km</span></p>
                                        <p className="text-[9px] text-slate-400">Distance</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-slate-800">1:10:15</p>
                                        <p className="text-[9px] text-slate-400">Duration</p>
                                    </div>
                                </div>
                            </ModernGlassCard>
                            
                             <ModernGlassCard className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                     <span className="text-sm font-bold text-slate-700">All Activity</span>
                                     <div className="flex gap-2 text-[10px] font-bold text-slate-400">
                                         <span className="text-[#A06CD5]">Today</span>
                                         <span>Week</span>
                                         <span>Month</span>
                                     </div>
                                </div>
                                <div className="h-24 w-full">
                                    <VerticalBarChart 
                                        data={stats.activityData.map(d => d / 2)} // Mock different dataset visuals
                                        labels={stats.labels} 
                                        colorStart="#4ECDC4" 
                                        colorEnd="#80E9FF" 
                                    />
                                </div>
                            </ModernGlassCard>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-6">
                        {sortedPhotos.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <ModernGlassCard className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                </ModernGlassCard>
                                <p>{t('no_photos')}</p>
                                <button onClick={() => setActiveTab('camera')} className="mt-4 text-xs font-bold text-[#4ECDC4] bg-[#4ECDC4]/10 px-4 py-2 rounded-xl">{t('take_first')}</button>
                            </div>
                        ) : (
                            <>
                                {/* Time Lapse Player */}
                                <ModernGlassCard className="p-2 aspect-[3/4] shadow-2xl mx-auto max-w-sm relative">
                                    <img 
                                        src={`data:image/jpeg;base64,${sortedPhotos[playbackIndex].data}`} 
                                        alt="Progress" 
                                        className="w-full h-full object-cover rounded-[2rem]"
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white">
                                        <div>
                                            <p className="text-slate-800 text-xs font-bold">{new Date(sortedPhotos[playbackIndex].date).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-[#2AA198]">{sortedPhotos[playbackIndex].weight ? `${sortedPhotos[playbackIndex].weight} kg` : ''}</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="w-10 h-10 rounded-full bg-[#4ECDC4] flex items-center justify-center text-white shadow-lg hover:bg-[#3dbdb4] transition"
                                        >
                                            {isPlaying ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                                            }
                                        </button>
                                    </div>
                                    <div className="absolute top-4 left-4 right-4 h-1 bg-black/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#4ECDC4] transition-all duration-300" 
                                            style={{ width: `${((playbackIndex + 1) / sortedPhotos.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </ModernGlassCard>

                                {/* Grid View */}
                                <div className="grid grid-cols-3 gap-2">
                                    {sortedPhotos.map((photo, idx) => (
                                        <div 
                                            key={photo.id} 
                                            onClick={() => { setPlaybackIndex(idx); setIsPlaying(false); }}
                                            className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition ${playbackIndex === idx ? 'border-[#4ECDC4] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={`data:image/jpeg;base64,${photo.data}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'camera' && (
                    <div className="h-full flex flex-col items-center">
                        <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            
                            {isGhostMode && latestPhoto && (
                                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
                                    <img src={`data:image/jpeg;base64,${latestPhoto.data}`} className="w-full h-full object-cover" style={{ filter: 'grayscale(100%)' }} />
                                </div>
                            )}

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                                <button 
                                    onClick={() => setIsGhostMode(!isGhostMode)}
                                    className={`p-3 rounded-full backdrop-blur-md border ${isGhostMode ? 'bg-[#4ECDC4] text-white border-[#4ECDC4]' : 'bg-white/20 text-white border-white/40'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
                                </button>
                                
                                <button 
                                    onClick={capturePhoto}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full transition-transform group-hover:scale-90"></div>
                                </button>
                                
                                <div className="w-12"></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <Settings />
                )}
            </div>
        </div>
    );
};
