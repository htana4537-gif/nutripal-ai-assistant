import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, Plus, Calendar, Clock, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface WorkoutPlan {
  id: string; client_id: string; date: string; workout_type: string; duration_minutes: number; calories_burned: number; status: string;
  client?: { full_name: string };
}

const Workouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { checkAuth(); loadWorkouts(); }, []);

  const checkAuth = async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) navigate("/login"); };

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase.from("workout_plans").select(`*, client:clients(full_name)`).order("date", { ascending: false });
      if (error) throw error;
      setWorkouts((data as any) || []);
    } catch (error) { toast({ title: "خطأ", description: "فشل في تحميل التمارين", variant: "destructive" }); } finally { setLoading(false); }
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
            <Button className="bg-gradient-primary glow-green"><Plus className="h-4 w-4 ml-2" />إضافة</Button>
          </div>
        </div>

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
                <Badge variant="outline" className="glass mb-3"><Dumbbell className="h-3 w-3 ml-1" />{getWorkoutTypeLabel(workout.workout_type)}</Badge>
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
