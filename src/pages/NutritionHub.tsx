import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Utensils, Search, ShoppingCart, TrendingDown, Loader2, Heart, ChefHat,
  Apple, Beef, Wheat, Milk, Droplets, Cookie, Leaf, Coffee,
  RefreshCw, Check, Star, Sparkles
} from "lucide-react";

// Food Database
const FOOD_CATEGORIES = [
  { key: "all", label: "الكل", icon: Sparkles },
  { key: "Vegetables", label: "خضروات", icon: Leaf },
  { key: "Fruits", label: "فواكه", icon: Apple },
  { key: "Proteins", label: "بروتين", icon: Beef },
  { key: "Carbs", label: "كربوهيدرات", icon: Wheat },
  { key: "Dairy", label: "ألبان", icon: Milk },
  { key: "Beverages", label: "مشروبات", icon: Coffee },
  { key: "Snacks", label: "وجبات خفيفة", icon: Cookie },
];

const FOODS = [
  { id: "1", name: "دجاج مشوي", category: "Proteins", calories: 165, protein: 31, carbs: 0, fats: 3.6, price: 45, emoji: "🍗", available: true },
  { id: "2", name: "أرز بني", category: "Carbs", calories: 216, protein: 5, carbs: 45, fats: 1.8, price: 15, emoji: "🍚", available: true },
  { id: "3", name: "سلمون", category: "Proteins", calories: 208, protein: 20, carbs: 0, fats: 13, price: 120, emoji: "🐟", available: true },
  { id: "4", name: "بيض", category: "Proteins", calories: 155, protein: 13, carbs: 1.1, fats: 11, price: 30, emoji: "🥚", available: true },
  { id: "5", name: "سبانخ", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, price: 8, emoji: "🥬", available: true },
  { id: "6", name: "موز", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, price: 12, emoji: "🍌", available: true },
  { id: "7", name: "زبادي يوناني", category: "Dairy", calories: 59, protein: 10, carbs: 3.6, fats: 0.7, price: 20, emoji: "🥛", available: true },
  { id: "8", name: "شوفان", category: "Carbs", calories: 389, protein: 17, carbs: 66, fats: 7, price: 25, emoji: "🥣", available: true },
  { id: "9", name: "بطاطا حلوة", category: "Carbs", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, price: 10, emoji: "🍠", available: true },
  { id: "10", name: "تفاح", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, price: 15, emoji: "🍎", available: true },
  { id: "11", name: "لوز", category: "Snacks", calories: 579, protein: 21, carbs: 22, fats: 50, price: 80, emoji: "🥜", available: true },
  { id: "12", name: "بروكلي", category: "Vegetables", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, price: 12, emoji: "🥦", available: true },
  { id: "13", name: "قهوة", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fats: 0, price: 5, emoji: "☕", available: true },
  { id: "14", name: "شاي أخضر", category: "Beverages", calories: 1, protein: 0, carbs: 0, fats: 0, price: 3, emoji: "🍵", available: true },
  { id: "15", name: "شوكولاتة داكنة", category: "Snacks", calories: 546, protein: 5, carbs: 60, fats: 31, price: 35, emoji: "🍫", available: true },
  { id: "16", name: "حمص", category: "Proteins", calories: 164, protein: 9, carbs: 27, fats: 2.6, price: 8, emoji: "🫘", available: true },
];

const NutritionHub = () => {
  const [activeTab, setActiveTab] = useState<"database" | "economy" | "shopping">("database");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredFoods = useMemo(() => {
    return FOODS.filter((food) => {
      const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
      const matchesSearch = food.name.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const proteinRankings = useMemo(() => {
    return [...FOODS]
      .filter((f) => f.protein > 0 && f.price > 0)
      .map((f) => ({ ...f, costPerGram: f.price / f.protein }))
      .sort((a, b) => a.costPerGram - b.costPerGram)
      .slice(0, 5);
  }, []);

  const energyRankings = useMemo(() => {
    return [...FOODS]
      .filter((f) => f.calories > 0 && f.price > 0)
      .map((f) => ({ ...f, costPer100kcal: (f.price / f.calories) * 100 }))
      .sort((a, b) => a.costPer100kcal - b.costPer100kcal)
      .slice(0, 5);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const tabs = [
    { key: "database", label: "قاعدة الطعام", icon: Search },
    { key: "economy", label: "الاقتصاد الذكي", icon: TrendingDown },
    { key: "shopping", label: "قائمة التسوق", icon: ShoppingCart },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold gradient-text">مركز التغذية</h1>
          <p className="mt-2 text-muted-foreground">قاعدة بيانات الطعام، الاقتصاد الذكي وقوائم التسوق</p>
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
            {/* Search */}
            <div className="glass-card p-4 flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن طعام..."
                className="border-0 bg-transparent focus-visible:ring-0"
                dir="rtl"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.key
                      ? "bg-gradient-primary text-primary-foreground"
                      : "glass border-border/30 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFoods.map((food) => (
                <div key={food.id} className="glass-card p-5 hover-scale group relative">
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
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${food.available ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {food.available ? "متوفر" : "غير متوفر"}
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
            {/* Best Protein Value */}
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
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{food.name}</p>
                      <p className="text-xs text-muted-foreground">{food.protein}g بروتين / {food.price} ج.م</p>
                    </div>
                    <span className="text-primary font-bold text-sm">{food.costPerGram.toFixed(1)} ج.م/g</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cheapest Energy */}
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
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{food.name}</p>
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
              {FOODS.filter((f) => f.available).slice(0, 8).map((food) => (
                <div key={food.id} className="flex items-center gap-3 glass rounded-xl p-4">
                  <span className="text-2xl">{food.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{food.name}</p>
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
                {FOODS.filter((f) => f.available).slice(0, 8).reduce((acc, f) => acc + f.price, 0)} ج.م
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NutritionHub;
