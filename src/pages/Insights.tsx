import React from 'react';
import { useNutrition } from '../store/NutritionContext';
import { TrendingUp, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const Insights: React.FC = () => {
  const { profile, dailyGoal, consumed } = useNutrition();

  // Mock historical data for the chart
  const history = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'EEE', { locale: zhCN }),
    calories: Math.floor(Math.random() * 500) + 1800,
    goal: dailyGoal.calories,
  }));

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">分析</h1>
        <p className="text-sm text-slate-500 font-medium">周报分析</p>
      </header>

      {/* AI Summary Card */}
      <section className="bg-gradient-to-br from-mint-50 to-sky-50 rounded-3xl p-6 border border-mint-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mint-200/20 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-mint-600 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">AI 饮食报告</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              您本周的蛋白质摄入表现很好，但膳食纤维摄入持续偏低。建议在晚餐中增加更多根茎类蔬菜或豆类。
            </p>
          </div>
        </div>
      </section>

      {/* Trend Chart (Mocked with CSS for simplicity) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">卡路里趋势</h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex items-end gap-2">
          {history.map((day, i) => {
            const height = (day.calories / 3000) * 100;
            const isToday = i === 6;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative h-full flex items-end justify-center">
                  {/* Goal Line Indicator */}
                  <div className="absolute top-[40%] w-full h-[1px] bg-slate-200 border-t border-dashed border-slate-300 z-0" />
                  
                  <div 
                    className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 relative z-10 ${isToday ? 'bg-mint-500' : 'bg-slate-200 group-hover:bg-slate-300'}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-mint-600' : 'text-slate-400'}`}>{day.date}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Micro-Nutrients */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">微量元素</h2>
        <div className="grid grid-cols-2 gap-4">
          <MicroCard label="膳食纤维" value="12g" target="25g" status="low" />
          <MicroCard label="钠" value="1.2g" target="2.3g" status="good" />
          <MicroCard label="糖分" value="45g" target="50g" status="warning" />
          <MicroCard label="维生素C" value="80mg" target="90mg" status="good" />
        </div>
      </section>
    </div>
  );
};

const MicroCard: React.FC<{ label: string; value: string; target: string; status: 'good' | 'warning' | 'low' }> = ({ label, value, target, status }) => {
  const statusColors = {
    good: 'text-mint-500 bg-mint-50',
    warning: 'text-coral-500 bg-coral-50',
    low: 'text-sky-500 bg-sky-50',
  };
  
  const StatusIcon = status === 'good' ? CheckCircle2 : AlertCircle;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <div className={`p-1.5 rounded-lg ${statusColors[status]}`}>
          <StatusIcon size={16} />
        </div>
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-400 font-medium mt-0.5">目标: {target}</div>
      </div>
    </div>
  );
};
