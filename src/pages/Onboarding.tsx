import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Globe, User, Ruler, Target, Utensils, Settings } from "lucide-react";

const STEPS = [
  { icon: Globe, title: "اللغة والمنطقة" },
  { icon: User, title: "الأساسيات" },
  { icon: Ruler, title: "قياسات الجسم" },
  { icon: Target, title: "الأهداف ونمط الحياة" },
  { icon: Utensils, title: "الأهداف اليومية" },
  { icon: Settings, title: "التفضيلات" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    language: "ar",
    country: "Egypt",
    currency: "EGP",
    name: "",
    age: 25,
    gender: "Male",
    height: 170,
    weight: 70,
    goal: "Lose Weight",
    activityLevel: "Moderately Active",
    mealsPerDay: 3,
    waterPerDay: 3,
    budgetMode: false,
    dietaryRestrictions: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: any) => setProfile((p) => ({ ...p, [key]: value }));

  const handleFinish = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    toast({ title: "تم!", description: "تم حفظ بياناتك بنجاح" });
    navigate("/");
  };

  const next = () => (step < 5 ? setStep(step + 1) : handleFinish());
  const prev = () => step > 0 && setStep(step - 1);

  const GlassInput = (props: any) => (
    <input
      {...props}
      className={`w-full glass border-border/50 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${props.className || ""}`}
    />
  );

  const GlassSelect = ({ children, ...props }: any) => (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none glass border-border/50 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      >
        {children}
      </select>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
        <ChevronRight className="h-4 w-4 rotate-90" />
      </div>
    </div>
  );

  const OptionButton = ({ selected, onClick, children }: any) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border text-sm font-bold transition-all hover-scale ${
        selected
          ? "glass-card border-primary/50 text-primary glow-green"
          : "glass border-border/30 text-muted-foreground hover:border-primary/30"
      }`}
    >
      {children}
    </button>
  );

  const RangeSlider = ({ label, value, min, max, step: s, unit, color, onChange }: any) => (
    <div>
      <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 mr-1">
        {label} <span className="text-foreground text-lg mr-2">{value} {unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={s || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
        style={{ accentColor: color || "hsl(var(--primary))" }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1 px-1">
        <span>{min}{unit}</span>
        <span>{Math.round((min + max) / 2)}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen liquid-bg bg-gradient-bg flex items-center justify-center p-6" dir="rtl">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-80 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress Steps */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-gradient-primary glow-green" : "bg-muted/30"
              }`}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 w-32 h-32 bg-gradient-primary rounded-full blur-3xl opacity-30 animate-pulse mx-auto" />
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-primary flex items-center justify-center glow-green mb-4">
              <Utensils className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">AI GYM</h1>
          <p className="text-muted-foreground mt-2">ذكاء سائل. نتائج صلبة.</p>
        </div>

        {/* Glass Panel */}
        <div className="glass-card p-8 rounded-3xl min-h-[350px] flex flex-col justify-center">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[0].title}</h2>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">اختر اللغة</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: "en", l: "English" }, { v: "ar", l: "العربية" }, { v: "fr", l: "Français" }, { v: "es", l: "Español" }].map((lang) => (
                    <OptionButton key={lang.v} selected={profile.language === lang.v} onClick={() => update("language", lang.v)}>
                      {lang.l}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">الدولة</label>
                <GlassSelect value={profile.country} onChange={(e: any) => update("country", e.target.value)}>
                  {["Egypt", "Saudi Arabia", "UAE", "USA", "UK", "France", "Spain", "Germany", "Canada", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </GlassSelect>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">العملة</label>
                <GlassSelect value={profile.currency} onChange={(e: any) => update("currency", e.target.value)}>
                  {["USD", "EUR", "GBP", "SAR", "AED", "EGP"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </GlassSelect>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[1].title}</h2>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">الاسم</label>
                <GlassInput type="text" placeholder="اسمك الكامل" value={profile.name} onChange={(e: any) => update("name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">العمر</label>
                  <GlassInput type="number" value={profile.age} onChange={(e: any) => update("age", Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">الجنس</label>
                  <GlassSelect value={profile.gender} onChange={(e: any) => update("gender", e.target.value)}>
                    <option value="Male">ذكر</option>
                    <option value="Female">أنثى</option>
                  </GlassSelect>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[2].title}</h2>
              <RangeSlider label="الطول" value={profile.height} min={100} max={250} unit="cm" onChange={(v: number) => update("height", v)} />
              <RangeSlider label="الوزن" value={profile.weight} min={30} max={200} unit="kg" color="hsl(var(--secondary))" onChange={(v: number) => update("weight", v)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[3].title}</h2>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">الهدف الرئيسي</label>
                <GlassSelect value={profile.goal} onChange={(e: any) => update("goal", e.target.value)}>
                  <option value="Lose Weight">فقدان الوزن</option>
                  <option value="Build Muscle">بناء العضلات</option>
                  <option value="Maintain">الحفاظ على الوزن</option>
                  <option value="Improve Health">تحسين الصحة</option>
                </GlassSelect>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">مستوى النشاط</label>
                <GlassSelect value={profile.activityLevel} onChange={(e: any) => update("activityLevel", e.target.value)}>
                  <option value="Sedentary">خامل</option>
                  <option value="Lightly Active">نشط قليلاً</option>
                  <option value="Moderately Active">نشط معتدل</option>
                  <option value="Very Active">نشط جداً</option>
                </GlassSelect>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[4].title}</h2>
              <RangeSlider label="وجبات يومياً" value={profile.mealsPerDay} min={1} max={8} unit="" onChange={(v: number) => update("mealsPerDay", v)} />
              <RangeSlider label="هدف الماء" value={profile.waterPerDay} min={1} max={5} s={0.5} unit="L" color="hsl(var(--accent))" onChange={(v: number) => update("waterPerDay", v)} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground text-center">{STEPS[5].title}</h2>
              <label className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer glass border-border/30 hover:border-primary/30 transition group">
                <input
                  type="checkbox"
                  checked={profile.budgetMode}
                  onChange={(e) => update("budgetMode", e.target.checked)}
                  className="w-6 h-6 rounded accent-primary"
                />
                <div className="flex-1">
                  <span className="text-primary font-bold block mb-1">الوضع الاقتصادي</span>
                  <span className="text-xs text-muted-foreground">اقترح مكونات غير مكلفة</span>
                </div>
              </label>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">قيود غذائية</label>
                <GlassInput
                  type="text"
                  placeholder="مثلاً: نباتي، خالي من الجلوتين"
                  value={profile.dietaryRestrictions}
                  onChange={(e: any) => update("dietaryRestrictions", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button onClick={prev} variant="outline" className="glass border-border/50 flex-1 py-6 rounded-2xl text-foreground">
              <ChevronRight className="h-4 w-4 ml-2" />
              السابق
            </Button>
          )}
          <Button
            onClick={next}
            className="flex-1 py-6 rounded-2xl bg-gradient-primary text-primary-foreground font-bold btn-hover-lift glow-green"
          >
            {step === 5 ? "ابدأ الرحلة 🚀" : "التالي"}
            {step < 5 && <ChevronLeft className="h-4 w-4 mr-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
