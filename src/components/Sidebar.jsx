import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Network, 
  Zap, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  Settings, 
  LogOut,
  ShieldAlert,
  Activity
} from 'lucide-react';

const Sidebar = ({ currentTab, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Configuration', icon: UploadCloud },
    { id: 'topology', label: 'Network Topology', icon: Network },
    { id: 'simulation', label: 'STP Simulation', icon: Zap },
    { id: 'risk', label: 'Loop Risk Analysis', icon: AlertTriangle },
    { id: 'ai', label: 'AI Recommendation', icon: Cpu },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#080d1e]/90 border-r border-[#00D4FF]/20 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-40 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('landing')}
        className="p-5 border-b border-[#00D4FF]/15 flex items-center gap-3.5 cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00A2FF] via-[#00D4FF] to-[#7B2CBF] p-[1.5px] shadow-[0_0_18px_rgba(0,212,255,0.4)] group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-[#0099FF] to-[#7928CA] rounded-[14px] flex items-center justify-center text-white">
            <ShieldAlert className="w-7 h-7 text-white stroke-[2]" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-heading font-extrabold text-base text-white tracking-wider leading-none">
            STP
          </div>
          <div className="font-heading font-extrabold text-base text-white tracking-wider leading-tight">
            WORKFLOW
          </div>
          <div className="text-[9px] font-mono font-semibold text-[#00D4FF] tracking-wider uppercase mt-0.5">
            ENTERPRISE L2 AI
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Navigation Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00D4FF]/20 to-[#00D4FF]/5 text-[#00D4FF] border border-[#00D4FF]/40 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#00D4FF]/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00D4FF]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Network Quick Status Card */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-[#0d1527]/80 border border-[#00D4FF]/20 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
          <span>SYSTEM HEALTH</span>
          <span className="text-[#00FF88] font-bold">96.4%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] rounded-full w-[96.4%]" />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#00D4FF] animate-pulse" />
            42 Switches
          </span>
          <span className="text-[#00FF88]">STP Stable</span>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-[#00D4FF]/15">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Logout / Exit</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
