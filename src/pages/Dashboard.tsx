import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Activity, TrendingUp, Calendar, LogOut, Sparkles, Zap } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center liquid-bg bg-gradient-bg">
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
            <h1 className="text-4xl font-bold gradient-text">لوحة التحكم</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              مرحباً بك في نظام إدارة مساعد التغذية الذكي
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 glass border-border/50 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
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
            <div 
              className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-green cursor-pointer group" 
              onClick={() => navigate("/clients")}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">إدارة العملاء</h3>
                  <p className="text-sm text-muted-foreground">عرض وإدارة جميع العملاء</p>
                </div>
              </div>
            </div>

            <div 
              className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-yellow cursor-pointer group" 
              onClick={() => navigate("/conversations")}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-secondary transition-transform duration-300 group-hover:scale-110">
                  <MessageSquare className="h-7 w-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">المحادثات</h3>
                  <p className="text-sm text-muted-foreground">متابعة المحادثات مع العملاء</p>
                </div>
              </div>
            </div>

            <div 
              className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-green cursor-pointer group" 
              onClick={() => navigate("/meal-plans")}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">الخطط الغذائية</h3>
                  <p className="text-sm text-muted-foreground">إنشاء ومتابعة الخطط</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card p-6 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-primary glow-green">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold gradient-text">
                نظام متكامل مدعوم بالذكاء الاصطناعي
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                يتيح لك هذا النظام إدارة عملائك بكفاءة، متابعة تقدمهم، وتقديم خطط غذائية وتمارين
                مخصصة. النظام متصل بـ Telegram للتواصل التلقائي مع العملاء وتقديم الدعم الفوري.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "إدارة العملاء", color: "bg-primary/20 text-primary" },
                  { label: "خطط غذائية", color: "bg-accent/20 text-accent" },
                  { label: "تمارين رياضية", color: "bg-secondary/20 text-secondary" },
                  { label: "تحليلات ذكية", color: "bg-success/20 text-success" },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    className={`glass rounded-full px-4 py-1.5 text-xs font-medium ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <Sparkles className="h-8 w-8 text-secondary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
