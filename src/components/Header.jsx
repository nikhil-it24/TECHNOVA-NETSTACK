import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Radio, 
  ShieldCheck, 
  ChevronDown, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

const Header = ({ title = 'Enterprise Dashboard', onSearch }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, type: 'success', text: 'Root Bridge SW-CORE-01 verified stable', time: '2m ago' },
    { id: 2, type: 'warning', text: 'Redundant link SW-ACC-04 Port Gi0/2 blocked', time: '8m ago' },
    { id: 3, type: 'info', text: 'AI Loop Prediction scan completed (99.2% accuracy)', time: '15m ago' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#080d1e]/80 backdrop-blur-xl border-b border-[#00D4FF]/20 px-6 py-3.5 flex items-center justify-between">
      {/* Search & Location Title */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#00D4FF]">
          <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
          <span className="font-bold tracking-wider text-slate-200">LOCATION:</span>
          <span className="px-2 py-0.5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF]">
            ENTERPRISE NETWORK (HQ-NYC)
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Network (Switch IP, VLAN ID, MAC, Port)..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-[#0d1527]/90 border border-[#00D4FF]/25 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all font-mono"
          />
        </div>
      </div>

      {/* Right Tools & Status Ticker */}
      <div className="flex items-center gap-4">
        {/* Live Network Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1527]/90 border border-[#00FF88]/30 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-[#00FF88] font-bold">LIVE MONITORED</span>
        </div>

        {/* Live UTC Clock */}
        <div className="hidden font-mono text-xs text-slate-400 xl:block bg-[#0d1527]/60 px-3 py-1.5 rounded-xl border border-[#00D4FF]/15">
          {currentTime}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-[#0d1527] border border-[#00D4FF]/25 text-slate-300 hover:text-[#00D4FF] hover:border-[#00D4FF] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4D6D] border border-[#050816] animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0a1020] border border-[#00D4FF]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 z-50 text-xs space-y-3 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-[#00D4FF]/20 pb-2">
                <span className="font-heading font-bold text-white tracking-wider">SYSTEM NOTIFICATIONS</span>
                <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#0d1527] border border-[#00D4FF]/15 flex items-start gap-2.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#FFB703] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="text-slate-200">{n.text}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#00D4FF]/20">
          <div className="w-9 h-9 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/80 flex items-center justify-center text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.35)] shrink-0">
            <User className="w-5 h-5 text-[#00D4FF]" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-extrabold text-slate-100 font-heading leading-tight tracking-wide">NETSTACK</div>
            <div className="text-xs font-mono text-[#00D4FF] font-medium">L2 Security Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
