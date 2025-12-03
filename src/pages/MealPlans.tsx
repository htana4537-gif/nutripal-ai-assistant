import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Utensils, Plus, Calendar, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface MealPlan {
  id: string;
  client_id: string;
  date: string;
  meal_type: string;
  foods: any;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  status: string;
  notes: string;
  client?: {
    full_name: string;
  };
}

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadMealPlans();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("meal_plans")
        .select(`
          *,
          client:clients(full_name)
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل خطط الوجبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMealPlans = mealPlans.filter((plan) =>
    plan.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.meal_type.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getMealTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      breakfast: "فطور",
      lunch: "غداء",
      dinner: "عشاء",
      snack: "وجبة خفيفة",
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
            <h1 className="text-3xl font-bold">خطط الوجبات</h1>
            <p className="text-muted-foreground">إدارة الخطط الغذائية للعملاء</p>
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
              إضافة خطة
            </Button>
          </div>
        </div>

        {filteredMealPlans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد خطط وجبات</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMealPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.client?.full_name}</CardTitle>
                    {getStatusBadge(plan.status || "planned")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(plan.date), "dd MMMM yyyy", { locale: ar })}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-sm">
                      {getMealTypeLabel(plan.meal_type)}
                    </Badge>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{plan.total_calories || 0} سعرة</span>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-500/10 text-center">
                        <span className="text-blue-500">{plan.total_protein || 0}g</span>
                        <span className="text-muted-foreground text-xs block">بروتين</span>
                      </div>
                      <div className="p-2 rounded-lg bg-yellow-500/10 text-center">
                        <span className="text-yellow-600">{plan.total_carbs || 0}g</span>
                        <span className="text-muted-foreground text-xs block">كربوهيدرات</span>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-500/10 text-center">
                        <span className="text-purple-500">{plan.total_fats || 0}g</span>
                        <span className="text-muted-foreground text-xs block">دهون</span>
                      </div>
                    </div>

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

export default MealPlans;
