import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HeadphonesIcon, Plus, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface SupportTicket {
  id: string; client_id: string; subject: string; description: string; status: string; priority: string; created_at: string;
  client?: { full_name: string };
}

const Support = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { checkAuth(); loadTickets(); }, []);

  const checkAuth = async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) navigate("/login"); };

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase.from("support_tickets").select(`*, client:clients(full_name)`).order("created_at", { ascending: false });
      if (error) throw error;
      setTickets((data as any) || []);
    } catch (error) { toast({ title: "خطأ", description: "فشل في تحميل التذاكر", variant: "destructive" }); } finally { setLoading(false); }
  };

  const filteredTickets = tickets.filter((t) => t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const getStatusBadge = (status: string) => {
    const config = { open: "bg-secondary/20 text-secondary", in_progress: "bg-primary/20 text-primary", resolved: "bg-success/20 text-success" }[status] || "bg-muted text-muted-foreground";
    return <Badge className={`glass ${config}`}>{status === "open" ? "مفتوح" : status === "in_progress" ? "قيد المعالجة" : "تم الحل"}</Badge>;
  };
  const getPriorityBadge = (priority: string) => {
    const config = { high: "bg-destructive/20 text-destructive", medium: "bg-secondary/20 text-secondary", low: "bg-muted text-muted-foreground" }[priority] || "bg-muted text-muted-foreground";
    return <Badge className={`glass ${config}`}>{priority === "high" ? "عالي" : priority === "medium" ? "متوسط" : "منخفض"}</Badge>;
  };

  if (loading) return <DashboardLayout><div className="flex min-h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="text-4xl font-bold gradient-text">الدعم الفني</h1><p className="text-muted-foreground">إدارة تذاكر الدعم</p></div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-72"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="البحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl" /></div>
            <Button className="bg-gradient-primary glow-green"><Plus className="h-4 w-4 ml-2" />تذكرة</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[{ label: "إجمالي", value: tickets.length, icon: HeadphonesIcon, gradient: "bg-gradient-primary" }, { label: "مفتوحة", value: tickets.filter(t => t.status === "open").length, icon: AlertCircle, gradient: "bg-gradient-secondary" }, { label: "محلولة", value: tickets.filter(t => t.status === "resolved").length, icon: HeadphonesIcon, gradient: "bg-gradient-accent" }].map((s) => (
            <div key={s.label} className="glass-card p-4"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${s.gradient}`}><s.icon className="h-4 w-4 text-primary-foreground" /></div><div><p className="text-2xl font-bold gradient-text">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div></div>
          ))}
        </div>

        {filteredTickets.length === 0 ? (
          <div className="glass-card p-12 text-center"><HeadphonesIcon className="mx-auto h-16 w-16 text-muted-foreground/50" /><p className="mt-4 text-muted-foreground">لا توجد تذاكر</p></div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.01] hover:glow-green cursor-pointer">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><h3 className="font-semibold text-foreground">{ticket.subject}</h3>{getStatusBadge(ticket.status || "open")}{getPriorityBadge(ticket.priority || "medium")}</div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground"><span>{ticket.client?.full_name}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(ticket.created_at || new Date()), "dd MMM yyyy", { locale: ar })}</span></div>
                  </div>
                  <Button variant="outline" size="sm" className="glass">عرض</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Support;
