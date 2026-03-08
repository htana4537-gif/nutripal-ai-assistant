export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  price: number;
  emoji: string;
  available: boolean;
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

export const FOODS: Food[] = [
  // ===== بروتين (Proteins) =====
  { id: "1", name: "صدور دجاج", category: "Proteins", calories: 165, protein: 31, carbs: 0, fats: 3.6, price: 95, emoji: "🍗", available: true },
  { id: "2", name: "أوراك دجاج", category: "Proteins", calories: 209, protein: 26, carbs: 0, fats: 10.9, price: 75, emoji: "🍗", available: true },
  { id: "3", name: "دجاج كامل", category: "Proteins", calories: 239, protein: 27, carbs: 0, fats: 14, price: 65, emoji: "🐔", available: true },
  { id: "4", name: "كبدة دجاج", category: "Proteins", calories: 167, protein: 24, carbs: 1, fats: 6.5, price: 60, emoji: "🫀", available: true },
  { id: "5", name: "لحم بقري (فخذ)", category: "Proteins", calories: 250, protein: 26, carbs: 0, fats: 15, price: 280, emoji: "🥩", available: true },
  { id: "6", name: "لحم بقري مفروم", category: "Proteins", calories: 254, protein: 17, carbs: 0, fats: 20, price: 220, emoji: "🥩", available: true },
  { id: "7", name: "كفتة", category: "Proteins", calories: 280, protein: 18, carbs: 5, fats: 21, price: 200, emoji: "🥩", available: true },
  { id: "8", name: "كبدة بقري", category: "Proteins", calories: 135, protein: 21, carbs: 4, fats: 3.6, price: 180, emoji: "🫀", available: true },
  { id: "9", name: "سمك بلطي", category: "Proteins", calories: 128, protein: 26, carbs: 0, fats: 2.7, price: 55, emoji: "🐟", available: true },
  { id: "10", name: "سمك بوري", category: "Proteins", calories: 150, protein: 24, carbs: 0, fats: 5.5, price: 70, emoji: "🐟", available: true },
  { id: "11", name: "سلمون", category: "Proteins", calories: 208, protein: 20, carbs: 0, fats: 13, price: 350, emoji: "🐟", available: true },
  { id: "12", name: "جمبري", category: "Proteins", calories: 99, protein: 24, carbs: 0.2, fats: 0.3, price: 200, emoji: "🦐", available: true },
  { id: "13", name: "تونة معلبة", category: "Proteins", calories: 132, protein: 29, carbs: 0, fats: 1, price: 35, emoji: "🐟", available: true },
  { id: "14", name: "سردين معلب", category: "Proteins", calories: 208, protein: 25, carbs: 0, fats: 11, price: 25, emoji: "🐟", available: true },
  { id: "15", name: "بيض بلدي", category: "Proteins", calories: 155, protein: 13, carbs: 1.1, fats: 11, price: 4, emoji: "🥚", available: true },
  { id: "16", name: "بيض أبيض", category: "Proteins", calories: 147, protein: 12.6, carbs: 0.7, fats: 10, price: 3, emoji: "🥚", available: true },
  { id: "17", name: "لحم ضأن", category: "Proteins", calories: 294, protein: 25, carbs: 0, fats: 21, price: 320, emoji: "🍖", available: false },
  { id: "18", name: "ديك رومي", category: "Proteins", calories: 135, protein: 30, carbs: 0, fats: 1, price: 130, emoji: "🦃", available: false },
  { id: "19", name: "سمك قاروص", category: "Proteins", calories: 124, protein: 24, carbs: 0, fats: 2.6, price: 150, emoji: "🐟", available: true },
  { id: "20", name: "كاليماري", category: "Proteins", calories: 92, protein: 15.6, carbs: 3.1, fats: 1.4, price: 160, emoji: "🦑", available: false },

  // ===== خضروات (Vegetables) =====
  { id: "21", name: "طماطم", category: "Vegetables", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, price: 8, emoji: "🍅", available: true },
  { id: "22", name: "خيار", category: "Vegetables", calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, price: 6, emoji: "🥒", available: true },
  { id: "23", name: "بصل", category: "Vegetables", calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, price: 10, emoji: "🧅", available: true },
  { id: "24", name: "ثوم", category: "Vegetables", calories: 149, protein: 6.4, carbs: 33, fats: 0.5, price: 40, emoji: "🧄", available: true },
  { id: "25", name: "بطاطس", category: "Vegetables", calories: 77, protein: 2, carbs: 17, fats: 0.1, price: 12, emoji: "🥔", available: true },
  { id: "26", name: "جزر", category: "Vegetables", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, price: 7, emoji: "🥕", available: true },
  { id: "27", name: "سبانخ", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, price: 10, emoji: "🥬", available: true },
  { id: "28", name: "بروكلي", category: "Vegetables", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, price: 25, emoji: "🥦", available: true },
  { id: "29", name: "فلفل ألوان", category: "Vegetables", calories: 31, protein: 1, carbs: 6, fats: 0.3, price: 30, emoji: "🫑", available: true },
  { id: "30", name: "فلفل أخضر", category: "Vegetables", calories: 20, protein: 0.9, carbs: 4.6, fats: 0.2, price: 10, emoji: "🌶️", available: true },
  { id: "31", name: "كوسة", category: "Vegetables", calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, price: 8, emoji: "🥒", available: true },
  { id: "32", name: "باذنجان", category: "Vegetables", calories: 25, protein: 1, carbs: 6, fats: 0.2, price: 10, emoji: "🍆", available: true },
  { id: "33", name: "قرنبيط", category: "Vegetables", calories: 25, protein: 1.9, carbs: 5, fats: 0.3, price: 12, emoji: "🥦", available: true },
  { id: "34", name: "ملوخية", category: "Vegetables", calories: 36, protein: 3.4, carbs: 5, fats: 0.4, price: 15, emoji: "🥬", available: true },
  { id: "35", name: "بامية", category: "Vegetables", calories: 33, protein: 1.9, carbs: 7, fats: 0.2, price: 20, emoji: "🫛", available: true },
  { id: "36", name: "خس", category: "Vegetables", calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, price: 5, emoji: "🥬", available: true },
  { id: "37", name: "جرجير", category: "Vegetables", calories: 25, protein: 2.6, carbs: 3.7, fats: 0.7, price: 3, emoji: "🌿", available: true },
  { id: "38", name: "بقدونس", category: "Vegetables", calories: 36, protein: 3, carbs: 6.3, fats: 0.8, price: 3, emoji: "🌿", available: true },
  { id: "39", name: "فجل", category: "Vegetables", calories: 16, protein: 0.7, carbs: 3.4, fats: 0.1, price: 5, emoji: "🌱", available: true },
  { id: "40", name: "كرنب (كابوتشا)", category: "Vegetables", calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1, price: 8, emoji: "🥬", available: true },
  { id: "41", name: "بنجر", category: "Vegetables", calories: 43, protein: 1.6, carbs: 10, fats: 0.2, price: 10, emoji: "🟣", available: true },
  { id: "42", name: "ذرة حلوة", category: "Vegetables", calories: 86, protein: 3.3, carbs: 19, fats: 1.4, price: 8, emoji: "🌽", available: true },
  { id: "43", name: "أفوكادو", category: "Vegetables", calories: 160, protein: 2, carbs: 9, fats: 15, price: 40, emoji: "🥑", available: false },

  // ===== فواكه (Fruits) =====
  { id: "44", name: "موز", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, price: 15, emoji: "🍌", available: true },
  { id: "45", name: "تفاح", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, price: 20, emoji: "🍎", available: true },
  { id: "46", name: "برتقال", category: "Fruits", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, price: 10, emoji: "🍊", available: true },
  { id: "47", name: "عنب", category: "Fruits", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, price: 25, emoji: "🍇", available: true },
  { id: "48", name: "فراولة", category: "Fruits", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, price: 35, emoji: "🍓", available: true },
  { id: "49", name: "مانجو", category: "Fruits", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, price: 30, emoji: "🥭", available: false },
  { id: "50", name: "بطيخ", category: "Fruits", calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2, price: 5, emoji: "🍉", available: false },
  { id: "51", name: "جوافة", category: "Fruits", calories: 68, protein: 2.6, carbs: 14, fats: 1, price: 15, emoji: "🍈", available: true },
  { id: "52", name: "رمان", category: "Fruits", calories: 83, protein: 1.7, carbs: 19, fats: 1.2, price: 20, emoji: "🫐", available: false },
  { id: "53", name: "تين", category: "Fruits", calories: 74, protein: 0.8, carbs: 19, fats: 0.3, price: 30, emoji: "🍈", available: false },
  { id: "54", name: "كيوي", category: "Fruits", calories: 61, protein: 1.1, carbs: 15, fats: 0.5, price: 50, emoji: "🥝", available: true },
  { id: "55", name: "أناناس", category: "Fruits", calories: 50, protein: 0.5, carbs: 13, fats: 0.1, price: 35, emoji: "🍍", available: true },
  { id: "56", name: "تمر", category: "Fruits", calories: 277, protein: 1.8, carbs: 75, fats: 0.2, price: 60, emoji: "🌴", available: true },
  { id: "57", name: "يوسفي", category: "Fruits", calories: 53, protein: 0.8, carbs: 13, fats: 0.3, price: 15, emoji: "🍊", available: true },
  { id: "58", name: "خوخ", category: "Fruits", calories: 39, protein: 0.9, carbs: 10, fats: 0.3, price: 25, emoji: "🍑", available: false },
  { id: "59", name: "مشمش", category: "Fruits", calories: 48, protein: 1.4, carbs: 11, fats: 0.4, price: 25, emoji: "🍑", available: false },
  { id: "60", name: "ليمون", category: "Fruits", calories: 29, protein: 1.1, carbs: 9, fats: 0.3, price: 15, emoji: "🍋", available: true },

  // ===== كربوهيدرات (Carbs) =====
  { id: "61", name: "أرز أبيض", category: "Carbs", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, price: 18, emoji: "🍚", available: true },
  { id: "62", name: "أرز بني", category: "Carbs", calories: 112, protein: 2.6, carbs: 24, fats: 0.9, price: 30, emoji: "🍚", available: true },
  { id: "63", name: "أرز بسمتي", category: "Carbs", calories: 121, protein: 3.5, carbs: 25, fats: 0.4, price: 35, emoji: "🍚", available: true },
  { id: "64", name: "مكرونة", category: "Carbs", calories: 131, protein: 5, carbs: 25, fats: 1.1, price: 12, emoji: "🍝", available: true },
  { id: "65", name: "خبز بلدي", category: "Carbs", calories: 275, protein: 9, carbs: 56, fats: 1.2, price: 1, emoji: "🫓", available: true },
  { id: "66", name: "خبز أسمر", category: "Carbs", calories: 247, protein: 13, carbs: 41, fats: 3.4, price: 5, emoji: "🍞", available: true },
  { id: "67", name: "خبز توست", category: "Carbs", calories: 265, protein: 9, carbs: 49, fats: 3.2, price: 15, emoji: "🍞", available: true },
  { id: "68", name: "بطاطا حلوة", category: "Carbs", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, price: 15, emoji: "🍠", available: true },
  { id: "69", name: "شوفان", category: "Carbs", calories: 389, protein: 17, carbs: 66, fats: 7, price: 45, emoji: "🥣", available: true },
  { id: "70", name: "كورن فليكس", category: "Carbs", calories: 357, protein: 8, carbs: 84, fats: 0.4, price: 35, emoji: "🥣", available: true },
  { id: "71", name: "برغل", category: "Carbs", calories: 342, protein: 12, carbs: 76, fats: 1.3, price: 25, emoji: "🌾", available: true },
  { id: "72", name: "كسكسي", category: "Carbs", calories: 112, protein: 3.8, carbs: 23, fats: 0.2, price: 20, emoji: "🌾", available: true },
  { id: "73", name: "فريك", category: "Carbs", calories: 330, protein: 14, carbs: 68, fats: 2.5, price: 40, emoji: "🌾", available: true },

  // ===== ألبان (Dairy) =====
  { id: "74", name: "حليب كامل الدسم", category: "Dairy", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, price: 20, emoji: "🥛", available: true },
  { id: "75", name: "حليب خالي الدسم", category: "Dairy", calories: 34, protein: 3.4, carbs: 5, fats: 0.1, price: 22, emoji: "🥛", available: true },
  { id: "76", name: "زبادي كامل", category: "Dairy", calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3, price: 8, emoji: "🥛", available: true },
  { id: "77", name: "زبادي يوناني", category: "Dairy", calories: 59, protein: 10, carbs: 3.6, fats: 0.7, price: 25, emoji: "🥛", available: true },
  { id: "78", name: "جبنة بيضاء", category: "Dairy", calories: 264, protein: 17, carbs: 1.3, fats: 21, price: 40, emoji: "🧀", available: true },
  { id: "79", name: "جبنة قريش", category: "Dairy", calories: 98, protein: 11, carbs: 3.4, fats: 4.3, price: 20, emoji: "🧀", available: true },
  { id: "80", name: "جبنة رومي", category: "Dairy", calories: 380, protein: 25, carbs: 3.6, fats: 30, price: 120, emoji: "🧀", available: true },
  { id: "81", name: "جبنة شيدر", category: "Dairy", calories: 402, protein: 25, carbs: 1.3, fats: 33, price: 100, emoji: "🧀", available: true },
  { id: "82", name: "جبنة موزاريلا", category: "Dairy", calories: 280, protein: 28, carbs: 3.1, fats: 17, price: 90, emoji: "🧀", available: true },
  { id: "83", name: "قشطة", category: "Dairy", calories: 195, protein: 2.8, carbs: 4.3, fats: 19, price: 15, emoji: "🍶", available: true },
  { id: "84", name: "لبنة", category: "Dairy", calories: 150, protein: 8, carbs: 5, fats: 11, price: 30, emoji: "🥛", available: true },
  { id: "85", name: "حليب جاموسي", category: "Dairy", calories: 97, protein: 3.7, carbs: 5.2, fats: 6.9, price: 18, emoji: "🥛", available: true },
  { id: "86", name: "زبدة", category: "Dairy", calories: 717, protein: 0.9, carbs: 0.1, fats: 81, price: 70, emoji: "🧈", available: true },
  { id: "87", name: "سمنة بلدي", category: "Dairy", calories: 900, protein: 0, carbs: 0, fats: 100, price: 120, emoji: "🧈", available: true },

  // ===== بقوليات (Legumes) =====
  { id: "88", name: "فول مدمس", category: "Legumes", calories: 110, protein: 8, carbs: 19, fats: 0.4, price: 15, emoji: "🫘", available: true },
  { id: "89", name: "عدس أصفر", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, price: 20, emoji: "🫘", available: true },
  { id: "90", name: "عدس بني", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, price: 22, emoji: "🫘", available: true },
  { id: "91", name: "حمص", category: "Legumes", calories: 164, protein: 9, carbs: 27, fats: 2.6, price: 25, emoji: "🫘", available: true },
  { id: "92", name: "فاصوليا بيضاء", category: "Legumes", calories: 127, protein: 8.7, carbs: 23, fats: 0.5, price: 30, emoji: "🫘", available: true },
  { id: "93", name: "فاصوليا حمراء", category: "Legumes", calories: 127, protein: 8.7, carbs: 22, fats: 0.5, price: 35, emoji: "🫘", available: true },
  { id: "94", name: "لوبيا", category: "Legumes", calories: 116, protein: 7.7, carbs: 21, fats: 0.5, price: 25, emoji: "🫘", available: true },
  { id: "95", name: "بازلاء", category: "Legumes", calories: 81, protein: 5.4, carbs: 14, fats: 0.4, price: 15, emoji: "🟢", available: true },
  { id: "96", name: "فول نابت", category: "Legumes", calories: 105, protein: 8, carbs: 17, fats: 0.6, price: 12, emoji: "🌱", available: true },

  // ===== مشروبات (Beverages) =====
  { id: "97", name: "قهوة تركي", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fats: 0, price: 5, emoji: "☕", available: true },
  { id: "98", name: "نسكافيه", category: "Beverages", calories: 2, protein: 0.1, carbs: 0, fats: 0, price: 3, emoji: "☕", available: true },
  { id: "99", name: "شاي أسود", category: "Beverages", calories: 1, protein: 0, carbs: 0.3, fats: 0, price: 2, emoji: "🍵", available: true },
  { id: "100", name: "شاي أخضر", category: "Beverages", calories: 1, protein: 0, carbs: 0, fats: 0, price: 5, emoji: "🍵", available: true },
  { id: "101", name: "كركديه", category: "Beverages", calories: 5, protein: 0, carbs: 1, fats: 0, price: 8, emoji: "🫖", available: true },
  { id: "102", name: "عصير برتقال طازج", category: "Beverages", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, price: 15, emoji: "🧃", available: true },
  { id: "103", name: "عصير جوافة", category: "Beverages", calories: 68, protein: 0.3, carbs: 17, fats: 0.1, price: 12, emoji: "🧃", available: true },
  { id: "104", name: "ينسون", category: "Beverages", calories: 4, protein: 0.2, carbs: 0.9, fats: 0, price: 3, emoji: "🫖", available: true },
  { id: "105", name: "حلبة", category: "Beverages", calories: 12, protein: 0.9, carbs: 2.2, fats: 0.2, price: 5, emoji: "🫖", available: true },
  { id: "106", name: "تمر هندي", category: "Beverages", calories: 60, protein: 0.3, carbs: 15, fats: 0, price: 10, emoji: "🥤", available: false },
  { id: "107", name: "سحلب", category: "Beverages", calories: 95, protein: 3, carbs: 15, fats: 2.5, price: 15, emoji: "🥤", available: false },
  { id: "108", name: "عرقسوس", category: "Beverages", calories: 50, protein: 0, carbs: 13, fats: 0, price: 8, emoji: "🥤", available: false },

  // ===== وجبات خفيفة (Snacks) =====
  { id: "109", name: "لوز", category: "Snacks", calories: 579, protein: 21, carbs: 22, fats: 50, price: 200, emoji: "🥜", available: true },
  { id: "110", name: "فول سوداني", category: "Snacks", calories: 567, protein: 26, carbs: 16, fats: 49, price: 60, emoji: "🥜", available: true },
  { id: "111", name: "كاجو", category: "Snacks", calories: 553, protein: 18, carbs: 30, fats: 44, price: 250, emoji: "🥜", available: true },
  { id: "112", name: "عين جمل", category: "Snacks", calories: 654, protein: 15, carbs: 14, fats: 65, price: 300, emoji: "🥜", available: true },
  { id: "113", name: "بندق", category: "Snacks", calories: 628, protein: 15, carbs: 17, fats: 61, price: 280, emoji: "🌰", available: false },
  { id: "114", name: "زبيب", category: "Snacks", calories: 299, protein: 3.1, carbs: 79, fats: 0.5, price: 80, emoji: "🍇", available: true },
  { id: "115", name: "شوكولاتة داكنة 70%", category: "Snacks", calories: 546, protein: 5, carbs: 60, fats: 31, price: 50, emoji: "🍫", available: true },
  { id: "116", name: "بسكويت شوفان", category: "Snacks", calories: 430, protein: 7, carbs: 66, fats: 16, price: 30, emoji: "🍪", available: true },
  { id: "117", name: "حلاوة طحينية", category: "Snacks", calories: 516, protein: 13, carbs: 55, fats: 28, price: 40, emoji: "🍬", available: true },
  { id: "118", name: "بار بروتين", category: "Snacks", calories: 200, protein: 20, carbs: 22, fats: 7, price: 45, emoji: "🍫", available: true },
  { id: "119", name: "لب أبيض", category: "Snacks", calories: 559, protein: 30, carbs: 11, fats: 49, price: 40, emoji: "🌻", available: true },
  { id: "120", name: "لب سوري", category: "Snacks", calories: 584, protein: 21, carbs: 20, fats: 51, price: 50, emoji: "🌻", available: true },
  { id: "121", name: "فشار (بدون زبدة)", category: "Snacks", calories: 375, protein: 11, carbs: 74, fats: 4.3, price: 15, emoji: "🍿", available: true },
  { id: "122", name: "مكسرات مشكلة", category: "Snacks", calories: 607, protein: 20, carbs: 21, fats: 54, price: 180, emoji: "🥜", available: true },

  // ===== زيوت ودهون (Oils) =====
  { id: "123", name: "زيت زيتون", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 120, emoji: "🫒", available: true },
  { id: "124", name: "زيت ذرة", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 50, emoji: "🌽", available: true },
  { id: "125", name: "زيت عباد الشمس", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 55, emoji: "🌻", available: true },
  { id: "126", name: "زيت جوز هند", category: "Oils", calories: 862, protein: 0, carbs: 0, fats: 100, price: 150, emoji: "🥥", available: true },
  { id: "127", name: "زيت سمسم", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, price: 80, emoji: "🫘", available: true },
  { id: "128", name: "طحينة", category: "Oils", calories: 595, protein: 17, carbs: 21, fats: 54, price: 60, emoji: "🥜", available: true },
  { id: "129", name: "زبدة فول سوداني", category: "Oils", calories: 588, protein: 25, carbs: 20, fats: 50, price: 80, emoji: "🥜", available: true },

  // ===== حبوب (Grains) =====
  { id: "130", name: "دقيق أبيض", category: "Grains", calories: 364, protein: 10, carbs: 76, fats: 1, price: 15, emoji: "🌾", available: true },
  { id: "131", name: "دقيق أسمر", category: "Grains", calories: 340, protein: 13, carbs: 72, fats: 2.5, price: 20, emoji: "🌾", available: true },
  { id: "132", name: "نشا", category: "Grains", calories: 381, protein: 0.3, carbs: 91, fats: 0.1, price: 10, emoji: "🌾", available: true },
  { id: "133", name: "بقسماط", category: "Grains", calories: 395, protein: 11, carbs: 72, fats: 6, price: 15, emoji: "🍞", available: true },
  { id: "134", name: "كينوا", category: "Grains", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, price: 90, emoji: "🌾", available: true },
  { id: "135", name: "شعير", category: "Grains", calories: 354, protein: 12, carbs: 73, fats: 2.3, price: 25, emoji: "🌾", available: true },
  { id: "136", name: "ذرة صفراء", category: "Grains", calories: 365, protein: 9.4, carbs: 74, fats: 4.7, price: 15, emoji: "🌽", available: true },

  // ===== توابل وإضافات =====
  { id: "137", name: "عسل نحل", category: "Snacks", calories: 304, protein: 0.3, carbs: 82, fats: 0, price: 100, emoji: "🍯", available: true },
  { id: "138", name: "عسل أسود", category: "Snacks", calories: 290, protein: 0, carbs: 75, fats: 0, price: 30, emoji: "🍯", available: true },
  { id: "139", name: "مربى فراولة", category: "Snacks", calories: 250, protein: 0.4, carbs: 63, fats: 0.1, price: 25, emoji: "🍓", available: true },
  
  // ===== المزيد من البروتين =====
  { id: "140", name: "واي بروتين", category: "Proteins", calories: 120, protein: 24, carbs: 3, fats: 1.5, price: 50, emoji: "🥤", available: true },
  { id: "141", name: "لانشون", category: "Proteins", calories: 260, protein: 12, carbs: 3, fats: 22, price: 45, emoji: "🥩", available: true },
  { id: "142", name: "بسطرمة", category: "Proteins", calories: 234, protein: 30, carbs: 1, fats: 12, price: 150, emoji: "🥩", available: true },
  { id: "143", name: "سجق", category: "Proteins", calories: 300, protein: 14, carbs: 2, fats: 26, price: 100, emoji: "🌭", available: true },

  // ===== المزيد من الخضروات =====
  { id: "144", name: "فاصوليا خضراء", category: "Vegetables", calories: 31, protein: 1.8, carbs: 7, fats: 0.1, price: 20, emoji: "🫛", available: true },
  { id: "145", name: "لفت", category: "Vegetables", calories: 28, protein: 0.9, carbs: 6, fats: 0.1, price: 5, emoji: "🟣", available: true },
  { id: "146", name: "مشروم", category: "Vegetables", calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, price: 35, emoji: "🍄", available: true },
  { id: "147", name: "زيتون أخضر", category: "Vegetables", calories: 115, protein: 0.8, carbs: 6, fats: 11, price: 40, emoji: "🫒", available: true },
  { id: "148", name: "زيتون أسود", category: "Vegetables", calories: 115, protein: 0.8, carbs: 6, fats: 11, price: 50, emoji: "🫒", available: true },

  // ===== المزيد من المشروبات =====
  { id: "149", name: "لبن رايب", category: "Beverages", calories: 42, protein: 3.4, carbs: 5, fats: 1, price: 8, emoji: "🥛", available: true },
  { id: "150", name: "سموذي موز وفراولة", category: "Beverages", calories: 90, protein: 2, carbs: 20, fats: 0.5, price: 25, emoji: "🥤", available: true },
  { id: "151", name: "عصير ليمون بالنعناع", category: "Beverages", calories: 25, protein: 0.2, carbs: 6, fats: 0, price: 10, emoji: "🍋", available: true },
  { id: "152", name: "ماء جوز هند", category: "Beverages", calories: 19, protein: 0.7, carbs: 3.7, fats: 0.2, price: 30, emoji: "🥥", available: false },
  { id: "153", name: "قمر الدين", category: "Beverages", calories: 70, protein: 0.5, carbs: 17, fats: 0, price: 12, emoji: "🥤", available: false },

  // ===== المزيد =====
  { id: "154", name: "سمسم", category: "Grains", calories: 573, protein: 18, carbs: 23, fats: 50, price: 60, emoji: "🌾", available: true },
  { id: "155", name: "بذور شيا", category: "Grains", calories: 486, protein: 17, carbs: 42, fats: 31, price: 120, emoji: "🌱", available: true },
  { id: "156", name: "بذور كتان", category: "Grains", calories: 534, protein: 18, carbs: 29, fats: 42, price: 80, emoji: "🌱", available: true },
  { id: "157", name: "جرانولا", category: "Grains", calories: 471, protein: 10, carbs: 64, fats: 20, price: 70, emoji: "🥣", available: true },
  { id: "158", name: "خبز صاج", category: "Carbs", calories: 260, protein: 8, carbs: 52, fats: 2, price: 3, emoji: "🫓", available: true },
  { id: "159", name: "رقاق", category: "Carbs", calories: 340, protein: 9, carbs: 72, fats: 1, price: 20, emoji: "🫓", available: true },
  { id: "160", name: "عصير جزر", category: "Beverages", calories: 40, protein: 0.9, carbs: 9, fats: 0.2, price: 12, emoji: "🥕", available: true },
];
