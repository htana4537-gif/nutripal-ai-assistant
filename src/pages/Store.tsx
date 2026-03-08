import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Search, Plus, Minus, Trash2, X, Star,
  Pill, Dumbbell, Zap, Heart, Package, Apple, Flame, Battery, Bone, UtensilsCrossed,
  Filter, Eye, EyeOff
} from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

const CATEGORY_ICONS: Record<string, any> = {
  "all": Package,
  "بروتين": Dumbbell,
  "أداء": Zap,
  "صحة": Heart,
  "تعافي": Pill,
  "فيتامينات": Apple,
  "حرق دهون": Flame,
  "طاقة": Battery,
  "مفاصل": Bone,
  "أطعمة صحية": UtensilsCrossed,
};

const Store = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
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

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch = p.name.includes(searchQuery) || p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesAvailability = !showOnlyAvailable || p.inStock;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [searchQuery, activeCategory, showOnlyAvailable]);

  const availableCount = filteredProducts.filter(p => p.inStock).length;
  const unavailableCount = filteredProducts.filter(p => !p.inStock).length;

  return (
    <DashboardLayout>
      <div className="p-8 relative">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">متجر المكملات</h1>
            <p className="text-muted-foreground mt-1">
              {PRODUCTS.length} منتج • {availableCount} متوفر • {unavailableCount} غير متوفر
            </p>
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
              onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              variant="outline"
              className={`gap-2 h-12 rounded-xl border-border/50 ${showOnlyAvailable ? 'bg-primary/20 border-primary/50 text-primary' : 'glass'}`}
            >
              {showOnlyAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="hidden md:inline">{showOnlyAvailable ? "المتوفر فقط" : "عرض الكل"}</span>
            </Button>
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
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Package;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-primary text-primary-foreground glow-green"
                    : "glass border-border/30 text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`glass-card p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden ${
                !product.inStock ? "opacity-50 grayscale-[30%]" : "hover:glow-green"
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

              {/* Stock indicator */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${product.inStock ? 'bg-primary' : 'bg-destructive'}`} />
              </div>

              {/* Product Image */}
              <div className="text-center mb-4 relative">
                <div className="text-5xl py-4 group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="glass px-4 py-2 rounded-full text-xs font-bold text-destructive border-destructive/30">
                      نفذ المخزون
                    </span>
                  </div>
                )}
              </div>

              {/* Category */}
              <Badge variant="secondary" className="text-[10px] mb-2">{product.category}</Badge>

              {/* Name */}
              <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-3 w-3 text-warning fill-warning" />
                <span className="text-xs font-bold text-foreground">{product.rating}</span>
                <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.benefits.slice(0, 3).map((b, i) => (
                  <span key={i} className="text-[10px] bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">
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
                  size="sm"
                  className="bg-gradient-primary text-primary-foreground rounded-xl h-9 px-3"
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
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <div className="relative w-full max-w-md glass-strong border-r-0 rounded-r-none rounded-l-3xl p-6 overflow-y-auto animate-fade-in">
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
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-3xl">{item.product.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-primary font-bold">{item.product.price} ج.م</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-primary/30 transition">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-primary/30 transition">
                            <Plus className="h-3 w-3" />
                          </button>
                          <button onClick={() => removeFromCart(item.product.id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-destructive/30 transition text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

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
