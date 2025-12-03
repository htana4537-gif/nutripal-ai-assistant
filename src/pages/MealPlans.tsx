import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Utensils, Plus, Calendar, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface MealPlan {
  id: string; client_id: string; date: string; meal_type: string; foods: any;
  total_calories: number; total_protein: number; total_carbs: number; total_fats: number; status: string;
  client?: { full_name: string };
}

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { checkAuth(); loadMealPlans(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
  };

  const loadMealPlans = async () => {
    try {
      const { data, error } = await supabase.from("meal_plans").select(`*, client:clients(full_name)`).order("date", { ascending: false });
      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في تحميل خطط الوجبات", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const filteredMealPlans = mealPlans.filter((plan) => plan.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || plan.meal_type.toLowerCase().includes(searchQuery.toLowerCase()));
  const getMealTypeLabel = (type: string) => ({ breakfast: "فطور", lunch: "غداء", dinner: "عشاء", snack: "وجبة خفيفة" }[type] || type);

  if (loading) return <DashboardLayout><div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">خطط الوجبات</h1>
            <p className="text-muted-foreground">إدارة الخطط الغذائية للعملاء</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="البحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl" />
            </div>
            <Button className="bg-gradient-primary glow-green"><Plus className="h-4 w-4 ml-2" />إضافة</Button>
          </div>
        </div>

        {filteredMealPlans.length === 0 ? (
          <div className="glass-card p-12 text-center"><Utensils className="mx-auto h-16 w-16 text-muted-foreground/50" /><p className="mt-4 text-muted-foreground">لا توجد خطط</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMealPlans.map((plan) => (
              <div key={plan.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-green cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{plan.client?.full_name}</h3>
                  <Badge className="glass bg-success/20 text-success">{plan.status === "completed" ? "مكتمل" : "مخطط"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3"><Calendar className="h-3 w-3" />{format(new Date(plan.date), "dd MMMM yyyy", { locale: ar })}</p>
                <Badge variant="outline" className="glass mb-3">{getMealTypeLabel(plan.meal_type)}</Badge>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="glass rounded-lg p-2 text-center"><Flame className="h-4 w-4 text-secondary mx-auto" /><span className="gradient-text-yellow font-bold">{plan.total_calories || 0}</span><p className="text-xs text-muted-foreground">سعرة</p></div>
                  <div className="glass rounded-lg p-2 text-center"><span className="gradient-text font-bold">{plan.total_protein || 0}g</span><p className="text-xs text-muted-foreground">بروتين</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MealPlans;
