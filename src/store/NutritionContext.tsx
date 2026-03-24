import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, DailyGoal, UserProfile } from '../types';

interface NutritionState {
  profile: UserProfile;
  dailyGoal: DailyGoal;
  consumed: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    water: number;
  };
  logs: FoodItem[];
  qwenApiKey: string;
  addLog: (item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  addWater: (amount: number) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateQwenApiKey: (key: string) => void;
}

const defaultProfile: UserProfile = {
  gender: 'female',
  age: 28,
  height: 165,
  weight: 60,
  activityLevel: 'moderate',
  goal: 'maintain',
  dietMode: 'balanced',
};

const calculateGoals = (profile: UserProfile): DailyGoal => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr += profile.gender === 'male' ? 5 : -161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let tdee = bmr * activityMultipliers[profile.activityLevel];

  if (profile.goal === 'lose') tdee -= 500;
  if (profile.goal === 'gain') tdee += 500;

  const calories = Math.round(tdee);
  
  // Default balanced: 50% carbs, 20% protein, 30% fat
  let carbRatio = 0.5;
  let proteinRatio = 0.2;
  let fatRatio = 0.3;

  if (profile.dietMode === 'keto') {
    carbRatio = 0.05; proteinRatio = 0.25; fatRatio = 0.7;
  } else if (profile.dietMode === 'high_protein') {
    carbRatio = 0.4; proteinRatio = 0.35; fatRatio = 0.25;
  } else if (profile.dietMode === 'mediterranean') {
    carbRatio = 0.45; proteinRatio = 0.2; fatRatio = 0.35;
  }

  return {
    calories,
    carbs: Math.round((calories * carbRatio) / 4),
    protein: Math.round((calories * proteinRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
    water: 2500, // ml
  };
};

const NutritionContext = createContext<NutritionState | undefined>(undefined);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(calculateGoals(profile));
  const [logs, setLogs] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('logs');
    if (saved) {
      const parsed: FoodItem[] = JSON.parse(saved);
      const now = Date.now();
      return parsed.filter(log => now - new Date(log.timestamp).getTime() < THIRTY_DAYS_MS);
    }
    return [
      {
        id: '1',
        name: '牛油果煎蛋吐司',
        weight: 250,
        mealType: 'Breakfast',
        timestamp: new Date().toISOString(),
        calories: 350,
        carbs: 30,
        protein: 15,
        fat: 20,
        imageUrl: 'https://images.unsplash.com/photo-1484723091791-00d759ce4342?w=400&h=300&fit=crop',
      }
    ];
  });
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('water');
    const savedDate = localStorage.getItem('waterDate');
    const today = new Date().toDateString();
    if (saved && savedDate === today) {
      return parseInt(saved, 10);
    }
    return 0;
  });
  const [qwenApiKey, setQwenApiKey] = useState(localStorage.getItem('qwenApiKey') || '');

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
    setDailyGoal(calculateGoals(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('water', water.toString());
    localStorage.setItem('waterDate', new Date().toDateString());
  }, [water]);

  const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString());

  const consumed = {
    calories: todayLogs.reduce((sum, log) => sum + log.calories, 0),
    carbs: todayLogs.reduce((sum, log) => sum + log.carbs, 0),
    protein: todayLogs.reduce((sum, log) => sum + log.protein, 0),
    fat: todayLogs.reduce((sum, log) => sum + log.fat, 0),
    water,
  };

  const addLog = (item: Omit<FoodItem, 'id' | 'timestamp'>) => {
    const newLog: FoodItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addWater = (amount: number) => {
    setWater(prev => Math.min(prev + amount, dailyGoal.water));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const updateQwenApiKey = (key: string) => {
    setQwenApiKey(key);
    localStorage.setItem('qwenApiKey', key);
  };

  return (
    <NutritionContext.Provider value={{ profile, dailyGoal, consumed, logs, qwenApiKey, addLog, addWater, updateProfile, updateQwenApiKey }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) throw new Error('useNutrition must be used within NutritionProvider');
  return context;
};
