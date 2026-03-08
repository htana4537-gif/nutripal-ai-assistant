import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, TrendingUp, Activity } from "lucide-react";

interface Client {
  id: string;
  telegram_id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  weight: number | null;
  target_weight: number | null;
  status: string;
  created_at: string;
}

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuth();
    loadClients();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => loadClients()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients((data as any) || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل العملاء",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.telegram_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      paused: "destructive",
    };
    
    const labels: Record<string, string> = {
      active: "نشط",
      inactive: "غير نشط",
      paused: "متوقف مؤقتاً",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">العملاء</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            إدارة ومتابعة جميع عملائك
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن عميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 transition-all duration-200 focus:shadow-soft"
            />
          </div>
          <Button className="gap-2 bg-gradient-primary text-white shadow-soft transition-all duration-200 hover:shadow-medium">
            <UserPlus className="h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <Card className="border-none p-12 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">لا يوجد عملاء</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery
                ? "لم يتم العثور على عملاء بهذا الاسم"
                : "ابدأ بإضافة عملاء جدد للنظام"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="group cursor-pointer border-none p-6 shadow-soft transition-all duration-300 hover:shadow-medium"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white font-bold">
                      {client.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {client.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">@{client.telegram_id}</p>
                    </div>
                  </div>
                  {getStatusBadge(client.status)}
                </div>

                <div className="space-y-2 text-sm">
                  {client.age && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العمر:</span>
                      <span className="font-medium text-foreground">{client.age} سنة</span>
                    </div>
                  )}
                  {client.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجنس:</span>
                      <span className="font-medium text-foreground">
                        {client.gender === 'male' ? 'ذكر' : client.gender === 'female' ? 'أنثى' : 'آخر'}
                      </span>
                    </div>
                  )}
                  {client.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الوزن الحالي:</span>
                      <span className="font-medium text-foreground">{client.weight} كجم</span>
                    </div>
                  )}
                  {client.target_weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الوزن المستهدف:</span>
                      <span className="font-medium text-foreground">{client.target_weight} كجم</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                  >
                    <TrendingUp className="h-4 w-4" />
                    التقدم
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Activity className="h-4 w-4" />
                    الخطط
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Clients;
