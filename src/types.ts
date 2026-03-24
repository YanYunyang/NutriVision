export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface FoodItem extends NutritionData {
  id: string;
  name: string;
  weight: number; // in grams
  mealType: MealType;
  timestamp: string;
  imageUrl?: string;
  breakdown?: { name: string; percentage: number; weight: number }[];
}

export interface DailyGoal extends NutritionData {
  water: number; // in ml
}

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  dietMode: 'balanced' | 'keto' | 'high_protein' | 'mediterranean';
}
