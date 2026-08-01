import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  Bot,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { fetchAiRecommendation } from '../services/reportService';

const AiRecommendationPage = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const loadAiData = async () => {
    setLoading(true);
    const data = await fetchAiRecommendation();
    setAiData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAiData();
  }, []);

  const recommendations = aiData?.recommendations || [];

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0a1020] to-[#0d1527] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#00D4FF] animate-pulse" />
            SENTINEL AI RECOMMENDATION COPILOT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Connected to GET /ai-recommendation REST API Endpoint • Automated Cyber Hardening
          </p>
        </div>

        <button
          onClick={loadAiData}
          className="btn-cyber-secondary px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh GET /ai-recommendation</span>
        </button>
      </div>

      {/* Main AI Status Card */}
      <div className="glass-card-glow p-6 rounded-2xl border border-[#00D4FF]/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00D4FF]/20 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF] flex items-center justify-center text-[#00D4FF] shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">SENTINEL AI COPILOT HARDENING ADVICE</h3>
              <p className="text-xs text-slate-400 font-mono">Generative L2 Security Model • {recommendations.length} Recommendations Generated</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-mono text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>STATUS: HTTP 200 OK</span>
            </span>
          </div>
        </div>

        {/* AI Action Recommendations Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3 font-mono text-xs text-[#00D4FF] flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Analyzing network topology with Sentinel AI Copilot...</span>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#00FF88] space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-[#00FF88]" />
            <div>No hardening recommendations needed. Current network configuration is fully optimized.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec, idx) => {
              const isHigh = rec.severity === 'HIGH' || rec.severity === 'CRITICAL';
              const isMed = rec.severity === 'MEDIUM';

              return (
                <div 
                  key={idx}
                  className="glass-card p-5 rounded-xl border border-[#00D4FF]/30 space-y-3 hover:border-[#00D4FF] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isHigh ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40' :
                      isMed ? 'bg-[#FFB703]/20 text-[#FFB703] border border-[#FFB703]/40' :
                      'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                    }`}>
                      {rec.severity || 'MEDIUM'}
                    </span>
                    <span className="text-xs font-mono text-[#00D4FF] font-bold">
                      {rec.target || `${rec.switch} Port ${rec.port}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white mb-1">
                      {rec.issue}
                    </h4>
                    <p className="text-xs text-slate-300 font-mono">
                      {rec.fix}
                    </p>
                  </div>

                  {/* Recommended Cisco CLI Code Block */}
                  {rec.fix_cmd && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-[#00FF88]" />
                          CISCO IOS HARDENING CLI FIX
                        </span>
                        <button
                          onClick={() => handleCopyCode(rec.fix_cmd, idx)}
                          className="hover:text-white transition flex items-center gap-1 text-[#00D4FF]"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <pre className="p-3 rounded-lg bg-[#050816] border border-[#00D4FF]/20 text-[#00FF88] font-mono text-xs overflow-x-auto">
                        {rec.fix_cmd}
                      </pre>
                    </div>
                  )}

                  {rec.impact && (
                    <div className="text-[11px] font-mono text-slate-400 border-t border-[#00D4FF]/10 pt-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFB703] shrink-0" />
                      <span>Impact: {rec.impact}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Raw JSON Preview */}
        {aiData && (
          <div className="space-y-2 pt-4 border-t border-[#00D4FF]/20">
            <div className="text-xs font-mono text-slate-400">RAW JSON PAYLOAD FROM /ai-recommendation</div>
            <pre className="p-4 rounded-xl bg-[#050816] text-[#00D4FF] font-mono text-xs overflow-x-auto max-h-56">
              {JSON.stringify(aiData, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};

export default AiRecommendationPage;
