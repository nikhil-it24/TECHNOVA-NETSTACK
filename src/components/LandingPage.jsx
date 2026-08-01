import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Zap, 
  Layers, 
  Network, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Sliders, 
  FileText,
  Lock,
  Globe,
  Radio
} from 'lucide-react';
import GlobeNetworkCanvas from './GlobeNetworkCanvas';

const LandingPage = ({ onNavigate }) => {
  // Animated counters
  const [switches, setSwitches] = useState(0);
  const [vlans, setVlans] = useState(0);
  const [links, setLinks] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const duration = 1500; // ms
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      
      setSwitches(Math.floor(progress * 42));
      setVlans(Math.floor(progress * 15));
      setLinks(Math.floor(progress * 98));
      setAccuracy(parseFloat((progress * 99.2).toFixed(1)));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden bg-[#050816] bg-radial-glow bg-grid-pattern">
      {/* Top Cyber Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050816]/80 border-b border-[#00D4FF]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-[#00FF88]/20 border border-[#00D4FF]/50 shadow-[0_0_15px_rgba(0,212,255,0.4)]">
              <ShieldCheck className="w-6 h-6 text-[#00D4FF]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                STP <span className="text-[#00D4FF] text-glow-cyan">WORKFLOW</span>
              </span>
              <span className="block text-[10px] tracking-widest text-[#4CC9F0] uppercase font-mono">
                L2 AI GUARD v4.8
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0d1527]/80 p-1.5 rounded-full border border-[#00D4FF]/20">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'upload', label: 'Upload Config' },
              { id: 'topology', label: 'Network Topology' },
              { id: 'simulation', label: 'STP Simulation' },
              { id: 'risk', label: 'Loop Risk Analysis' },
              { id: 'ai', label: 'AI Recommendation' },
              { id: 'reports', label: 'Reports' },
              { id: 'settings', label: 'Settings' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="px-4 py-2 rounded-full text-xs font-medium text-slate-300 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-cyber-primary px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 uppercase font-bold tracking-wider"
          >
            <Zap className="w-4 h-4" />
            Console Launch
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/40 text-[#00D4FF] text-xs font-mono tracking-widest uppercase">
              <Radio className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
              <span>Cyber AI Network Engine Active</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-black text-5xl sm:text-6xl xl:text-7xl tracking-tight leading-none text-white">
                STP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#4CC9F0] to-[#00FF88] text-glow-cyan">WORKFLOW</span>
              </h1>
              <p className="font-heading font-semibold text-xl sm:text-2xl text-[#4CC9F0] tracking-wide">
                AI-Powered Layer-2 Network Intelligence Platform
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0d1527]/90 border-l-4 border-[#00D4FF] backdrop-blur-sm">
              <span className="font-mono text-sm font-semibold text-[#00FF88] block mb-1">
                PREDICT • PREVENT • PROTECT LAYER-2 NETWORKS
              </span>
              <blockquote className="text-slate-300 text-sm italic">
                "Advanced Spanning Tree Protocol Topology Mapping, AI Loop Prediction and Intelligent Network Risk Analysis."
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-cyber-primary px-8 py-4 rounded-xl text-sm flex items-center gap-3 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
              >
                <span className="text-lg">🚀</span>
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('simulation')}
                className="btn-cyber-secondary px-8 py-4 rounded-xl text-sm flex items-center gap-3"
              >
                <span className="text-lg">⚡</span>
                <span>Run STP Simulation</span>
              </button>
            </div>

            {/* Live Counter Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/20 text-center">
                <div className="font-heading font-extrabold text-3xl text-[#00D4FF] text-glow-cyan">
                  {switches}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">Managed Switches</div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/20 text-center">
                <div className="font-heading font-extrabold text-3xl text-[#4CC9F0]">
                  {vlans}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">Active VLANs</div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/20 text-center">
                <div className="font-heading font-extrabold text-3xl text-[#00FF88] text-glow-emerald">
                  {links}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">Healthy Links</div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/20 text-center">
                <div className="font-heading font-extrabold text-3xl text-[#FF4D6D]">
                  {accuracy}%
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">AI Prediction Accuracy</div>
              </div>
            </div>

          </div>

          {/* Hero Interactive 3D Mesh Globe */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="glass-card rounded-2xl p-2 w-full border border-[#00D4FF]/30 shadow-[0_0_40px_rgba(0,212,255,0.2)]">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#050816]/90 px-3 py-1.5 rounded-md border border-[#00D4FF]/30 text-xs font-mono text-[#00D4FF]">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#00FF88]" />
                LIVE MESH SCAN
              </div>
              <GlobeNetworkCanvas />
              
              <div className="p-4 bg-[#0d1527]/90 rounded-xl border-t border-[#00D4FF]/20 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
                  <span className="text-slate-300">Root Bridge: SW-CORE-01</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                  <span className="text-slate-300">Convergence: 1.2s</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-[#00D4FF]/10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Enterprise Grade Layer-2 Intelligence
          </h2>
          <p className="text-slate-400 text-sm">
            Fusion of Cisco DNA Center, Juniper Mist AI, Darktrace threat detection and IBM QRadar SIEM analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigate('topology')}
            className="glass-card p-6 rounded-2xl cursor-pointer glass-card-hover group border border-[#00D4FF]/20"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/40 flex items-center justify-center text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
              Topology Discovery & Vectoring
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated multi-vendor switch discovery with VLAN overlay, trunk link mapping, and real-time BPDU port status vectoring.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('simulation')}
            className="glass-card p-6 rounded-2xl cursor-pointer glass-card-hover group border border-[#00D4FF]/20"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-[#00FF88] transition-colors">
              Real-time STP Convergence Simulator
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Step-by-step interactive simulation of Root Bridge elections, Root Port selection, and Designated vs Blocked port determination.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('ai')}
            className="glass-card p-6 rounded-2xl cursor-pointer glass-card-hover group border border-[#00D4FF]/20"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/40 flex items-center justify-center text-[#FF4D6D] mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-[#FF4D6D] transition-colors">
              AI Broadcast Storm & Loop Predictor
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Predictive AI models detect potential broadcast storms, unidirectional links, and misconfigured BPDU guard risks with 99.2% accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00D4FF]/20 bg-[#050816]/90 px-6 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#00D4FF]" />
            <span>STP WORKFLOW PLATFORM © 2026 ENTERPRISE NETWORKING</span>
          </div>
          <div>Cisco IOS / NX-OS • Juniper JunOS • HP Aruba CX Compatible</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
