import React from 'react';
import { useNutrition } from '../store/NutritionContext';
import { Search, MapPin, Star, Clock, Flame } from 'lucide-react';

export const Discover: React.FC = () => {
  const { dailyGoal, consumed } = useNutrition();
  
  const remainingProtein = Math.max(0, dailyGoal.protein - consumed.protein);
  const remainingCarbs = Math.max(0, dailyGoal.carbs - consumed.carbs);

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">发现</h1>
        <p className="text-sm text-slate-500 font-medium">智能推荐</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="搜索食物或餐厅..." 
          className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-mint-500/50 transition-all font-medium text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* AI Gap Fillers */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold text-slate-900">营养补漏</h2>
          <span className="text-xs font-semibold text-sky-500 bg-sky-50 px-2 py-1 rounded-lg">还需 {remainingProtein}g 蛋白质</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
          <FoodCard 
            title="香煎三文鱼" 
            calories={280} 
            protein={35} 
            time="20 分钟" 
            icon="🍣" 
          />
          <FoodCard 
            title="希腊酸奶碗" 
            calories={150} 
            protein={20} 
            time="5 分钟" 
            icon="🥣" 
          />
          <FoodCard 
            title="水煮毛豆" 
            calories={120} 
            protein={11} 
            time="10 分钟" 
            icon="🫛" 
          />
        </div>
      </section>

      {/* Restaurant Assistant */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin size={20} className="text-coral-500" /> 附近餐厅
        </h2>
        
        <div className="space-y-4">
          <RestaurantCard 
            name="Sweetgreen" 
            distance="0.3 英里" 
            rating={4.8} 
            recommendation="丰收沙拉碗（去面包）" 
            match="95%" 
            icon="🥗" 
          />
          <RestaurantCard 
            name="Chipotle" 
            distance="0.5 英里" 
            rating={4.5} 
            recommendation="鸡肉沙拉碗" 
            match="88%" 
            icon="🌯" 
          />
        </div>
      </section>
    </div>
  );
};

const FoodCard: React.FC<{ title: string; calories: number; protein: number; time: string; icon: string }> = ({ title, calories, protein, time, icon }) => (
  <div className="min-w-[200px] bg-white rounded-3xl p-3 shadow-sm border border-slate-100 snap-start shrink-0 group hover:shadow-md transition-all">
    <div className="relative h-32 rounded-2xl overflow-hidden mb-3 bg-slate-50 flex items-center justify-center text-6xl">
      <div className="group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1">
        <Flame size={12} className="text-coral-500" /> {calories}
      </div>
    </div>
    <h3 className="font-bold text-slate-800 truncate mb-1">{title}</h3>
    <div className="flex justify-between items-center text-xs font-medium text-slate-500">
      <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md">{protein}g 蛋白质</span>
      <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
    </div>
  </div>
);

const RestaurantCard: React.FC<{ name: string; distance: string; rating: number; recommendation: string; match: string; icon: string }> = ({ name, distance, rating, recommendation, match, icon }) => (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 items-center group hover:shadow-md transition-all cursor-pointer">
    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition-transform duration-300">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-slate-800 truncate">{name}</h3>
        <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
          <Star size={12} fill="currentColor" /> {rating}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2">距离 {distance}</p>
      <div className="bg-mint-50 rounded-xl p-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-mint-700 truncate pr-2">💡 {recommendation}</span>
        <span className="text-xs font-bold text-white bg-mint-500 px-2 py-1 rounded-lg shrink-0">{match} 匹配</span>
      </div>
    </div>
  </div>
);
