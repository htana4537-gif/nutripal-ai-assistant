
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum Goal {
  LoseWeight = 'Lose Weight',
  BuildMuscle = 'Build Muscle',
  Maintain = 'Maintain',
  Endurance = 'Improve Endurance'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active'
}

export type Language = 'en' | 'ar' | 'fr' | 'es';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'EGP';

export type WearableProvider = 'Apple Health' | 'Google Fit' | 'Garmin';

export interface HealthStats {
  date: string;
  steps: number;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  activeCalories: number; // Burned via exercise/movement
  lastSynced: number;
}

export interface ProgressPhoto {
  id: string;
  date: string; // ISO String
  data: string; // Base64
  weight?: number;
}

export interface Ingredient {
  item: string;
  amount: string;
  isBudgetFriendly?: boolean;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  // Recipe Details
  description: string;
  steps: string[];
  prepTime: string;
  cookingTime: string;
  tips: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
  // Detailed Instructions
  targetMuscles: string[];
  instructions: string[];
  benefits: string;
}

export interface WorkoutRoutine {
  focus: string;
  exercises: Exercise[];
  durationMin: number;
}

export type FoodCategory = 'Vegetables' | 'Fruits' | 'Proteins' | 'Carbs' | 'Dairy' | 'Fats' | 'Beverages' | 'Snacks';

export interface FoodItem {
  id: string;
  name: string; // This will now serve as the translation key
  category: FoodCategory;
  price: number;
  unit: 'kg' | 'piece' | 'liter' | 'pack';
  preference: number; // 0-10
  isAvailable: boolean; // Inventory status
  image: string; // Emoji or URL
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
}

export interface FoodEfficiency {
    item: FoodItem;
    costPerGramProtein: number;
    costPer100kcal: number;
}

export interface NutrientDeficiency {
  nutrient: string;
  detectedAt: number;
  symptoms: string;
}

export interface ConsumedLog {
  id: string;
  date: string; // YYYY-MM-DD
  meal: Meal;
  timestamp: number;
  sugarSpoons?: number;
  additives?: string;
}

export interface RPGAttribute {
    level: number;
    xp: number;
    maxXP: number; // XP needed for next level
}

export interface RPGStats {
    level: number;
    currentXP: number;
    nextLevelXP: number;
    title: string;
    attributes: {
        strength: RPGAttribute;   // Protein
        endurance: RPGAttribute;  // Carbs
        agility: RPGAttribute;    // Steps / Activity
        intelligence: RPGAttribute; // Fats (Brain Food)
        mana: RPGAttribute;       // Sleep / Recovery
    };
}

export type SpecialMode = 'Standard' | 'DamageControl' | 'Travel';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryRestrictions: string[];
  budgetMode: boolean; // Economic mode
  language: Language;
  currency: Currency;
  country: string; // New field for location-based pricing
  onboarded: boolean;
  points: number; // Gamification
  streak: number;
  favoriteMeals: Meal[];
  favoriteWorkouts: WorkoutRoutine[];
  foodDatabase: FoodItem[];
  deficiencies: NutrientDeficiency[];
  // New Targets
  targetMealsPerDay: number;
  targetWaterPerDay: number; // Liters
  consumedHistory: ConsumedLog[];
  // Wearables & Health
  connectedDevices: WearableProvider[];
  dailyStats: HealthStats;
  healthHistory: HealthStats[]; // Added for statistics
  progressPhotos: ProgressPhoto[];
  // RPG
  rpgStats: RPGStats;
  lastPriceUpdate: number; // Timestamp for daily updates
  // Special Modes
  specialMode: SpecialMode;
  damageControlExpiry?: number;
  travelConfig?: {
      isActive: boolean;
      destinationTimezone?: string;
  };
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachment?: Attachment;
  timestamp: number;
  isThinking?: boolean;
}

export interface DailyPlan {
  day: string;
  meals: {
    breakfast: Meal[]; // Array for options
    lunch: Meal[];
    dinner: Meal[];
    snack: Meal[];
  };
  workout?: WorkoutRoutine;
}

export interface WeeklyPlan {
  generatedAt: number;
  days: DailyPlan[];
}

export interface NutrientInfo {
  id: string;
  name: string;
  type: 'Vitamin' | 'Mineral';
  benefits: string;
  deficiencySymptoms: string;
  toxicity: string;
  sources: string[];
  recommendedIntake: string;
  interactions: string;
}

// Label Decoder Types
export interface HarmfulIngredient {
    name: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    description: string; // "Preservative linked to..."
}

export interface MarketingTruth {
    claim: string; // "Light"
    reality: string; // "High sugar content to compensate fat reduction"
}

export interface LabelAnalysis {
    score: number; // 0-10 Health Score
    verdict: 'Safe' | 'Caution' | 'Avoid';
    summary: string;
    harmfulIngredients: HarmfulIngredient[];
    marketingAnalysis: MarketingTruth[];
}
