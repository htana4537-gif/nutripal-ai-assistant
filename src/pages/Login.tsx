import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Utensils, Loader2, Sparkles, Leaf, Apple } from "lucide-react";

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
    <div className="min-h-screen liquid-bg bg-gradient-bg flex items-center justify-center p-4" dir="rtl">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-32 left-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-accent/15 blur-2xl float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-40 left-1/4 w-20 h-20 rounded-full bg-primary/15 blur-2xl float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 rounded-full bg-secondary/15 blur-2xl float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Info */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="glass-card p-3 glow-green">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">مساعد التغذية الذكي</h1>
                <p className="text-muted-foreground">نظام إدارة متكامل</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              منصة متطورة لإدارة العملاء وتقديم خطط غذائية مخصصة مدعومة بالذكاء الاصطناعي
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: "تحليل ذكي للصور والأغذية", color: "text-primary" },
              { icon: Leaf, text: "خطط غذائية مخصصة", color: "text-accent" },
              { icon: Apple, text: "متابعة يومية تلقائية", color: "text-secondary" },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-4 flex items-center gap-4 ripple shimmer cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 rounded-xl bg-gradient-primary hover-scale icon-spin">
                  <feature.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "عميل نشط" },
              { value: "98%", label: "رضا العملاء" },
              { value: "24/7", label: "دعم متواصل" },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="glass-card p-4 text-center hover-scale pulse-scale"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-2xl font-bold gradient-text-yellow">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="glass-strong rounded-3xl p-8 lg:p-10 space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
            <div className="glass-card p-3 glow-green">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">مساعد التغذية</h1>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {isSignUp ? "إنشاء حساب جديد" : "مرحباً بعودتك"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "أنشئ حسابك للبدء في إدارة عملائك"
                : "سجل دخولك للوصول إلى لوحة التحكم"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="glass border-border/50 bg-muted/30 h-12 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="glass border-border/50 bg-muted/30 h-12 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="glass border-border/50 bg-muted/30 h-12 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-lg btn-hover-lift ripple"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : isSignUp ? (
                "إنشاء الحساب"
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp
                ? "لديك حساب بالفعل؟ سجل الدخول"
                : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
            </button>
          </div>

          {/* Decorative line */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Sparkles className="h-4 w-4 text-primary/50" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
