import { ReactNode } from "react";
import { Users, MessageSquare, Utensils, Dumbbell, TrendingUp, HeadphonesIcon } from "lucide-react";
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
    { name: "الدعم الفني", href: "/support", icon: HeadphonesIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-64 border-l border-border bg-card shadow-medium">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Utensils className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">مساعد التغذية</h1>
              <p className="text-xs text-muted-foreground">نظام الإدارة</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                activeClassName="bg-gradient-primary text-primary-foreground hover:bg-gradient-primary hover:text-primary-foreground shadow-soft"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">
                مدعوم بتقنية الذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 min-h-screen">{children}</main>
    </div>
  );
};

export default DashboardLayout;
