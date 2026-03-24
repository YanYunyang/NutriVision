import React, { useState } from 'react';
import { useNutrition } from '../store/NutritionContext';
import { Droplet, Plus, Flame, Utensils, Zap, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const GENERIC_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop'
];

export const getGenericImage = (name: string) => {
  if (!name) return GENERIC_FOOD_IMAGES[0];
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GENERIC_FOOD_IMAGES[sum % GENERIC_FOOD_IMAGES.length];
};

const COMMON_FOODS = [
  { name: '米饭', calories: 130, carbs: 28, protein: 2.6, fat: 0.3, imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop' },
  { name: '鸡胸肉', calories: 165, carbs: 0, protein: 31, fat: 3.6, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop' },
  { name: '鸡蛋', calories: 155, carbs: 1.1, protein: 13, fat: 11, imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop' },
  { name: '苹果', calories: 52, carbs: 14, protein: 0.3, fat: 0.2, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=400&h=300&fit=crop' },
  { name: '全麦面包', calories: 247, carbs: 41, protein: 13, fat: 3.4, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
  { name: '牛奶', calories: 42, carbs: 5, protein: 3.4, fat: 1, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
  { name: '牛肉', calories: 250, carbs: 0, protein: 26, fat: 15, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
  { name: '西兰花', calories: 35, carbs: 7, protein: 2.4, fat: 0.4, imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop' },
];

export const Home: React.FC = () => {
  const { dailyGoal, consumed, logs, addWater, addLog } = useNutrition();
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [selectedFood, setSelectedFood] = useState<typeof COMMON_FOODS[0] | null>(null);
  const [manualForm, setManualForm] = useState({
    name: '',
    weight: 100,
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    mealType: 'Lunch' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  });

  const remainingCals = Math.max(0, dailyGoal.calories - consumed.calories);
  const calPercentage = Math.min(100, (consumed.calories / dailyGoal.calories) * 100);

  const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString());
  const displayedLogs = showAllLogs ? todayLogs : todayLogs.slice(0, 3);

  const handleSelectCommonFood = (food: typeof COMMON_FOODS[0]) => {
    setSelectedFood(food);
    setManualForm(prev => ({
      ...prev,
      name: food.name,
      calories: Math.round((food.calories * prev.weight) / 100),
      carbs: Math.round((food.carbs * prev.weight) / 100),
      protein: Math.round((food.protein * prev.weight) / 100),
      fat: Math.round((food.fat * prev.weight) / 100),
    }));
  };

  const handleWeightChange = (newWeight: number) => {
    setManualForm(prev => {
      const updates: any = { weight: newWeight };
      if (selectedFood) {
        updates.calories = Math.round((selectedFood.calories * newWeight) / 100);
        updates.carbs = Math.round((selectedFood.carbs * newWeight) / 100);
        updates.protein = Math.round((selectedFood.protein * newWeight) / 100);
        updates.fat = Math.round((selectedFood.fat * newWeight) / 100);
      }
      return { ...prev, ...updates };
    });
  };

  const handleNameChange = (newName: string) => {
    setSelectedFood(null);
    setManualForm(prev => ({ ...prev, name: newName }));
  };

  const handleManualSubmit = () => {
    if (!manualForm.name) return;
    const imageUrl = selectedFood ? selectedFood.imageUrl : getGenericImage(manualForm.name);
    addLog({
      name: manualForm.name,
      weight: manualForm.weight,
      calories: manualForm.calories,
      carbs: manualForm.carbs,
      protein: manualForm.protein,
      fat: manualForm.fat,
      mealType: manualForm.mealType,
      imageUrl
    });
    setShowManualAdd(false);
    setManualForm({ name: '', weight: 100, calories: 0, carbs: 0, protein: 0, fat: 0, mealType: 'Lunch' });
    setSelectedFood(null);
  };

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">今日</h1>
          <p className="text-sm text-slate-500 font-medium">{format(new Date(), 'MM月dd日 EEEE', { locale: zhCN })}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
          <img src="https://picsum.photos/seed/user/100/100" alt="User" />
        </div>
      </header>

      {/* Macros */}
      <section className="space-y-4">
        <MacroBar label="热量" consumed={consumed.calories} goal={dailyGoal.calories} color="bg-mint-500" unit="千卡" />
        <div className="grid grid-cols-3 gap-4">
          <MacroBar label="碳水" consumed={consumed.carbs} goal={dailyGoal.carbs} color="bg-coral-500" />
          <MacroBar label="蛋白质" consumed={consumed.protein} goal={dailyGoal.protein} color="bg-sky-500" />
          <MacroBar label="脂肪" consumed={consumed.fat} goal={dailyGoal.fat} color="bg-lemon-500" />
        </div>
      </section>

      {/* Water Tracker */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Droplet size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">饮水</h3>
            <p className="text-sm text-slate-500">{consumed.water} / {dailyGoal.water} ml</p>
          </div>
        </div>
        <button 
          onClick={() => addWater(250)}
          className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95"
        >
          <Plus size={20} />
        </button>
      </section>

      {/* Recent Meals */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold text-slate-900">今日饮食</h2>
          <div className="flex gap-3">
            <button onClick={() => setShowManualAdd(true)} className="text-sm font-medium text-slate-500 hover:text-slate-700">手动添加</button>
            <button onClick={() => setShowAllLogs(!showAllLogs)} className="text-sm font-medium text-mint-600">
              {showAllLogs ? '收起' : '查看全部'}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {displayedLogs.map(log => {
            const mealTypeMap: Record<string, string> = { Breakfast: '早餐', Lunch: '午餐', Dinner: '晚餐', Snack: '加餐' };
            const isBadImage = !log.imageUrl || log.imageUrl.includes('picsum.photos') || log.imageUrl.includes('dicebear.com');
            const imageUrl = isBadImage ? getGenericImage(log.name) : log.imageUrl;
            return (
            <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 items-center">
              <img src={imageUrl} alt={log.name} className="w-16 h-16 rounded-xl object-cover bg-slate-50" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 truncate">{log.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{mealTypeMap[log.mealType] || log.mealType} • {log.weight}g</p>
                <div className="flex gap-3 mt-2 text-[10px] font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Flame size={12} className="text-coral-500"/> {log.calories} 千卡</span>
                  <span className="flex items-center gap-1"><Zap size={12} className="text-sky-500"/> {log.protein}g 蛋白质</span>
                </div>
              </div>
            </div>
          )})}
        </div>
      </section>

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-slate-900">手动添加饮食</h2>
              <button onClick={() => setShowManualAdd(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block">常见食物 (每100g)</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_FOODS.map(food => (
                    <button
                      key={food.name}
                      onClick={() => handleSelectCommonFood(food)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                        selectedFood?.name === food.name 
                          ? "bg-mint-50 border-mint-200 text-mint-700" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">食物名称</label>
                <input type="text" value={manualForm.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" placeholder="例如：苹果" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">重量 (g)</label>
                  <input type="number" value={manualForm.weight || ''} onChange={e => handleWeightChange(Number(e.target.value))} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">卡路里 (kcal)</label>
                  <input type="number" value={manualForm.calories || ''} onChange={e => setManualForm({...manualForm, calories: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">碳水 (g)</label>
                  <input type="number" value={manualForm.carbs || ''} onChange={e => setManualForm({...manualForm, carbs: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">蛋白质 (g)</label>
                  <input type="number" value={manualForm.protein || ''} onChange={e => setManualForm({...manualForm, protein: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">脂肪 (g)</label>
                  <input type="number" value={manualForm.fat || ''} onChange={e => setManualForm({...manualForm, fat: Number(e.target.value)})} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">餐别</label>
                  <select value={manualForm.mealType} onChange={e => setManualForm({...manualForm, mealType: e.target.value as any})} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500">
                    <option value="Breakfast">早餐</option>
                    <option value="Lunch">午餐</option>
                    <option value="Dinner">晚餐</option>
                    <option value="Snack">加餐</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-2">
              <button onClick={() => setShowManualAdd(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors">取消</button>
              <button onClick={handleManualSubmit} className="flex-1 py-3 rounded-xl bg-mint-500 text-white font-semibold hover:bg-mint-600 transition-colors">添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroBar: React.FC<{ label: string; consumed: number; goal: number; color: string; unit?: string }> = ({ label, consumed, goal, color, unit = 'g' }) => {
  const percentage = Math.min(100, (consumed / goal) * 100);
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</span>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-800">{consumed}<span className="text-xs font-medium text-slate-400">/{goal}{unit}</span></span>
    </div>
  );
};
