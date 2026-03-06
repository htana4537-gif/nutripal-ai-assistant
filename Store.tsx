
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { UserProfile, WeeklyPlan, Message, Gender, Goal, ActivityLevel, Meal, WorkoutRoutine, FoodItem, NutrientDeficiency, Language, NutrientInfo, Exercise, WearableProvider, HealthStats, ProgressPhoto, RPGStats, RPGAttribute, LabelAnalysis, FoodEfficiency, SpecialMode } from '../types';
import { analyzeSymptoms, analyzeFoodLog, getMealRecipe, getExerciseDetails, analyzeNutritionLabel, estimateLocalFoodPrices, analyzeActivityLog } from '../services/geminiService';

// --- DATA & TRANSLATIONS ---

const NUTRIENTS_DATA: NutrientInfo[] = [
    { id: 'n1', name: 'Vitamin A', type: 'Vitamin', benefits: 'Vision, Immune System, Skin Health', deficiencySymptoms: 'Night blindness, dry skin, frequent infections.', toxicity: 'Liver damage, bone pain.', sources: ['Carrots', 'Sweet Potato', 'Spinach', 'Liver'], recommendedIntake: 'Adults: 700-900 mcg/day', interactions: 'Absorption enhanced by fats.' },
    { id: 'n2', name: 'Vitamin C', type: 'Vitamin', benefits: 'Antioxidant, Collagen Synthesis, Immunity', deficiencySymptoms: 'Scurvy, bleeding gums, fatigue.', toxicity: 'Digestive upset, kidney stones.', sources: ['Oranges', 'Strawberries', 'Bell Peppers', 'Kiwi'], recommendedIntake: 'Adults: 75-90 mg/day', interactions: 'Enhances iron absorption.' },
    { id: 'n3', name: 'Vitamin D', type: 'Vitamin', benefits: 'Bone Health, Calcium Absorption, Mood', deficiencySymptoms: 'Bone pain, muscle weakness, depression.', toxicity: 'Calcium buildup, kidney damage.', sources: ['Sunlight', 'Fatty Fish', 'Egg Yolks', 'Fortified Milk'], recommendedIntake: 'Adults: 600-800 IU/day', interactions: 'Requires magnesium for activation.' },
    { id: 'n4', name: 'Calcium', type: 'Mineral', benefits: 'Bone & Tooth Health, Muscle Function', deficiencySymptoms: 'Muscle cramps, brittle nails, osteoporosis.', toxicity: 'Kidney stones, constipation.', sources: ['Milk', 'Cheese', 'Yogurt', 'Leafy Greens'], recommendedIntake: 'Adults: 1000 mg/day', interactions: 'Competes with iron and zinc.' },
    { id: 'n5', name: 'Iron', type: 'Mineral', benefits: 'Oxygen Transport, Energy Production', deficiencySymptoms: 'Anemia, fatigue, pale skin.', toxicity: 'Organ damage, digestive issues.', sources: ['Red Meat', 'Spinach', 'Lentils', 'Fortified Cereals'], recommendedIntake: 'Men: 8mg, Women: 18mg/day', interactions: 'Vitamin C helps absorption; Calcium inhibits it.' },
    { id: 'n6', name: 'Magnesium', type: 'Mineral', benefits: 'Muscle & Nerve Function, Blood Sugar Control', deficiencySymptoms: 'Muscle twitches, fatigue, irregular heartbeat.', toxicity: 'Diarrhea, low blood pressure.', sources: ['Almonds', 'Spinach', 'Black Beans', 'Dark Chocolate'], recommendedIntake: 'Adults: 310-420 mg/day', interactions: 'High doses can interfere with antibiotics.' },
    { id: 'n7', name: 'Potassium', type: 'Mineral', benefits: 'Fluid Balance, Nerve Signals, Heart Health', deficiencySymptoms: 'Weakness, fatigue, muscle cramps.', toxicity: 'Heart palpitations (rare from food).', sources: ['Bananas', 'Potatoes', 'Avocado', 'Spinach'], recommendedIntake: 'Adults: 2600-3400 mg/day', interactions: 'ACE inhibitors can increase potassium levels.' },
    { id: 'n8', name: 'Zinc', type: 'Mineral', benefits: 'Immune Function, Wound Healing, DNA Synthesis', deficiencySymptoms: 'Hair loss, diarrhea, delayed healing.', toxicity: 'Nausea, vomiting, copper deficiency.', sources: ['Oysters', 'Beef', 'Pumpkin Seeds', 'Lentils'], recommendedIntake: 'Adults: 8-11 mg/day', interactions: 'Inhibits copper and iron absorption.' },
    { id: 'n9', name: 'Vitamin B12', type: 'Vitamin', benefits: 'Red Blood Cell Formation, DNA Synthesis', deficiencySymptoms: 'Fatigue, weakness, nerve problems.', toxicity: 'Low risk (water soluble).', sources: ['Meat', 'Fish', 'Dairy', 'Eggs'], recommendedIntake: 'Adults: 2.4 mcg/day', interactions: 'Metformin can reduce absorption.' },
    { id: 'n10', name: 'Omega-3', type: 'Mineral', benefits: 'Heart Health, Brain Function, Inflammation', deficiencySymptoms: 'Dry skin, poor memory, mood swings.', toxicity: 'Blood thinning.', sources: ['Salmon', 'Walnuts', 'Chia Seeds', 'Flaxseeds'], recommendedIntake: 'Adults: 1.1-1.6 g/day', interactions: 'May increase bleeding risk with blood thinners.' },
    { id: 'n11', name: 'Vitamin E', type: 'Vitamin', benefits: 'Antioxidant, Skin Health', deficiencySymptoms: 'Nerve/muscle damage, weak immunity.', toxicity: 'Bleeding risk.', sources: ['Almonds', 'Sunflower Seeds', 'Avocado'], recommendedIntake: 'Adults: 15 mg/day', interactions: 'Can interact with blood thinners.' },
    { id: 'n12', name: 'Vitamin K', type: 'Vitamin', benefits: 'Blood Clotting, Bone Health', deficiencySymptoms: 'Excessive bleeding, easy bruising.', toxicity: 'Interferes with blood thinners.', sources: ['Kale', 'Spinach', 'Broccoli'], recommendedIntake: 'Adults: 90-120 mcg/day', interactions: 'Crucial interaction with Warfarin.' }
];

const FOOD_NAMES_DB = [
    'carrot', 'cucumber', 'tomato', 'lettuce', 'spinach', 'broccoli', 'onion', 'garlic', 'bell_pepper', 'potato', 'sweet_potato', 'zucchini', 'eggplant', 'cauliflower', 'green_beans',
    'apple', 'banana', 'orange', 'strawberry', 'grapes', 'watermelon', 'pineapple', 'mango', 'blueberry', 'lemon', 'peach', 'pear', 'cherry', 'kiwi',
    'chicken_breast', 'beef_steak', 'ground_beef', 'salmon', 'tuna_can', 'eggs', 'turkey_breast', 'shrimp', 'tofu', 'lentils', 'chickpeas', 'black_beans',
    'rice_white', 'rice_brown', 'pasta', 'oats', 'quinoa', 'bread_whole', 'bread_white', 'cereal',
    'milk_whole', 'milk_lowfat', 'yogurt_greek', 'yogurt_plain', 'cheese_cheddar', 'cheese_mozarella', 'butter', 'cream',
    'olive_oil', 'vegetable_oil', 'almonds', 'walnuts', 'peanuts', 'peanut_butter', 'avocado',
    'chocolate_dark', 'popcorn', 'chips', 'cookies', 'protein_bar',
    'water', 'coffee', 'tea_green', 'tea_black', 'juice_orange', 'soda'
];

const translations = {
  // ... (keeping all translations as they were, they are used by the t() function)
  en: {
    home: 'Home', nutrition: 'Nutrition Hub', fitness: 'Fitness & Health', coach: 'AI Coach', profile: 'Body', greeting: 'Hello',
    goal_msg: 'Ready to crush your goal?', points: 'Total Points', streak: 'Daily Streak', quick_actions: 'Quick Actions',
    log_meal: 'Log Meal', log_meal_desc: 'Track calories & macros', analyze_food: 'Analyze Food', analyze: 'Analyze',
    log_activity: 'Log Activity', log_activity_desc: 'Track sports & cardio', activity_name: 'Activity Name', duration_min: 'Duration (min)', calories_burned: 'Calories Burned', log_this_activity: 'Log Activity',
    food_log_placeholder: 'e.g., I ate 2 eggs and a slice of toast...', analyzing: 'Analyzing...', log_this_meal: 'Log This Meal',
    add_to_fav: 'Add to Favorites', consumed: 'Consumed',
    lang_region: 'Language & Region', select_lang: 'Select Language', select_country: 'Country / Region', 
    country_placeholder: 'Select your country', select_curr: 'Currency', basics: 'Basics', name: 'Name', 
    age: 'Age', gender: 'Gender', body_stats: 'Body Stats', height: 'Height', weight: 'Weight', 
    goals_lifestyle: 'Goals & Lifestyle', primary_goal: 'Primary Goal', activity_level: 'Activity Level',
    daily_intake: 'Daily Intake Targets', meals_per_day: 'Meals per Day', water_per_day: 'Water Target',
    preferences: 'Preferences', enable_budget: 'Enable Budget Mode', budget_desc: 'Suggest cheaper ingredients',
    diet_restrictions: 'Dietary Restrictions', diet_placeholder: 'e.g., Vegan, Gluten-free', start_journey: 'Start Journey', next: 'Next',
    hero_mode: 'Hero Mode', level: 'Level', str: 'STR', agi: 'AGI', end: 'END', int: 'INT', mana: 'MANA',
    recovery_mode: 'Recovery Mode', recovery_msg: 'Sleep was low. Light training advised.',
    high_activity: 'High Activity', high_activity_msg: 'Great step count! Extra calories added.',
    coach_insight: 'Coach Insight', coach_insight_text: 'Consistency is key. Keep it up!',
    sleep_analysis: 'Sleep Analysis', active_calories: 'Active Calories', step_count: 'Steps', water_tracker: 'Hydration',
    syncing: 'Syncing...', connected_devices: 'Connected Devices', disconnect: 'Disconnect', connect: 'Connect', reset: 'Reset App',
    sedentary_savior: 'Sedentary Savior', stretch_now: 'Stretch Now', stretch_msg: 'Been sitting a while? Try these desk stretches.',
    damage_control: 'Damage Control', i_overate: 'I Overate!', damage_control_active: 'Damage Control Active', damage_control_msg: 'Carbs reduced for 3 days to balance intake.',
    travel_mode: 'Travel Mode', jet_lag_plan: 'Jet Lag Advisor', travel_active: 'Travel Mode Active', travel_msg: 'Hydrate well. Avoid caffeine after 2 PM.', enable_travel: 'Enable Travel Mode', disable_travel: 'Disable Travel Mode',
    your_schedule: 'Your Schedule', regenerate: 'Regenerate', diet: 'Diet', workout: 'Workout', favorites: 'Favorites',
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
    no_plan: 'No plan generated yet.', gen_plan_desc: 'Let AI build a plan for', generate_plan: 'Generate Plan',
    option: 'Option', custom_option: 'Custom', food_type: 'Food Type', quantity: 'Quantity', enter_type: 'e.g. Pizza', enter_qty: 'e.g. 2 slices',
    view_recipe: 'View Recipe', prep_time: 'Prep', cooking_time: 'Cook', tips: 'Chef Tips', ingredients: 'Ingredients', instructions: 'Instructions',
    exercise_guide: 'Exercise Guide', watch_tutorial: 'Watch Tutorial', target_muscles: 'Target Muscles', steps: 'Steps', benefits: 'Benefits',
    rest_day: 'Rest Day', fav_meals: 'Favorite Meals', fav_workouts: 'Favorite Workouts', no_favs: 'No favorites saved.',
    shopping_list: 'Shopping List', shopping_list_title: 'Grocery List', share_list: 'Share List', list_copied: 'Copied!',
    log_drink: 'Log Drink', drink_name: 'Drink Name', sugar_spoons: 'Sugar Spoons', additives: 'Additives (Milk/Cream)',
    nutrients_health: 'Nutrients & Health', scan_label: 'Scan Label', add_food: 'Add Food', food_db: 'Food DB', symptom_checker: 'Symptom Checker',
    prices_updated: 'Prices updated for', prices_updating: 'Updating...', refresh_prices: 'Refresh Prices',
    search_food: 'Search food...', in_stock: 'In Stock', all: 'All', price: 'Price', macros_100g: 'Macros / 100g', calories_100: 'kcal/100g',
    protein_g: 'Protein (g)', carbs_g: 'Carbs (g)', fats_g: 'Fats (g)', pref: 'Preference', available: 'Available', not_available: 'Out of Stock',
    describe_symptoms: 'Describe symptoms (e.g., headache, fatigue)...', detected_deficiencies: 'Detected Deficiencies',
    vitamins: 'Vitamins', minerals: 'Minerals', deficiency_symptoms: 'Deficiency Symptoms', sources: 'Sources', rdi: 'RDI', interactions: 'Interactions',
    create: 'Create', cancel: 'Cancel', category: 'Category',
    smart_economy: 'Smart Economy', best_protein_value: 'Best Protein Value', cheapest_energy: 'Cheapest Energy', cost_per_g_prot: 'Cost/g Protein', cost_per_100_kcal: 'Cost/100kcal', smart_insight: 'Smart Insight', savings: 'Savings', cheaper_than: 'cheaper than',
    label_instructions: 'Take a photo of the ingredients list or nutrition facts.', verdict: 'Verdict', safe: 'Safe', caution: 'Caution', avoid: 'Avoid',
    hidden_dangers: 'Hidden Dangers', marketing_truth: 'Label Truth', claim_vs_reality: 'Claim vs Reality', close: 'Close',
    body_transformation: 'Body Transformation', capture: 'Capture', time_lapse: 'Time Lapse', settings: 'Settings', no_photos: 'No photos yet.', take_first: 'Take your first photo!', ghost_mode: 'Ghost Mode',
    other: 'Other',
    fasting: 'Fasting', ends_in: 'Ends in', hours: 'Hrs', min_to_cook: 'Min', ingredients_count: 'Ingred.',
    upgrade_premium: 'Upgrade to Premium', upgrade_desc: 'Get full access to AI features.', edit_profile: 'Edit Profile', add_device: 'Add Device',
    plan_your_day: 'Plan Your Day', auto_plan: 'Auto-Plan', agenda: 'Agenda', add: 'Add', strength: 'Strength', upper_body: 'Upper Body',
    preference: 'Preferences', account: 'Account', help_feedback: 'Help & Feedback', ai_companion: 'AI Companion',
    online_proactive: 'Online & Proactive', recording: 'Recording...', type_message: 'Type a message...',
    statistics: 'Statistics', weekly_report: 'Weekly Report', monthly_report: 'Monthly Report',
    avg_calories: 'Avg. Calories', avg_sleep: 'Avg. Sleep', avg_water: 'Avg. Water', consistency: 'Consistency',
    Vegetables: 'Vegetables', Fruits: 'Fruits', Proteins: 'Proteins', Carbs: 'Carbs', Dairy: 'Dairy', Fats: 'Fats', Beverages: 'Beverages', Snacks: 'Snacks',
    carrot: 'Carrot', cucumber: 'Cucumber', tomato: 'Tomato', lettuce: 'Lettuce', spinach: 'Spinach', broccoli: 'Broccoli', onion: 'Onion', garlic: 'Garlic', bell_pepper: 'Bell Pepper', potato: 'Potato', sweet_potato: 'Sweet Potato', zucchini: 'Zucchini', eggplant: 'Eggplant', cauliflower: 'Cauliflower', green_beans: 'Green Beans',
    apple: 'Apple', banana: 'Banana', orange: 'Orange', strawberry: 'Strawberry', grapes: 'Grapes', watermelon: 'Watermelon', pineapple: 'Pineapple', mango: 'Mango', blueberry: 'Blueberry', lemon: 'Lemon', peach: 'Peach', pear: 'Pear', cherry: 'Cherry', kiwi: 'Kiwi',
    chicken_breast: 'Chicken Breast', beef_steak: 'Beef Steak', ground_beef: 'Ground Beef', salmon: 'Salmon', tuna_can: 'Canned Tuna', eggs: 'Eggs', turkey_breast: 'Turkey Breast', shrimp: 'Shrimp', tofu: 'Tofu', lentils: 'Lentils', chickpeas: 'Chickpeas', black_beans: 'Black Beans',
    rice_white: 'White Rice', rice_brown: 'Brown Rice', pasta: 'Pasta', oats: 'Oats', quinoa: 'Quinoa', bread_whole: 'Whole Wheat Bread', bread_white: 'White Bread', cereal: 'Cereal',
    milk_whole: 'Whole Milk', milk_lowfat: 'Low-fat Milk', yogurt_greek: 'Greek Yogurt', yogurt_plain: 'Plain Yogurt', cheese_cheddar: 'Cheddar', cheese_mozarella: 'Mozzarella', butter: 'Butter', cream: 'Cream',
    olive_oil: 'Olive Oil', vegetable_oil: 'Vegetable Oil', almonds: 'Almonds', walnuts: 'Walnuts', peanuts: 'Peanuts', peanut_butter: 'Peanut Butter', avocado: 'Avocado',
    chocolate_dark: 'Dark Chocolate', popcorn: 'Popcorn', chips: 'Potato Chips', cookies: 'Cookies', protein_bar: 'Protein Bar',
    water: 'Water', coffee: 'Coffee', tea_green: 'Green Tea', tea_black: 'Black Tea', juice_orange: 'Orange Juice', soda: 'Soda'
  },
  ar: {
    home: 'الرئيسية', nutrition: 'التغذية', fitness: 'اللياقة والصحة', coach: 'مدرب', profile: 'جسمي', greeting: 'مرحباً',
    goal_msg: 'جاهز لتحقيق هدفك؟', points: 'النقاط', streak: 'تتابع', quick_actions: 'إجراءات سريعة',
    log_meal: 'سجل وجبة', log_meal_desc: 'تتبع السعرات والماكروز', analyze_food: 'حلل طعامك', analyze: 'تحليل',
    log_activity: 'سجل نشاط', log_activity_desc: 'تتبع الرياضة والكارديو', activity_name: 'اسم النشاط', duration_min: 'المدة (دقيقة)', calories_burned: 'السعرات المحروقة', log_this_activity: 'سجل النشاط',
    food_log_placeholder: 'مثلاً: أكلت بيضتين وقطعة خبز...', analyzing: 'جار التحليل...', log_this_meal: 'سجل هذه الوجبة',
    add_to_fav: 'أضف للمفضلة', consumed: 'تم الاستهلاك',
    lang_region: 'اللغة والمنطقة', select_lang: 'اختر اللغة', select_country: 'الدولة / المنطقة',
    country_placeholder: 'اختر دولتك', select_curr: 'العملة', basics: 'الأساسيات', name: 'الاسم',
    age: 'العمر', gender: 'الجنس', body_stats: 'قياسات الجسم', height: 'الطول', weight: 'الوزن',
    goals_lifestyle: 'الأهداف ونمط الحياة', primary_goal: 'الهدف الرئيسي', activity_level: 'مستوى النشاط',
    daily_intake: 'الأهداف اليومية', meals_per_day: 'وجبات يومياً', water_per_day: 'هدف الماء',
    preferences: 'التفضيلات', enable_budget: 'الوضع الاقتصادي', budget_desc: 'اقترح مكونات غير مكلفة',
    diet_restrictions: 'قيود غذائية', diet_placeholder: 'مثلاً: نباتي، خالي من الجلوتين', start_journey: 'ابدأ الرحلة', next: 'التالي',
    hero_mode: 'وضع البطل', level: 'مستوى', str: 'قوة', agi: 'رشاقة', end: 'تحمل', int: 'ذكاء', mana: 'طاقة',
    recovery_mode: 'وضع التعافي', recovery_msg: 'نومك قليل. تدرب بخفة.',
    high_activity: 'نشاط مرتفع', high_activity_msg: 'خطوات رائعة! تمت إضافة سعرات إضافية.',
    coach_insight: 'نصيحة المدرب', coach_insight_text: 'الاستمرارية هي السر. استمر!',
    sleep_analysis: 'تحليل النوم', active_calories: 'سعرات النشاط', step_count: 'خطوة', water_tracker: 'شرب الماء',
    syncing: 'مزامنة...', connected_devices: 'الأجهزة المتصلة', disconnect: 'فصل', connect: 'اتصال', reset: 'إعادة ضبط',
    sedentary_savior: 'منقذ المكتبيين', stretch_now: 'تمرين تمدد', stretch_msg: 'جالس منذ فترة؟ جرب هذه التمارين.',
    damage_control: 'التحكم بالأضرار', i_overate: 'أفرطت في الأكل!', damage_control_active: 'التحكم بالأضرار نشط', damage_control_msg: 'تم تقليل الكربوهيدرات لمدة 3 أيام للتوازن.',
    travel_mode: 'وضع السفر', jet_lag_plan: 'مستشار الرحلات', travel_active: 'وضع السفر نشط', travel_msg: 'اشرب الماء بكثرة. تجنب الكافيين مساءً.', enable_travel: 'تفعيل وضع السفر', disable_travel: 'إلغاء وضع السفر',
    your_schedule: 'جدولك', regenerate: 'تجديد', diet: 'غذاء', workout: 'تمارين', favorites: 'المفضلة',
    breakfast: 'فطور', lunch: 'غداء', dinner: 'عشاء', snack: 'وجبة خفيفة',
    no_plan: 'لا توجد خطة بعد.', gen_plan_desc: 'دع الذكاء الاصطناعي يخطط لـ', generate_plan: 'إنشاء خطة',
    option: 'خيار', custom_option: 'مخصص', food_type: 'نوع الطعام', quantity: 'الكمية', enter_type: 'مثلاً: بيتزا', enter_qty: 'مثلاً: قطعتين',
    view_recipe: 'عرض الوصفة', prep_time: 'تحضير', cooking_time: 'طهي', tips: 'نصائح الشيف', ingredients: 'المكونات', instructions: 'التعليمات',
    exercise_guide: 'دليل التمرين', watch_tutorial: 'شاهد فيديو', target_muscles: 'عضلات مستهدفة', steps: 'خطوات', benefits: 'فوائد',
    rest_day: 'يوم راحة', fav_meals: 'وجبات مفضلة', fav_workouts: 'تمارين مفضلة', no_favs: 'لا يوجد مفضلة.',
    shopping_list: 'قائمة التسوق', shopping_list_title: 'مشتريات البقالة', share_list: 'مشاركة القائمة', list_copied: 'تم النسخ!',
    log_drink: 'سجل مشروب', drink_name: 'اسم المشروب', sugar_spoons: 'ملاعق سكر', additives: 'إضافات (حليب/كريمة)',
    nutrients_health: 'الصحة والتغذية', scan_label: 'مسح الملصق', add_food: 'أضف طعام', food_db: 'قاعدة الطعام', symptom_checker: 'فاحص الأعراض',
    prices_updated: 'تم تحديث الأسعار لـ', prices_updating: 'تحديث...', refresh_prices: 'تحديث الأسعار',
    search_food: 'بحث عن طعام...', in_stock: 'متوفر', all: 'الكل', price: 'السعر', macros_100g: 'ماكروز / 100غ', calories_100: 'سعرة/100غ',
    protein_g: 'بروتين (غ)', carbs_g: 'كارب (غ)', fats_g: 'دهون (غ)', pref: 'تفضيل', available: 'متاح', not_available: 'غير متاح',
    describe_symptoms: 'صف الأعراض (مثلاً: صداع، تعب)...', detected_deficiencies: 'النقص المحتمل',
    vitamins: 'فيتامينات', minerals: 'معادن', deficiency_symptoms: 'أعراض النقص', sources: 'مصادر', rdi: 'الاحتياج اليومي', interactions: 'تفاعلات',
    create: 'إنشاء', cancel: 'إلغاء', category: 'الفئة',
    smart_economy: 'اقتصاد ذكي', best_protein_value: 'أفضل قيمة بروتين', cheapest_energy: 'أرخص طاقة', cost_per_g_prot: 'تكلفة/غ بروتين', cost_per_100_kcal: 'تكلفة/100سعرة', smart_insight: 'رؤية ذكية', savings: 'توفير', cheaper_than: 'أرخص من',
    label_instructions: 'التقط صورة لقائمة المكونات أو الحقائق الغذائية.', verdict: 'الحكم', safe: 'آمن', caution: 'حذر', avoid: 'تجنب',
    hidden_dangers: 'مخاطر خفية', marketing_truth: 'حقيقة الملصق', claim_vs_reality: 'الادعاء vs الواقع', close: 'إغلاق',
    body_transformation: 'تحول الجسم', capture: 'التقاط', time_lapse: 'تطور زمني', settings: 'إعدادات', no_photos: 'لا توجد صور.', take_first: 'التقط صورتك الأولى!', ghost_mode: 'وضع الشبح',
    other: 'أخرى',
    fasting: 'صيام', ends_in: 'ينتهي في', hours: 'ساعة', min_to_cook: 'دقيقة', ingredients_count: 'مكونات',
    upgrade_premium: 'الترقية للمميزة', upgrade_desc: 'وصول كامل لميزات الذكاء الاصطناعي', edit_profile: 'تعديل الملف', add_device: 'إضافة جهاز',
    plan_your_day: 'خطط يومك', auto_plan: 'تخطيط تلقائي', agenda: 'جدول', add: 'إضافة', strength: 'قوة', upper_body: 'الجزء العلوي',
    preference: 'تفضيلات', account: 'حساب', help_feedback: 'مساعدة', ai_companion: 'رفيق ذكي',
    online_proactive: 'متصل ونشط', recording: 'جار التسجيل...', type_message: 'اكتب رسالة...',
    statistics: 'الإحصائيات', weekly_report: 'تقرير أسبوعي', monthly_report: 'تقرير شهري',
    avg_calories: 'متوسط السعرات', avg_sleep: 'متوسط النوم', avg_water: 'متوسط الماء', consistency: 'الانتظام',
    Vegetables: 'خضروات', Fruits: 'فواكه', Proteins: 'بروتينات', Carbs: 'نشويات', Dairy: 'ألبان', Fats: 'دهون', Beverages: 'مشروبات', Snacks: 'وجبات خفيفة',
    carrot: 'جزر', cucumber: 'خيار', tomato: 'طماطم', lettuce: 'خس', spinach: 'سبانخ', broccoli: 'بروكلي', onion: 'بصل', garlic: 'ثوم', bell_pepper: 'فلفل رومي', potato: 'بطاطس', sweet_potato: 'بطاطا حلوة', zucchini: 'كوسا', eggplant: 'باذنجان', cauliflower: 'قرنبيط', green_beans: 'فاصوليا خضراء',
    apple: 'تفاح', banana: 'موز', orange: 'برتقال', strawberry: 'فراولة', grapes: 'عنب', watermelon: 'بطيخ', pineapple: 'أناناس', mango: 'مانجو', blueberry: 'توت أزرق', lemon: 'ليمون', peach: 'خوخ', pear: 'كمثرى', cherry: 'كرز', kiwi: 'كيوي',
    chicken_breast: 'صدر دجاج', beef_steak: 'شريحة لحم', ground_beef: 'لحم مفروم', salmon: 'سلمون', tuna_can: 'تونا معلبة', eggs: 'بيض', turkey_breast: 'صدر ديك رومي', shrimp: 'روبيان', tofu: 'توفو', lentils: 'عدس', chickpeas: 'حمص', black_beans: 'فاصوليا سوداء',
    rice_white: 'أرز أبيض', rice_brown: 'أرز بني', pasta: 'مكرونة', oats: 'شوفان', quinoa: 'كينوا', bread_whole: 'خبز أسمر', bread_white: 'خبز أبيض', cereal: 'حبوب إفطار',
    milk_whole: 'حليب كامل', milk_lowfat: 'حليب قليل الدسم', yogurt_greek: 'زبادي يوناني', yogurt_plain: 'زبادي عادي', cheese_cheddar: 'جبن شيدر', cheese_mozarella: 'موزاريلا', butter: 'زبدة', cream: 'قشطة',
    olive_oil: 'زيت زيتون', vegetable_oil: 'زيت نباتي', almonds: 'لوز', walnuts: 'عين جمل', peanuts: 'فول سوداني', peanut_butter: 'زبدة فول سوداني', avocado: 'أفوكادو',
    chocolate_dark: 'شوكلاتة داكنة', popcorn: 'فشار', chips: 'شيبس', cookies: 'كوكيز', protein_bar: 'بار بروتين',
    water: 'ماء', coffee: 'قهوة', tea_green: 'شاي أخضر', tea_black: 'شاي أحمر', juice_orange: 'عصير برتقال', soda: 'مشروب غازي'
  },
  // ... (Keeping French and Spanish maps identical to save space, but added keys)
  fr: {
    // ... existing ...
    home: 'Accueil', nutrition: 'Nutrition', fitness: 'Santé & Forme', coach: 'Coach', profile: 'Corps', greeting: 'Bonjour',
    goal_msg: 'Prêt à atteindre votre objectif?', points: 'Points', streak: 'Série', quick_actions: 'Actions Rapides',
    log_meal: 'Journal Repas', log_meal_desc: 'Suivi calories & macros', analyze_food: 'Analyser', analyze: 'Analyser',
    log_activity: 'Journal Activité', log_activity_desc: 'Suivi sports & cardio', activity_name: 'Nom Activité', duration_min: 'Durée (min)', calories_burned: 'Calories Brûlées', log_this_activity: 'Enregistrer Activité',
    food_log_placeholder: 'ex: J\'ai mangé 2 oeufs...', analyzing: 'Analyse...', log_this_meal: 'Enregistrer',
    add_to_fav: 'Ajouter aux Favoris', consumed: 'Consommé',
    lang_region: 'Langue & Région', select_lang: 'Langue', select_country: 'Pays / Région',
    country_placeholder: 'Choisir pays', select_curr: 'Devise', basics: 'Bases', name: 'Nom',
    age: 'Âge', gender: 'Genre', body_stats: 'Mesures', height: 'Taille', weight: 'Poids',
    goals_lifestyle: 'Objectifs', primary_goal: 'But Principal', activity_level: 'Niveau d\'Activité',
    daily_intake: 'Objectifs Quotidiens', meals_per_day: 'Repas/jour', water_per_day: 'Objectif Eau',
    preferences: 'Préférences', enable_budget: 'Mode Économique', budget_desc: 'Ingrédients moins chers',
    diet_restrictions: 'Restrictions', diet_placeholder: 'ex: Végétalien', start_journey: 'Commencer', next: 'Suivant',
    hero_mode: 'Mode Héros', level: 'Niveau', str: 'FOR', agi: 'AGI', end: 'END', int: 'INT', mana: 'MANA',
    recovery_mode: 'Mode Récupération', recovery_msg: 'Peu de sommeil. Entraînement léger.',
    high_activity: 'Haute Activité', high_activity_msg: 'Beaucoup de pas! Calories ajoutées.',
    coach_insight: 'Conseil Coach', coach_insight_text: 'La constance est la clé.',
    sleep_analysis: 'Sommeil', active_calories: 'Calories Actives', step_count: 'Pas', water_tracker: 'Hydratation',
    syncing: 'Synchro...', connected_devices: 'Appareils', disconnect: 'Déconnecter', connect: 'Connecter', reset: 'Réinitialiser',
    sedentary_savior: 'Sauveur Sédentaire', stretch_now: 'S\'étirer', stretch_msg: 'Assis trop longtemps? Étirez-vous.',
    damage_control: 'Contrôle Dégâts', i_overate: 'J\'ai trop mangé!', damage_control_active: 'Contrôle Dégâts Actif', damage_control_msg: 'Glucides réduits pour 3 jours.',
    travel_mode: 'Mode Voyage', jet_lag_plan: 'Conseil Jet Lag', travel_active: 'Mode Voyage Actif', travel_msg: 'Hydratez-vous. Évitez caféine le soir.', enable_travel: 'Activer Mode Voyage', disable_travel: 'Désactiver Mode Voyage',
    your_schedule: 'Votre Planning', regenerate: 'Régénérer', diet: 'Régime', workout: 'Entraînement', favorites: 'Favoris',
    breakfast: 'Petit Déj', lunch: 'Déjeuner', dinner: 'Dîner', snack: 'Collation',
    no_plan: 'Pas de plan.', gen_plan_desc: 'Laissez l\'IA créer un plan pour', generate_plan: 'Générer Plan',
    option: 'Option', custom_option: 'Perso', food_type: 'Type', quantity: 'Quantité', enter_type: 'ex: Pizza', enter_qty: 'ex: 2 parts',
    view_recipe: 'Voir Recette', prep_time: 'Prép', cooking_time: 'Cuisson', tips: 'Astuces', ingredients: 'Ingrédients', instructions: 'Instructions',
    exercise_guide: 'Guide Exercice', watch_tutorial: 'Voir Tutoriel', target_muscles: 'Muscles Ciblés', steps: 'Étapes', benefits: 'Bienfaits',
    rest_day: 'Repos', fav_meals: 'Repas Fav', fav_workouts: 'Entraînements Fav', no_favs: 'Pas de favoris.',
    shopping_list: 'Liste Courses', shopping_list_title: 'Liste Courses', share_list: 'Partager', list_copied: 'Copié!',
    log_drink: 'Journal Boisson', drink_name: 'Nom Boisson', sugar_spoons: 'Cuillères Sucre', additives: 'Ajouts (Lait)',
    nutrients_health: 'Nutriments & Santé', scan_label: 'Scanner Étiquette', add_food: 'Ajouter', food_db: 'Base Aliments', symptom_checker: 'Symptômes',
    prices_updated: 'Prix à jour pour', prices_updating: 'Mise à jour...', refresh_prices: 'Actualiser',
    search_food: 'Chercher...', in_stock: 'En Stock', all: 'Tout', price: 'Prix', macros_100g: 'Macros / 100g', calories_100: 'kcal/100g',
    protein_g: 'Protéines (g)', carbs_g: 'Glucides (g)', fats_g: 'Lipides (g)', pref: 'Préférence', available: 'Dispo', not_available: 'Épuisé',
    describe_symptoms: 'Décrivez symptômes...', detected_deficiencies: 'Carences',
    vitamins: 'Vitamines', minerals: 'Minéraux', deficiency_symptoms: 'Symptômes Carence', sources: 'Sources', rdi: 'AJR', interactions: 'Interactions',
    create: 'Créer', cancel: 'Annuler', category: 'Catégorie',
    smart_economy: 'Économie Intelligente', best_protein_value: 'Meilleure Valeur Protéine', cheapest_energy: 'Énergie Moins Chère', cost_per_g_prot: 'Coût/g Protéine', cost_per_100_kcal: 'Coût/100kcal', smart_insight: 'Aperçu Intelligent', savings: 'Économie', cheaper_than: 'moins cher que',
    label_instructions: 'Prenez photo ingrédients ou valeurs.', verdict: 'Verdict', safe: 'Sûr', caution: 'Attention', avoid: 'Éviter',
    hidden_dangers: 'Dangers Cachés', marketing_truth: 'Vérité Étiquette', claim_vs_reality: 'Allégation vs Réalité', close: 'Fermer',
    body_transformation: 'Transformation', capture: 'Capturer', time_lapse: 'Time Lapse', settings: 'Paramètres', no_photos: 'Pas de photos.', take_first: 'Prenez la première!', ghost_mode: 'Mode Fantôme',
    other: 'Autre',
    fasting: 'Jeûne', ends_in: 'Finit dans', hours: 'H', min_to_cook: 'Min', ingredients_count: 'Ingréd.',
    upgrade_premium: 'Passer Premium', upgrade_desc: 'Accès complet aux fonctions IA.', edit_profile: 'Éditer Profil', add_device: 'Ajouter Appareil',
    plan_your_day: 'Planifier', auto_plan: 'Auto-Plan', agenda: 'Agenda', add: 'Ajouter', strength: 'Force', upper_body: 'Haut du Corps',
    preference: 'Préférences', account: 'Compte', help_feedback: 'Aide', ai_companion: 'Compagnon IA',
    online_proactive: 'En ligne & Proactif', recording: 'Enregistrement...', type_message: 'Écrivez un message...',
    statistics: 'Statistiques', weekly_report: 'Rapport Hebdomadaire', monthly_report: 'Rapport Mensuel',
    avg_calories: 'Moy. Calories', avg_sleep: 'Moy. Sommeil', avg_water: 'Moy. Eau', consistency: 'Constance',
    Vegetables: 'Légumes', Fruits: 'Fruits', Proteins: 'Protéines', Carbs: 'Glucides', Dairy: 'Laitiers', Fats: 'Lipides', Beverages: 'Boissons', Snacks: 'Snacks',
    carrot: 'Carotte', cucumber: 'Concombre', tomato: 'Tomate', lettuce: 'Laitue', spinach: 'Épinard', broccoli: 'Brocoli', onion: 'Oignon', garlic: 'Ail', bell_pepper: 'Poivron', potato: 'Pomme de terre', sweet_potato: 'Patate douce', zucchini: 'Courgette', eggplant: 'Aubergine', cauliflower: 'Chou-fleur', green_beans: 'Haricots verts',
    apple: 'Pomme', banana: 'Banane', orange: 'Orange', strawberry: 'Fraise', grapes: 'Raisin', watermelon: 'Pastèque', pineapple: 'Ananas', mango: 'Mangue', blueberry: 'Myrtille', lemon: 'Citron', peach: 'Pêche', pear: 'Poire', cherry: 'Cerise', kiwi: 'Kiwi',
    chicken_breast: 'Blanc de poulet', beef_steak: 'Steak de boeuf', ground_beef: 'Boeuf haché', salmon: 'Saumon', tuna_can: 'Thon en boîte', eggs: 'Oeufs', turkey_breast: 'Dinde', shrimp: 'Crevettes', tofu: 'Tofu', lentils: 'Lentilles', chickpeas: 'Pois chiches', black_beans: 'Haricots noirs',
    rice_white: 'Riz blanc', rice_brown: 'Riz complet', pasta: 'Pâtes', oats: 'Avoine', quinoa: 'Quinoa', bread_whole: 'Pain complet', bread_white: 'Pain blanc', cereal: 'Céréales',
    milk_whole: 'Lait entier', milk_lowfat: 'Lait demi-écrémé', yogurt_greek: 'Yaourt Grec', yogurt_plain: 'Yaourt nature', cheese_cheddar: 'Cheddar', cheese_mozarella: 'Mozzarella', butter: 'Beurre', cream: 'Crème',
    olive_oil: 'Huile d\'olive', vegetable_oil: 'Huile végétale', almonds: 'Amandes', walnuts: 'Noix', peanuts: 'Cacahuètes', peanut_butter: 'Beurre de cacahuète', avocado: 'Avocat',
    chocolate_dark: 'Chocolat noir', popcorn: 'Pop-corn', chips: 'Chips', cookies: 'Cookies', protein_bar: 'Barre protéinée',
    water: 'Eau', coffee: 'Café', tea_green: 'Thé vert', tea_black: 'Thé noir', juice_orange: 'Jus d\'orange', soda: 'Soda'
  },
  es: {
    // ... existing ...
    home: 'Inicio', nutrition: 'Nutrición', fitness: 'Salud y Forma', coach: 'Entrenador', profile: 'Cuerpo', greeting: 'Hola',
    goal_msg: '¿Listo para tu meta?', points: 'Puntos', streak: 'Racha', quick_actions: 'Acciones Rápidas',
    log_meal: 'Registrar Comida', log_meal_desc: 'Calorías y macros', analyze_food: 'Analizar Comida', analyze: 'Analizar',
    log_activity: 'Registrar Actividad', log_activity_desc: 'Seguimiento deportes', activity_name: 'Nombre Actividad', duration_min: 'Duración (min)', calories_burned: 'Calorías Quemadas', log_this_activity: 'Registrar Actividad',
    food_log_placeholder: 'ej: Comí 2 huevos...', analyzing: 'Analizando...', log_this_meal: 'Registrar',
    add_to_fav: 'Añadir a Favoritos', consumed: 'Consumido',
    lang_region: 'Idioma y Región', select_lang: 'Idioma', select_country: 'País / Región',
    country_placeholder: 'Selecciona país', select_curr: 'Moneda', basics: 'Básicos', name: 'Nombre',
    age: 'Edad', gender: 'Género', body_stats: 'Medidas', height: 'Altura', weight: 'Peso',
    goals_lifestyle: 'Objetivos', primary_goal: 'Meta Principal', activity_level: 'Nivel Actividad',
    daily_intake: 'Objetivos Diarios', meals_per_day: 'Comidas al día', water_per_day: 'Meta Agua',
    preferences: 'Preferencias', enable_budget: 'Modo Económico', budget_desc: 'Ingredientes baratos',
    diet_restrictions: 'Restricciones', diet_placeholder: 'ej: Vegano', start_journey: 'Comenzar', next: 'Siguiente',
    hero_mode: 'Modo Héroe', level: 'Nivel', str: 'FUE', agi: 'AGI', end: 'RES', int: 'INT', mana: 'MANA',
    recovery_mode: 'Modo Recuperación', recovery_msg: 'Poco sueño. Entrena suave.',
    high_activity: 'Alta Actividad', high_activity_msg: '¡Grandes pasos! Calorías extra añadidas.',
    coach_insight: 'Consejo', coach_insight_text: 'La constance es clave.',
    sleep_analysis: 'Sueño', active_calories: 'Calorías Activas', step_count: 'Pasos', water_tracker: 'Hydratación',
    syncing: 'Sincronizando...', connected_devices: 'Dispositivos', disconnect: 'Desconectar', connect: 'Conectar', reset: 'Reiniciar',
    sedentary_savior: 'Salvador Sedentario', stretch_now: 'Estirar', stretch_msg: '¿Mucho tiempo sentado? Estira.',
    damage_control: 'Control Daños', i_overate: '¡Comí de más!', damage_control_active: 'Control Daños Activo', damage_control_msg: 'Carbohidratos reducidos por 3 días.',
    travel_mode: 'Modo Viaje', jet_lag_plan: 'Asesor Jet Lag', travel_active: 'Modo Viaje Activo', travel_msg: 'Hidrátate. Evita cafeína de noche.', enable_travel: 'Activar Modo Viaje', disable_travel: 'Desactivar Modo Viaje',
    your_schedule: 'Tu Horario', regenerate: 'Regenerar', diet: 'Dieta', workout: 'Entreno', favorites: 'Favoritos',
    breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena', snack: 'Snack',
    no_plan: 'Sin plan aún.', gen_plan_desc: 'Deja que la IA cree un plan para', generate_plan: 'Generar Plan',
    option: 'Opción', custom_option: 'Perso', food_type: 'Tipo', quantity: 'Cantidad', enter_type: 'ej: Pizza', enter_qty: 'ej: 2 trozos',
    view_recipe: 'Ver Receta', prep_time: 'Prep', cooking_time: 'Cocina', tips: 'Consejos', ingredients: 'Ingredientes', instructions: 'Instrucciones',
    exercise_guide: 'Guía Ejercicio', watch_tutorial: 'Ver Tutorial', target_muscles: 'Músculos', steps: 'Pasos', benefits: 'Beneficios',
    rest_day: 'Descanso', fav_meals: 'Comidas Fav', fav_workouts: 'Entrenos Fav', no_favs: 'Sin favoritos.',
    shopping_list: 'Lista Compra', shopping_list_title: 'La Compra', share_list: 'Compartir', list_copied: '¡Copiado!',
    log_drink: 'Registrar Bebida', drink_name: 'Nombre', sugar_spoons: 'Cucharadas Azúcar', additives: 'Añadidos (Leche)',
    nutrients_health: 'Nutrientes y Salud', scan_label: 'Escanear Etiqueta', add_food: 'Añadir Comida', food_db: 'Base Alimentos', symptom_checker: 'Síntomas',
    prices_updated: 'Precios para', prices_updating: 'Actualizando...', refresh_prices: 'Actualizar',
    search_food: 'Buscar...', in_stock: 'En Stock', all: 'Todo', price: 'Precio', macros_100g: 'Macros / 100g', calories_100: 'kcal/100g',
    protein_g: 'Proteína (g)', carbs_g: 'Carbs (g)', fats_g: 'Grasas (g)', pref: 'Preferencia', available: 'Disponible', not_available: 'Agotado',
    describe_symptoms: 'Describe síntomas...', detected_deficiencies: 'Deficiencias',
    vitamins: 'Vitaminas', minerals: 'Minerales', deficiency_symptoms: 'Síntomas', sources: 'Fuentes', rdi: 'IDR', interactions: 'Interacciones',
    create: 'Crear', cancel: 'Cancelar', category: 'Categoría',
    smart_economy: 'Economía Inteligente', best_protein_value: 'Mejor Valor Proteico', cheapest_energy: 'Energía más Barata', cost_per_g_prot: 'Coste/g Proteína', cost_per_100_kcal: 'Coste/100kcal', smart_insight: 'Visión Inteligente', savings: 'Ahorro', cheaper_than: 'más barato que',
    label_instructions: 'Toma foto de ingredientes o valores.', verdict: 'Veredicto', safe: 'Seguro', caution: 'Precaución', avoid: 'Evitar',
    hidden_dangers: 'Peligros Ocultos', marketing_truth: 'Verdad Etiqueta', claim_vs_reality: 'Afirmación vs Realidad', close: 'Cerrar',
    body_transformation: 'Transformación', capture: 'Capturar', time_lapse: 'Time Lapse', settings: 'Ajustes', no_photos: 'Sin fotos.', take_first: '¡Toma la primera!', ghost_mode: 'Modo Fantasma',
    other: 'Otro',
    fasting: 'Ayuno', ends_in: 'Termina en', hours: 'H', min_to_cook: 'Min', ingredients_count: 'Ingred.',
    upgrade_premium: 'Mejorar a Premium', upgrade_desc: 'Acceso total a funciones IA.', edit_profile: 'Editar Perfil', add_device: 'Añadir Dispositivo',
    plan_your_day: 'Planificar Día', auto_plan: 'Auto-Plan', agenda: 'Agenda', add: 'Añadir', strength: 'Fuerza', upper_body: 'Tren Superior',
    preference: 'Preferencias', account: 'Cuenta', help_feedback: 'Ayuda', ai_companion: 'Compañero IA',
    online_proactive: 'En línea y Proactivo', recording: 'Grabando...', type_message: 'Escribe un mensaje...',
    statistics: 'Estadísticas', weekly_report: 'Informe Semanal', monthly_report: 'Informe Mensual',
    avg_calories: 'Calorías Promedio', avg_sleep: 'Sueño Promedio', avg_water: 'Agua Promedio', consistency: 'Constancia',
    Vegetables: 'Verduras', Fruits: 'Frutas', Proteins: 'Proteínas', Carbs: 'Carbohidratos', Dairy: 'Lácteos', Fats: 'Grasas', Beverages: 'Bebidas', Snacks: 'Snacks',
    carrot: 'Zanahoria', cucumber: 'Pepino', tomato: 'Tomate', lettuce: 'Lechuga', spinach: 'Espinaca', broccoli: 'Brócoli', onion: 'Cebolla', garlic: 'Ajo', bell_pepper: 'Pimiento', potato: 'Patata', sweet_potato: 'Batata', zucchini: 'Calabacín', eggplant: 'Berenjena', cauliflower: 'Coliflor', green_beans: 'Judías verdes',
    apple: 'Manzana', banana: 'Plátano', orange: 'Naranja', strawberry: 'Fresa', grapes: 'Uvas', watermelon: 'Sandía', pineapple: 'Piña', mango: 'Mango', blueberry: 'Arándano', lemon: 'Limón', peach: 'Melocotón', pear: 'Pera', cherry: 'Cereza', kiwi: 'Kiwi',
    chicken_breast: 'Pechuga de pollo', beef_steak: 'Filete ternera', ground_beef: 'Carne picada', salmon: 'Salmón', tuna_can: 'Atún lata', eggs: 'Huevos', turkey_breast: 'Pechuga pavo', shrimp: 'Gambas', tofu: 'Tofu', lentils: 'Lentejas', chickpeas: 'Garbanzos', black_beans: 'Frijoles',
    rice_white: 'Arroz blanco', rice_brown: 'Arroz integral', pasta: 'Pasta', oats: 'Avena', quinoa: 'Quinua', bread_whole: 'Pan integral', bread_white: 'Pan blanco', cereal: 'Cereales',
    milk_whole: 'Leche entera', milk_lowfat: 'Leche semi', yogurt_greek: 'Yogur griego', yogurt_plain: 'Yogur natural', cheese_cheddar: 'Cheddar', cheese_mozarella: 'Mozzarella', butter: 'Mantequilla', cream: 'Nata',
    olive_oil: 'Aceite oliva', vegetable_oil: 'Aceite girasol', almonds: 'Almendras', walnuts: 'Nueces', peanuts: 'Cacahuetes', peanut_butter: 'Crema cacahuete', avocado: 'Aguacate',
    chocolate_dark: 'Choc. negro', popcorn: 'Palomitas', chips: 'Patatas fritas', cookies: 'Galletas', protein_bar: 'Barrita proteína',
    water: 'Agua', coffee: 'Café', tea_green: 'Té verde', tea_black: 'Té negro', juice_orange: 'Zumo naranja', soda: 'Refresco'
  }
};

const defaultUser: UserProfile = {
  name: '',
  age: 25,
  gender: Gender.Male,
  height: 170,
  weight: 70,
  goal: Goal.Maintain,
  activityLevel: ActivityLevel.ModeratelyActive,
  dietaryRestrictions: [],
  budgetMode: false,
  language: 'en',
  currency: 'USD',
  country: 'Global',
  onboarded: false,
  points: 0,
  streak: 0,
  favoriteMeals: [],
  favoriteWorkouts: [],
  foodDatabase: [],
  deficiencies: [],
  targetMealsPerDay: 3,
  targetWaterPerDay: 2,
  consumedHistory: [],
  connectedDevices: [],
  dailyStats: {
      date: new Date().toISOString().split('T')[0],
      steps: 0,
      sleepHours: 7.5,
      sleepQuality: 'Good',
      activeCalories: 0,
      lastSynced: 0
  },
  healthHistory: [], // Initialized as empty
  progressPhotos: [],
  rpgStats: { level: 1, currentXP: 0, nextLevelXP: 500, title: 'Novice', attributes: { strength: {level:1, xp:0, maxXP:100}, agility: {level:1, xp:0, maxXP:100}, endurance: {level:1, xp:0, maxXP:100}, intelligence: {level:1, xp:0, maxXP:100}, mana: {level:1, xp:0, maxXP:100} } },
  lastPriceUpdate: 0,
  specialMode: 'Standard'
};

interface AppState {
  user: UserProfile;
  plan: WeeklyPlan | null;
  messages: Message[];
  isLoading: boolean;
  currentView: 'onboarding' | 'dashboard' | 'chat' | 'nutrition' | 'fitness' | 'progress';
  updateUser: (u: Partial<UserProfile>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  addFoodItem: (item: FoodItem) => void;
  setPlan: (p: WeeklyPlan) => void;
  addMessage: (m: Message) => void;
  setLoading: (l: boolean) => void;
  navigate: (view: 'onboarding' | 'dashboard' | 'chat' | 'nutrition' | 'fitness' | 'progress') => void;
  resetApp: () => void;
  toggleFavoriteMeal: (meal: Meal) => void;
  toggleFavoriteWorkout: (workout: WorkoutRoutine) => void;
  analyzeUserSymptoms: (symptoms: string) => Promise<void>;
  toggleFoodAvailability: (id: string) => void;
  logConsumedMeal: (meal: Meal) => void;
  analyzeCustomMeal: (text: string) => Promise<Meal | null>;
  getDailyNutrition: () => { calories: number; protein: number; carbs: number; fats: number };
  t: (key: keyof typeof translations['en']) => string;
  getLocalizedFoodName: (name: string) => string;
  getNutrientData: () => NutrientInfo[];
  updatePlanMeal: (dayIndex: number, mealType: 'breakfast'|'lunch'|'dinner'|'snack', optionIndex: number, updates: Partial<Meal>) => void;
  updatePlanExercise: (dayIndex: number, exerciseIndex: number, updates: Partial<Exercise>) => void;
  hydrateMealDetail: (dayIndex: number, mealType: 'breakfast'|'lunch'|'dinner'|'snack', optionIndex: number, meal: Meal) => Promise<void>;
  hydrateExerciseDetail: (dayIndex: number, exerciseIndex: number, exercise: Exercise) => Promise<void>;
  generateShoppingList: () => Record<string, string[]>;
  connectWearable: (provider: WearableProvider) => void;
  syncHealthData: () => Promise<void>;
  addProgressPhoto: (photo: string) => void;
  analyzeLabelImage: (base64: string) => Promise<LabelAnalysis | null>;
  refreshFoodPrices: () => Promise<void>;
  calculateFoodEfficiency: (sortBy: 'protein' | 'calories') => FoodEfficiency[];
  activateDamageControl: () => void;
  activateTravelMode: (isActive: boolean) => void;
  getFoodImage: (name: string) => string;
  analyzeActivity: (activity: string, duration: string) => Promise<{name: string, calories: number} | null>;
  logManualActivity: (calories: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppStore must be used within an AppProvider');
    }
    return context;
};

// Helper to generate initial food DB
const generateInitialFoods = (): FoodItem[] => {
    return FOOD_NAMES_DB.map((name, idx) => {
        let category: any = 'Snacks';
        let image = '🍽️';
        let price = 5;
        let macros = { c: 50, p: 2, cb: 10, f: 1 };

        if (['carrot', 'cucumber', 'tomato', 'lettuce', 'spinach', 'broccoli', 'onion', 'garlic', 'bell_pepper', 'potato', 'sweet_potato', 'zucchini', 'eggplant', 'cauliflower', 'green_beans'].includes(name)) { category = 'Vegetables'; image = '🥦'; price = 2; macros = {c:30, p:1, cb:6, f:0}; }
        else if (['apple', 'banana', 'orange', 'strawberry', 'grapes', 'watermelon', 'pineapple', 'mango', 'blueberry', 'lemon', 'peach', 'pear', 'cherry', 'kiwi'].includes(name)) { category = 'Fruits'; image = '🍎'; price = 3; macros = {c:50, p:0.5, cb:12, f:0}; }
        else if (['chicken_breast', 'beef_steak', 'ground_beef', 'salmon', 'tuna_can', 'eggs', 'turkey_breast', 'shrimp', 'tofu'].includes(name)) { category = 'Proteins'; image = '🥩'; price = 10; macros = {c:150, p:25, cb:0, f:5}; }
        else if (['lentils', 'chickpeas', 'black_beans'].includes(name)) { category = 'Proteins'; image = '🫘'; price = 3; macros = {c:116, p:9, cb:20, f:0.4}; }
        else if (['rice_white', 'rice_brown', 'pasta', 'oats', 'quinoa', 'bread_whole', 'bread_white', 'cereal'].includes(name)) { category = 'Carbs'; image = '🍚'; price = 2; macros = {c:130, p:3, cb:28, f:0.5}; }
        else if (['milk_whole', 'milk_lowfat', 'yogurt_greek', 'yogurt_plain', 'cheese_cheddar', 'cheese_mozarella', 'butter', 'cream'].includes(name)) { category = 'Dairy'; image = '🥛'; price = 4; macros = {c:60, p:3, cb:5, f:3}; }
        else if (['olive_oil', 'vegetable_oil', 'almonds', 'walnuts', 'peanuts', 'peanut_butter', 'avocado'].includes(name)) { category = 'Fats'; image = '🥑'; price = 8; macros = {c:884, p:0, cb:0, f:100}; }
        else if (['water', 'coffee', 'tea_green', 'tea_black', 'juice_orange', 'soda'].includes(name)) { category = 'Beverages'; image = '🥤'; price = 1; macros = {c:0, p:0, cb:0, f:0}; }
        
        return {
            id: `f_${idx}`,
            name: name, // This is the translation key
            category: category,
            price: price,
            unit: 'kg',
            preference: 5,
            isAvailable: idx % 3 === 0, // Random availability for demo
            image: image,
            caloriesPer100g: macros.c,
            proteinPer100g: macros.p,
            carbsPer100g: macros.cb,
            fatsPer100g: macros.f
        };
    });
};

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ai_gym_user');
    const initialFoods = generateInitialFoods();
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
            ...defaultUser, 
            ...parsed, 
            connectedDevices: parsed.connectedDevices || [],
            dailyStats: parsed.dailyStats || defaultUser.dailyStats,
            healthHistory: parsed.healthHistory || [],
            progressPhotos: parsed.progressPhotos || [],
            rpgStats: parsed.rpgStats || defaultUser.rpgStats,
            lastPriceUpdate: parsed.lastPriceUpdate || 0,
            specialMode: parsed.specialMode || 'Standard',
            foodDatabase: (parsed.foodDatabase && parsed.foodDatabase.length > 20) ? parsed.foodDatabase : initialFoods
        };
      } catch (e) {
        return { ...defaultUser, foodDatabase: initialFoods }; 
      }
    }
    return { ...defaultUser, foodDatabase: initialFoods };
  });

  const [plan, setPlanState] = useState<WeeklyPlan | null>(() => {
      const saved = localStorage.getItem('ai_gym_plan');
      try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'chat' | 'nutrition' | 'fitness' | 'progress'>(() => {
    const saved = localStorage.getItem('ai_gym_user');
    if (saved) {
        try { return JSON.parse(saved).onboarded ? 'dashboard' : 'onboarding'; } catch { return 'onboarding'; }
    }
    return 'onboarding';
  });

  useEffect(() => {
    localStorage.setItem('ai_gym_user', JSON.stringify(user));
  }, [user]);

  // Check Damage Control Expiry
  useEffect(() => {
     if (user.specialMode === 'DamageControl' && user.damageControlExpiry) {
         if (Date.now() > user.damageControlExpiry) {
             setUser(prev => ({ ...prev, specialMode: 'Standard', damageControlExpiry: undefined }));
         }
     }
  }, [user]);

  useEffect(() => {
     if (user.onboarded && user.foodDatabase.length > 0) {
         const now = Date.now();
         const oneDay = 24 * 60 * 60 * 1000;
         if (now - user.lastPriceUpdate > oneDay) {
             console.log("Prices stale, updating...");
             refreshFoodPrices();
         }
     }
  }, [user.onboarded]); 

  const refreshFoodPrices = async () => {
      if (!user.country || user.foodDatabase.length === 0) return;
      const foodNames = user.foodDatabase.map(f => f.name);
      const prices = await estimateLocalFoodPrices(foodNames, user.country, user.currency);
      if (prices) {
          setUser(prev => ({
              ...prev,
              lastPriceUpdate: Date.now(),
              foodDatabase: prev.foodDatabase.map(item => ({
                  ...item,
                  price: prices[item.name] || item.price 
              }))
          }));
      }
  };

  const updateUser = (updates: Partial<UserProfile>) => setUser(prev => ({ ...prev, ...updates }));
  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => setUser(prev => ({ ...prev, foodDatabase: prev.foodDatabase.map(item => item.id === id ? { ...item, ...updates } : item) }));
  const addFoodItem = (item: FoodItem) => setUser(prev => ({ ...prev, foodDatabase: [...prev.foodDatabase, item] }));
  const setPlan = (p: WeeklyPlan) => { setPlanState(p); localStorage.setItem('ai_gym_plan', JSON.stringify(p)); };
  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);
  const navigate = (view: typeof currentView) => setCurrentView(view);
  const resetApp = () => { localStorage.removeItem('ai_gym_user'); localStorage.removeItem('ai_gym_plan'); setUser({ ...defaultUser, foodDatabase: generateInitialFoods() }); setPlanState(null); setMessages([]); setCurrentView('onboarding'); };
  const toggleFavoriteMeal = (meal: Meal) => setUser(prev => { const isFav = prev.favoriteMeals.some(m => m.name === meal.name); const newFavs = isFav ? prev.favoriteMeals.filter(m => m.name !== meal.name) : [...prev.favoriteMeals, meal]; return { ...prev, favoriteMeals: newFavs }; });
  const toggleFavoriteWorkout = (workout: WorkoutRoutine) => setUser(prev => { const isFav = prev.favoriteWorkouts.some(w => w.focus === workout.focus); const newFavs = isFav ? prev.favoriteWorkouts.filter(w => w.focus !== workout.focus) : [...prev.favoriteWorkouts, workout]; return { ...prev, favoriteWorkouts: newFavs }; });
  const analyzeUserSymptoms = async (symptoms: string) => { setLoading(true); const deficiencies = await analyzeSymptoms(symptoms, user); if (deficiencies) setUser(prev => ({ ...prev, deficiencies: [...(prev.deficiencies || []), ...deficiencies] })); setLoading(false); };
  const toggleFoodAvailability = (id: string) => setUser(prev => ({ ...prev, foodDatabase: prev.foodDatabase.map(f => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f) }));
  
  const checkLevelUp = (stats: RPGStats, addedXP: number): RPGStats => { let newStats = { ...stats }; newStats.currentXP += addedXP; if (newStats.currentXP >= newStats.nextLevelXP) { newStats.level += 1; newStats.currentXP -= newStats.nextLevelXP; newStats.nextLevelXP = Math.floor(newStats.nextLevelXP * 1.2); } return newStats; };
  const updateAttribute = (attr: RPGAttribute, xpGain: number): RPGAttribute => { let newAttr = { ...attr }; newAttr.xp += xpGain; if (newAttr.xp >= newAttr.maxXP) { newAttr.level += 1; newAttr.xp -= newAttr.maxXP; newAttr.maxXP = Math.floor(newAttr.maxXP * 1.1); } return newAttr; };
  const logConsumedMeal = (meal: Meal) => { setUser(prev => { const proteinXP = Math.floor(meal.protein || 0); const carbsXP = Math.floor(meal.carbs || 0); const fatsXP = Math.floor(meal.fats || 0); let rpg = { ...prev.rpgStats }; rpg.attributes.strength = updateAttribute(rpg.attributes.strength, proteinXP); rpg.attributes.endurance = updateAttribute(rpg.attributes.endurance, carbsXP); rpg.attributes.intelligence = updateAttribute(rpg.attributes.intelligence, fatsXP); const totalXP = proteinXP + carbsXP + fatsXP; rpg = checkLevelUp(rpg, totalXP); return { ...prev, consumedHistory: [...prev.consumedHistory, { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], timestamp: Date.now(), meal: meal }], points: prev.points + 10, rpgStats: rpg }; }); };
  const analyzeCustomMeal = async (text: string) => { return await analyzeFoodLog(text, user); };
  const getDailyNutrition = () => { const today = new Date().toISOString().split('T')[0]; const todaysLogs = user.consumedHistory.filter(log => log.date === today); return todaysLogs.reduce((acc, log) => ({ calories: acc.calories + (log.meal.calories || 0), protein: acc.protein + (log.meal.protein || 0), carbs: acc.carbs + (log.meal.carbs || 0), fats: acc.fats + (log.meal.fats || 0) }), { calories: 0, protein: 0, carbs: 0, fats: 0 }); };
  
  const generateShoppingList = (): Record<string, string[]> => { if (!plan || !plan.days) return {}; const list: Record<string, string[]> = {}; const addItem = (name: string, amount: string) => { const dbItem = user.foodDatabase.find(f => f.name.toLowerCase() === name.toLowerCase() || getLocalizedFoodName(f.name).toLowerCase() === name.toLowerCase()); const categoryKey = dbItem?.category || 'Snacks'; const category = translations[user.language as keyof typeof translations]?.[categoryKey as any] as string || categoryKey; if (!list[category]) list[category] = []; const entry = `${name} (${amount})`; if (!list[category].includes(entry)) list[category].push(entry); }; plan.days.forEach(day => { ['breakfast', 'lunch', 'dinner', 'snack'].forEach(type => { const meals = day.meals[type as keyof typeof day.meals]; if (meals && meals.length > 0) meals[0].ingredients.forEach(ing => addItem(ing.item, ing.amount)); }); }); return list; };
  const connectWearable = (provider: WearableProvider) => { setTimeout(() => { setUser(prev => { const exists = prev.connectedDevices.includes(provider); return { ...prev, connectedDevices: exists ? prev.connectedDevices.filter(p => p !== provider) : [...prev.connectedDevices, provider] } }); }, 1000); };
  const syncHealthData = async () => { 
      return new Promise<void>((resolve) => { 
          setTimeout(() => { 
              const randomSteps = Math.floor(Math.random() * 5000) + 4000; 
              const randomSleep = Math.floor(Math.random() * 4) + 4.5; 
              const activeCals = Math.floor(randomSteps * 0.04); 
              
              setUser(prev => { 
                  const agilityXP = Math.floor(randomSteps / 100); 
                  const manaXP = Math.floor(randomSleep * 20); 
                  let rpg = { ...prev.rpgStats }; 
                  rpg.attributes.agility = updateAttribute(rpg.attributes.agility, agilityXP); 
                  rpg.attributes.mana = updateAttribute(rpg.attributes.mana, manaXP); 
                  rpg = checkLevelUp(rpg, agilityXP + manaXP); 

                  const newDailyStats: HealthStats = { 
                      date: new Date().toISOString().split('T')[0], 
                      steps: randomSteps, 
                      sleepHours: parseFloat(randomSleep.toFixed(1)), 
                      sleepQuality: randomSleep > 7 ? 'Excellent' : randomSleep > 6 ? 'Good' : 'Poor', 
                      activeCalories: activeCals, 
                      lastSynced: Date.now() 
                  };

                  // Update History
                  const history = [...(prev.healthHistory || [])];
                  const idx = history.findIndex(h => h.date === newDailyStats.date);
                  if (idx >= 0) history[idx] = newDailyStats;
                  else history.push(newDailyStats);

                  return { 
                      ...prev, 
                      dailyStats: newDailyStats, 
                      healthHistory: history,
                      rpgStats: rpg 
                  }; 
              }); 
              resolve(); 
          }, 2000); 
      }); 
  };
  const addProgressPhoto = (photoData: string) => { setUser(prev => ({ ...prev, progressPhotos: [...(prev.progressPhotos || []), { id: Date.now().toString(), date: new Date().toISOString(), data: photoData, weight: prev.weight }] })); };
  
  const calculateFoodEfficiency = (sortBy: 'protein' | 'calories'): FoodEfficiency[] => {
      return user.foodDatabase.map(item => {
          // Normalize unit to roughly 100g equivalent for price calc
          let weightInGrams = 1000; // default for kg/liter
          if (item.unit === 'pack') weightInGrams = 500;
          if (item.unit === 'piece') weightInGrams = 150;
          
          const costPer100gProduct = item.price / (weightInGrams / 100);
          const costPerGramProtein = item.proteinPer100g > 0 ? costPer100gProduct / item.proteinPer100g : 999;
          const costPer100kcal = item.caloriesPer100g > 0 ? costPer100gProduct / (item.caloriesPer100g / 100) : 999;
          return { item, costPerGramProtein, costPer100kcal };
      }).sort((a, b) => {
          if (sortBy === 'protein') return a.costPerGramProtein - b.costPerGramProtein;
          return a.costPer100kcal - b.costPer100kcal;
      });
  };

  const activateDamageControl = () => {
      const expiry = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 Days
      setUser(prev => ({ ...prev, specialMode: 'DamageControl', damageControlExpiry: expiry }));
  };

  const activateTravelMode = (isActive: boolean) => {
      setUser(prev => ({ ...prev, specialMode: isActive ? 'Travel' : 'Standard' }));
  };

  const analyzeActivity = async (activity: string, duration: string) => {
      return await analyzeActivityLog(activity, duration, user);
  };

  const logManualActivity = (calories: number) => {
      setUser(prev => {
          const agilityXP = Math.floor(calories / 10); // 10 XP per 100 kcal
          let rpg = { ...prev.rpgStats };
          rpg.attributes.agility = updateAttribute(rpg.attributes.agility, agilityXP);
          rpg = checkLevelUp(rpg, agilityXP);
          
          return { 
              ...prev, 
              dailyStats: {
                  ...prev.dailyStats,
                  activeCalories: (prev.dailyStats.activeCalories || 0) + calories
              },
              points: prev.points + 20,
              rpgStats: rpg
          }; 
      });
  };

  const t = (key: any): string => { 
      const lang = user.language; 
      const dict = (translations as any)[lang];
      return dict?.[key] || (translations as any)['en'][key] || key; 
  };
  
  const getLocalizedFoodName = (name: string): string => {
      const lang = user.language;
      const dict = (translations as any)[lang];
      if (dict && dict[name]) return dict[name];
      if (translations['en'][name as keyof typeof translations['en']]) return translations['en'][name as keyof typeof translations['en']] as string;
      return name;
  };

  const getFoodImage = (name: string): string => {
      const item = user.foodDatabase.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (item && item.image) return item.image;
      
      const lower = name.toLowerCase();
      if (lower.includes('egg')) return '🥚';
      if (lower.includes('chicken') || lower.includes('poulet') || lower.includes('دجاج')) return '🍗';
      if (lower.includes('meat') || lower.includes('beef') || lower.includes('steak') || lower.includes('لحم')) return '🥩';
      if (lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna') || lower.includes('سمك')) return '🐟';
      if (lower.includes('apple') || lower.includes('pomme') || lower.includes('تفاح')) return '🍎';
      if (lower.includes('banana') || lower.includes('موز')) return '🍌';
      if (lower.includes('rice') || lower.includes('riz') || lower.includes('أرز')) return '🍚';
      if (lower.includes('bread') || lower.includes('pain') || lower.includes('خبز')) return '🍞';
      if (lower.includes('milk') || lower.includes('lait') || lower.includes('حليب')) return '🥛';
      if (lower.includes('coffee') || lower.includes('café') || lower.includes('قهوة')) return '☕';
      return '🍽️';
  };

  const getNutrientData = (): NutrientInfo[] => {
      return NUTRIENTS_DATA.map(n => ({
          ...n,
          name: t(n.name.toLowerCase().replace(' ', '_')) === n.name.toLowerCase().replace(' ', '_') ? n.name : t(n.name.toLowerCase().replace(' ', '_')), 
          benefits: t('benefits') + ': ' + n.benefits, 
      }));
  };

  const updatePlanMeal = (dayIndex: number, mealType: 'breakfast'|'lunch'|'dinner'|'snack', optionIndex: number, updates: Partial<Meal>) => { 
      setPlanState(prev => { 
          if (!prev) return null; 
          const newDays = [...prev.days]; 
          if (!newDays[dayIndex]) return prev; 
          const currentMeals = newDays[dayIndex].meals;
          const meals = [...currentMeals[mealType]]; 
          if (meals[optionIndex]) { 
              meals[optionIndex] = { ...meals[optionIndex], ...updates }; 
              newDays[dayIndex] = { 
                  ...newDays[dayIndex], 
                  meals: { ...currentMeals, [mealType]: meals } 
              }; 
          } 
          return { ...prev, days: newDays }; 
      }); 
  };

  const updatePlanExercise = (dayIndex: number, exerciseIndex: number, updates: Partial<Exercise>) => { 
      setPlanState(prev => { 
          if (!prev) return null; 
          const newDays = [...prev.days]; 
          if (!newDays[dayIndex] || !newDays[dayIndex].workout) return prev; 
          const currentWorkout = newDays[dayIndex].workout!;
          const exercises = [...currentWorkout.exercises]; 
          if (exercises[exerciseIndex]) { 
              exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...updates }; 
              newDays[dayIndex] = { 
                  ...newDays[dayIndex], 
                  workout: { ...currentWorkout, exercises } 
              }; 
          } 
          return { ...prev, days: newDays }; 
      }); 
  };

  const hydrateMealDetail = async (dayIndex: number, mealType: 'breakfast'|'lunch'|'dinner'|'snack', optionIndex: number, meal: Meal) => { 
      const ingredients = meal.ingredients.map(i => `${i.amount} ${i.item}`).join(', '); 
      const details = await getMealRecipe(meal.name, ingredients, user); 
      if (details) updatePlanMeal(dayIndex, mealType, optionIndex, details); 
  };

  const hydrateExerciseDetail = async (dayIndex: number, exerciseIndex: number, exercise: Exercise) => { 
      const details = await getExerciseDetails(exercise.name, user); 
      if (details) updatePlanExercise(dayIndex, exerciseIndex, details); 
  };

  const analyzeLabelImage = async (base64: string): Promise<LabelAnalysis | null> => { 
      return await analyzeNutritionLabel(base64, user); 
  };

  return (
    <AppContext.Provider value={{
      user, plan, messages, isLoading, currentView,
      updateUser, updateFoodItem, addFoodItem, setPlan, addMessage, setLoading, navigate, resetApp,
      toggleFavoriteMeal, toggleFavoriteWorkout, analyzeUserSymptoms, toggleFoodAvailability, logConsumedMeal, analyzeCustomMeal,
      getDailyNutrition, t, getLocalizedFoodName, getNutrientData, updatePlanMeal, updatePlanExercise,
      hydrateMealDetail, hydrateExerciseDetail, generateShoppingList, connectWearable, syncHealthData, addProgressPhoto, analyzeLabelImage, refreshFoodPrices, calculateFoodEfficiency,
      activateDamageControl, activateTravelMode, getFoodImage, analyzeActivity, logManualActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};
