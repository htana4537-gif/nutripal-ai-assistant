import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Weight, Activity, Calendar, Smile, Frown, Meh, X, Save, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ProgressLog {
  id: string;
  client_id: string;
  log_date: string;
  weight: number | null;
  energy_level: number | null;
  mood: string | null;
  notes: string | null;
  body_measurements: { chest?: number; waist?: number; hips?: number; arms?: number } | null;
  client?: { full_name: string };
}

interface Client {
  id: string;
  full_name: string;
}

const CircularProgress = ({
  value, max, label, unit, colorClass,
}: {
  value: number; max: number; label: string; unit: string; colorClass: string;
}) => {
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg height={radius * 2.5} width={radius * 2.5} className="-rotate-90">
          <circle
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
          />
          <circle
            className={colorClass}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold gradient-text">{value}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
};

const moodOptions = [
  { value: "great", label: "ممتاز", icon: <Smile className="h-5 w-5 text-primary" />, color: "bg-primary/20 border-primary/50 text-primary" },
  { value: "good", label: "جيد", icon: <Smile className="h-5 w-5 text-secondary" />, color: "bg-secondary/20 border-secondary/50 text-secondary" },
  { value: "neutral", label: "عادي", icon: <Meh className="h-5 w-5 text-muted-foreground" />, color: "bg-muted/50 border-border/50 text-muted-foreground" },
  { value: "bad", label: "سيء", icon: <Frown className="h-5 w-5 text-destructive" />, color: "bg-destructive/20 border-destructive/50 text-destructive" },
];

const ProgressTracking = () => {
  const [logs, setLogs] = useState<ProgressLog[]>([]);

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    weight: "",
    energy_level: 5,
    mood: "good",
    notes: "",
    chest: "", waist: "", hips: "", arms: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
    };
    checkAuth();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsRes, clientsRes] = await Promise.all([
        supabase.from("progress_logs").select("*, client:clients(full_name)").order("log_date", { ascending: false }).limit(50),
        supabase.from("clients").select("id, full_name").order("full_name"),
      ]);
      setLogs((logsRes.data || []) as unknown as ProgressLog[]);
      setClients(clientsRes.data || []);
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedClient) {
      toast({ title: "خطأ", description: "يرجى اختيار العميل", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const measurements: { chest?: number; waist?: number; hips?: number; arms?: number } = {};
      if (formData.chest) measurements.chest = parseFloat(formData.chest);
      if (formData.waist) measurements.waist = parseFloat(formData.waist);
      if (formData.hips) measurements.hips = parseFloat(formData.hips);
      if (formData.arms) measurements.arms = parseFloat(formData.arms);

      const { error } = await supabase.from("progress_logs").insert({
        client_id: selectedClient,
        log_date: formData.log_date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        energy_level: formData.energy_level,
        mood: formData.mood,
        notes: formData.notes || null,
        body_measurements: Object.keys(measurements).length > 0 ? measurements : null,
      });
      if (error) throw error;
      toast({ title: "تم الحفظ", description: "تم تسجيل بيانات التقدم بنجاح" });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getMoodInfo = (mood: string | null) =>
    moodOptions.find((m) => m.value === mood) || moodOptions[1];

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
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">متابعة التقدم</h1>
            <p className="text-muted-foreground">تسجيل ومتابعة تقدم العملاء</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary glow-green btn-hover-lift"
          >
            <Plus className="h-4 w-4 ml-2" />
            تسجيل تقدم جديد
          </Button>
        </div>

        {/* Summary Stats */}
        {logs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold gradient-text">{logs.length}</p>
              <p className="text-sm text-muted-foreground">إجمالي السجلات</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Weight className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-3xl font-bold gradient-text-yellow">
                {logs.find((l) => l.weight)?.weight || "—"}
              </p>
              <p className="text-sm text-muted-foreground">آخر وزن مسجل (كجم)</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Activity className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold gradient-text">
                {Math.round(
                  logs.filter((l) => l.energy_level).reduce((a, l) => a + (l.energy_level || 0), 0) /
                    (logs.filter((l) => l.energy_level).length || 1)
                )}
                /10
              </p>
              <p className="text-sm text-muted-foreground">متوسط مستوى الطاقة</p>
            </div>
          </div>
        )}

        {/* Add Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="glass-strong w-full max-w-lg rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold gradient-text">تسجيل تقدم جديد</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Client Select */}
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">العميل</label>
                <div className="relative">
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-foreground bg-transparent border-border/50 appearance-none"
                  >
                    <option value="">اختر العميل</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card">{c.full_name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Date & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">التاريخ</label>
                  <Input
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                    className="glass border-border/50 bg-muted/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">الوزن (كجم)</label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="glass border-border/50 bg-muted/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
                  مستوى الطاقة: {formData.energy_level}/10
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min={1} max={10}
                    value={formData.energy_level}
                    onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>منخفض</span><span>عالٍ</span>
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">المزاج</label>
                <div className="grid grid-cols-4 gap-2">
                  {moodOptions.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setFormData({ ...formData, mood: m.value })}
                      className={`glass rounded-xl p-3 flex flex-col items-center gap-1 border transition-all ${
                        formData.mood === m.value ? m.color : "border-border/30"
                      }`}
                    >
                      {m.icon}
                      <span className="text-xs">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurements */}
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">القياسات (سم) - اختياري</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "chest", label: "الصدر" },
                    { key: "waist", label: "الخصر" },
                    { key: "hips", label: "الأرداف" },
                    { key: "arms", label: "الذراعين" },
                  ].map((field) => (
                    <Input
                      key={field.key}
                      type="number"
                      placeholder={field.label}
                      value={(formData as any)[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="glass border-border/50 bg-muted/20 rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أي ملاحظات إضافية..."
                  rows={3}
                  className="w-full glass rounded-xl px-4 py-3 text-foreground bg-transparent border border-border/50 placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 glass border-border/50">
                  إلغاء
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-primary glow-green">
                  {saving ? <span className="animate-pulse">جاري الحفظ...</span> : <><Save className="h-4 w-4 ml-2" />حفظ</>}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Logs List */}
        {logs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <TrendingUp className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">لا توجد سجلات تقدم</p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-gradient-primary glow-green">
              <Plus className="h-4 w-4 ml-2" />ابدأ التسجيل
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const moodInfo = getMoodInfo(log.mood);
              const measurements = log.body_measurements as { chest?: number; waist?: number; hips?: number; arms?: number } | null;
              return (
                <div key={log.id} className="glass-card p-6 transition-all duration-300 hover:scale-[1.005] hover:glow-green">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shrink-0">
                        <TrendingUp className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{log.client?.full_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(log.log_date), "dd MMMM yyyy", { locale: ar })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {log.weight && (
                        <div className="glass rounded-xl px-4 py-2 text-center">
                          <p className="text-xs text-muted-foreground">الوزن</p>
                          <p className="font-bold gradient-text">{log.weight} كجم</p>
                        </div>
                      )}

                      {log.energy_level && (
                        <div className="glass rounded-xl px-4 py-2 text-center">
                          <p className="text-xs text-muted-foreground">الطاقة</p>
                          <div className="flex items-center gap-1">
                            <CircularProgress value={log.energy_level} max={10} label="" unit="" colorClass="stroke-primary" />
                            <span className="font-bold gradient-text text-sm">{log.energy_level}/10</span>
                          </div>
                        </div>
                      )}

                      {log.mood && (
                        <Badge className={`glass ${moodInfo.color}`}>
                          {moodInfo.icon}
                          <span className="mr-1">{moodInfo.label}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {measurements && Object.keys(measurements).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-4 gap-3">
                      {measurements.chest && (
                        <div className="glass rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">الصدر</p>
                          <p className="font-bold text-sm gradient-text">{measurements.chest} سم</p>
                        </div>
                      )}
                      {measurements.waist && (
                        <div className="glass rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">الخصر</p>
                          <p className="font-bold text-sm gradient-text">{measurements.waist} سم</p>
                        </div>
                      )}
                      {measurements.hips && (
                        <div className="glass rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">الأرداف</p>
                          <p className="font-bold text-sm gradient-text">{measurements.hips} سم</p>
                        </div>
                      )}
                      {measurements.arms && (
                        <div className="glass rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">الذراعين</p>
                          <p className="font-bold text-sm gradient-text">{measurements.arms} سم</p>
                        </div>
                      )}
                    </div>
                  )}

                  {log.notes && (
                    <p className="mt-3 text-sm text-muted-foreground border-t border-border/20 pt-3">{log.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProgressTracking;
