import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Search, ShoppingCart, TrendingDown, Heart,
  Apple, Beef, Wheat, Milk, Coffee, Cookie, Leaf,
  Sparkles, Droplets, Check, ToggleLeft
} from "lucide-react";
import { FOODS as INITIAL_FOODS, FOOD_CATEGORIES, type Food } from "@/data/foods";

const CATEGORY_ICONS: Record<string, any> = {
  all: Sparkles,
  Vegetables: Leaf,
  Fruits: Apple,
  Proteins: Beef,
  Carbs: Wheat,
  Dairy: Milk,
  Beverages: Coffee,
  Snacks: Cookie,
  Oils: Droplets,
  Legumes: Sparkles,
  Grains: Wheat,
};

const NutritionHub = () => {
  const [activeTab, setActiveTab] = useState<"database" | "economy" | "shopping">("database");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  // Local state to track availability overrides
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(INITIAL_FOODS.map(f => [f.id, f.available]))
  );

  const foods = useMemo(() =>
    INITIAL_FOODS.map(f => ({ ...f, available: availabilityMap[f.id] ?? f.available })),
    [availabilityMap]
  );

  const toggleAvailability = (id: string) => {
    setAvailabilityMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
      const matchesSearch = food.name.includes(searchTerm);
      const matchesAvailability = !showAvailableOnly || food.available;
      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [foods, searchTerm, selectedCategory, showAvailableOnly]);

  const proteinRankings = useMemo(() => {
    return [...foods]
      .filter((f) => f.available && f.protein > 0 && f.price > 0)
      .map((f) => ({ ...f, costPerGram: f.price / f.protein }))
      .sort((a, b) => a.costPerGram - b.costPerGram)
      .slice(0, 8);
  }, [foods]);

  const energyRankings = useMemo(() => {
    return [...foods]
      .filter((f) => f.available && f.calories > 0 && f.price > 0)
      .map((f) => ({ ...f, costPer100kcal: (f.price / f.calories) * 100 }))
      .sort((a, b) => a.costPer100kcal - b.costPer100kcal)
      .slice(0, 8);
  }, [foods]);

  const tabs = [
    { key: "database", label: "قاعدة الطعام", icon: Search },
    { key: "economy", label: "الاقتصاد الذكي", icon: TrendingDown },
    { key: "shopping", label: "قائمة التسوق", icon: ShoppingCart },
  ];

  const availableCount = foods.filter(f => f.available).length;
  const unavailableCount = foods.length - availableCount;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold gradient-text">مركز التغذية</h1>
          <p className="mt-2 text-muted-foreground">
            {foods.length} صنف •{" "}
            <span className="text-primary font-bold">{availableCount} متوفر</span>
            {" "}•{" "}
            <span className="text-destructive font-bold">{unavailableCount} غير متوفر</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-primary text-primary-foreground glow-green"
                  : "glass border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Database Tab */}
        {activeTab === "database" && (
          <div className="space-y-6">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="glass-card p-3 flex items-center gap-3 flex-1">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن طعام..."
                  className="border-0 bg-transparent focus-visible:ring-0"
                  dir="rtl"
                />
              </div>
              <div className="glass-card p-3 flex items-center gap-3">
                <Switch checked={showAvailableOnly} onCheckedChange={setShowAvailableOnly} />
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">المتوفر فقط</span>
              </div>
            </div>

            {/* Availability hint */}
            <div className="glass rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ToggleLeft className="h-4 w-4 text-primary" />
              <span>انقر على زر التوفر في كل بطاقة لتفعيل أو تعطيل المنتج — تؤثر الحالة على الخطط الغذائية</span>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {FOOD_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.key] || Sparkles;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.key
                        ? "bg-gradient-primary text-primary-foreground"
                        : "glass border-border/30 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">{filteredFoods.length} نتيجة</p>

            {/* Food Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className={`glass-card p-5 group relative transition-all duration-300 ${
                    !food.available ? "opacity-55 saturate-50" : "hover-scale"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">{food.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{food.name}</h3>
                      <p className="text-xs text-primary font-bold">{food.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">سعرات</p>
                      <p className="font-bold text-foreground text-sm">{food.calories}</p>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">بروتين</p>
                      <p className="font-bold text-sm" style={{color: "hsl(210 80% 60%)"}}>
                        {food.protein}g
                      </p>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">كربو</p>
                      <p className="font-bold text-sm" style={{color: "hsl(35 90% 60%)"}}>
                        {food.carbs}g
                      </p>
                    </div>
                  </div>

                  {/* Price + Availability Toggle */}
                  <div className="flex justify-between items-center pt-2 border-t border-border/20">
                    <div>
                      <p className="text-primary font-bold">{food.price} ج.م</p>
                      <p className="text-xs text-muted-foreground">/ {food.unit}</p>
                    </div>
                    {/* Toggle availability button */}
                    <button
                      onClick={() => toggleAvailability(food.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        food.available
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${food.available ? "bg-primary" : "bg-destructive"}`} />
                      {food.available ? "متوفر" : "غير متوفر"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Economy Tab - based on available foods only */}
        {activeTab === "economy" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl" style={{background: "hsl(210 80% 50% / 0.2)"}}>
                  <Beef className="h-6 w-6" style={{color: "hsl(210 80% 60%)"}} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">أفضل قيمة بروتين</h3>
                  <p className="text-xs text-muted-foreground">من الأصناف المتوفرة فقط • أقل تكلفة/جرام بروتين</p>
                </div>
              </div>
              <div className="space-y-3">
                {proteinRankings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">لا توجد أصناف متوفرة</p>
                ) : proteinRankings.map((food, i) => (
                  <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.protein}g بروتين / {food.price} ج.م ({food.unit})</p>
                    </div>
                    <span className="text-primary font-bold text-sm shrink-0">{food.costPerGram.toFixed(1)} ج.م/g</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl" style={{background: "hsl(35 90% 60% / 0.2)"}}>
                  <TrendingDown className="h-6 w-6" style={{color: "hsl(35 90% 60%)"}} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">أرخص طاقة</h3>
                  <p className="text-xs text-muted-foreground">من الأصناف المتوفرة فقط • أقل تكلفة/100 سعرة</p>
                </div>
              </div>
              <div className="space-y-3">
                {energyRankings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">لا توجد أصناف متوفرة</p>
                ) : energyRankings.map((food, i) => (
                  <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-gradient-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.calories} سعرة / {food.price} ج.م ({food.unit})</p>
                    </div>
                    <span className="text-secondary font-bold text-sm shrink-0">{food.costPer100kcal.toFixed(1)} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shopping Tab - available foods only */}
        {activeTab === "shopping" && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-primary">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">قائمة التسوق</h3>
                <p className="text-xs text-muted-foreground">الأصناف المتوفرة فقط — بناءً على إعداداتك</p>
              </div>
            </div>
            <div className="space-y-3">
              {foods.filter((f) => f.available).map((food) => (
                <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-4">
                  <span className="text-2xl">{food.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{food.name}</p>
                    <p className="text-xs text-muted-foreground">{food.category}</p>
                  </div>
                  <span className="text-primary font-bold">{food.price} ج.م/{food.unit}</span>
                  <Check className="h-5 w-5 text-primary shrink-0" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center glass rounded-xl p-4">
              <div>
                <span className="font-bold text-foreground">إجمالي القائمة</span>
                <p className="text-xs text-muted-foreground">{foods.filter(f => f.available).length} صنف متوفر</p>
              </div>
              <span className="text-2xl font-bold gradient-text">
                {foods.filter((f) => f.available).reduce((acc, f) => acc + f.price, 0).toLocaleString()} ج.م
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NutritionHub;
