import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Clock, 
  Terminal,
  AlertCircle,
  Cpu
} from 'lucide-react';
import TopologyCanvas from './TopologyCanvas';
import { runSimulation } from '../services/simulationService';

const StpSimulationPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartSimulation = async () => {
    setLoading(true);
    setIsPlaying(true);
    const res = await runSimulation();
    setApiResponse(res);
    setLoading(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setApiResponse(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0a1020] to-[#0d1527] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#00FF88]" />
            STP SIMULATION ENGINE INTERFACE
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Connected to POST /api/simulate REST API • Real-Time Playback Controls
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-[#050816] p-2 rounded-xl border border-[#00D4FF]/30 backdrop-blur-md">
          <button
            onClick={handleStartSimulation}
            disabled={loading}
            className="btn-cyber-primary px-4 py-2 rounded-lg text-xs flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'Triggering...' : isPlaying ? 'Pause' : 'Start Simulation'}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-[#0d1527] border border-[#00D4FF]/30 text-slate-200 hover:text-[#00D4FF] transition"
            title="Resume / Pause"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#0d1527] border border-[#00D4FF]/30 text-slate-200 hover:text-[#00D4FF] transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#00D4FF]/20 mx-1" />

          <div className="flex items-center gap-1 text-xs font-mono">
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded ${
                  speed === s ? 'bg-[#00D4FF] text-[#050816] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backend API Response Status Box */}
      {apiResponse && (
        <div className="glass-card-glow p-6 rounded-2xl border border-[#00D4FF]/40 space-y-3">
          <div className="flex items-center justify-between border-b border-[#00D4FF]/20 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00D4FF] animate-pulse" />
              <span className="font-heading font-bold text-white text-base">FASTAPI /api/simulate RESPONSE</span>
            </div>
            <span className="text-xs font-mono text-[#00D4FF]">STATUS: {apiResponse.status}</span>
          </div>

          {apiResponse.status === 'waiting_for_stp_engine' && (
            <div className="p-4 rounded-xl bg-[#0d1527] border border-[#FFB703]/40 text-[#FFB703] font-mono text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">Simulation engine is under development.</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Backend received POST /api/simulate request. STP calculation module is awaiting algorithm integration.
                </div>
              </div>
            </div>
          )}

          <pre className="p-3 rounded-xl bg-[#050816] text-[#00D4FF] font-mono text-xs overflow-x-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Grid: Visualizer & Details */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <TopologyCanvas height="520px" interactive={true} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-[#00D4FF]/30 space-y-4">
            <h3 className="font-heading font-bold text-base text-white border-b border-[#00D4FF]/20 pb-2">
              SIMULATION ENGINE STATUS
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 flex justify-between">
                <span className="text-slate-400">ENGINE STATE:</span>
                <span className="text-[#00FF88] font-bold">READY FOR STP INTEGRATION</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00D4FF]/20 flex justify-between">
                <span className="text-slate-400">ENDPOINT:</span>
                <span className="text-[#00D4FF]">POST /api/simulate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StpSimulationPage;
