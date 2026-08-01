import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2,
  Save,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

const SettingsPage = () => {
  const [helloTime, setHelloTime] = useState(2);
  const [maxAge, setMaxAge] = useState(20);
  const [fwdDelay, setFwdDelay] = useState(15);
  const [aiSensitivity, setAiSensitivity] = useState(85);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0a1020] to-[#0d1527] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00D4FF]" />
            ENTERPRISE PLATFORM SETTINGS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Global STP Protocol Timers • AI Threshold Sensitivity • SNMP Polling Engine
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-cyber-primary px-6 py-3 rounded-xl text-xs flex items-center gap-2 font-mono"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#00FF88]/15 border border-[#00FF88] text-[#00FF88] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration parameters saved and synchronized with 42 managed switches!</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* STP Timers Settings */}
        <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/25 space-y-5">
          <h3 className="font-heading font-bold text-base text-white border-b border-[#00D4FF]/20 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00D4FF]" />
            SPANNING TREE PROTOCOL TIMERS (802.1w)
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hello Time Interval:</span>
                <span className="text-[#00D4FF] font-bold">{helloTime} Seconds</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={helloTime}
                onChange={(e) => setHelloTime(parseInt(e.target.value))}
                className="w-full accent-[#00D4FF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Max Age Timer:</span>
                <span className="text-[#4CC9F0] font-bold">{maxAge} Seconds</span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                value={maxAge}
                onChange={(e) => setMaxAge(parseInt(e.target.value))}
                className="w-full accent-[#4CC9F0]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Forward Delay Timer:</span>
                <span className="text-[#00FF88] font-bold">{fwdDelay} Seconds</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                value={fwdDelay}
                onChange={(e) => setFwdDelay(parseInt(e.target.value))}
                className="w-full accent-[#00FF88]"
              />
            </div>
          </div>
        </div>

        {/* AI & Telemetry Parameters */}
        <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/25 space-y-5">
          <h3 className="font-heading font-bold text-base text-white border-b border-[#00D4FF]/20 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00FF88]" />
            AI MODEL & TELEMETRY PARAMETERS
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>AI Loop Prediction Threshold:</span>
                <span className="text-[#00FF88] font-bold">{aiSensitivity}% Sensitivity</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiSensitivity}
                onChange={(e) => setAiSensitivity(parseInt(e.target.value))}
                className="w-full accent-[#00FF88]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 space-y-2">
              <span className="text-slate-400 block">SNMP COMMUNITY STRING</span>
              <input
                type="password"
                defaultValue="sentinel_v3_secure_community"
                className="w-full bg-[#050816] border border-[#00D4FF]/30 rounded-lg p-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
