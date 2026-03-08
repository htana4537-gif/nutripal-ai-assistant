export interface Product {
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

export const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "بروتين", label: "بروتين" },
  { id: "أداء", label: "أداء" },
  { id: "صحة", label: "صحة" },
  { id: "تعافي", label: "تعافي" },
  { id: "فيتامينات", label: "فيتامينات" },
  { id: "حرق دهون", label: "حرق دهون" },
  { id: "طاقة", label: "طاقة" },
  { id: "مفاصل", label: "مفاصل" },
  { id: "أطعمة صحية", label: "أطعمة صحية" },
];

export const PRODUCTS: Product[] = [
  // ===================== بروتين (25 منتج) =====================
  { id: "p1", name: "واي بروتين جولد ستاندرد 5 باوند", nameEn: "Gold Standard Whey 5lb", category: "بروتين", price: 2850, originalPrice: 3200, rating: 4.9, reviews: 1243, image: "🥛", description: "بروتين واي عالي الجودة بنسبة 24 جم بروتين لكل حصة - الأكثر مبيعاً عالمياً", benefits: ["بناء العضلات", "سريع الامتصاص", "منخفض الدهون"], inStock: true, badge: "الأكثر مبيعاً" },
  { id: "p2", name: "واي بروتين جولد ستاندرد 2 باوند", nameEn: "Gold Standard Whey 2lb", category: "بروتين", price: 1350, rating: 4.9, reviews: 876, image: "🥛", description: "نفس الجودة العالية بحجم أصغر مناسب للتجربة", benefits: ["بناء العضلات", "24 جم بروتين", "5 جم BCAA"], inStock: true },
  { id: "p3", name: "سيرياس ماس 12 باوند", nameEn: "Serious Mass 12lb", category: "بروتين", price: 3200, originalPrice: 3600, rating: 4.7, reviews: 654, image: "💪", description: "1250 سعرة حرارية و50 جم بروتين لكل حصة لزيادة الوزن", benefits: ["زيادة الوزن", "50 جم بروتين", "1250 سعرة"], inStock: true, badge: "للتضخيم" },
  { id: "p4", name: "ايزو 100 داي ماتيز", nameEn: "ISO 100 Dymatize", category: "بروتين", price: 3100, rating: 4.8, reviews: 432, image: "🥤", description: "بروتين أيزو هيدرولايزد سريع الامتصاص خالي من اللاكتوز", benefits: ["هيدرولايزد", "خالي من اللاكتوز", "25 جم بروتين"], inStock: true },
  { id: "p5", name: "نايترو تك مسل تك 4 باوند", nameEn: "Nitro-Tech MuscleTech 4lb", category: "بروتين", price: 2400, rating: 4.6, reviews: 321, image: "🏋️", description: "بروتين واي + أيزوليت مع كرياتين لبناء العضلات", benefits: ["30 جم بروتين", "3 جم كرياتين", "بناء عضلات"], inStock: true },
  { id: "p6", name: "كازين بروتين جولد ستاندرد", nameEn: "Gold Standard Casein", category: "بروتين", price: 2650, rating: 4.6, reviews: 234, image: "🌙", description: "بروتين بطيء الامتصاص لتغذية العضلات أثناء النوم", benefits: ["بطيء الامتصاص", "24 جم بروتين", "للنوم"], inStock: true },
  { id: "p7", name: "كومبات بروتين مسل فارم", nameEn: "Combat Protein MusclePharm", category: "بروتين", price: 2100, rating: 4.5, reviews: 198, image: "⚔️", description: "مزيج 5 أنواع بروتين للامتصاص المستمر على مدار الساعة", benefits: ["5 مصادر بروتين", "25 جم بروتين", "امتصاص مستمر"], inStock: true },
  { id: "p8", name: "واي بروتين إمباكت", nameEn: "Impact Whey MyProtein", category: "بروتين", price: 1800, originalPrice: 2100, rating: 4.7, reviews: 567, image: "🥛", description: "بروتين واي عالي الجودة من ماي بروتين البريطانية", benefits: ["21 جم بروتين", "قيمة ممتازة", "نكهات متعددة"], inStock: true, badge: "عرض" },
  { id: "p9", name: "بروتين نباتي أورجانيك", nameEn: "Organic Plant Protein", category: "بروتين", price: 1650, rating: 4.4, reviews: 145, image: "🌱", description: "بروتين نباتي من البازلاء والأرز للنباتيين", benefits: ["نباتي 100%", "عضوي", "20 جم بروتين"], inStock: true },
  { id: "p10", name: "واي بروتين أنيمال", nameEn: "Animal Whey Protein", category: "بروتين", price: 2750, rating: 4.7, reviews: 287, image: "🦁", description: "واي بروتين بجودة فائقة من أنيمال للمحترفين", benefits: ["25 جم بروتين", "جودة فائقة", "للمحترفين"], inStock: false },
  { id: "p11", name: "هيدرو واي زيرو بيوتك", nameEn: "Hydro Whey Zero BioTech", category: "بروتين", price: 2200, rating: 4.5, reviews: 176, image: "💧", description: "بروتين واي هيدرولايزد بدون سكر ودهون", benefits: ["هيدرولايزد", "زيرو سكر", "23 جم بروتين"], inStock: true },
  { id: "p12", name: "ماس تك إكستريم 2000", nameEn: "Mass-Tech Extreme 2000", category: "بروتين", price: 3500, rating: 4.5, reviews: 198, image: "🔩", description: "2000 سعرة حرارية و80 جم بروتين لزيادة الكتلة العضلية", benefits: ["80 جم بروتين", "2000 سعرة", "كرياتين"], inStock: true },
  { id: "p13", name: "واي بروتين ستاكس", nameEn: "Rule 1 Whey Blend", category: "بروتين", price: 2300, rating: 4.6, reviews: 154, image: "🥤", description: "مزيج بروتين واي بريميوم بنكهات مميزة", benefits: ["24 جم بروتين", "نكهات فاخرة", "جودة عالية"], inStock: true },
  { id: "p14", name: "بروتين البيض ألبيومين", nameEn: "Egg Albumin Protein", category: "بروتين", price: 1400, rating: 4.3, reviews: 87, image: "🥚", description: "بروتين البيض الطبيعي - بديل ممتاز للواي", benefits: ["طبيعي 100%", "بطيء الامتصاص", "خالي لاكتوز"], inStock: true },
  { id: "p15", name: "سينثا 6 إيدج BSN", nameEn: "Syntha-6 Edge BSN", category: "بروتين", price: 2500, rating: 4.7, reviews: 345, image: "🎯", description: "بروتين متعدد المصادر بطعم لذيذ من BSN", benefits: ["24 جم بروتين", "طعم مميز", "ألياف"], inStock: false },

  // ===================== أداء (20 منتج) =====================
  { id: "p16", name: "كرياتين مونوهيدرات 300 جم", nameEn: "Creatine Monohydrate 300g", category: "أداء", price: 450, rating: 4.8, reviews: 876, image: "⚡", description: "كرياتين نقي 100% لزيادة القوة والأداء الرياضي", benefits: ["زيادة القوة", "تحسين الأداء", "نقي 100%"], inStock: true },
  { id: "p17", name: "كرياتين مونوهيدرات 500 جم", nameEn: "Creatine Monohydrate 500g", category: "أداء", price: 700, rating: 4.8, reviews: 654, image: "⚡", description: "كرياتين نقي بحجم أكبر وقيمة أفضل", benefits: ["5 جم لكل حصة", "100 حصة", "بدون إضافات"], inStock: true },
  { id: "p18", name: "بري وورك أوت C4 أوريجينال", nameEn: "C4 Original Pre-Workout", category: "أداء", price: 850, originalPrice: 1000, rating: 4.6, reviews: 432, image: "🔥", description: "مكمل ما قبل التمرين لطاقة وتركيز فائقين", benefits: ["طاقة فورية", "150 مج كافيين", "بيتا ألانين"], inStock: true, badge: "عرض" },
  { id: "p19", name: "بري وورك أوت C4 ألتيميت", nameEn: "C4 Ultimate Pre-Workout", category: "أداء", price: 1200, rating: 4.7, reviews: 234, image: "💥", description: "النسخة المتقدمة من C4 بجرعات أعلى للمحترفين", benefits: ["300 مج كافيين", "سيترولين", "للمحترفين"], inStock: true },
  { id: "p20", name: "بري وورك أوت جولد ستاندرد", nameEn: "Gold Standard Pre-Workout", category: "أداء", price: 950, rating: 4.5, reviews: 321, image: "⭐", description: "بري وورك أوت متوازن من أوبتيموم نيوترشن", benefits: ["175 مج كافيين", "كرياتين", "بيتا ألانين"], inStock: true },
  { id: "p21", name: "أرجينين L-Arginine 1000", nameEn: "L-Arginine 1000mg", category: "أداء", price: 380, rating: 4.4, reviews: 198, image: "🫀", description: "أرجينين لتحسين تدفق الدم وضخ العضلات", benefits: ["تدفق الدم", "ضخ عضلي", "1000 مج"], inStock: true },
  { id: "p22", name: "سيترولين ماليت", nameEn: "Citrulline Malate", category: "أداء", price: 520, rating: 4.5, reviews: 145, image: "🔄", description: "سيترولين لتحسين الأداء والتحمل العضلي", benefits: ["تحمل أفضل", "ضخ عضلي", "تقليل التعب"], inStock: true },
  { id: "p23", name: "بيتا ألانين", nameEn: "Beta-Alanine", category: "أداء", price: 420, rating: 4.4, reviews: 132, image: "⚡", description: "بيتا ألانين لزيادة التحمل وتأخير التعب العضلي", benefits: ["زيادة التحمل", "تأخير التعب", "3.2 جم"], inStock: true },
  { id: "p24", name: "تيستو بوستر أنيمال", nameEn: "Animal Test", category: "أداء", price: 1800, rating: 4.3, reviews: 87, image: "🦁", description: "محفز تستوستيرون طبيعي لزيادة القوة والكتلة العضلية", benefits: ["رفع تستوستيرون", "قوة", "كتلة عضلية"], inStock: false },
  { id: "p25", name: "ZMA زد إم إيه", nameEn: "ZMA Supplement", category: "أداء", price: 350, rating: 4.5, reviews: 234, image: "🔋", description: "زنك ومغنيسيوم وفيتامين B6 لدعم الأداء والتعافي", benefits: ["تعافي", "نوم أفضل", "أداء"], inStock: true },
  { id: "p26", name: "HMB 1000", nameEn: "HMB 1000mg", category: "أداء", price: 480, rating: 4.3, reviews: 76, image: "🛡️", description: "HMB للحفاظ على العضلات ومنع الهدم العضلي", benefits: ["حماية العضلات", "منع الهدم", "1000 مج"], inStock: true },
  { id: "p27", name: "بري وورك أوت توتال وور", nameEn: "Total War Pre-Workout", category: "أداء", price: 1100, rating: 4.6, reviews: 267, image: "💣", description: "واحد من أقوى مكملات البري وورك أوت في السوق", benefits: ["طاقة خارقة", "تركيز حاد", "ضخ عضلي"], inStock: true },
  { id: "p28", name: "نايتريك أوكسايد بوستر", nameEn: "Nitric Oxide Booster", category: "أداء", price: 650, rating: 4.4, reviews: 156, image: "💨", description: "محفز أكسيد النيتريك لأفضل ضخ عضلي أثناء التمرين", benefits: ["ضخ عضلي", "تدفق الدم", "أداء أفضل"], inStock: true },

  // ===================== صحة (25 منتج) =====================
  { id: "p29", name: "أوميجا 3 زيت السمك 1000", nameEn: "Omega-3 Fish Oil 1000mg", category: "صحة", price: 380, originalPrice: 450, rating: 4.7, reviews: 543, image: "🐟", description: "أحماض دهنية أساسية لصحة القلب والمخ", benefits: ["صحة القلب", "وظائف المخ", "مضاد للالتهابات"], inStock: true, badge: "عرض" },
  { id: "p30", name: "أوميجا 3 تركيز عالي", nameEn: "Omega-3 Triple Strength", category: "صحة", price: 620, rating: 4.8, reviews: 321, image: "🐟", description: "أوميجا 3 بتركيز ثلاثي - EPA و DHA بجرعة مضاعفة", benefits: ["تركيز ثلاثي", "EPA + DHA", "جودة فائقة"], inStock: true },
  { id: "p31", name: "فيتامين D3 5000 وحدة", nameEn: "Vitamin D3 5000 IU", category: "صحة", price: 250, rating: 4.8, reviews: 765, image: "☀️", description: "فيتامين الشمس الضروري لصحة العظام والمناعة", benefits: ["صحة العظام", "مناعة", "5000 وحدة"], inStock: true },
  { id: "p32", name: "فيتامين C 1000", nameEn: "Vitamin C 1000mg", category: "صحة", price: 180, rating: 4.6, reviews: 876, image: "🍊", description: "فيتامين سي لتعزيز المناعة ومضاد أكسدة قوي", benefits: ["تعزيز المناعة", "مضاد أكسدة", "1000 مج"], inStock: true },
  { id: "p33", name: "زنك 50 مج", nameEn: "Zinc 50mg", category: "صحة", price: 150, rating: 4.5, reviews: 432, image: "🔩", description: "زنك لدعم المناعة وصحة البشرة والشعر", benefits: ["مناعة", "بشرة صحية", "شعر قوي"], inStock: true },
  { id: "p34", name: "مغنيسيوم 400 مج", nameEn: "Magnesium 400mg", category: "صحة", price: 200, rating: 4.6, reviews: 345, image: "💎", description: "مغنيسيوم لصحة العضلات والأعصاب والنوم العميق", benefits: ["عضلات", "أعصاب", "نوم عميق"], inStock: true },
  { id: "p35", name: "بروبيوتيك 50 مليار", nameEn: "Probiotic 50 Billion", category: "صحة", price: 550, rating: 4.7, reviews: 234, image: "🦠", description: "بكتيريا نافعة لصحة الجهاز الهضمي والمناعة", benefits: ["صحة الأمعاء", "هضم أفضل", "مناعة"], inStock: true },
  { id: "p36", name: "كولاجين بحري", nameEn: "Marine Collagen", category: "صحة", price: 750, originalPrice: 900, rating: 4.6, reviews: 321, image: "✨", description: "كولاجين بحري لصحة البشرة والمفاصل والشعر", benefits: ["بشرة نضرة", "مفاصل", "شعر قوي"], inStock: true, badge: "للبشرة" },
  { id: "p37", name: "حديد مع فيتامين C", nameEn: "Iron + Vitamin C", category: "صحة", price: 180, rating: 4.4, reviews: 198, image: "🩸", description: "حديد مع فيتامين C لتحسين الامتصاص ومنع الأنيميا", benefits: ["منع أنيميا", "امتصاص أفضل", "طاقة"], inStock: true },
  { id: "p38", name: "كالسيوم + فيتامين D", nameEn: "Calcium + Vitamin D", category: "صحة", price: 220, rating: 4.5, reviews: 267, image: "🦴", description: "كالسيوم مع فيتامين D لعظام قوية وصحية", benefits: ["عظام قوية", "أسنان", "فيتامين D"], inStock: true },
  { id: "p39", name: "زيت بذور الكتان", nameEn: "Flaxseed Oil", category: "صحة", price: 280, rating: 4.3, reviews: 123, image: "🌿", description: "أوميجا 3 نباتي من بذور الكتان للنباتيين", benefits: ["نباتي", "أوميجا 3", "ألياف"], inStock: true },
  { id: "p40", name: "كو إنزيم Q10", nameEn: "CoQ10 100mg", category: "صحة", price: 480, rating: 4.6, reviews: 176, image: "❤️", description: "مضاد أكسدة قوي لصحة القلب وإنتاج الطاقة الخلوية", benefits: ["صحة القلب", "طاقة خلوية", "مضاد أكسدة"], inStock: true },
  { id: "p41", name: "سبيرولينا عضوية", nameEn: "Organic Spirulina", category: "صحة", price: 350, rating: 4.5, reviews: 145, image: "🌊", description: "سوبر فود غني بالبروتين والمعادن والفيتامينات", benefits: ["سوبر فود", "بروتين نباتي", "حديد"], inStock: true },
  { id: "p42", name: "خل التفاح كبسولات", nameEn: "Apple Cider Vinegar Caps", category: "صحة", price: 280, rating: 4.3, reviews: 198, image: "🍎", description: "فوائد خل التفاح بدون الطعم الحاد - يدعم الهضم", benefits: ["هضم", "تنظيم سكر", "إزالة سموم"], inStock: false },
  { id: "p43", name: "أشواغاندا 600 مج", nameEn: "Ashwagandha 600mg", category: "صحة", price: 320, rating: 4.6, reviews: 234, image: "🧘", description: "عشبة أشواغاندا لتقليل التوتر ودعم الأداء", benefits: ["تقليل توتر", "أداء رياضي", "نوم أفضل"], inStock: true },
  { id: "p44", name: "كركم + بيبرين", nameEn: "Turmeric + Bioperine", category: "صحة", price: 250, rating: 4.5, reviews: 187, image: "🟡", description: "كركم مع بيبرين لامتصاص أفضل - مضاد التهابات طبيعي", benefits: ["مضاد التهابات", "مضاد أكسدة", "مفاصل"], inStock: true },

  // ===================== تعافي (20 منتج) =====================
  { id: "p45", name: "BCAA 5000 باودر", nameEn: "BCAA 5000 Powder", category: "تعافي", price: 550, rating: 4.6, reviews: 432, image: "💪", description: "أحماض أمينية متفرعة لتعزيز التعافي وحماية العضلات", benefits: ["تعافي سريع", "حماية العضلات", "5 جم BCAA"], inStock: true },
  { id: "p46", name: "BCAA كبسولات 240 كبسولة", nameEn: "BCAA Capsules 240ct", category: "تعافي", price: 480, rating: 4.5, reviews: 234, image: "💊", description: "أحماض أمينية BCAA في كبسولات سهلة الاستخدام", benefits: ["سهل الاستخدام", "BCAA", "تعافي"], inStock: true },
  { id: "p47", name: "جلوتامين 300 جم", nameEn: "L-Glutamine 300g", category: "تعافي", price: 400, rating: 4.5, reviews: 298, image: "🧬", description: "حمض أميني أساسي لتعزيز التعافي وصحة الأمعاء", benefits: ["تعافي سريع", "صحة الأمعاء", "مناعة"], inStock: true },
  { id: "p48", name: "جلوتامين 500 جم", nameEn: "L-Glutamine 500g", category: "تعافي", price: 620, rating: 4.5, reviews: 176, image: "🧬", description: "جلوتامين بحجم كبير للاستخدام المنتظم", benefits: ["100 حصة", "تعافي", "اقتصادي"], inStock: true },
  { id: "p49", name: "EAA أحماض أمينية أساسية", nameEn: "EAA Essential Aminos", category: "تعافي", price: 650, rating: 4.6, reviews: 198, image: "🔬", description: "9 أحماض أمينية أساسية كاملة لتعافي مثالي", benefits: ["9 أحماض أمينية", "تعافي كامل", "بناء عضلات"], inStock: true },
  { id: "p50", name: "كارنيتين L-Carnitine 1000", nameEn: "L-Carnitine 1000mg", category: "تعافي", price: 350, rating: 4.4, reviews: 234, image: "🔥", description: "كارنيتين لنقل الأحماض الدهنية وتحسين التعافي", benefits: ["حرق دهون", "تعافي", "طاقة"], inStock: true },
  { id: "p51", name: "تورين 1000 مج", nameEn: "Taurine 1000mg", category: "تعافي", price: 280, rating: 4.3, reviews: 123, image: "⚡", description: "تورين لدعم التعافي والأداء والتركيز", benefits: ["تعافي", "تركيز", "أداء"], inStock: true },
  { id: "p52", name: "إلكتروليت باودر", nameEn: "Electrolyte Powder", category: "تعافي", price: 320, rating: 4.6, reviews: 276, image: "💧", description: "أملاح ومعادن لتعويض ما يفقد أثناء التمرين", benefits: ["ترطيب", "أملاح معدنية", "تعافي"], inStock: true },
  { id: "p53", name: "ريكوفري أمينو", nameEn: "Recovery Amino", category: "تعافي", price: 780, rating: 4.7, reviews: 154, image: "🔄", description: "تركيبة متكاملة للتعافي بعد التمرين", benefits: ["BCAA + جلوتامين", "فيتامينات", "تعافي شامل"], inStock: true },
  { id: "p54", name: "جليسين 1000 مج", nameEn: "Glycine 1000mg", category: "تعافي", price: 200, rating: 4.3, reviews: 87, image: "😴", description: "جليسين لتحسين جودة النوم والتعافي العضلي", benefits: ["نوم أفضل", "تعافي", "تهدئة"], inStock: true },

  // ===================== فيتامينات (20 منتج) =====================
  { id: "p55", name: "ملتي فيتامين للرجال", nameEn: "Men's Multivitamin", category: "فيتامينات", price: 420, rating: 4.6, reviews: 543, image: "💊", description: "فيتامينات ومعادن شاملة مصممة خصيصاً للرجال", benefits: ["طاقة", "مناعة", "صحة عامة"], inStock: true },
  { id: "p56", name: "ملتي فيتامين للنساء", nameEn: "Women's Multivitamin", category: "فيتامينات", price: 420, rating: 4.7, reviews: 432, image: "💊", description: "فيتامينات شاملة مع حديد وفوليك أسيد للنساء", benefits: ["حديد", "فوليك أسيد", "كالسيوم"], inStock: true },
  { id: "p57", name: "فيتامين B Complex", nameEn: "Vitamin B Complex", category: "فيتامينات", price: 200, rating: 4.5, reviews: 321, image: "🅱️", description: "مجموعة فيتامينات B الكاملة لإنتاج الطاقة والأعصاب", benefits: ["طاقة", "أعصاب", "تركيز"], inStock: true },
  { id: "p58", name: "فيتامين E 400 وحدة", nameEn: "Vitamin E 400 IU", category: "فيتامينات", price: 180, rating: 4.4, reviews: 198, image: "🌻", description: "فيتامين E مضاد أكسدة لصحة البشرة والقلب", benefits: ["مضاد أكسدة", "بشرة", "قلب"], inStock: true },
  { id: "p59", name: "فيتامين A 10000", nameEn: "Vitamin A 10000 IU", category: "فيتامينات", price: 150, rating: 4.3, reviews: 145, image: "👁️", description: "فيتامين A لصحة العينين والبشرة والمناعة", benefits: ["نظر", "بشرة", "مناعة"], inStock: true },
  { id: "p60", name: "فيتامين K2 + D3", nameEn: "Vitamin K2 + D3", category: "فيتامينات", price: 350, rating: 4.7, reviews: 234, image: "🦷", description: "تركيبة K2 مع D3 لتوجيه الكالسيوم للعظام", benefits: ["عظام", "قلب", "كالسيوم"], inStock: true },
  { id: "p61", name: "بيوتين 10000", nameEn: "Biotin 10000 mcg", category: "فيتامينات", price: 250, rating: 4.6, reviews: 432, image: "💇", description: "بيوتين لشعر قوي وأظافر صحية وبشرة نضرة", benefits: ["شعر", "أظافر", "بشرة"], inStock: true },
  { id: "p62", name: "فوليك أسيد 800", nameEn: "Folic Acid 800mcg", category: "فيتامينات", price: 120, rating: 4.5, reviews: 176, image: "🧬", description: "حمض الفوليك الضروري لتكوين خلايا الدم", benefits: ["خلايا دم", "حمل صحي", "أعصاب"], inStock: true },
  { id: "p63", name: "سيلينيوم 200 ميكروجرام", nameEn: "Selenium 200mcg", category: "فيتامينات", price: 170, rating: 4.4, reviews: 132, image: "🔬", description: "سيلينيوم مضاد أكسدة لصحة الغدة الدرقية", benefits: ["غدة درقية", "مضاد أكسدة", "مناعة"], inStock: true },
  { id: "p64", name: "كروميوم 200 ميكروجرام", nameEn: "Chromium 200mcg", category: "فيتامينات", price: 160, rating: 4.3, reviews: 98, image: "📊", description: "كروميوم لتنظيم سكر الدم والتحكم في الشهية", benefits: ["سكر الدم", "شهية", "أيض"], inStock: true },

  // ===================== حرق دهون (20 منتج) =====================
  { id: "p65", name: "هايدروكسي كت هارد كور", nameEn: "Hydroxycut Hardcore", category: "حرق دهون", price: 850, originalPrice: 1000, rating: 4.5, reviews: 543, image: "🔥", description: "حارق دهون قوي مع كافيين ومستخلصات طبيعية", benefits: ["حرق دهون", "طاقة", "تركيز"], inStock: true, badge: "الأكثر مبيعاً" },
  { id: "p66", name: "ليبو 6 بلاك ألترا", nameEn: "Lipo-6 Black Ultra", category: "حرق دهون", price: 920, rating: 4.6, reviews: 432, image: "⬛", description: "تركيبة حرق دهون متقدمة للمحترفين", benefits: ["حرق سريع", "كبت شهية", "طاقة"], inStock: true },
  { id: "p67", name: "أنيمال كتس", nameEn: "Animal Cuts", category: "حرق دهون", price: 1400, rating: 4.7, reviews: 321, image: "✂️", description: "تركيبة تنشيف شاملة من أنيمال - الخيار الأول للمنافسين", benefits: ["تنشيف", "تعريق", "طاقة"], inStock: true },
  { id: "p68", name: "CLA 1000 حمض اللينوليك", nameEn: "CLA 1000mg", category: "حرق دهون", price: 380, rating: 4.3, reviews: 234, image: "💛", description: "حمض اللينوليك المقترن لدعم حرق الدهون بشكل طبيعي", benefits: ["حرق طبيعي", "حفظ عضلات", "أيض"], inStock: true },
  { id: "p69", name: "L-Carnitine سائل 3000", nameEn: "L-Carnitine Liquid 3000", category: "حرق دهون", price: 450, rating: 4.5, reviews: 345, image: "💧", description: "كارنيتين سائل سريع الامتصاص لحرق الدهون أثناء التمرين", benefits: ["امتصاص سريع", "حرق أثناء التمرين", "3000 مج"], inStock: true },
  { id: "p70", name: "مستخلص الشاي الأخضر", nameEn: "Green Tea Extract", category: "حرق دهون", price: 250, rating: 4.4, reviews: 287, image: "🍵", description: "مستخلص الشاي الأخضر الغني بمضادات الأكسدة EGCG", benefits: ["EGCG", "حرق دهون", "مضاد أكسدة"], inStock: true },
  { id: "p71", name: "كافيين 200 مج", nameEn: "Caffeine 200mg", category: "حرق دهون", price: 150, rating: 4.5, reviews: 432, image: "☕", description: "كافيين نقي لزيادة الأيض والتركيز وحرق الدهون", benefits: ["أيض أسرع", "تركيز", "200 مج"], inStock: true },
  { id: "p72", name: "يوهمبين HCL", nameEn: "Yohimbine HCL", category: "حرق دهون", price: 320, rating: 4.2, reviews: 156, image: "🌿", description: "يوهمبين لاستهداف الدهون العنيدة في البطن والأجناب", benefits: ["دهون عنيدة", "بطن", "تركيز"], inStock: false },
  { id: "p73", name: "ثيرمو فات بيرنر", nameEn: "Thermo Fat Burner", category: "حرق دهون", price: 680, rating: 4.4, reviews: 198, image: "🌡️", description: "حارق دهون ثيرموجينيك لرفع حرارة الجسم والأيض", benefits: ["ثيرموجينيك", "أيض", "طاقة"], inStock: true },
  { id: "p74", name: "كيتو BHB ملح", nameEn: "Keto BHB Salts", category: "حرق دهون", price: 550, rating: 4.3, reviews: 145, image: "🧪", description: "أجسام كيتونية خارجية لدعم حمية الكيتو", benefits: ["كيتو", "طاقة بدون كربوهيدرات", "تركيز"], inStock: true },
  { id: "p75", name: "فورسكولين 250 مج", nameEn: "Forskolin 250mg", category: "حرق دهون", price: 380, rating: 4.2, reviews: 98, image: "🌱", description: "مستخلص فورسكولين الطبيعي لتحفيز إنزيم حرق الدهون", benefits: ["طبيعي", "أيض", "هرمونات"], inStock: true },

  // ===================== طاقة (15 منتج) =====================
  { id: "p76", name: "شريط بروتين كويست", nameEn: "Quest Protein Bar", category: "طاقة", price: 85, rating: 4.7, reviews: 876, image: "🍫", description: "شريط بروتين بـ 20 جم بروتين و1 جم سكر فقط", benefits: ["20 جم بروتين", "1 جم سكر", "ألياف"], inStock: true },
  { id: "p77", name: "شريط بروتين ON", nameEn: "ON Protein Bar", category: "طاقة", price: 75, rating: 4.5, reviews: 543, image: "🍫", description: "بروتين بار من أوبتيموم نيوترشن بطعم الشوكولاتة", benefits: ["20 جم بروتين", "طعم مميز", "وجبة خفيفة"], inStock: true },
  { id: "p78", name: "باكيت شوفان بروتين", nameEn: "Protein Oats Packet", category: "طاقة", price: 45, rating: 4.4, reviews: 321, image: "🥣", description: "شوفان بروتين جاهز للتحضير كوجبة إفطار سريعة", benefits: ["إفطار سريع", "بروتين + كربوهيدرات", "ألياف"], inStock: true },
  { id: "p79", name: "زبدة الفول السوداني بروتين", nameEn: "Protein Peanut Butter", category: "طاقة", price: 320, rating: 4.6, reviews: 234, image: "🥜", description: "زبدة فول سوداني مدعمة بالبروتين بدون سكر مضاف", benefits: ["بروتين إضافي", "دهون صحية", "بدون سكر"], inStock: true },
  { id: "p80", name: "جل طاقة GU", nameEn: "GU Energy Gel", category: "طاقة", price: 55, rating: 4.5, reviews: 432, image: "⚡", description: "جل طاقة سريع للعدائين والرياضيين أثناء الأداء", benefits: ["طاقة فورية", "كربوهيدرات", "كافيين"], inStock: true },
  { id: "p81", name: "مشروب طاقة BCAA", nameEn: "BCAA Energy Drink", category: "طاقة", price: 35, rating: 4.3, reviews: 234, image: "🥤", description: "مشروب طاقة مع BCAA جاهز للشرب", benefits: ["BCAA", "كافيين", "جاهز"], inStock: true },
  { id: "p82", name: "بسكويت بروتين", nameEn: "Protein Cookie", category: "طاقة", price: 65, rating: 4.4, reviews: 198, image: "🍪", description: "بسكويت بروتين عالي البروتين منخفض السكر", benefits: ["16 جم بروتين", "وجبة خفيفة", "طعم رائع"], inStock: true },
  { id: "p83", name: "شيبس بروتين", nameEn: "Protein Chips", category: "طاقة", price: 55, rating: 4.2, reviews: 145, image: "🥨", description: "شيبس عالي البروتين كبديل صحي للسناكس", benefits: ["بروتين", "منخفض الدهون", "سناك صحي"], inStock: true },
  { id: "p84", name: "بان كيك بروتين مزيج", nameEn: "Protein Pancake Mix", category: "طاقة", price: 380, rating: 4.5, reviews: 176, image: "🥞", description: "مزيج بان كيك بروتين سهل التحضير", benefits: ["20 جم بروتين", "سهل التحضير", "لذيذ"], inStock: true },
  { id: "p85", name: "جرانولا بروتين", nameEn: "Protein Granola", category: "طاقة", price: 280, rating: 4.4, reviews: 132, image: "🥣", description: "جرانولا مدعمة بالبروتين مع مكسرات وشوكولاتة", benefits: ["بروتين", "ألياف", "إفطار صحي"], inStock: false },

  // ===================== مفاصل (13 منتج) =====================
  { id: "p86", name: "جلوكوزامين + كوندرويتين", nameEn: "Glucosamine Chondroitin", category: "مفاصل", price: 450, rating: 4.7, reviews: 543, image: "🦴", description: "تركيبة شاملة لصحة المفاصل والغضاريف", benefits: ["مفاصل", "غضاريف", "مرونة"], inStock: true },
  { id: "p87", name: "جلوكوزامين 1500", nameEn: "Glucosamine 1500mg", category: "مفاصل", price: 320, rating: 4.5, reviews: 321, image: "🦵", description: "جلوكوزامين لدعم صحة المفاصل وتقليل الالتهابات", benefits: ["مفاصل", "1500 مج", "التهابات"], inStock: true },
  { id: "p88", name: "MSM ميثيل سلفونيل", nameEn: "MSM 1000mg", category: "مفاصل", price: 280, rating: 4.4, reviews: 198, image: "🔗", description: "MSM لدعم الأنسجة الضامة وتخفيف آلام المفاصل", benefits: ["أنسجة ضامة", "آلام", "مرونة"], inStock: true },
  { id: "p89", name: "كولاجين النوع الثاني", nameEn: "Type II Collagen", category: "مفاصل", price: 580, rating: 4.6, reviews: 234, image: "✨", description: "كولاجين النوع الثاني المتخصص في صحة الغضاريف", benefits: ["غضاريف", "مفاصل", "مرونة"], inStock: true },
  { id: "p90", name: "أنيمال فليكس", nameEn: "Animal Flex", category: "مفاصل", price: 1200, rating: 4.8, reviews: 321, image: "🦁", description: "تركيبة شاملة لحماية المفاصل من أنيمال للرياضيين", benefits: ["حماية شاملة", "للرياضيين", "غضاريف + أربطة"], inStock: true, badge: "الأفضل" },
  { id: "p91", name: "حمض الهيالورونيك", nameEn: "Hyaluronic Acid", category: "مفاصل", price: 380, rating: 4.5, reviews: 176, image: "💧", description: "حمض الهيالورونيك لترطيب المفاصل ونضارة البشرة", benefits: ["ترطيب مفاصل", "بشرة", "مرونة"], inStock: true },
  { id: "p92", name: "بوزويليا 500 مج", nameEn: "Boswellia 500mg", category: "مفاصل", price: 300, rating: 4.4, reviews: 132, image: "🌿", description: "مستخلص بوزويليا الطبيعي المضاد للالتهابات", benefits: ["طبيعي", "مضاد التهابات", "مفاصل"], inStock: true },
  { id: "p93", name: "أوميجا 3 للمفاصل", nameEn: "Joint Support Omega", category: "مفاصل", price: 420, rating: 4.5, reviews: 145, image: "🐟", description: "أوميجا 3 بتركيز عالي مخصص لدعم صحة المفاصل", benefits: ["أوميجا 3", "التهابات", "مفاصل"], inStock: true },
  { id: "p94", name: "سام-إي SAMe 400", nameEn: "SAMe 400mg", category: "مفاصل", price: 650, rating: 4.3, reviews: 87, image: "🧪", description: "SAMe لدعم صحة المفاصل والمزاج والكبد", benefits: ["مفاصل", "مزاج", "كبد"], inStock: false },

  // ===================== أطعمة صحية (17 منتج) =====================
  { id: "p95", name: "شوفان عضوي 1 كجم", nameEn: "Organic Oats 1kg", category: "أطعمة صحية", price: 120, rating: 4.6, reviews: 876, image: "🌾", description: "شوفان كامل عضوي - مصدر ممتاز للكربوهيدرات المعقدة", benefits: ["كربوهيدرات معقدة", "ألياف", "عضوي"], inStock: true },
  { id: "p96", name: "أرز بني 2 كجم", nameEn: "Brown Rice 2kg", category: "أطعمة صحية", price: 85, rating: 4.4, reviews: 432, image: "🍚", description: "أرز بني كامل الحبة غني بالألياف والمعادن", benefits: ["ألياف", "معادن", "كربوهيدرات بطيئة"], inStock: true },
  { id: "p97", name: "كينوا عضوية 500 جم", nameEn: "Organic Quinoa 500g", category: "أطعمة صحية", price: 180, rating: 4.7, reviews: 234, image: "🌱", description: "كينوا عضوية غنية بالبروتين النباتي الكامل", benefits: ["بروتين كامل", "خالي جلوتين", "عضوي"], inStock: true },
  { id: "p98", name: "عسل نحل جبلي 500 جم", nameEn: "Mountain Honey 500g", category: "أطعمة صحية", price: 350, rating: 4.8, reviews: 543, image: "🍯", description: "عسل نحل طبيعي جبلي 100% بدون إضافات", benefits: ["طبيعي 100%", "طاقة", "مناعة"], inStock: true },
  { id: "p99", name: "زيت زيتون بكر 500 مل", nameEn: "Extra Virgin Olive Oil", category: "أطعمة صحية", price: 250, rating: 4.7, reviews: 432, image: "🫒", description: "زيت زيتون بكر ممتاز عصرة أولى", benefits: ["دهون صحية", "مضاد أكسدة", "قلب"], inStock: true },
  { id: "p100", name: "زيت جوز الهند عضوي", nameEn: "Organic Coconut Oil", category: "أطعمة صحية", price: 220, rating: 4.5, reviews: 321, image: "🥥", description: "زيت جوز الهند العضوي للطبخ والتجميل", benefits: ["MCT", "طبخ صحي", "عضوي"], inStock: true },
  { id: "p101", name: "لوز خام 500 جم", nameEn: "Raw Almonds 500g", category: "أطعمة صحية", price: 280, rating: 4.6, reviews: 234, image: "🌰", description: "لوز خام طبيعي غني بالبروتين والدهون الصحية", benefits: ["بروتين", "دهون صحية", "فيتامين E"], inStock: true },
  { id: "p102", name: "كاجو محمص 250 جم", nameEn: "Roasted Cashews 250g", category: "أطعمة صحية", price: 180, rating: 4.5, reviews: 198, image: "🥜", description: "كاجو محمص بدون ملح - سناك صحي مغذي", benefits: ["بروتين", "مغنيسيوم", "حديد"], inStock: true },
  { id: "p103", name: "بذور الشيا 300 جم", nameEn: "Chia Seeds 300g", category: "أطعمة صحية", price: 150, rating: 4.7, reviews: 345, image: "🌿", description: "بذور الشيا الغنية بالأوميجا 3 والألياف", benefits: ["أوميجا 3", "ألياف", "بروتين"], inStock: true },
  { id: "p104", name: "بذور الكتان 500 جم", nameEn: "Flaxseeds 500g", category: "أطعمة صحية", price: 100, rating: 4.4, reviews: 234, image: "🌾", description: "بذور الكتان المطحونة غنية بالأوميجا 3 والألياف", benefits: ["أوميجا 3", "ألياف", "ليجنان"], inStock: true },
  { id: "p105", name: "تمر مجهول 1 كجم", nameEn: "Medjool Dates 1kg", category: "أطعمة صحية", price: 320, rating: 4.8, reviews: 432, image: "🌴", description: "تمر مجهول فاخر - أفضل وقود طبيعي قبل التمرين", benefits: ["طاقة طبيعية", "بوتاسيوم", "ألياف"], inStock: true },
  { id: "p106", name: "زبدة اللوز 250 جم", nameEn: "Almond Butter 250g", category: "أطعمة صحية", price: 280, rating: 4.6, reviews: 176, image: "🥜", description: "زبدة لوز طبيعية 100% بدون سكر أو ملح", benefits: ["دهون صحية", "بروتين", "فيتامين E"], inStock: true },
  { id: "p107", name: "شوكولاتة داكنة 85%", nameEn: "Dark Chocolate 85%", category: "أطعمة صحية", price: 95, rating: 4.5, reviews: 321, image: "🍫", description: "شوكولاتة داكنة 85% كاكاو غنية بمضادات الأكسدة", benefits: ["مضادات أكسدة", "مغنيسيوم", "مزاج جيد"], inStock: true },
  { id: "p108", name: "طحينة سمسم 300 جم", nameEn: "Tahini 300g", category: "أطعمة صحية", price: 75, rating: 4.4, reviews: 198, image: "🫙", description: "طحينة سمسم طبيعية غنية بالكالسيوم والدهون الصحية", benefits: ["كالسيوم", "بروتين", "دهون صحية"], inStock: true },
  { id: "p109", name: "دقيق لوز 500 جم", nameEn: "Almond Flour 500g", category: "أطعمة صحية", price: 220, rating: 4.5, reviews: 145, image: "🥜", description: "دقيق لوز خالي الجلوتين للمخبوزات الصحية", benefits: ["خالي جلوتين", "كيتو", "بروتين"], inStock: true },
  { id: "p110", name: "سكر ستيفيا طبيعي", nameEn: "Stevia Sweetener", category: "أطعمة صحية", price: 120, rating: 4.3, reviews: 234, image: "🍃", description: "بديل سكر طبيعي من نبات الستيفيا - صفر سعرات", benefits: ["صفر سعرات", "طبيعي", "لمرضى السكر"], inStock: true },
  { id: "p111", name: "صوص بدون سعرات", nameEn: "Zero Calorie Sauce", category: "أطعمة صحية", price: 150, rating: 4.2, reviews: 176, image: "🍶", description: "صوص بنكهات متعددة بدون سعرات حرارية للدايت", benefits: ["صفر سعرات", "نكهات متعددة", "دايت فريندلي"], inStock: true },

  // ===================== منتجات إضافية (6 منتجات) =====================
  { id: "p112", name: "شيكر بلندر بوتل 700 مل", nameEn: "BlenderBottle 700ml", category: "أداء", price: 250, rating: 4.7, reviews: 876, image: "🥤", description: "شيكر بلندر بوتل الأصلي مع كرة خلط", benefits: ["خلط مثالي", "مانع تسريب", "700 مل"], inStock: true },
  { id: "p113", name: "حزام رفع أثقال جلد", nameEn: "Leather Lifting Belt", category: "أداء", price: 850, rating: 4.8, reviews: 321, image: "🏋️", description: "حزام رفع أثقال جلد طبيعي لحماية الظهر", benefits: ["حماية الظهر", "جلد طبيعي", "متين"], inStock: true },
  { id: "p114", name: "قفازات تمرين", nameEn: "Training Gloves", category: "أداء", price: 350, rating: 4.5, reviews: 234, image: "🧤", description: "قفازات تمرين مع دعم للمعصم وتهوية ممتازة", benefits: ["حماية اليد", "دعم معصم", "تهوية"], inStock: true },
  { id: "p115", name: "رباط معصم Wrist Wraps", nameEn: "Wrist Wraps", category: "أداء", price: 200, rating: 4.6, reviews: 198, image: "🤜", description: "رباط معصم مرن لدعم المعصم أثناء التمارين الثقيلة", benefits: ["دعم معصم", "مرن", "متين"], inStock: true },
  { id: "p116", name: "حبل مقاومة مجموعة", nameEn: "Resistance Bands Set", category: "أداء", price: 450, rating: 4.6, reviews: 321, image: "🔴", description: "مجموعة أحبال مقاومة 5 مستويات للتمرين المنزلي", benefits: ["5 مستويات", "تمرين منزلي", "خفيف الوزن"], inStock: true },
  { id: "p117", name: "فوم رولر 45 سم", nameEn: "Foam Roller 45cm", category: "تعافي", price: 320, rating: 4.5, reviews: 198, image: "🧱", description: "فوم رولر لتدليك العضلات والتعافي بعد التمرين", benefits: ["تدليك عضلات", "تعافي", "مرونة"], inStock: true },
];
