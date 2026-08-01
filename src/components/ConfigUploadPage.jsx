import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  CheckCircle2, 
  RefreshCw,
  Terminal,
  ArrowRight,
  Server
} from 'lucide-react';
import { uploadConfigFile } from '../services/uploadService';

const ConfigUploadPage = ({ onNavigate }) => {
  const [selectedVendor, setSelectedVendor] = useState('cisco-ios');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const sampleFilenames = {
    'cisco-ios': 'cisco_catalyst_core_3850.cfg',
    'cisco-nxos': 'cisco_nexus_9000_cluster.cfg',
    'juniper': 'juniper_ex4300_enterprise.txt',
    'aruba': 'hp_aruba_cx8360_core.cfg'
  };

  const handleUploadFile = async (rawFile = null) => {
    setIsUploading(true);
    setUploadProgress(0);
    setApiResponse(null);

    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
      }
    }, 150);

    const targetFile = rawFile || new File(["! Sample Config"], sampleFilenames[selectedVendor], { type: "text/plain" });
    const res = await uploadConfigFile(targetFile);
    
    setTimeout(() => {
      setIsUploading(false);
      setApiResponse(res);
    }, 700);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileBrowser = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      
      {/* Hidden File Input for Native OS File Explorer */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".cfg,.txt,.pkt,.xml,.json,.yaml,.yml,.py"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] to-[#0a1020] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-[#00D4FF]" />
            CONFIGURATION UPLOAD & REST API PARSER
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Support: Cisco IOS, Cisco NX-OS, Juniper, HP Aruba (.cfg, .txt, .pkt, .xml, .json, .yaml, .py) • Connected to POST /api/upload
          </p>
        </div>

        <button
          onClick={() => handleUploadFile()}
          className="btn-cyber-primary px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload Sample Config API</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Vendor Selector & Upload Drag & Drop */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-4 rounded-2xl border border-[#00D4FF]/25 space-y-3">
            <label className="text-xs font-mono text-slate-300 block">SELECT HARDWARE VENDOR:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cisco-ios', label: 'Cisco IOS' },
                { id: 'cisco-nxos', label: 'Cisco NX-OS' },
                { id: 'juniper', label: 'Juniper JunOS' },
                { id: 'aruba', label: 'HP Aruba CX' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendor(v.id)}
                  className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                    selectedVendor === v.id
                      ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-[#00D4FF] font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                      : 'bg-[#0d1527] border-[#00D4FF]/20 text-slate-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div 
            onClick={triggerFileBrowser}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-card-glow p-12 rounded-2xl border text-center space-y-5 transition-all cursor-pointer bg-[#040817]/90 backdrop-blur-xl ${
              isDraggingOver
                ? 'border-[#00FF88] shadow-[0_0_30px_rgba(0,255,136,0.3)] bg-[#00FF88]/10'
                : 'border-[#00D4FF]/30 hover:border-[#00D4FF]'
            }`}
          >
            <div className="w-20 h-20 rounded-full border border-[#00D4FF] bg-[#05091a] mx-auto flex items-center justify-center text-[#00D4FF] shadow-[0_0_25px_rgba(0,212,255,0.3)]">
              <UploadCloud className="w-10 h-10 text-[#00D4FF]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                Drag & Drop Configuration File Here
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-mono">
                Supports <code className="text-slate-300">`.cfg`</code>, <code className="text-slate-300">`.txt`</code>, <code className="text-slate-300">`.pkt`</code>, <code className="text-slate-300">`.xml`</code>, <code className="text-slate-300">`.json`</code>, <code className="text-slate-300">`.yaml`</code>, or <code className="text-slate-300">`custom_stp_engine.py`</code>
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button 
                type="button"
                onClick={triggerFileBrowser}
                className="btn-cyber-primary px-6 py-3 rounded-xl text-xs flex items-center gap-2 font-mono"
              >
                <span>Browse & Upload to API</span>
              </button>
            </div>
          </div>

        </div>

        {/* API JSON Response Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {isUploading && (
            <div className="glass-card-glow p-6 rounded-2xl border border-[#00D4FF]/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#00D4FF]">
                <span>SENDING TO FASTAPI BACKEND...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {apiResponse ? (
            <div className="glass-card-emerald p-6 rounded-2xl border border-[#00FF88]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
                  <span className="font-heading font-bold text-white text-base">API UPLOAD SUCCESSFUL</span>
                </div>
                <span className="text-xs font-mono text-[#00FF88]">HTTP 200 OK</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00FF88]/20 space-y-1">
                  <div className="text-slate-400">STATUS</div>
                  <div className="text-[#00FF88] font-extrabold text-sm">{apiResponse.status}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0d1527] border border-[#00FF88]/20 space-y-1">
                  <div className="text-slate-400">FILENAME</div>
                  <div className="text-[#00D4FF] font-bold">{apiResponse.filename}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#050816] border border-[#00D4FF]/20 space-y-1">
                  <div className="text-slate-400 text-[10px]">RAW JSON RESPONSE FROM /api/upload</div>
                  <pre className="text-[#00FF88] text-[11px] overflow-x-auto">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => onNavigate('topology')}
                className="w-full btn-cyber-primary py-3 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <span>View Generated Topology</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !isUploading && (
            <div className="glass-card p-8 rounded-2xl border border-[#00D4FF]/20 text-center space-y-3">
              <Terminal className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-heading text-slate-300 font-bold">FastAPI Endpoint Ready</div>
              <p className="text-xs text-slate-500 font-mono">
                Click browse or sample config to dispatch payload to <code className="text-[#00D4FF]">http://localhost:8000/api/upload</code>.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ConfigUploadPage;
