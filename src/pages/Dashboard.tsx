import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Activity, TrendingUp, Calendar, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeConversations: 0,
    todayMeals: 0,
    weeklyProgress: "+12%",
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadStats = async () => {
    try {
      const [clientsRes, conversationsRes, mealsRes] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact" }),
        supabase.from("conversations").select("id", { count: "exact" }),
        supabase
          .from("meal_plans")
          .select("id", { count: "exact" })
          .eq("date", new Date().toISOString().split("T")[0]),
      ]);

      setStats({
        totalClients: clientsRes.count || 0,
        activeConversations: conversationsRes.count || 0,
        todayMeals: mealsRes.count || 0,
        weeklyProgress: "+12%",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              مرحباً بك في نظام إدارة مساعد التغذية الذكي
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 transition-all duration-200 hover:shadow-soft"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="إجمالي العملاء"
            value={stats.totalClients}
            change={stats.weeklyProgress + " هذا الأسبوع"}
            changeType="positive"
            icon={Users}
            gradient="primary"
          />
          <StatsCard
            title="المحادثات النشطة"
            value={stats.activeConversations}
            icon={MessageSquare}
            gradient="accent"
          />
          <StatsCard
            title="وجبات اليوم"
            value={stats.todayMeals}
            icon={Calendar}
            gradient="secondary"
          />
          <StatsCard
            title="معدل التقدم"
            value="87%"
            change="+5% من الشهر الماضي"
            changeType="positive"
            icon={Activity}
            gradient="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">إجراءات سريعة</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-none p-6 shadow-soft transition-all duration-300 hover:shadow-medium cursor-pointer" onClick={() => navigate("/clients")}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">إدارة العملاء</h3>
                  <p className="text-sm text-muted-foreground">عرض وإدارة جميع العملاء</p>
                </div>
              </div>
            </Card>

            <Card className="border-none p-6 shadow-soft transition-all duration-300 hover:shadow-medium cursor-pointer" onClick={() => navigate("/conversations")}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">المحادثات</h3>
                  <p className="text-sm text-muted-foreground">متابعة المحادثات مع العملاء</p>
                </div>
              </div>
            </Card>

            <Card className="border-none p-6 shadow-soft transition-all duration-300 hover:shadow-medium cursor-pointer" onClick={() => navigate("/meal-plans")}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-secondary">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">الخطط الغذائية</h3>
                  <p className="text-sm text-muted-foreground">إنشاء ومتابعة الخطط</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-none bg-gradient-to-br from-primary/10 to-accent/10 p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-primary">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                نظام متكامل مدعوم بالذكاء الاصطناعي
              </h3>
              <p className="mt-2 text-muted-foreground">
                يتيح لك هذا النظام إدارة عملائك بكفاءة، متابعة تقدمهم، وتقديم خطط غذائية وتمارين
                مخصصة. النظام متصل بـ Telegram للتواصل التلقائي مع العملاء وتقديم الدعم الفوري.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                  إدارة العملاء
                </span>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  خطط غذائية
                </span>
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                  تمارين رياضية
                </span>
                <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                  تحليلات ذكية
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
