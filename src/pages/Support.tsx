import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TicketIcon, Plus, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface SupportTicket {
  id: string;
  client_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolution: string;
  client?: {
    full_name: string;
  };
}

const Support = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadTickets();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          client:clients(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل تذاكر الدعم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">مفتوح</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500">قيد المعالجة</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">تم الحل</Badge>;
      case "closed":
        return <Badge variant="secondary">مغلق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">عالي</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">متوسط</Badge>;
      case "low":
        return <Badge variant="secondary">منخفض</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
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

  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">الدعم الفني</h1>
            <p className="text-muted-foreground">إدارة تذاكر الدعم والاستفسارات</p>
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
              تذكرة جديدة
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <TicketIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tickets.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي التذاكر</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openTickets}</p>
                <p className="text-sm text-muted-foreground">تذاكر مفتوحة</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <TicketIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tickets.length - openTickets}</p>
                <p className="text-sm text-muted-foreground">تذاكر محلولة</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TicketIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد تذاكر دعم</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status || "open")}
                        {getPriorityBadge(ticket.priority || "medium")}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ticket.client?.full_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(ticket.created_at || new Date()), "dd MMM yyyy", { locale: ar })}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
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

export default Support;
