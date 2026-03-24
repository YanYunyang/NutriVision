import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Camera, BarChart2, Compass, User } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#F4F7F6] text-slate-800 font-sans overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <NavItem to="/" icon={<Home size={24} />} label="首页" />
        <NavItem to="/insights" icon={<BarChart2 size={24} />} label="分析" />
        
        <div className="relative -top-6">
          <NavLink
            to="/camera"
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-mint-500/30 transition-transform active:scale-95",
                isActive ? "bg-mint-600 text-white" : "bg-mint-500 text-white"
              )
            }
          >
            <Camera size={28} />
          </NavLink>
        </div>
        
        <NavItem to="/discover" icon={<Compass size={24} />} label="发现" />
        <NavItem to="/profile" icon={<User size={24} />} label="我的" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive ? "text-mint-600" : "text-slate-400 hover:text-slate-600"
        )
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
};
