import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, Calendar, Clock, Flame, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface WorkoutPlan {
  id: string; client_id: string; date: string; workout_type: string; duration_minutes: number; calories_burned: number; status: string;
  client?: { full_name: string };
}

interface Client { id: string; full_name: string; }

const Workouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("strength");
  const [focusArea, setFocusArea] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { checkAuth(); loadWorkouts(); loadClients(); }, []);

  const checkAuth = async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) navigate("/login"); };

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, full_name");
    setClients((data as any) || []);
  };

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase.from("workout_plans").select(`*, client:clients(full_name)`).order("date", { ascending: false });
      if (error) throw error;
      setWorkouts((data as any) || []);
    } catch (error) { toast({ title: "خطأ", description: "فشل في تحميل التمارين", variant: "destructive" }); } finally { setLoading(false); }
  };

  const handleGenerateWorkout = async () => {
    if (!selectedClient) {
      toast({ title: "خطأ", description: "اختر عميل أولاً", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
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

  const filteredWorkouts = workouts.filter((w) => w.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || w.workout_type.toLowerCase().includes(searchQuery.toLowerCase()));
  const getWorkoutTypeLabel = (type: string) => ({ cardio: "كارديو", strength: "قوة", flexibility: "مرونة", hiit: "HIIT" }[type] || type);

  if (loading) return <DashboardLayout><div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="text-4xl font-bold gradient-text">خطط التمارين</h1><p className="text-muted-foreground">إدارة برامج التمارين</p></div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-72"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="البحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl" /></div>
            <Button onClick={() => setShowGenerate(!showGenerate)} className="bg-gradient-primary glow-green gap-2">
              <Sparkles className="h-4 w-4" />توليد بالـ AI
            </Button>
          </div>
        </div>

        {/* AI Generate Panel */}
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

        {filteredWorkouts.length === 0 ? (
          <div className="glass-card p-12 text-center"><Dumbbell className="mx-auto h-16 w-16 text-muted-foreground/50" /><p className="mt-4 text-muted-foreground">لا توجد تمارين</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <div key={workout.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-green cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{workout.client?.full_name}</h3>
                  <Badge className="glass bg-success/20 text-success">{workout.status === "completed" ? "مكتمل" : "مخطط"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3"><Calendar className="h-3 w-3" />{format(new Date(workout.date), "dd MMMM yyyy", { locale: ar })}</p>
                <Badge className="glass mb-3"><Dumbbell className="h-3 w-3 ml-1" />{getWorkoutTypeLabel(workout.workout_type)}</Badge>
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass rounded-lg p-3 text-center"><Clock className="h-4 w-4 text-primary mx-auto" /><span className="gradient-text font-bold">{workout.duration_minutes || 0}</span><p className="text-xs text-muted-foreground">دقيقة</p></div>
                  <div className="glass rounded-lg p-3 text-center"><Flame className="h-4 w-4 text-secondary mx-auto" /><span className="gradient-text-yellow font-bold">{workout.calories_burned || 0}</span><p className="text-xs text-muted-foreground">سعرة</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workouts;
