import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Conversation {
  id: string;
  client_id: string;
  platform: string;
  created_at: string;
  last_message_at: string;
  client?: { full_name: string; status: string };
}

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadConversations();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/login");
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase.from("conversations").select(`*, client:clients(full_name, status)`).order("last_message_at", { ascending: false });
      if (error) throw error;
      setConversations((data as any) || []);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في تحميل المحادثات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => conv.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">المحادثات</h1>
            <p className="text-muted-foreground">إدارة محادثات العملاء</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="البحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl" />
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">لا توجد محادثات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.01] hover:glow-green cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary transition-transform group-hover:scale-110">
                      <User className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{conv.client?.full_name || "عميل غير معروف"}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {conv.last_message_at ? format(new Date(conv.last_message_at), "dd MMM yyyy, HH:mm", { locale: ar }) : "لا توجد رسائل"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="glass bg-primary/20 text-primary border-primary/30">Telegram</Badge>
                    <Button variant="outline" size="sm" className="glass">عرض</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
