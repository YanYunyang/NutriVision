import React from 'react';
import { useNutrition } from '../store/NutritionContext';
import { User, Settings, Activity, Target, ChevronRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, qwenApiKey, updateQwenApiKey } = useNutrition();

  const dietModeMap = { balanced: '均衡饮食', keto: '生酮饮食', high_protein: '高蛋白饮食', mediterranean: '地中海饮食' };
  const activityMap = { sedentary: '久坐少动', light: '轻度活动', moderate: '中度活动', active: '高度活动', very_active: '极度活动' };
  const goalMap = { lose: '减脂', maintain: '保持', gain: '增肌' };

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden shrink-0">
          <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23bbf7d0'/%3E%3Crect x='2' y='5' width='3' height='4' fill='%2378350f'/%3E%3Crect x='11' y='5' width='3' height='4' fill='%2378350f'/%3E%3Crect x='3' y='6' width='1' height='2' fill='%23fde68a'/%3E%3Crect x='12' y='6' width='1' height='2' fill='%23fde68a'/%3E%3Crect x='4' y='3' width='8' height='8' fill='%2378350f'/%3E%3Crect x='5' y='5' width='6' height='6' fill='%23fde68a'/%3E%3Crect x='4' y='7' width='8' height='4' fill='%23fde68a'/%3E%3Crect x='5' y='6' width='2' height='2' fill='%23000'/%3E%3Crect x='9' y='6' width='2' height='2' fill='%23000'/%3E%3Crect x='5' y='6' width='1' height='1' fill='%23fff'/%3E%3Crect x='9' y='6' width='1' height='1' fill='%23fff'/%3E%3Crect x='7' y='8' width='2' height='1' fill='%23d97706'/%3E%3Crect x='4' y='11' width='8' height='5' fill='%2378350f'/%3E%3Crect x='5' y='12' width='6' height='4' fill='%23fde68a'/%3E%3Crect x='7' y='9' width='5' height='2' fill='%23facc15'/%3E%3Crect x='10' y='7' width='3' height='2' fill='%23facc15'/%3E%3Crect x='11' y='5' width='2' height='2' fill='%23facc15'/%3E%3Crect x='8' y='10' width='3' height='3' fill='%2378350f'/%3E%3C/svg%3E" alt="User" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">小猴子</h1>
          <p className="text-sm text-slate-500 font-medium">免费版</p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<User size={20} />} 
          label="年龄" 
          value={profile.age} 
          unit="岁"
          type="number"
          onChange={(v) => updateProfile({ age: v })}
        />
        <StatCard 
          icon={<Activity size={20} />} 
          label="体重" 
          value={profile.weight} 
          unit="kg"
          type="number"
          onChange={(v) => updateProfile({ weight: v })}
        />
        <StatCard 
          icon={<Target size={20} />} 
          label="身高" 
          value={profile.height} 
          unit="cm"
          type="number"
          onChange={(v) => updateProfile({ height: v })}
        />
        <StatCard 
          icon={<User size={20} />} 
          label="性别" 
          value={profile.gender} 
          type="select"
          options={[{label: '男', value: 'male'}, {label: '女', value: 'female'}]}
          onChange={(v) => updateProfile({ gender: v })}
        />
      </section>

      {/* Settings List */}
      <section className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
        <SettingItem 
          title="饮食模式" 
          value={dietModeMap[profile.dietMode]} 
          onClick={() => {
            const modes = ['balanced', 'keto', 'high_protein', 'mediterranean'];
            const next = modes[(modes.indexOf(profile.dietMode) + 1) % modes.length];
            updateProfile({ dietMode: next as any });
          }}
        />
        <SettingItem 
          title="活动强度" 
          value={activityMap[profile.activityLevel]} 
          onClick={() => {
            const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
            const next = levels[(levels.indexOf(profile.activityLevel) + 1) % levels.length];
            updateProfile({ activityLevel: next as any });
          }}
        />
        <SettingItem 
          title="目标" 
          value={goalMap[profile.goal]} 
          onClick={() => {
            const goals = ['lose', 'maintain', 'gain'];
            const next = goals[(goals.indexOf(profile.goal) + 1) % goals.length];
            updateProfile({ goal: next as any });
          }}
        />
      </section>

      {/* API Key Config */}
      <section className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-bold text-slate-800">API 配置</h2>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">通义千问 API Key</label>
          <input
            type="password"
            value={qwenApiKey}
            onChange={(e) => updateQwenApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">用于驱动 AI 视觉识别模块 (需支持 qwen-vl-max)</p>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  unit?: string;
  type?: 'number' | 'select';
  options?: {label: string, value: string}[];
  onChange?: (val: any) => void;
  className?: string 
}> = ({ icon, label, value, unit, type, options, onChange, className }) => (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
    <div className="text-mint-500 bg-mint-50 w-8 h-8 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className={`flex items-baseline gap-1 text-lg font-bold text-slate-800 ${className}`}>
        {type === 'number' ? (
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange?.(Number(e.target.value))} 
            className="w-12 bg-transparent border-b border-dashed border-slate-300 focus:border-mint-500 focus:outline-none text-center p-0 m-0"
          />
        ) : type === 'select' ? (
          <select 
            value={value} 
            onChange={(e) => onChange?.(e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-300 focus:border-mint-500 focus:outline-none p-0 m-0 appearance-none cursor-pointer"
          >
            {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : (
          <span>{value}</span>
        )}
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>
    </div>
  </div>
);

const SettingItem: React.FC<{ title: string; value: string; onClick: () => void }> = ({ title, value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-2xl group"
  >
    <span className="font-semibold text-slate-700">{title}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-400 capitalize">{value}</span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-mint-500 transition-colors" />
    </div>
  </button>
);
