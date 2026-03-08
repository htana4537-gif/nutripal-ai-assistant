import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Search, Plus, Minus, Trash2, X, Star,
  Pill, Dumbbell, Zap, Heart, Package
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  benefits: string[];
  inStock: boolean;
  badge?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p1", name: "واي بروتين جولد ستاندرد", nameEn: "Gold Standard Whey", category: "بروتين",
    price: 1200, originalPrice: 1500, rating: 4.8, reviews: 342, image: "🥛",
    description: "بروتين واي عالي الجودة بنسبة 24 جم بروتين لكل حصة",
    benefits: ["بناء العضلات", "سريع الامتصاص", "منخفض الدهون"], inStock: true, badge: "الأكثر مبيعاً"
  },
  {
    id: "p2", name: "كرياتين مونوهيدرات", nameEn: "Creatine Monohydrate", category: "أداء",
    price: 450, rating: 4.7, reviews: 218, image: "⚡",
    description: "كرياتين نقي 100% لزيادة القوة والأداء الرياضي",
    benefits: ["زيادة القوة", "تحسين الأداء", "تعزيز التعافي"], inStock: true
  },
  {
    id: "p3", name: "أوميجا 3 زيت السمك", nameEn: "Omega-3 Fish Oil", category: "صحة",
    price: 380, originalPrice: 450, rating: 4.6, reviews: 156, image: "🐟",
    description: "أحماض دهنية أساسية لصحة القلب والمخ",
    benefits: ["صحة القلب", "وظائف المخ", "مضاد للالتهابات"], inStock: true, badge: "عرض"
  },
  {
    id: "p4", name: "BCAA أحماض أمينية", nameEn: "BCAA Amino Acids", category: "تعافي",
    price: 550, rating: 4.5, reviews: 189, image: "💪",
    description: "أحماض أمينية متفرعة لتعزيز التعافي العضلي",
    benefits: ["تقليل آلام العضلات", "تعزيز التعافي", "حماية العضلات"], inStock: true
  },
  {
    id: "p5", name: "ملتي فيتامين يومي", nameEn: "Daily Multivitamin", category: "صحة",
    price: 320, rating: 4.4, reviews: 267, image: "💊",
    description: "فيتامينات ومعادن شاملة للاحتياج اليومي",
    benefits: ["تعزيز المناعة", "طاقة يومية", "صحة عامة"], inStock: true
  },
  {
    id: "p6", name: "بري وورك أوت C4", nameEn: "C4 Pre-Workout", category: "أداء",
    price: 680, originalPrice: 800, rating: 4.3, reviews: 134, image: "🔥",
    description: "مكمل ما قبل التمرين لطاقة وتركيز فائقين",
    benefits: ["طاقة فورية", "تركيز عالي", "تحمل أفضل"], inStock: true, badge: "عرض"
  },
  {
    id: "p7", name: "جلوتامين", nameEn: "L-Glutamine", category: "تعافي",
    price: 400, rating: 4.5, reviews: 98, image: "🧬",
    description: "حمض أميني أساسي لتعزيز التعافي وصحة الأمعاء",
    benefits: ["تعافي سريع", "صحة الأمعاء", "تعزيز المناعة"], inStock: true
  },
  {
    id: "p8", name: "كازين بروتين ليلي", nameEn: "Casein Night Protein", category: "بروتين",
    price: 950, rating: 4.6, reviews: 112, image: "🌙",
    description: "بروتين بطيء الامتصاص لتغذية العضلات أثناء النوم",
    benefits: ["تغذية مستمرة", "بطيء الامتصاص", "مثالي للنوم"], inStock: false
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", icon: Package },
  { id: "بروتين", label: "بروتين", icon: Dumbbell },
  { id: "أداء", label: "أداء", icon: Zap },
  { id: "صحة", label: "صحة", icon: Heart },
  { id: "تعافي", label: "تعافي", icon: Pill },
];

const Store = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: "تمت الإضافة", description: `${product.name} أُضيف للسلة` });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.includes(searchQuery) || p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="p-8 relative">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">متجر المكملات</h1>
            <p className="text-muted-foreground mt-1">مكملات غذائية عالية الجودة لدعم أهدافك</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مكمل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 glass border-border/50 bg-muted/30 h-12 rounded-xl"
              />
            </div>
            <Button
              onClick={() => setShowCart(true)}
              className="bg-gradient-primary glow-green relative gap-2 h-12"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">السلة</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-primary text-primary-foreground glow-green"
                  : "glass border-border/30 text-muted-foreground hover:border-primary/30"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`glass-card p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden ${
                !product.inStock ? "opacity-60" : "hover:glow-green"
              }`}
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1">
                    {product.badge}
                  </Badge>
                </div>
              )}

              {/* Product Image */}
              <div className="text-center mb-4 relative">
                <div className="text-6xl py-6 group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="glass px-4 py-2 rounded-full text-sm font-bold text-destructive border-destructive/30">
                      نفذ المخزون
                    </span>
                  </div>
                )}
              </div>

              {/* Category */}
              <Badge className="glass text-xs mb-2">{product.category}</Badge>

              {/* Name */}
              <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.benefits.map((b, i) => (
                  <span key={i} className="text-[10px] glass px-2 py-0.5 rounded-full text-muted-foreground">
                    {b}
                  </span>
                ))}
              </div>

              {/* Price & Add */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold gradient-text">{product.price}</span>
                  <span className="text-xs text-muted-foreground mr-1">ج.م</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through mr-2">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="bg-gradient-primary text-primary-foreground rounded-xl h-10 px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="glass-card p-12 text-center mt-8">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">لا توجد منتجات تطابق البحث</p>
          </div>
        )}

        {/* Cart Drawer */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end" dir="rtl">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <div className="relative w-full max-w-md glass-card border-r-0 rounded-r-none rounded-l-3xl p-6 overflow-y-auto animate-fade-in">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-primary">
                    <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">سلة المشتريات</h2>
                    <p className="text-xs text-muted-foreground">{totalItems} منتج</p>
                  </div>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 rounded-xl glass hover:border-primary/30 transition">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">السلة فارغة</p>
                  <p className="text-xs text-muted-foreground mt-1">أضف منتجات للبدء</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-3xl">{item.product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-primary font-bold">{item.product.price} ج.م</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-primary/30 transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-primary/30 transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-destructive/30 transition text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="glass rounded-2xl p-4 space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span className="font-bold text-foreground">{totalPrice} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الشحن</span>
                      <span className="font-bold text-primary">مجاني</span>
                    </div>
                    <div className="border-t border-border/30 pt-3 flex justify-between">
                      <span className="font-bold text-foreground">الإجمالي</span>
                      <span className="text-xl font-bold gradient-text">{totalPrice} ج.م</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      toast({ title: "تم الطلب! 🎉", description: `تم إرسال طلبك بنجاح. الإجمالي: ${totalPrice} ج.م` });
                      setCart([]);
                      setShowCart(false);
                    }}
                    className="w-full bg-gradient-primary glow-green h-14 rounded-2xl text-lg font-bold"
                  >
                    إتمام الطلب
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Store;
