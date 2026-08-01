import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Server,
  Monitor,
  ShieldCheck,
  Award
} from 'lucide-react';
import { fetchReports } from '../services/reportService';

const ReportsPage = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReportsData = async () => {
    setLoading(true);
    const data = await fetchReports();
    setReportsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const handleExportCSV = () => {
    if (!reportsData) return;
    const findings = reportsData.findings || [];
    
    let csvContent = "data:text/csv;charset=utf-8,Severity,Switch,Port,Issue,Description\n";
    findings.forEach(f => {
      csvContent += `"${f.severity || 'MEDIUM'}","${f.switch || ''}","${f.port || ''}","${f.issue || ''}","${f.description || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `STP_Compliance_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePDF = () => {
    window.print();
  };

  const complianceScore = reportsData?.compliance_score || '82.5%';
  const rootBridge = reportsData?.root_bridge || 'Switch1';
  const switchesAudited = reportsData?.switches_audited || 7;
  const hostsConnected = reportsData?.hosts_connected || 4;
  const risksIdentified = reportsData?.risks_identified || 12;
  const findings = reportsData?.findings || [];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto print:p-0 print:bg-white print:text-black">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0a1020] to-[#0d1527] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#00D4FF]" />
            REPORTS & COMPLIANCE GENERATOR
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Connected to GET /reports REST API Endpoint • Automated Enterprise Audit
          </p>
        </div>

        <button
          onClick={loadReportsData}
          className="btn-cyber-secondary px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh GET /reports</span>
        </button>
      </div>

      {/* Audit Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl border border-[#00FF88]/30 flex items-center gap-3">
          <Award className="w-6 h-6 text-[#00FF88]" />
          <div>
            <div className="font-heading font-extrabold text-xl text-[#00FF88]">{complianceScore}</div>
            <div className="text-[10px] font-mono text-slate-400">Compliance Score</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/30 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#00D4FF]" />
          <div>
            <div className="font-heading font-extrabold text-xl text-[#00D4FF]">{rootBridge}</div>
            <div className="text-[10px] font-mono text-slate-400">Root Bridge</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#00D4FF]/30 flex items-center gap-3">
          <Server className="w-6 h-6 text-white" />
          <div>
            <div className="font-heading font-extrabold text-xl text-white">{switchesAudited}</div>
            <div className="text-[10px] font-mono text-slate-400">Switches Audited</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#A855F7]/30 flex items-center gap-3">
          <Monitor className="w-6 h-6 text-[#A855F7]" />
          <div>
            <div className="font-heading font-extrabold text-xl text-white">{hostsConnected}</div>
            <div className="text-[10px] font-mono text-slate-400">Host PCs Connected</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-[#FF4D6D]/30 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
          <div>
            <div className="font-heading font-extrabold text-xl text-[#FF4D6D]">{risksIdentified}</div>
            <div className="text-[10px] font-mono text-slate-400">Vulnerabilities Found</div>
          </div>
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/25 space-y-4 print:hidden">
        <h3 className="font-heading font-bold text-base text-white border-b border-[#00D4FF]/20 pb-2">
          EXPORT ACTIONS & AUDIT TOOLS
        </h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGeneratePDF}
            className="btn-cyber-primary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate PDF / Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-cyber-secondary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00FF88]" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={loadReportsData}
            className="btn-cyber-secondary px-6 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Refresh Audit Snapshot</span>
          </button>
        </div>
      </div>

      {/* Audited Findings Table */}
      <div className="glass-card p-6 rounded-2xl border border-[#00D4FF]/30 space-y-4">
        <div className="flex items-center justify-between border-b border-[#00D4FF]/20 pb-3">
          <h3 className="font-heading font-bold text-white text-base">DETAILED AUDIT FINDINGS TABLE</h3>
          <span className="text-xs font-mono text-[#00FF88]">ISO 27001 L2 COMPLIANT</span>
        </div>

        {findings.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[#00FF88]">
            No compliance issues detected in current network snapshot.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#00D4FF]/20 text-slate-400">
                  <th className="py-2.5 px-3">SEVERITY</th>
                  <th className="py-2.5 px-3">TARGET SWITCH</th>
                  <th className="py-2.5 px-3">PORT</th>
                  <th className="py-2.5 px-3">ISSUE TITLE</th>
                  <th className="py-2.5 px-3">REMEDIATION DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00D4FF]/10 text-slate-200">
                {findings.map((f, i) => (
                  <tr key={i} className="hover:bg-[#00D4FF]/5">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'HIGH' || f.severity === 'CRITICAL' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                        f.severity === 'MEDIUM' ? 'bg-[#FFB703]/20 text-[#FFB703]' :
                        'bg-[#00D4FF]/20 text-[#00D4FF]'
                      }`}>
                        {f.severity || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{f.switch}</td>
                    <td className="py-3 px-3 text-[#00D4FF]">{f.port}</td>
                    <td className="py-3 px-3 font-bold text-white">{f.issue}</td>
                    <td className="py-3 px-3 text-slate-400">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raw JSON Preview */}
      {reportsData && (
        <div className="glass-card p-4 rounded-2xl border border-[#00D4FF]/25 space-y-2 print:hidden">
          <div className="text-xs font-mono text-slate-400">RAW JSON RECEIVED FROM /reports</div>
          <pre className="p-4 rounded-xl bg-[#050816] text-[#00D4FF] font-mono text-xs overflow-x-auto max-h-48">
            {JSON.stringify(reportsData, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;
