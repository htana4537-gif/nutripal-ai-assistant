import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  client?: {
    full_name: string;
    status: string;
  };
  messages_count?: number;
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
    if (!session) {
      navigate("/login");
    }
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          client:clients(full_name, status)
        `)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل المحادثات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "telegram":
        return <Badge className="bg-blue-500">Telegram</Badge>;
      case "whatsapp":
        return <Badge className="bg-green-500">WhatsApp</Badge>;
      default:
        return <Badge variant="secondary">{platform}</Badge>;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">المحادثات</h1>
            <p className="text-muted-foreground">إدارة محادثات العملاء</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث عن محادثة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد محادثات</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.map((conv) => (
              <Card key={conv.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{conv.client?.full_name || "عميل غير معروف"}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {conv.last_message_at
                            ? format(new Date(conv.last_message_at), "dd MMM yyyy, HH:mm", { locale: ar })
                            : "لا توجد رسائل"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPlatformBadge(conv.platform || "telegram")}
                    <Button variant="outline" size="sm">
                      عرض المحادثة
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

export default Conversations;
