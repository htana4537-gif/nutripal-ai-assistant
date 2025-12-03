import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, Plus, Calendar, Clock, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface WorkoutPlan {
  id: string;
  client_id: string;
  date: string;
  workout_type: string;
  exercises: any;
  duration_minutes: number;
  calories_burned: number;
  status: string;
  notes: string;
  client?: {
    full_name: string;
  };
}

const Workouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadWorkouts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .select(`
          *,
          client:clients(full_name)
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل خطط التمارين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.workout_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">مكتمل</Badge>;
      case "planned":
        return <Badge variant="secondary">مخطط</Badge>;
      case "skipped":
        return <Badge variant="destructive">تم تخطيه</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWorkoutTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      cardio: "كارديو",
      strength: "قوة",
      flexibility: "مرونة",
      hiit: "HIIT",
      yoga: "يوغا",
      walking: "مشي",
      running: "جري",
      swimming: "سباحة",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">خطط التمارين</h1>
            <p className="text-muted-foreground">إدارة برامج التمارين للعملاء</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تمرين
            </Button>
          </div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد خطط تمارين</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workout.client?.full_name}</CardTitle>
                    {getStatusBadge(workout.status || "planned")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(workout.date), "dd MMMM yyyy", { locale: ar })}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-sm">
                      <Dumbbell className="h-3 w-3 ml-1" />
                      {getWorkoutTypeLabel(workout.workout_type)}
                    </Badge>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{workout.duration_minutes || 0} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{workout.calories_burned || 0} سعرة</span>
                      </div>
                    </div>

                    {workout.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workout.notes}
                      </p>
                    )}

                    <Button variant="outline" className="w-full" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workouts;
