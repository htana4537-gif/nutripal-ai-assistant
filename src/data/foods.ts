export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  carbs: number;    // per 100g
  fats: number;     // per 100g
  price: number;    // ج.م per kg unless noted
  unit: string;     // وحدة القياس
  emoji: string;
  available: boolean;
  imageUrl?: string;
}

export const FOOD_CATEGORIES = [
  { key: "all", label: "الكل" },
  { key: "Vegetables", label: "خضروات" },
  { key: "Fruits", label: "فواكه" },
  { key: "Proteins", label: "بروتين" },
  { key: "Carbs", label: "كربوهيدرات" },
  { key: "Dairy", label: "ألبان" },
  { key: "Beverages", label: "مشروبات" },
  { key: "Snacks", label: "وجبات خفيفة" },
  { key: "Oils", label: "زيوت ودهون" },
  { key: "Legumes", label: "بقوليات" },
  { key: "Grains", label: "حبوب" },
];

// الأسعار بالجنيه المصري - محدثة مارس 2025 تقريباً
// السعرات والماكروز لكل 100 جرام
export const FOODS: Food[] = [
  // ===== بروتين (Proteins) - الأسعار بالكيلو =====
  { id: "1", name: "صدور دجاج", category: "Proteins", calories: 165, protein: 31, carbs: 0, fats: 3.6, price: 140, unit: "كجم", emoji: "🍗", available: true },
  { id: "2", name: "أوراك دجاج", category: "Proteins", calories: 209, protein: 26, carbs: 0, fats: 10.9, price: 110, unit: "كجم", emoji: "🍗", available: true },
  { id: "3", name: "دجاج كامل", category: "Proteins", calories: 239, protein: 27, carbs: 0, fats: 14, price: 95, unit: "كجم", emoji: "🐔", available: true },
  { id: "4", name: "كبدة دجاج", category: "Proteins", calories: 167, protein: 24, carbs: 1, fats: 6.5, price: 80, unit: "كجم", emoji: "🫀", available: true },
  { id: "5", name: "لحم بقري (فخذ)", category: "Proteins", calories: 250, protein: 26, carbs: 0, fats: 15, price: 380, unit: "كجم", emoji: "🥩", available: true },
  { id: "6", name: "لحم بقري مفروم", category: "Proteins", calories: 254, protein: 17, carbs: 0, fats: 20, price: 320, unit: "كجم", emoji: "🥩", available: true },
  { id: "7", name: "كفتة", category: "Proteins", calories: 280, protein: 18, carbs: 5, fats: 21, price: 300, unit: "كجم", emoji: "🥩", available: true },
  { id: "8", name: "كبدة بقري", category: "Proteins", calories: 135, protein: 21, carbs: 4, fats: 3.6, price: 250, unit: "كجم", emoji: "🫀", available: true },
  { id: "9", name: "سمك بلطي", category: "Proteins", calories: 128, protein: 26, carbs: 0, fats: 2.7, price: 75, unit: "كجم", emoji: "🐟", available: true },
  { id: "10", name: "سمك بوري", category: "Proteins", calories: 150, protein: 24, carbs: 0, fats: 5.5, price: 120, unit: "كجم", emoji: "🐟", available: true },
  { id: "11", name: "سلمون (مستورد)", category: "Proteins", calories: 208, protein: 20, carbs: 0, fats: 13, price: 550, unit: "كجم", emoji: "🐟", available: true },
  { id: "12", name: "جمبري", category: "Proteins", calories: 99, protein: 24, carbs: 0.2, fats: 0.3, price: 300, unit: "كجم", emoji: "🦐", available: true },
  { id: "13", name: "تونة معلبة (170g)", category: "Proteins", calories: 132, protein: 29, carbs: 0, fats: 1, price: 45, unit: "علبة", emoji: "🐟", available: true },
  { id: "14", name: "سردين معلب", category: "Proteins", calories: 208, protein: 25, carbs: 0, fats: 11, price: 30, unit: "علبة", emoji: "🐟", available: true },
  { id: "15", name: "بيض بلدي", category: "Proteins", calories: 155, protein: 13, carbs: 1.1, fats: 11, price: 5.5, unit: "بيضة", emoji: "🥚", available: true },
  { id: "16", name: "بيض أبيض", category: "Proteins", calories: 147, protein: 12.6, carbs: 0.7, fats: 10, price: 4.5, unit: "بيضة", emoji: "🥚", available: true },
  { id: "17", name: "لحم ضأن", category: "Proteins", calories: 294, protein: 25, carbs: 0, fats: 21, price: 450, unit: "كجم", emoji: "🍖", available: true },
  { id: "18", name: "ديك رومي صدور", category: "Proteins", calories: 135, protein: 30, carbs: 0, fats: 1, price: 180, unit: "كجم", emoji: "🦃", available: false },
  { id: "19", name: "سمك قاروص", category: "Proteins", calories: 124, protein: 24, carbs: 0, fats: 2.6, price: 200, unit: "كجم", emoji: "🐟", available: true },
  { id: "20", name: "كاليماري", category: "Proteins", calories: 92, protein: 15.6, carbs: 3.1, fats: 1.4, price: 220, unit: "كجم", emoji: "🦑", available: true },

  // ===== خضروات (Vegetables) - الأسعار بالكيلو =====
  { id: "tomato", name: "طماطم", category: "Vegetables", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, price: 12, unit: "كجم", emoji: "🍅", available: true, imageUrl: "/src/assets/food-images/tomato.png" },
  { id: "cucumber", name: "خيار", category: "Vegetables", calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, price: 10, unit: "كجم", emoji: "🥒", available: true, imageUrl: "/src/assets/food-images/cucumber.png" },
  { id: "onion", name: "بصل", category: "Vegetables", calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, price: 18, unit: "كجم", emoji: "🧅", available: true },
  { id: "garlic", name: "ثوم", category: "Vegetables", calories: 149, protein: 6.4, carbs: 33, fats: 0.5, price: 80, unit: "كجم", emoji: "🧄", available: true },
  { id: "potato", name: "بطاطس", category: "Vegetables", calories: 77, protein: 2, carbs: 17, fats: 0.1, price: 15, unit: "كجم", emoji: "🥔", available: true },
  { id: "26", name: "جزر", category: "Vegetables", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, price: 12, unit: "كجم", emoji: "🥕", available: true },
  { id: "27", name: "سبانخ", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, price: 15, unit: "كجم", emoji: "🥬", available: true },
  { id: "28", name: "بروكلي", category: "Vegetables", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, price: 40, unit: "كجم", emoji: "🥦", available: true },
  { id: "29", name: "فلفل ألوان", category: "Vegetables", calories: 31, protein: 1, carbs: 6, fats: 0.3, price: 50, unit: "كجم", emoji: "🫑", available: true },
  { id: "30", name: "فلفل أخضر", category: "Vegetables", calories: 20, protein: 0.9, carbs: 4.6, fats: 0.2, price: 15, unit: "كجم", emoji: "🌶️", available: true },
  { id: "31", name: "كوسة", category: "Vegetables", calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, price: 12, unit: "كجم", emoji: "🥒", available: true },
  { id: "32", name: "باذنجان", category: "Vegetables", calories: 25, protein: 1, carbs: 6, fats: 0.2, price: 14, unit: "كجم", emoji: "🍆", available: true },
  { id: "33", name: "قرنبيط", category: "Vegetables", calories: 25, protein: 1.9, carbs: 5, fats: 0.3, price: 15, unit: "كجم", emoji: "🥦", available: true },
  { id: "34", name: "ملوخية", category: "Vegetables", calories: 36, protein: 3.4, carbs: 5, fats: 0.4, price: 20, unit: "كجم", emoji: "🥬", available: true },
  { id: "35", name: "بامية", category: "Vegetables", calories: 33, protein: 1.9, carbs: 7, fats: 0.2, price: 35, unit: "كجم", emoji: "🫛", available: true },
  { id: "36", name: "خس", category: "Vegetables", calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, price: 8, unit: "كجم", emoji: "🥬", available: true },
  { id: "37", name: "جرجير", category: "Vegetables", calories: 25, protein: 2.6, carbs: 3.7, fats: 0.7, price: 5, unit: "حزمة", emoji: "🌿", available: true },
  { id: "38", name: "بقدونس", category: "Vegetables", calories: 36, protein: 3, carbs: 6.3, fats: 0.8, price: 5, unit: "حزمة", emoji: "🌿", available: true },
  { id: "39", name: "فجل", category: "Vegetables", calories: 16, protein: 0.7, carbs: 3.4, fats: 0.1, price: 5, unit: "حزمة", emoji: "🌱", available: true },
  { id: "40", name: "كرنب", category: "Vegetables", calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1, price: 10, unit: "كجم", emoji: "🥬", available: true },
  { id: "41", name: "بنجر", category: "Vegetables", calories: 43, protein: 1.6, carbs: 10, fats: 0.2, price: 12, unit: "كجم", emoji: "🟣", available: true },
  { id: "42", name: "ذرة حلوة", category: "Vegetables", calories: 86, protein: 3.3, carbs: 19, fats: 1.4, price: 10, unit: "كوز", emoji: "🌽", available: true },
  { id: "43", name: "أفوكادو", category: "Vegetables", calories: 160, protein: 2, carbs: 9, fats: 15, price: 60, unit: "كجم", emoji: "🥑", available: false },

  // ===== فواكه (Fruits) =====
  { id: "44", name: "موز", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, price: 20, unit: "كجم", emoji: "🍌", available: true },
  { id: "45", name: "تفاح مصري", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, price: 30, unit: "كجم", emoji: "🍎", available: true },
  { id: "46", name: "تفاح مستورد", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, price: 60, unit: "كجم", emoji: "🍎", available: true },
  { id: "47", name: "برتقال", category: "Fruits", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, price: 15, unit: "كجم", emoji: "🍊", available: true },
  { id: "48", name: "عنب", category: "Fruits", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, price: 40, unit: "كجم", emoji: "🍇", available: true },
  { id: "49", name: "فراولة", category: "Fruits", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, price: 50, unit: "كجم", emoji: "🍓", available: true },
  { id: "50", name: "مانجو", category: "Fruits", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, price: 45, unit: "كجم", emoji: "🥭", available: false },
  { id: "51", name: "بطيخ", category: "Fruits", calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2, price: 8, unit: "كجم", emoji: "🍉", available: false },
  { id: "52", name: "جوافة", category: "Fruits", calories: 68, protein: 2.6, carbs: 14, fats: 1, price: 20, unit: "كجم", emoji: "🍈", available: true },
  { id: "53", name: "رمان", category: "Fruits", calories: 83, protein: 1.7, carbs: 19, fats: 1.2, price: 30, unit: "كجم", emoji: "🫐", available: false },
  { id: "54", name: "تين", category: "Fruits", calories: 74, protein: 0.8, carbs: 19, fats: 0.3, price: 40, unit: "كجم", emoji: "🍈", available: false },
  { id: "55", name: "كيوي", category: "Fruits", calories: 61, protein: 1.1, carbs: 15, fats: 0.5, price: 80, unit: "كجم", emoji: "🥝", available: true },
  { id: "56", name: "أناناس", category: "Fruits", calories: 50, protein: 0.5, carbs: 13, fats: 0.1, price: 50, unit: "واحدة", emoji: "🍍", available: true },
  { id: "57", name: "تمر سيوي", category: "Fruits", calories: 277, protein: 1.8, carbs: 75, fats: 0.2, price: 40, unit: "كجم", emoji: "🌴", available: true },
  { id: "58", name: "تمر مجدول", category: "Fruits", calories: 277, protein: 1.8, carbs: 75, fats: 0.2, price: 200, unit: "كجم", emoji: "🌴", available: true },
  { id: "59", name: "يوسفي", category: "Fruits", calories: 53, protein: 0.8, carbs: 13, fats: 0.3, price: 20, unit: "كجم", emoji: "🍊", available: true },
  { id: "60", name: "خوخ", category: "Fruits", calories: 39, protein: 0.9, carbs: 10, fats: 0.3, price: 35, unit: "كجم", emoji: "🍑", available: false },
  { id: "61", name: "مشمش", category: "Fruits", calories: 48, protein: 1.4, carbs: 11, fats: 0.4, price: 30, unit: "كجم", emoji: "🍑", available: false },
  { id: "62", name: "ليمون", category: "Fruits", calories: 29, protein: 1.1, carbs: 9, fats: 0.3, price: 25, unit: "كجم", emoji: "🍋", available: true },

  // ===== كربوهيدرات (Carbs) =====
  { id: "63", name: "أرز أبيض مصري", category: "Carbs", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, price: 28, unit: "كجم", emoji: "🍚", available: true },
  { id: "64", name: "أرز بسمتي", category: "Carbs", calories: 121, protein: 3.5, carbs: 25, fats: 0.4, price: 55, unit: "كجم", emoji: "🍚", available: true },
  { id: "65", name: "أرز بني", category: "Carbs", calories: 112, protein: 2.6, carbs: 24, fats: 0.9, price: 45, unit: "كجم", emoji: "🍚", available: true },
  { id: "66", name: "مكرونة", category: "Carbs", calories: 131, protein: 5, carbs: 25, fats: 1.1, price: 18, unit: "500g", emoji: "🍝", available: true },
  { id: "67", name: "خبز بلدي", category: "Carbs", calories: 275, protein: 9, carbs: 56, fats: 1.2, price: 1, unit: "رغيف", emoji: "🫓", available: true },
  { id: "68", name: "خبز فينو", category: "Carbs", calories: 280, protein: 8, carbs: 52, fats: 4, price: 3, unit: "رغيف", emoji: "🍞", available: true },
  { id: "69", name: "خبز توست أبيض", category: "Carbs", calories: 265, protein: 9, carbs: 49, fats: 3.2, price: 25, unit: "كيس", emoji: "🍞", available: true },
  { id: "70", name: "خبز توست أسمر", category: "Carbs", calories: 247, protein: 13, carbs: 41, fats: 3.4, price: 30, unit: "كيس", emoji: "🍞", available: true },
  { id: "71", name: "بطاطا حلوة", category: "Carbs", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, price: 20, unit: "كجم", emoji: "🍠", available: true },
  { id: "72", name: "شوفان (500g)", category: "Carbs", calories: 389, protein: 17, carbs: 66, fats: 7, price: 65, unit: "500g", emoji: "🥣", available: true },
  { id: "73", name: "كورن فليكس", category: "Carbs", calories: 357, protein: 8, carbs: 84, fats: 0.4, price: 55, unit: "500g", emoji: "🥣", available: true },
  { id: "74", name: "برغل", category: "Carbs", calories: 342, protein: 12, carbs: 76, fats: 1.3, price: 35, unit: "كجم", emoji: "🌾", available: true },
  { id: "75", name: "كسكسي", category: "Carbs", calories: 112, protein: 3.8, carbs: 23, fats: 0.2, price: 30, unit: "500g", emoji: "🌾", available: true },
  { id: "76", name: "فريك", category: "Carbs", calories: 330, protein: 14, carbs: 68, fats: 2.5, price: 60, unit: "كجم", emoji: "🌾", available: true },
  { id: "77", name: "خبز صاج", category: "Carbs", calories: 260, protein: 8, carbs: 52, fats: 2, price: 5, unit: "رغيف", emoji: "🫓", available: true },

  // ===== ألبان (Dairy) =====
  { id: "78", name: "حليب كامل الدسم (1L)", category: "Dairy", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, price: 32, unit: "لتر", emoji: "🥛", available: true },
  { id: "79", name: "حليب خالي الدسم (1L)", category: "Dairy", calories: 34, protein: 3.4, carbs: 5, fats: 0.1, price: 35, unit: "لتر", emoji: "🥛", available: true },
  { id: "80", name: "زبادي كامل", category: "Dairy", calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3, price: 8, unit: "كوب", emoji: "🥛", available: true },
  { id: "81", name: "زبادي يوناني", category: "Dairy", calories: 59, protein: 10, carbs: 3.6, fats: 0.7, price: 30, unit: "كوب", emoji: "🥛", available: true },
  { id: "82", name: "جبنة بيضاء", category: "Dairy", calories: 264, protein: 17, carbs: 1.3, fats: 21, price: 70, unit: "كجم", emoji: "🧀", available: true },
  { id: "83", name: "جبنة قريش", category: "Dairy", calories: 98, protein: 11, carbs: 3.4, fats: 4.3, price: 30, unit: "كجم", emoji: "🧀", available: true },
  { id: "84", name: "جبنة رومي", category: "Dairy", calories: 380, protein: 25, carbs: 3.6, fats: 30, price: 180, unit: "كجم", emoji: "🧀", available: true },
  { id: "85", name: "جبنة شيدر", category: "Dairy", calories: 402, protein: 25, carbs: 1.3, fats: 33, price: 160, unit: "كجم", emoji: "🧀", available: true },
  { id: "86", name: "جبنة موزاريلا", category: "Dairy", calories: 280, protein: 28, carbs: 3.1, fats: 17, price: 140, unit: "كجم", emoji: "🧀", available: true },
  { id: "87", name: "قشطة", category: "Dairy", calories: 195, protein: 2.8, carbs: 4.3, fats: 19, price: 12, unit: "علبة", emoji: "🍶", available: true },
  { id: "88", name: "لبنة", category: "Dairy", calories: 150, protein: 8, carbs: 5, fats: 11, price: 45, unit: "كجم", emoji: "🥛", available: true },
  { id: "89", name: "زبدة (200g)", category: "Dairy", calories: 717, protein: 0.9, carbs: 0.1, fats: 81, price: 50, unit: "200g", emoji: "🧈", available: true },
  { id: "90", name: "سمنة بلدي", category: "Dairy", calories: 900, protein: 0, carbs: 0, fats: 100, price: 160, unit: "كجم", emoji: "🧈", available: true },
  { id: "91", name: "حليب جاموسي", category: "Dairy", calories: 97, protein: 3.7, carbs: 5.2, fats: 6.9, price: 25, unit: "لتر", emoji: "🥛", available: true },

  // ===== بقوليات (Legumes) - بالكيلو =====
  { id: "92", name: "فول مدمس (معلب)", category: "Legumes", calories: 110, protein: 8, carbs: 19, fats: 0.4, price: 18, unit: "علبة", emoji: "🫘", available: true },
  { id: "93", name: "فول ناشف", category: "Legumes", calories: 341, protein: 23, carbs: 58, fats: 1.5, price: 30, unit: "كجم", emoji: "🫘", available: true },
  { id: "94", name: "عدس أصفر", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, price: 35, unit: "كجم", emoji: "🫘", available: true },
  { id: "95", name: "عدس بني (أسود)", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, price: 40, unit: "كجم", emoji: "🫘", available: true },
  { id: "96", name: "حمص حب", category: "Legumes", calories: 164, protein: 9, carbs: 27, fats: 2.6, price: 45, unit: "كجم", emoji: "🫘", available: true },
  { id: "97", name: "فاصوليا بيضاء", category: "Legumes", calories: 127, protein: 8.7, carbs: 23, fats: 0.5, price: 50, unit: "كجم", emoji: "🫘", available: true },
  { id: "98", name: "فاصوليا حمراء", category: "Legumes", calories: 127, protein: 8.7, carbs: 22, fats: 0.5, price: 55, unit: "كجم", emoji: "🫘", available: true },
  { id: "99", name: "لوبيا", category: "Legumes", calories: 116, protein: 7.7, carbs: 21, fats: 0.5, price: 40, unit: "كجم", emoji: "🫘", available: true },
  { id: "100", name: "بازلاء خضراء مجمدة", category: "Legumes", calories: 81, protein: 5.4, carbs: 14, fats: 0.4, price: 35, unit: "400g", emoji: "🟢", available: true },
  { id: "101", name: "فول نابت", category: "Legumes", calories: 105, protein: 8, carbs: 17, fats: 0.6, price: 15, unit: "كجم", emoji: "🌱", available: true },

  // ===== مشروبات (Beverages) =====
  { id: "102", name: "قهوة تركي (250g)", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fats: 0, price: 80, unit: "250g", emoji: "☕", available: true },
  { id: "103", name: "نسكافيه (ظرف)", category: "Beverages", calories: 2, protein: 0.1, carbs: 0, fats: 0, price: 5, unit: "ظرف", emoji: "☕", available: true },
  { id: "104", name: "شاي أسود (250g)", category: "Beverages", calories: 1, protein: 0, carbs: 0.3, fats: 0, price: 50, unit: "250g", emoji: "🍵", available: true },
  { id: "105", name: "شاي أخضر (علبة)", category: "Beverages", calories: 1, protein: 0, carbs: 0, fats: 0, price: 40, unit: "25 كيس", emoji: "🍵", available: true },
  { id: "106", name: "كركديه", category: "Beverages", calories: 5, protein: 0, carbs: 1, fats: 0, price: 60, unit: "كجم", emoji: "🫖", available: true },
  { id: "107", name: "عصير برتقال طازج", category: "Beverages", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, price: 20, unit: "كوب", emoji: "🧃", available: true },
  { id: "108", name: "عصير جوافة", category: "Beverages", calories: 68, protein: 0.3, carbs: 17, fats: 0.1, price: 15, unit: "كوب", emoji: "🧃", available: true },
  { id: "109", name: "ينسون", category: "Beverages", calories: 4, protein: 0.2, carbs: 0.9, fats: 0, price: 40, unit: "250g", emoji: "🫖", available: true },
  { id: "110", name: "حلبة", category: "Beverages", calories: 12, protein: 0.9, carbs: 2.2, fats: 0.2, price: 50, unit: "كجم", emoji: "🫖", available: true },
  { id: "111", name: "تمر هندي", category: "Beverages", calories: 60, protein: 0.3, carbs: 15, fats: 0, price: 70, unit: "كجم", emoji: "🥤", available: false },
  { id: "112", name: "سحلب", category: "Beverages", calories: 95, protein: 3, carbs: 15, fats: 2.5, price: 15, unit: "كوب", emoji: "🥤", available: false },
  { id: "113", name: "عرقسوس", category: "Beverages", calories: 50, protein: 0, carbs: 13, fats: 0, price: 10, unit: "كوب", emoji: "🥤", available: false },
  { id: "114", name: "لبن رايب", category: "Beverages", calories: 42, protein: 3.4, carbs: 5, fats: 1, price: 10, unit: "كوب", emoji: "🥛", available: true },

  // ===== وجبات خفيفة (Snacks) =====
  { id: "115", name: "لوز", category: "Snacks", calories: 579, protein: 21, carbs: 22, fats: 50, price: 300, unit: "كجم", emoji: "🥜", available: true },
  { id: "116", name: "فول سوداني", category: "Snacks", calories: 567, protein: 26, carbs: 16, fats: 49, price: 80, unit: "كجم", emoji: "🥜", available: true },
  { id: "117", name: "كاجو", category: "Snacks", calories: 553, protein: 18, carbs: 30, fats: 44, price: 400, unit: "كجم", emoji: "🥜", available: true },
  { id: "118", name: "عين جمل", category: "Snacks", calories: 654, protein: 15, carbs: 14, fats: 65, price: 500, unit: "كجم", emoji: "🥜", available: true },
  { id: "119", name: "بندق", category: "Snacks", calories: 628, protein: 15, carbs: 17, fats: 61, price: 450, unit: "كجم", emoji: "🌰", available: false },
  { id: "120", name: "زبيب", category: "Snacks", calories: 299, protein: 3.1, carbs: 79, fats: 0.5, price: 120, unit: "كجم", emoji: "🍇", available: true },
  { id: "121", name: "شوكولاتة داكنة 70%", category: "Snacks", calories: 546, protein: 5, carbs: 60, fats: 31, price: 70, unit: "100g", emoji: "🍫", available: true },
  { id: "122", name: "بسكويت شوفان", category: "Snacks", calories: 430, protein: 7, carbs: 66, fats: 16, price: 40, unit: "عبوة", emoji: "🍪", available: true },
  { id: "123", name: "حلاوة طحينية", category: "Snacks", calories: 516, protein: 13, carbs: 55, fats: 28, price: 60, unit: "كجم", emoji: "🍬", available: true },
  { id: "124", name: "بار بروتين", category: "Snacks", calories: 200, protein: 20, carbs: 22, fats: 7, price: 55, unit: "بار", emoji: "🍫", available: true },
  { id: "125", name: "لب أبيض", category: "Snacks", calories: 559, protein: 30, carbs: 11, fats: 49, price: 60, unit: "كجم", emoji: "🌻", available: true },
  { id: "126", name: "لب سوري (سوبر)", category: "Snacks", calories: 584, protein: 21, carbs: 20, fats: 51, price: 80, unit: "كجم", emoji: "🌻", available: true },
  { id: "127", name: "فشار (حب)", category: "Snacks", calories: 375, protein: 11, carbs: 74, fats: 4.3, price: 25, unit: "كجم", emoji: "🍿", available: true },
  { id: "128", name: "مكسرات مشكلة", category: "Snacks", calories: 607, protein: 20, carbs: 21, fats: 54, price: 250, unit: "كجم", emoji: "🥜", available: true },
  { id: "129", name: "عسل نحل (جبلي)", category: "Snacks", calories: 304, protein: 0.3, carbs: 82, fats: 0, price: 200, unit: "كجم", emoji: "🍯", available: true },
  { id: "130", name: "عسل نحل (عادي)", category: "Snacks", calories: 304, protein: 0.3, carbs: 82, fats: 0, price: 100, unit: "كجم", emoji: "🍯", available: true },
  { id: "131", name: "عسل أسود", category: "Snacks", calories: 290, protein: 0, carbs: 75, fats: 0, price: 40, unit: "كجم", emoji: "🍯", available: true },
  { id: "132", name: "مربى", category: "Snacks", calories: 250, protein: 0.4, carbs: 63, fats: 0.1, price: 35, unit: "340g", emoji: "🍓", available: true },

  // ===== زيوت ودهون (Oils) =====
  { id: "133", name: "زيت زيتون (1L)", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 180, unit: "لتر", emoji: "🫒", available: true },
  { id: "134", name: "زيت ذرة (1L)", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 70, unit: "لتر", emoji: "🌽", available: true },
  { id: "135", name: "زيت عباد الشمس (1L)", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 65, unit: "لتر", emoji: "🌻", available: true },
  { id: "136", name: "زيت جوز هند", category: "Oils", calories: 862, protein: 0, carbs: 0, fats: 100, price: 200, unit: "500ml", emoji: "🥥", available: true },
  { id: "137", name: "زيت سمسم", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 120, unit: "لتر", emoji: "🫘", available: true },
  { id: "138", name: "طحينة", category: "Oils", calories: 595, protein: 17, carbs: 21, fats: 54, price: 80, unit: "كجم", emoji: "🥜", available: true },
  { id: "139", name: "زبدة فول سوداني", category: "Oils", calories: 588, protein: 25, carbs: 20, fats: 50, price: 120, unit: "340g", emoji: "🥜", available: true },

  // ===== حبوب (Grains) =====
  { id: "140", name: "دقيق أبيض", category: "Grains", calories: 364, protein: 10, carbs: 76, fats: 1, price: 20, unit: "كجم", emoji: "🌾", available: true },
  { id: "141", name: "دقيق أسمر (قمح كامل)", category: "Grains", calories: 340, protein: 13, carbs: 72, fats: 2.5, price: 30, unit: "كجم", emoji: "🌾", available: true },
  { id: "142", name: "نشا", category: "Grains", calories: 381, protein: 0.3, carbs: 91, fats: 0.1, price: 15, unit: "500g", emoji: "🌾", available: true },
  { id: "143", name: "بقسماط", category: "Grains", calories: 395, protein: 11, carbs: 72, fats: 6, price: 20, unit: "300g", emoji: "🍞", available: true },
  { id: "144", name: "كينوا", category: "Grains", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, price: 150, unit: "كجم", emoji: "🌾", available: true },
  { id: "145", name: "شعير", category: "Grains", calories: 354, protein: 12, carbs: 73, fats: 2.3, price: 35, unit: "كجم", emoji: "🌾", available: true },
  { id: "146", name: "سمسم", category: "Grains", calories: 573, protein: 18, carbs: 23, fats: 50, price: 100, unit: "كجم", emoji: "🌾", available: true },
  { id: "147", name: "بذور شيا", category: "Grains", calories: 486, protein: 17, carbs: 42, fats: 31, price: 200, unit: "كجم", emoji: "🌱", available: true },
  { id: "148", name: "بذور كتان", category: "Grains", calories: 534, protein: 18, carbs: 29, fats: 42, price: 100, unit: "كجم", emoji: "🌱", available: true },
  { id: "149", name: "جرانولا", category: "Grains", calories: 471, protein: 10, carbs: 64, fats: 20, price: 90, unit: "500g", emoji: "🥣", available: true },

  // ===== المزيد =====
  { id: "150", name: "واي بروتين (سكوب)", category: "Proteins", calories: 120, protein: 24, carbs: 3, fats: 1.5, price: 35, unit: "سكوب", emoji: "🥤", available: true },
  { id: "151", name: "لانشون", category: "Proteins", calories: 260, protein: 12, carbs: 3, fats: 22, price: 65, unit: "كجم", emoji: "🥩", available: true },
  { id: "152", name: "بسطرمة", category: "Proteins", calories: 234, protein: 30, carbs: 1, fats: 12, price: 250, unit: "كجم", emoji: "🥩", available: true },
  { id: "153", name: "سجق", category: "Proteins", calories: 300, protein: 14, carbs: 2, fats: 26, price: 130, unit: "كجم", emoji: "🌭", available: true },
  { id: "154", name: "فاصوليا خضراء", category: "Vegetables", calories: 31, protein: 1.8, carbs: 7, fats: 0.1, price: 25, unit: "كجم", emoji: "🫛", available: true },
  { id: "155", name: "مشروم", category: "Vegetables", calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, price: 50, unit: "كجم", emoji: "🍄", available: true },
  { id: "156", name: "زيتون أخضر", category: "Vegetables", calories: 115, protein: 0.8, carbs: 6, fats: 11, price: 60, unit: "كجم", emoji: "🫒", available: true },
  { id: "157", name: "زيتون أسود", category: "Vegetables", calories: 115, protein: 0.8, carbs: 6, fats: 11, price: 80, unit: "كجم", emoji: "🫒", available: true },
  { id: "158", name: "عصير ليمون بنعناع", category: "Beverages", calories: 25, protein: 0.2, carbs: 6, fats: 0, price: 15, unit: "كوب", emoji: "🍋", available: true },
  { id: "159", name: "عصير جزر", category: "Beverages", calories: 40, protein: 0.9, carbs: 9, fats: 0.2, price: 15, unit: "كوب", emoji: "🥕", available: true },
  { id: "160", name: "سموذي موز وفراولة", category: "Beverages", calories: 90, protein: 2, carbs: 20, fats: 0.5, price: 30, unit: "كوب", emoji: "🥤", available: true },
];
