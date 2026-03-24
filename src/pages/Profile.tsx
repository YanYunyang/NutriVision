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
        <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden">
          <img src="https://picsum.photos/seed/user/100/100" alt="User" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">用户</h1>
          <p className="text-sm text-slate-500 font-medium">免费版</p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard icon={<User size={20} />} label="年龄" value={`${profile.age} 岁`} />
        <StatCard icon={<Activity size={20} />} label="体重" value={`${profile.weight} kg`} />
        <StatCard icon={<Target size={20} />} label="身高" value={`${profile.height} cm`} />
        <StatCard icon={<Settings size={20} />} label="目标" value={goalMap[profile.goal]} className="capitalize" />
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

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; className?: string }> = ({ icon, label, value, className }) => (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
    <div className="text-mint-500 bg-mint-50 w-8 h-8 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className={`text-lg font-bold text-slate-800 ${className}`}>{value}</div>
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
