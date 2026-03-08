import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Search, ShoppingCart, TrendingDown, Heart,
  Apple, Beef, Wheat, Milk, Coffee, Cookie, Leaf,
  Sparkles, Droplets, Check
} from "lucide-react";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredFoods = useMemo(() => {
    return FOODS.filter((food) => {
      const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
      const matchesSearch = food.name.includes(searchTerm);
      const matchesAvailability = !showAvailableOnly || food.available;
      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [searchTerm, selectedCategory, showAvailableOnly]);

  const proteinRankings = useMemo(() => {
    return [...FOODS]
      .filter((f) => f.protein > 0 && f.price > 0)
      .map((f) => ({ ...f, costPerGram: f.price / f.protein }))
      .sort((a, b) => a.costPerGram - b.costPerGram)
      .slice(0, 8);
  }, []);

  const energyRankings = useMemo(() => {
    return [...FOODS]
      .filter((f) => f.calories > 0 && f.price > 0)
      .map((f) => ({ ...f, costPer100kcal: (f.price / f.calories) * 100 }))
      .sort((a, b) => a.costPer100kcal - b.costPer100kcal)
      .slice(0, 8);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const tabs = [
    { key: "database", label: "قاعدة الطعام", icon: Search },
    { key: "economy", label: "الاقتصاد الذكي", icon: TrendingDown },
    { key: "shopping", label: "قائمة التسوق", icon: ShoppingCart },
  ];

  const availableCount = FOODS.filter(f => f.available).length;
  const unavailableCount = FOODS.length - availableCount;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">مركز التغذية</h1>
            <p className="mt-2 text-muted-foreground">
              {FOODS.length} صنف • {availableCount} متوفر • {unavailableCount} غير متوفر
            </p>
          </div>
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
                <div key={food.id} className={`glass-card p-5 hover-scale group relative ${!food.available ? "opacity-60" : ""}`}>
                  <button
                    onClick={() => toggleFavorite(food.id)}
                    className={`absolute top-4 left-4 p-2 rounded-full transition-all ${
                      favorites.includes(food.id) ? "text-red-500 bg-red-500/10" : "text-muted-foreground glass hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(food.id) ? "fill-current" : ""}`} />
                  </button>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">{food.emoji}</div>
                    <div>
                      <h3 className="font-bold text-foreground">{food.name}</h3>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">{food.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">سعرات</p>
                      <p className="font-bold text-foreground">{food.calories}</p>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">بروتين</p>
                      <p className="font-bold text-blue-500">{food.protein}g</p>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground">كربو</p>
                      <p className="font-bold text-orange-500">{food.carbs}g</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary font-bold">{food.price} ج.م</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${food.available ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                      {food.available ? "متوفر ✓" : "غير متوفر"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Economy Tab */}
        {activeTab === "economy" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/20">
                  <Beef className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">أفضل قيمة بروتين</h3>
                  <p className="text-xs text-muted-foreground">أقل تكلفة لكل جرام بروتين</p>
                </div>
              </div>
              <div className="space-y-3">
                {proteinRankings.map((food, i) => (
                  <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.protein}g بروتين / {food.price} ج.م</p>
                    </div>
                    <span className="text-primary font-bold text-sm">{food.costPerGram.toFixed(1)} ج.م/g</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-orange-500/20">
                  <TrendingDown className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">أرخص طاقة</h3>
                  <p className="text-xs text-muted-foreground">أقل تكلفة لكل 100 سعر حراري</p>
                </div>
              </div>
              <div className="space-y-3">
                {energyRankings.map((food, i) => (
                  <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gradient-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xl">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.calories} سعرة / {food.price} ج.م</p>
                    </div>
                    <span className="text-secondary font-bold text-sm">{food.costPer100kcal.toFixed(1)} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === "shopping" && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-primary">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">قائمة التسوق</h3>
                <p className="text-xs text-muted-foreground">المواد المطلوبة بناءً على خطتك الغذائية</p>
              </div>
            </div>
            <div className="space-y-3">
              {FOODS.filter((f) => f.available).slice(0, 10).map((food) => (
                <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-4">
                  <span className="text-2xl">{food.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{food.name}</p>
                    <p className="text-xs text-muted-foreground">{food.category}</p>
                  </div>
                  <span className="text-primary font-bold">{food.price} ج.م</span>
                  <Check className="h-5 w-5 text-primary" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center glass rounded-xl p-4">
              <span className="font-bold text-foreground">الإجمالي</span>
              <span className="text-2xl font-bold gradient-text">
                {FOODS.filter((f) => f.available).slice(0, 10).reduce((acc, f) => acc + f.price, 0)} ج.م
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NutritionHub;
