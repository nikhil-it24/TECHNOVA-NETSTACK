import React, { useState, useEffect, useCallback } from 'react';
import { 
  Network, 
  Layers, 
  Server, 
  Router, 
  Monitor, 
  AlertTriangle,
  Zap,
  RefreshCw,
  Activity
} from 'lucide-react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchTopology } from '../services/topologyService';

const TopologyPage = ({ onNavigate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);

  const loadTopologyData = useCallback(async () => {
    setLoading(true);
    const data = await fetchTopology();
    setApiData(data);

    // Transform backend JSON into React Flow Nodes
    const flowNodes = (data.nodes || []).map((node, idx) => {
      const isPc = node.type === 'pc' || node.id.startsWith('PC');
      const isRoot = node.is_root || node.id === data.root_bridge || node.id === 'Switch1';

      return {
        id: node.id,
        position: node.position || { x: (idx % 4) * 220 + 80, y: Math.floor(idx / 4) * 160 + 50 },
        data: { label: node.label || node.id },
        style: {
          background: isPc ? '#0d192e' : '#080d1e',
          color: '#ffffff',
          border: isRoot ? '2px solid #00FF88' : isPc ? '1px solid #A855F7' : '1px solid #00D4FF',
          borderRadius: isPc ? '10px' : '14px',
          padding: isPc ? '8px 14px' : '12px 18px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono',
          boxShadow: isRoot 
            ? '0 0 20px rgba(0,255,136,0.35)' 
            : isPc 
            ? '0 0 12px rgba(168,85,247,0.25)' 
            : '0 0 15px rgba(0,212,255,0.2)'
        }
      };
    });

    // Transform backend JSON into React Flow Edges
    const flowEdges = (data.edges || []).map((edge) => {
      const isBlocked = edge.type === 'redundant_blocked';
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: !isBlocked,
        style: {
          stroke: isBlocked ? '#FF4D6D' : '#00D4FF',
          strokeWidth: 2,
          strokeDasharray: isBlocked ? '5,5' : 'none'
        },
        labelStyle: { fill: '#4CC9F0', fontSize: 9, fontFamily: 'JetBrains Mono' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isBlocked ? '#FF4D6D' : '#00D4FF'
        }
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
    setLoading(false);
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadTopologyData();
  }, [loadTopologyData]);

  const switchCount = nodes.filter(n => !n.id.startsWith('PC')).length;
  const pcCount = nodes.filter(n => n.id.startsWith('PC')).length;
  const blockedCount = edges.filter(e => e.style?.stroke === '#FF4D6D').length;
  const rootBridgeName = apiData?.root_bridge || 'Switch1';

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#0a1020] to-[#0d1527] border border-[#00D4FF]/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide flex items-center gap-2">
            <Network className="w-6 h-6 text-[#00D4FF]" />
            REACT FLOW TOPOLOGY MAPPER
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Displaying live topology JSON payload received from GET /api/topology
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadTopologyData}
            className="btn-cyber-secondary px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Fetch /api/topology</span>
          </button>

          <button 
            onClick={() => onNavigate('simulation')}
            className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono"
          >
            <Zap className="w-4 h-4" />
            <span>STP Simulation</span>
          </button>
        </div>
      </div>

      {/* Device Count Filter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="glass-card p-3.5 rounded-xl border border-[#00D4FF]/20 flex items-center gap-3">
          <Server className="w-5 h-5 text-[#00D4FF]" />
          <div>
            <div className="font-heading font-extrabold text-base text-white">{switchCount}</div>
            <div className="text-[10px] font-mono text-slate-400">Switches</div>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-[#A855F7]/20 flex items-center gap-3">
          <Monitor className="w-5 h-5 text-[#A855F7]" />
          <div>
            <div className="font-heading font-extrabold text-base text-white">{pcCount}</div>
            <div className="text-[10px] font-mono text-slate-400">Host PCs</div>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-[#00D4FF]/20 flex items-center gap-3">
          <Layers className="w-5 h-5 text-[#00FF88]" />
          <div>
            <div className="font-heading font-extrabold text-base text-white">{edges.length}</div>
            <div className="text-[10px] font-mono text-slate-400">Active Links</div>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-[#00FF88]/20 flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#00FF88]" />
          <div>
            <div className="font-heading font-extrabold text-base text-[#00FF88]">{rootBridgeName}</div>
            <div className="text-[10px] font-mono text-slate-400">Root Bridge</div>
          </div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-[#FF4D6D]/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
          <div>
            <div className="font-heading font-extrabold text-base text-[#FF4D6D]">{blockedCount} Link{blockedCount !== 1 ? 's' : ''}</div>
            <div className="text-[10px] font-mono text-slate-400">Blocked (STP)</div>
          </div>
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <div className="relative w-full h-[580px] rounded-2xl overflow-hidden glass-card border border-[#00D4FF]/30">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#00D4FF] gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Fetching network graph from GET /api/topology...</span>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background color="#00D4FF" gap={30} size={1} opacity={0.15} />
            <Controls style={{ backgroundColor: '#080d1e', borderColor: 'rgba(0,212,255,0.3)', color: '#ffffff' }} />
            <MiniMap style={{ backgroundColor: '#050816', borderColor: 'rgba(0,212,255,0.3)' }} nodeColor="#00D4FF" />
          </ReactFlow>
        )}
      </div>

      {/* Raw JSON Data Preview */}
      {apiData && (
        <div className="glass-card p-4 rounded-2xl border border-[#00D4FF]/25 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>RAW JSON RECEIVED FROM /api/topology</span>
            <span className="text-[#00FF88]">JSON REST PROTOCOL</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#050816] text-[#00D4FF] font-mono text-xs overflow-x-auto max-h-48">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
};

export default TopologyPage;
