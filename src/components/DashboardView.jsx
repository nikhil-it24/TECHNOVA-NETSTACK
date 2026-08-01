import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Layers, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Zap, 
  ArrowRight,
  TrendingDown,
  Filter,
  Play,
  Pause
} from 'lucide-react';
import TopologyCanvas from './TopologyCanvas';

const DashboardView = ({ onNavigate }) => {
  const [consoleLogs, setConsoleLogs] = useState([
    { id: 1, type: 'SUCCESS', title: 'Topology Updated', desc: '42 switches and 98 links mapped cleanly across 15 VLANs.', time: '11:46:12' },
    { id: 2, type: 'INFO', title: 'Root Bridge Election', desc: 'SW-CORE-01 elected with Priority 4096 (MAC 00:1A:2B:3C:4D:01).', time: '11:45:50' },
    { id: 3, type: 'SUCCESS', title: 'Loop Prevented', desc: 'STP auto-blocked alternate port Gi0/24 on SW-DIST-01.', time: '11:44:30' },
    { id: 4, type: 'WARNING', title: 'BPDU Guard Advisory', desc: 'PortFast enabled on SW-ACC-03 ohne BPDU Guard configured.', time: '11:42:15' },
    { id: 5, type: 'INFO', title: 'Configuration Uploaded', desc: 'Cisco_Catalyst_Core_Cluster.cfg parsed successfully.', time: '11:40:02' },
    { id: 6, type: 'SUCCESS', title: 'Simulation Completed', desc: 'Spanning Tree convergence baseline measured at 1.2 seconds.', time: '11:38:19' }
  ]);

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Progressive timeline step completion state
  const [activeStepIndex, setActiveStepIndex] = useState(6);

  const timelineSteps = [
    { title: 'Configuration Upload', desc: 'Cisco IOS / JunOS files parsed', status: 'completed' },
    { title: 'Topology Discovery', desc: '42 switch adjacency matrix constructed', status: 'completed' },
    { title: 'STP Parsing', desc: '802.1w Rapid PVST+ state mapped', status: 'completed' },
    { title: 'Root Bridge Election', desc: 'Root Bridge priority 4096 verified', status: 'completed' },
    { title: 'Loop Detection', desc: 'Zero active loops detected', status: 'completed' },
    { title: 'AI Recommendation', desc: '5 hardening suggestions generated', status: 'completed' },
    { title: 'Report Generated', desc: 'Audit compliance index 98.4%', status: 'completed' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0d1527]/90 via-[#0a1020]/90 to-[#0d1527]/90 border border-[#00D4FF]/30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-ping" />
          <div>
            <h1 className="font-heading font-extrabold text-xl text-white tracking-wide">
              REAL-TIME LAYER-2 COMMAND DASHBOARD
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Sentinel Core Engine • Active STP Protocol: 802.1w Rapid-PVST+
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('upload')}
            className="btn-cyber-secondary px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono"
          >
            <span>Upload Config</span>
          </button>
          <button 
            onClick={() => onNavigate('simulation')}
            className="btn-cyber-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Run STP Simulation</span>
          </button>
        </div>
      </div>

      {/* Row 1: Four Animated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="glass-card p-5 rounded-2xl border border-[#00D4FF]/25 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4FF]/10 rounded-full blur-2xl group-hover:bg-[#00D4FF]/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Total Switches</span>
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-black text-4xl text-white mb-1">42</div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00FF88]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Online & Synced</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-5 rounded-2xl border border-[#00D4FF]/25 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4CC9F0]/10 rounded-full blur-2xl group-hover:bg-[#4CC9F0]/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Active VLANs</span>
            <div className="w-9 h-9 rounded-xl bg-[#4CC9F0]/15 border border-[#4CC9F0]/30 flex items-center justify-center text-[#4CC9F0]">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-black text-4xl text-[#4CC9F0] mb-1">15</div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Isolation Matrix Active</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-5 rounded-2xl border border-[#00D4FF]/25 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF88]/10 rounded-full blur-2xl group-hover:bg-[#00FF88]/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Healthy Links</span>
            <div className="w-9 h-9 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-black text-4xl text-[#00FF88] text-glow-emerald mb-1">98</div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00FF88]">
            <span>3 Ports Blocked (STP Normal)</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-5 rounded-2xl border border-[#00D4FF]/25 glass-card-hover relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF88]/10 rounded-full blur-2xl group-hover:bg-[#00FF88]/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Current Loop Risk</span>
            <div className="w-9 h-9 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-black text-4xl text-[#00FF88] mb-1">LOW (8.4%)</div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00FF88]">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Loop Free Baseline</span>
          </div>
        </div>

      </div>

      {/* Row 2: Large Interactive Network Topology Graph */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
            <h2 className="font-heading font-bold text-lg text-white tracking-wide">
              LIVE NETWORK TOPOLOGY VECTOR MAP
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('topology')}
            className="text-xs text-[#00D4FF] hover:underline font-mono flex items-center gap-1"
          >
            <span>Expand Full Interactive Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TopologyCanvas height="480px" onSelectNode={(node) => console.log(node)} />
      </div>

      {/* Row 3: STP Health Gauge (Left) & Loop Risk Analysis Panel (Right) */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left: STP Health Gauge */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-[#00D4FF]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00FF88]" />
              STP HEALTH GAUGE
            </h3>
            <span className="text-xs font-mono text-[#00FF88] bg-[#00FF88]/10 px-2 py-0.5 rounded border border-[#00FF88]/30">
              OPTIMAL
            </span>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            {/* SVG Circular Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(0, 212, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#healthGradient)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="9" // 96.4% full
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#00FF88" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-heading font-black text-3xl text-white text-glow-cyan">96.4%</span>
                <span className="text-[10px] font-mono text-slate-400">NETWORK HEALTH</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/15 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span>Root Bridge Status:</span>
              <span className="text-[#00FF88] font-bold">SW-CORE-01 (STABLE)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Root Bridge MAC:</span>
              <span className="text-slate-200">00:1A:2B:3C:4D:01</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>STP Hello Time / Max Age:</span>
              <span className="text-slate-200">2s / 20s</span>
            </div>
          </div>
        </div>

        {/* Right: Loop Risk Analysis Panel */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-[#00D4FF]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#00D4FF]" />
              LOOP RISK ANALYSIS PANEL
            </h3>
            <button 
              onClick={() => onNavigate('risk')}
              className="text-xs text-[#00D4FF] hover:underline font-mono"
            >
              Detailed Risk Breakdown →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 text-center">
              <div className="text-[10px] font-mono text-slate-400 mb-1">RISK METER</div>
              <div className="font-heading font-extrabold text-xl text-[#00FF88]">LOW</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 text-center">
              <div className="text-[10px] font-mono text-slate-400 mb-1">STORM PROBABILITY</div>
              <div className="font-heading font-extrabold text-xl text-[#00D4FF]">2.1%</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 text-center">
              <div className="text-[10px] font-mono text-slate-400 mb-1">REDUNDANT LINKS</div>
              <div className="font-heading font-extrabold text-xl text-[#4CC9F0]">8 LINKS</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 text-center">
              <div className="text-[10px] font-mono text-slate-400 mb-1">BLOCKED PORTS</div>
              <div className="font-heading font-extrabold text-xl text-[#FF4D6D]">3 PORTS</div>
            </div>
          </div>

          {/* Risk Score Progress Bar */}
          <div className="space-y-2 p-4 rounded-xl bg-[#0d1527]/70 border border-[#00D4FF]/15">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Overall Layer-2 Risk Score</span>
              <span className="text-[#00FF88] font-bold">8 / 100 (Safe Zone)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-[#00FF88] via-[#00D4FF] to-[#FF4D6D] w-[8%]" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              AI analysis confirms zero active bridging loops. All redundant topologies are properly blocked by STP Rapid PVST+.
            </p>
          </div>
        </div>

      </div>

      {/* Row 4: AI Recommendation Panel */}
      <div className="glass-card-glow p-6 rounded-2xl border border-[#00D4FF]/40 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF] flex items-center justify-center text-[#00D4FF]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white tracking-wide">
                AI RECOMMENDATION COPILOT
              </h3>
              <p className="text-xs text-slate-400 font-mono">Intelligent Layer-2 Network Hardening Engine</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="btn-cyber-primary px-4 py-2 rounded-xl text-xs flex items-center gap-2"
          >
            <span>Open Sentinel AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { text: 'Root Bridge Stable', detail: 'Priority 4096 locked on SW-CORE-01', color: '#00FF88' },
            { text: 'Enable BPDU Guard on Access', detail: 'Applies to 12 edge switchports', color: '#00D4FF' },
            { text: 'Configure Root Guard', detail: 'Protect SW-DIST-01 from rogue bridges', color: '#4CC9F0' },
            { text: 'Optimize VLAN Distribution', detail: 'Balance VLAN 20 traffic across trunk 2', color: '#FFB703' },
            { text: 'Reduce Loop Risk by 31%', detail: 'Execute automated hardening patch', color: '#00FF88' }
          ].map((rec, i) => (
            <div 
              key={i}
              className="p-3.5 rounded-xl bg-[#0d1527]/90 border border-[#00D4FF]/20 hover:border-[#00D4FF]/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1.5" style={{ color: rec.color }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-heading font-bold text-xs">{rec.text}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-normal group-hover:text-slate-200">
                {rec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Alert Console */}
      <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00D4FF]" />
            <h3 className="font-heading font-bold text-base text-white tracking-wide">
              LIVE ALERT & EVENT CONSOLE
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <button 
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                isLiveStreaming ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isLiveStreaming ? 'Streaming Live' : 'Paused'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#050816] rounded-xl border border-[#00D4FF]/20 p-4 max-h-60 overflow-y-auto space-y-2 font-mono text-xs">
          {consoleLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-2 rounded bg-[#0d1527]/80 border-l-2 border-[#00D4FF]/30 hover:bg-[#0d1527] transition">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  log.type === 'SUCCESS' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                  log.type === 'WARNING' ? 'bg-[#FFB703]/20 text-[#FFB703]' :
                  log.type === 'CRITICAL' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' : 'bg-[#00D4FF]/20 text-[#00D4FF]'
                }`}>
                  {log.type}
                </span>
                <span className="text-white font-bold">{log.title}:</span>
                <span className="text-slate-300">{log.desc}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 6: Activity Timeline */}
      <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/25 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4CC9F0]" />
            <h3 className="font-heading font-bold text-base text-white tracking-wide">
              DISCOVERY & ANALYSIS TIMELINE
            </h3>
          </div>
          <span className="text-xs font-mono text-[#00FF88]">7/7 STEPS EXECUTED</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {timelineSteps.map((step, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                idx <= activeStepIndex 
                  ? 'bg-[#0d1527] border-[#00D4FF]/40 shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-600'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] mx-auto flex items-center justify-center font-bold text-xs mb-2">
                {idx + 1}
              </div>
              <div className="font-heading font-bold text-xs text-white mb-1 truncate">{step.title}</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardView;
