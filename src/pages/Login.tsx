import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Utensils, Loader2 } from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "تم إنشاء الحساب بنجاح!",
          description: "يمكنك الآن تسجيل الدخول",
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "مرحباً بك!",
          description: "تم تسجيل الدخول بنجاح",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Hero Section */}
      <div className="hidden w-1/2 lg:block relative overflow-hidden">
        <img
          src={dashboardHero}
          alt="نظام التغذية الذكي"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/80" />
        <div className="relative z-10 flex h-full flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Utensils className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">مساعد التغذية الذكي</h1>
              <p className="text-lg text-white/80">نظام إدارة متكامل للمدربين وخبراء التغذية</p>
            </div>
          </div>
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white" />
              <p>إدارة العملاء والمتابعة الشاملة</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white" />
              <p>خطط غذائية وتمارين مخصصة</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white" />
              <p>تحليلات ذكية ومتابعة تلقائية</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white" />
              <p>تكامل مع Telegram للتواصل السريع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex w-full items-center justify-center bg-gradient-bg p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-none p-8 shadow-strong">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isSignUp
                ? "أنشئ حسابك للوصول إلى لوحة التحكم"
                : "ادخل إلى لوحة التحكم الخاصة بك"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="transition-all duration-200 focus:shadow-soft"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white shadow-soft transition-all duration-200 hover:shadow-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : isSignUp ? (
                "إنشاء الحساب"
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "لديك حساب بالفعل؟ سجل الدخول"
                : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
