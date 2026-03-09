import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, AlertTriangle, ShoppingCart, Clock, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { FOODS } from "@/data/foods";
import { FOOD_DETAILS } from "@/data/foodsDetailedData";
import DashboardLayout from "@/components/DashboardLayout";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const food = FOODS.find(f => f.id === id);
  const details = FOOD_DETAILS[id || ""];

  if (!food || !details) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/nutrition")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة لمركز التغذية
          </Button>
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">لم يتم العثور على هذا الطعام</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/nutrition")}
          className="mb-6 hover:bg-accent/50"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة لمركز التغذية
        </Button>

        {/* Hero Section */}
        <div className="glass-card p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image */}
            <div className="space-y-4">
              <AspectRatio ratio={1}>
                {food.imageUrl ? (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="object-cover w-full h-full rounded-2xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${food.imageUrl ? 'hidden' : ''} w-full h-full rounded-2xl glass flex items-center justify-center`}>
                  <span className="text-8xl">{food.emoji}</span>
                </div>
              </AspectRatio>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-3">{food.name}</h1>
                <Badge variant="secondary" className="mb-4">{food.category}</Badge>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">{food.price}</span>
                    <span className="text-sm text-muted-foreground mr-1">ج.م</span>
                    <p className="text-xs text-muted-foreground">{food.unit}</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <Badge 
                    variant={food.available ? "default" : "destructive"}
                    className="px-4 py-2"
                  >
                    {food.available ? "متوفر" : "غير متوفر"}
                  </Badge>
                </div>

                {/* Nutrition Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">السعرات</p>
                    <p className="font-bold text-lg text-foreground">{food.calories}</p>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">البروتين</p>
                    <p className="font-bold text-lg text-blue-500">{food.protein}g</p>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">الكربوهيدرات</p>
                    <p className="font-bold text-lg text-orange-500">{food.carbs}g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Benefits */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                الفوائد الصحية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nutrients */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Thermometer className="h-5 w-5 text-secondary" />
                </div>
                العناصر الغذائية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(details.nutrients).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 glass rounded-lg">
                  <span className="text-sm text-foreground">{key}</span>
                  <span className="text-sm font-bold text-primary">{String(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sources */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-accent/20">
                  <ShoppingCart className="h-5 w-5 text-accent-foreground" />
                </div>
                مصادر الحصول
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.sources.map((source: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1 shrink-0" />
                  <p className="text-sm text-foreground">{source}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Recommendation */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                الكمية اليومية المُوصى بها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 glass rounded-lg">
                <p className="text-center text-lg font-bold text-primary">{details.dailyRecommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warnings */}
        {details.warnings.length > 0 && (
          <Card className="glass-card border-0 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                تحذيرات ومحاذير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.warnings.map((warning: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 glass rounded-lg border-l-4 border-destructive/30">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{warning}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Preparation Tips */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">نصائح التحضير</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.preparationTips.map((tip: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">التخزين والحفظ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.storage.map((storage: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-sm text-foreground">{storage}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FoodDetails;