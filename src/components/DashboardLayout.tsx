import { ReactNode } from "react";
import { Users, MessageSquare, Utensils, Dumbbell, TrendingUp, HeadphonesIcon, Sparkles, Bot, Activity } from "lucide-react";
import { NavLink } from "./NavLink";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigation = [
    { name: "لوحة التحكم", href: "/", icon: TrendingUp },
    { name: "العملاء", href: "/clients", icon: Users },
    { name: "المحادثات", href: "/conversations", icon: MessageSquare },
    { name: "الخطط الغذائية", href: "/meal-plans", icon: Utensils },
    { name: "خطط التمارين", href: "/workouts", icon: Dumbbell },
    { name: "متابعة التقدم", href: "/progress", icon: Activity },
    { name: "المساعد الذكي", href: "/ai-chat", icon: Bot },
    { name: "الدعم الفني", href: "/support", icon: HeadphonesIcon },
  ];

  return (
    <div className="min-h-screen liquid-bg bg-gradient-bg" dir="rtl">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-80 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-72 glass-strong border-l border-border/30 z-50">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-border/30 px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary glow-green">
              <Utensils className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">مساعد التغذية</h1>
              <p className="text-xs text-muted-foreground">نظام الإدارة الذكي</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-muted/50 hover:text-foreground group"
                activeClassName="bg-gradient-primary text-primary-foreground hover:bg-gradient-primary hover:text-primary-foreground glow-green"
              >
                <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/30 p-4">
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-secondary">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">الذكاء الاصطناعي</p>
                <p className="text-xs text-muted-foreground">مُفعّل ويعمل</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-72 min-h-screen relative z-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
