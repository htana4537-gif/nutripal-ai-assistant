import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dumbbell, Heart, AlertTriangle, Loader2, Search, ChevronDown, ChevronUp,
  Activity, Brain, Pill, Zap, Shield, Eye, Bone, Droplets,
  Sparkles, Calendar, Clock, Flame, ListChecks
} from "lucide-react";

const NUTRIENTS = [
  { id: "n1", name: "فيتامين A", type: "vitamin", icon: Eye, color: "text-orange-500", bg: "bg-orange-500/20", benefits: "الرؤية، جهاز المناعة، صحة الجلد", symptoms: "عمى ليلي، جلد جاف، عدوى متكررة", sources: ["جزر", "بطاطا حلوة", "سبانخ", "كبد"], rdi: "700-900 ميكروجرام" },
  { id: "n2", name: "فيتامين C", type: "vitamin", icon: Shield, color: "text-yellow-500", bg: "bg-yellow-500/20", benefits: "مضاد أكسدة، تكوين الكولاجين، المناعة", symptoms: "إسقربوط، نزيف اللثة، إرهاق", sources: ["برتقال", "فراولة", "فلفل", "كيوي"], rdi: "75-90 مج" },
  { id: "n3", name: "فيتامين D", type: "vitamin", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/20", benefits: "صحة العظام، امتصاص الكالسيوم، المزاج", symptoms: "ألم العظام، ضعف العضلات، اكتئاب", sources: ["الشمس", "سمك دهني", "صفار البيض", "حليب مدعم"], rdi: "600-800 وحدة" },
  { id: "n4", name: "الكالسيوم", type: "mineral", icon: Bone, color: "text-blue-500", bg: "bg-blue-500/20", benefits: "صحة العظام والأسنان، وظائف العضلات", symptoms: "تشنجات عضلية، أظافر هشة، هشاشة عظام", sources: ["حليب", "جبن", "زبادي", "خضروات ورقية"], rdi: "1000 مج" },
  { id: "n5", name: "الحديد", type: "mineral", icon: Droplets, color: "text-red-500", bg: "bg-red-500/20", benefits: "نقل الأكسجين، إنتاج الطاقة", symptoms: "أنيميا، إرهاق، شحوب الجلد", sources: ["لحم أحمر", "سبانخ", "عدس", "حبوب مدعمة"], rdi: "8-18 مج" },
  { id: "n6", name: "المغنيسيوم", type: "mineral", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/20", benefits: "وظائف العضلات والأعصاب، التحكم بسكر الدم", symptoms: "رعشة العضلات، إرهاق، عدم انتظام ضربات القلب", sources: ["لوز", "سبانخ", "فاصوليا سوداء", "شوكولاتة داكنة"], rdi: "310-420 مج" },
  { id: "n7", name: "أوميجا 3", type: "mineral", icon: Activity, color: "text-teal-500", bg: "bg-teal-500/20", benefits: "صحة القلب، وظائف المخ، مضاد للالتهابات", symptoms: "جلد جاف، ضعف الذاكرة، تقلبات مزاجية", sources: ["سلمون", "جوز", "بذور شيا", "بذور كتان"], rdi: "1.1-1.6 جم" },
  { id: "n8", name: "فيتامين B12", type: "vitamin", icon: Pill, color: "text-pink-500", bg: "bg-pink-500/20", benefits: "تكوين خلايا الدم الحمراء، تخليق DNA", symptoms: "إرهاق، ضعف، مشاكل عصبية", sources: ["لحم", "سمك", "ألبان", "بيض"], rdi: "2.4 ميكروجرام" },
];

const SAMPLE_WORKOUTS = [
  {
    day: "الأحد",
    focus: "الجزء العلوي",
    duration: 45,
    exercises: [
      { name: "تمارين الضغط", sets: 4, reps: "12" },
      { name: "تمرين السحب", sets: 3, reps: "10" },
      { name: "تمرين الكتف بالدمبل", sets: 3, reps: "12" },
      { name: "تمرين البايسبس", sets: 3, reps: "15" },
    ],
  },
  {
    day: "الاثنين",
    focus: "الجزء السفلي",
    duration: 50,
    exercises: [
      { name: "سكوات", sets: 4, reps: "15" },
      { name: "ديدليفت روماني", sets: 3, reps: "12" },
      { name: "لنج", sets: 3, reps: "10 لكل رجل" },
      { name: "تمرين الساق", sets: 3, reps: "15" },
    ],
  },
  {
    day: "الثلاثاء",
    focus: "يوم راحة",
    duration: 0,
    exercises: [],
  },
  {
    day: "الأربعاء",
    focus: "كارديو + كور",
    duration: 40,
    exercises: [
      { name: "جري (HIIT)", sets: 8, reps: "30 ثانية" },
      { name: "بلانك", sets: 3, reps: "45 ثانية" },
      { name: "تمرين البطن", sets: 3, reps: "20" },
      { name: "تمرين الدراجة", sets: 3, reps: "15" },
    ],
  },
];

interface WorkoutPlan {
  id: string; client_id: string; date: string; workout_type: string;
  duration_minutes: number; calories_burned: number; status: string;
  client?: { full_name: string };
}
interface ClientLite { id: string; full_name: string; }

const FitnessHub = () => {
  const [activeTab, setActiveTab] = useState<"workout" | "plans" | "health">("workout");
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [expandedNutrient, setExpandedNutrient] = useState<string | null>(null);
  const [symptomInput, setSymptomInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [deficiencies, setDeficiencies] = useState<{ nutrient: string; symptoms: string }[]>([]);

  // Plans state
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planSearch, setPlanSearch] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("strength");
  const [focusArea, setFocusArea] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === "plans") {
      loadWorkouts();
      loadClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, full_name");
    setClients((data as any) || []);
  };

  const loadWorkouts = async () => {
    setPlansLoading(true);
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .select(`*, client:clients(full_name)`)
        .order("date", { ascending: false });
      if (error) throw error;
      setWorkouts((data as any) || []);
    } catch {
      toast({ title: "خطأ", description: "فشل في تحميل التمارين", variant: "destructive" });
    } finally { setPlansLoading(false); }
  };

  const handleGenerateWorkout = async () => {
    if (!selectedClient) {
      toast({ title: "خطأ", description: "اختر عميل أولاً", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke("generate-workout-plan", {
        body: { client_id: selectedClient, workout_type: selectedType, focus_area: focusArea, date: new Date().toISOString().split("T")[0] },
      });
      if (error) throw error;
      toast({ title: "تم!", description: "تم إنشاء خطة التمرين بنجاح بالذكاء الاصطناعي" });
      setShowGenerate(false);
      loadWorkouts();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "فشل في إنشاء خطة التمرين", variant: "destructive" });
    } finally { setGenerating(false); }
  };

  const getWorkoutTypeLabel = (type: string) =>
    (({ cardio: "كارديو", strength: "قوة", flexibility: "مرونة", hiit: "HIIT" } as Record<string, string>)[type]) || type;

  const filteredWorkouts = workouts.filter(
    (w) => w.client?.full_name?.toLowerCase().includes(planSearch.toLowerCase()) ||
      w.workout_type.toLowerCase().includes(planSearch.toLowerCase())
  );

  const activeDay = SAMPLE_WORKOUTS[activeDayIndex];

  const handleAnalyzeSymptoms = async () => {
    if (!symptomInput.trim()) return;
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [],
          userMessage: `حلل هذه الأعراض واقترح نقص فيتامينات أو معادن محتمل: ${symptomInput}. أجب بصيغة JSON array مع كل عنصر يحتوي على nutrient و symptoms.`,
        },
      });
      if (data?.text) {
        try {
          const match = data.text.match(/\[[\s\S]*?\]/);
          if (match) {
            setDeficiencies(JSON.parse(match[0]));
          }
        } catch {
          setDeficiencies([{ nutrient: "نتيجة التحليل", symptoms: data.text }]);
        }
      }
    } catch {
      toast({ title: "خطأ", description: "فشل في تحليل الأعراض", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold gradient-text">اللياقة والصحة</h1>
          <p className="mt-2 text-muted-foreground">تمارين رياضية، فحص الأعراض وموسوعة الفيتامينات</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("workout")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "workout" ? "bg-gradient-primary text-primary-foreground glow-green" : "glass border-border/30 text-muted-foreground"
            }`}
          >
            <Dumbbell className="h-4 w-4" /> التمارين
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "plans" ? "bg-gradient-primary text-primary-foreground glow-green" : "glass border-border/30 text-muted-foreground"
            }`}
          >
            <ListChecks className="h-4 w-4" /> خطط التمارين
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "health" ? "bg-gradient-primary text-primary-foreground glow-green" : "glass border-border/30 text-muted-foreground"
            }`}
          >
            <Heart className="h-4 w-4" /> الصحة والفيتامينات
          </button>
        </div>

        {/* Workouts Tab */}
        {activeTab === "workout" && (
          <div className="space-y-6">
            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SAMPLE_WORKOUTS.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    idx === activeDayIndex ? "bg-gradient-primary text-primary-foreground glow-green" : "glass border-border/30 text-muted-foreground"
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {/* Workout Card */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -ml-16 -mt-16" />

              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{activeDay.focus}</h3>
                    {activeDay.duration > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{activeDay.duration} دقيقة</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-primary">
                    <Dumbbell className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                {activeDay.exercises.length > 0 ? (
                  <div className="space-y-3">
                    {activeDay.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-primary/30 transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/30">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground">{ex.name}</p>
                          <p className="text-xs text-muted-foreground glass-card inline-block px-2 py-0.5 rounded mt-1">
                            {ex.sets} × {ex.reps}
                          </p>
                        </div>
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">ℹ️</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 glass rounded-3xl border-dashed">
                    <h3 className="text-xl font-bold text-muted-foreground">😴 يوم راحة</h3>
                    <p className="text-sm text-muted-foreground mt-2">استرح وتعافى</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab - saved AI workout plans */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث في الخطط..."
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl"
                />
              </div>
              <Button onClick={() => setShowGenerate(!showGenerate)} className="bg-gradient-primary glow-green gap-2">
                <Sparkles className="h-4 w-4" />توليد خطة تمرين بالـ AI
              </Button>
            </div>

            {showGenerate && (
              <div className="glass-card p-6 border-primary/30 animate-fade-in">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />توليد خطة تمرين بالذكاء الاصطناعي
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">العميل</label>
                    <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full glass border-border/50 rounded-xl p-3 text-foreground">
                      <option value="">اختر عميل...</option>
                      {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">نوع التمرين</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full glass border-border/50 rounded-xl p-3 text-foreground">
                      <option value="strength">قوة</option>
                      <option value="cardio">كارديو</option>
                      <option value="hiit">HIIT</option>
                      <option value="flexibility">مرونة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">المنطقة المستهدفة</label>
                    <Input value={focusArea} onChange={(e) => setFocusArea(e.target.value)} placeholder="مثلاً: الجزء العلوي" className="glass border-border/50 rounded-xl h-12" />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleGenerateWorkout} disabled={generating} className="w-full bg-gradient-primary glow-green h-12">
                      {generating ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Sparkles className="h-4 w-4 ml-2" />}
                      {generating ? "جارِ التوليد..." : "توليد الخطة"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {plansLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredWorkouts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Dumbbell className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">لا توجد تمارين</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredWorkouts.map((workout) => (
                  <div key={workout.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-green cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">{workout.client?.full_name}</h3>
                      <Badge className="glass bg-success/20 text-success">{workout.status === "completed" ? "مكتمل" : "مخطط"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(workout.date), "dd MMMM yyyy", { locale: ar })}
                    </p>
                    <Badge className="glass mb-3"><Dumbbell className="h-3 w-3 ml-1" />{getWorkoutTypeLabel(workout.workout_type)}</Badge>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="glass rounded-lg p-3 text-center">
                        <Clock className="h-4 w-4 text-primary mx-auto" />
                        <span className="gradient-text font-bold">{workout.duration_minutes || 0}</span>
                        <p className="text-xs text-muted-foreground">دقيقة</p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <Flame className="h-4 w-4 text-secondary mx-auto" />
                        <span className="gradient-text-yellow font-bold">{workout.calories_burned || 0}</span>
                        <p className="text-xs text-muted-foreground">سعرة</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Health Tab */}
        {activeTab === "health" && (
          <div className="space-y-6">
            {/* Symptom Checker */}
            <div className="glass-card p-6 border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <AlertTriangle className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">فحص الأعراض بالذكاء الاصطناعي</h3>
                    <p className="text-xs text-muted-foreground">صف أعراضك لتحديد نقص محتمل</p>
                  </div>
                </div>
                <textarea
                  className="w-full glass border-border/50 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                  rows={3}
                  placeholder="صف أعراضك... مثلاً: إرهاق مستمر، تساقط شعر، ضعف التركيز"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  dir="rtl"
                />
                <Button
                  onClick={handleAnalyzeSymptoms}
                  disabled={analyzing || !symptomInput.trim()}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl"
                >
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                  {analyzing ? "جار التحليل..." : "تحليل الأعراض"}
                </Button>
              </div>
            </div>

            {/* Deficiency Results */}
            {deficiencies.length > 0 && (
              <div className="glass-card p-6 border-red-500/20">
                <h3 className="text-red-500 font-bold mb-4 text-xs uppercase tracking-widest">نقص محتمل</h3>
                <div className="space-y-3">
                  {deficiencies.map((def, i) => (
                    <div key={i} className="glass rounded-xl p-4 border-red-500/10">
                      <p className="font-bold text-foreground">{def.nutrient}</p>
                      <p className="text-xs text-muted-foreground mt-1">{def.symptoms}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrients Encyclopedia */}
            <div>
              <h3 className="font-bold text-foreground mb-4 text-lg border-r-4 border-primary pr-3">موسوعة الفيتامينات والمعادن</h3>
              <div className="space-y-3">
                {NUTRIENTS.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setExpandedNutrient(expandedNutrient === n.id ? null : n.id)}
                    className={`glass-card rounded-2xl overflow-hidden transition-all cursor-pointer ${
                      expandedNutrient === n.id ? "border-primary/50" : "hover:border-primary/30"
                    }`}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${n.bg}`}>
                        <n.icon className={`h-5 w-5 ${n.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.benefits}</p>
                      </div>
                      {expandedNutrient === n.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    {expandedNutrient === n.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-bold text-red-500 block mb-1">أعراض النقص</span>
                            <p className="text-xs text-muted-foreground">{n.symptoms}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-blue-500 block mb-1">المصادر الغذائية</span>
                            <p className="text-xs text-muted-foreground">{n.sources.join("، ")}</p>
                          </div>
                        </div>
                        <div className="glass rounded-lg p-3">
                          <span className="text-xs font-bold text-primary block mb-1">الجرعة اليومية الموصى بها</span>
                          <p className="text-sm font-bold text-foreground">{n.rdi}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FitnessHub;
