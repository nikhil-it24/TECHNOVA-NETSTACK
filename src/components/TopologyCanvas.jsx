import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Layers, 
  ShieldCheck, 
  Info, 
  X,
  Radio,
  Server,
  Router,
  Monitor,
  Activity
} from 'lucide-react';

const TopologyCanvas = ({ height = '500px', interactive = true, onSelectNode }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animating, setAnimating] = useState(true);
  const [selectedVlan, setSelectedVlan] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);

  // 7 Switches + 4 PCs Network Nodes Definition (technova SM 26 STP topology)
  const nodes = [
    // Tier 1: Core Root Bridge
    { id: 'Switch1', type: 'switch', role: 'ROOT_BRIDGE', priority: '4096', mac: '00:11:22:33:44:01', x: 400, y: 70, status: 'root' },

    // Tier 2: Distribution Layer
    { id: 'Switch2', type: 'switch', role: 'DISTRIBUTION', priority: '32768', mac: '00:11:22:33:44:02', x: 250, y: 190, status: 'healthy' },
    { id: 'Switch3', type: 'switch', role: 'DISTRIBUTION', priority: '32768', mac: '00:11:22:33:44:03', x: 550, y: 190, status: 'healthy' },

    // Tier 3: Access Layer
    { id: 'Switch4', type: 'switch', role: 'ACCESS', priority: '32768', mac: '00:11:22:33:44:04', x: 120, y: 320, status: 'healthy' },
    { id: 'Switch5', type: 'switch', role: 'ACCESS', priority: '32768', mac: '00:11:22:33:44:05', x: 310, y: 320, status: 'healthy' },
    { id: 'Switch6', type: 'switch', role: 'ACCESS', priority: '32768', mac: '00:11:22:33:44:06', x: 490, y: 320, status: 'healthy' },
    { id: 'Switch7', type: 'switch', role: 'ACCESS', priority: '32768', mac: '00:11:22:33:44:07', x: 680, y: 320, status: 'healthy' },

    // Tier 4: End Host PCs
    { id: 'PC0', type: 'host', role: 'HOST_PC', ip: '192.168.1.10', x: 120, y: 440, status: 'healthy' },
    { id: 'PC1', type: 'host', role: 'HOST_PC', ip: '192.168.1.11', x: 310, y: 440, status: 'healthy' },
    { id: 'PC2', type: 'host', role: 'HOST_PC', ip: '192.168.1.12', x: 490, y: 440, status: 'healthy' },
    { id: 'PC3', type: 'host', role: 'HOST_PC', ip: '192.168.1.13', x: 680, y: 440, status: 'healthy' },
  ];

  // Links with STP Port Statuses (ONLY Switch2 to Switch5 is RED/BLOCKED)
  const links = [
    // Core to Distribution Links (Forwarding / Green)
    { from: 'Switch1', to: 'Switch2', status: 'FORWARDING', portFrom: 'Gi0/1', portTo: 'Gi0/1' },
    { from: 'Switch1', to: 'Switch3', status: 'FORWARDING', portFrom: 'Gi0/2', portTo: 'Gi0/1' },

    // Distribution Cross-Link (Forwarding / Green)
    { from: 'Switch2', to: 'Switch3', status: 'FORWARDING', portFrom: 'Gi0/2', portTo: 'Gi0/2' },

    // Distribution to Access Links
    { from: 'Switch2', to: 'Switch4', status: 'FORWARDING', portFrom: 'Fa0/1', portTo: 'Gi0/1' },
    { from: 'Switch2', to: 'Switch5', status: 'BLOCKED', portFrom: 'Fa0/2', portTo: 'Gi0/1' }, // ONLY RED LINK
    { from: 'Switch3', to: 'Switch6', status: 'FORWARDING', portFrom: 'Fa0/1', portTo: 'Gi0/1' },
    { from: 'Switch3', to: 'Switch7', status: 'FORWARDING', portFrom: 'Fa0/2', portTo: 'Gi0/1' },

    // Access Layer Cross Links (Forwarding / Green)
    { from: 'Switch4', to: 'Switch5', status: 'FORWARDING', portFrom: 'Gi0/2', portTo: 'Gi0/2' },
    { from: 'Switch5', to: 'Switch6', status: 'FORWARDING', portFrom: 'Gi0/3', portTo: 'Gi0/2' },
    { from: 'Switch6', to: 'Switch7', status: 'FORWARDING', portFrom: 'Gi0/3', portTo: 'Gi0/2' },

    // Access to End Host PC Links (Forwarding / Green)
    { from: 'Switch4', to: 'PC0', status: 'FORWARDING', portFrom: 'Fa0/24', portTo: 'eth0' },
    { from: 'Switch5', to: 'PC1', status: 'FORWARDING', portFrom: 'Fa0/24', portTo: 'eth0' },
    { from: 'Switch6', to: 'PC2', status: 'FORWARDING', portFrom: 'Fa0/24', portTo: 'eth0' },
    { from: 'Switch7', to: 'PC3', status: 'FORWARDING', portFrom: 'Fa0/24', portTo: 'eth0' },
  ];

  // Packet animation offsets
  const packetProgress = useRef(links.map(() => Math.random()));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      const width = (canvas.width = canvas.parentElement.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement.clientHeight || 500);

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // Apply pan & zoom
      ctx.translate(pan.x + width / 2, pan.y + height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
      ctx.lineWidth = 1;
      const gSize = 40;
      for (let x = -width; x < width * 2; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, -height);
        ctx.lineTo(x, height * 2);
        ctx.stroke();
      }
      for (let y = -height; y < height * 2; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(-width, y);
        ctx.lineTo(width * 2, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach((link, idx) => {
        const sourceNode = nodes.find((n) => n.id === link.from);
        const targetNode = nodes.find((n) => n.id === link.to);

        if (!sourceNode || !targetNode) return;

        // Filter VLAN if selected
        if (selectedVlan !== 'ALL' && link.vlan !== parseInt(selectedVlan)) {
          return;
        }

        const isBlocked = link.status === 'BLOCKED';

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (isBlocked) {
          ctx.strokeStyle = '#FF4D6D';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = link.vlan === 10 ? '#00D4FF' : link.vlan === 20 ? '#4CC9F0' : '#00FF88';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Port Labels & Blocked Cross Mark
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        if (isBlocked) {
          // Blocked port icon indicator
          ctx.fillStyle = '#FF4D6D';
          ctx.beginPath();
          ctx.arc(midX, midY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#050816';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.fillText('X', midX - 3, midY + 3);
        }

        // Packet Flow Animation along forwarding links
        if (animating && !isBlocked) {
          packetProgress.current[idx] = (packetProgress.current[idx] + 0.008) % 1;
          const px = sourceNode.x + (targetNode.x - sourceNode.x) * packetProgress.current[idx];
          const py = sourceNode.y + (targetNode.y - sourceNode.y) * packetProgress.current[idx];

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = link.vlan === 10 ? '#00D4FF' : '#00FF88';
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        if (selectedVlan !== 'ALL' && node.vlan !== parseInt(selectedVlan) && node.vlan !== 1) {
          ctx.globalAlpha = 0.25;
        } else {
          ctx.globalAlpha = 1.0;
        }

        const isSelected = selectedNode?.id === node.id;
        const isRoot = node.role === 'ROOT_BRIDGE';

        // Outer Glow for Root Bridge or Selected Node
        if (isRoot || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
          ctx.fillStyle = isRoot ? 'rgba(0, 255, 136, 0.25)' : 'rgba(0, 212, 255, 0.3)';
          ctx.fill();
          ctx.strokeStyle = isRoot ? '#00FF88' : '#00D4FF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node Circle Base
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'switch' ? '#0d1527' : node.type === 'router' ? '#1a0d27' : '#0a1a20';
        ctx.strokeStyle = isRoot ? '#00FF88' : node.type === 'switch' ? '#00D4FF' : node.type === 'router' ? '#B5179E' : '#4CC9F0';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Node Icon Text Label (Short Symbol)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(node.type === 'switch' ? 'SW' : node.type === 'router' ? 'RT' : 'HOST', node.x, node.y + 3);

        // Node ID Title below
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = isRoot ? '#00FF88' : '#e2e8f0';
        ctx.fillText(node.id, node.x, node.y + 30);

        // Subtitle tag
        if (isRoot) {
          ctx.fillStyle = '#00FF88';
          ctx.font = '9px JetBrains Mono';
          ctx.fillText('[ROOT BRIDGE]', node.x, node.y + 42);
        }

        ctx.globalAlpha = 1.0;
      });

      ctx.restore();

      // Minimap Overlay (Bottom Right)
      ctx.fillStyle = 'rgba(5, 8, 22, 0.85)';
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 1;
      const mmWidth = 140;
      const mmHeight = 90;
      const mmX = width - mmWidth - 15;
      const mmY = height - mmHeight - 15;

      ctx.fillRect(mmX, mmY, mmWidth, mmHeight);
      ctx.strokeRect(mmX, mmY, mmWidth, mmHeight);

      // Minimap Nodes
      nodes.forEach((n) => {
        const miniX = mmX + (n.x / 800) * mmWidth;
        const miniY = mmY + (n.y / 500) * mmHeight;
        ctx.fillStyle = n.role === 'ROOT_BRIDGE' ? '#00FF88' : '#00D4FF';
        ctx.fillRect(miniX - 2, miniY - 2, 4, 4);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [pan, zoom, animating, selectedVlan, selectedNode]);

  // Click & Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x - rect.width / 2) / zoom + rect.width / 2;
    const clickY = (e.clientY - rect.top - pan.y - rect.height / 2) / zoom + rect.height / 2;

    const clicked = nodes.find(
      (n) => Math.sqrt((n.x - clickX) ** 2 + (n.y - clickY) ** 2) < 22
    );

    if (clicked) {
      setSelectedNode(clicked);
      if (onSelectNode) onSelectNode(clicked);
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-card border border-[#00D4FF]/30 select-none" style={{ height }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#050816]/90 p-2 rounded-xl border border-[#00D4FF]/30 backdrop-blur-md text-xs">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
          className="p-1.5 rounded-lg bg-[#0d1527] border border-[#00D4FF]/30 text-slate-200 hover:text-[#00D4FF] transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="p-1.5 rounded-lg bg-[#0d1527] border border-[#00D4FF]/30 text-slate-200 hover:text-[#00D4FF] transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-1.5 rounded-lg bg-[#0d1527] border border-[#00D4FF]/30 text-slate-200 hover:text-[#00D4FF] transition"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#00D4FF]/20 mx-1" />

        <button
          onClick={() => setAnimating(!animating)}
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 font-mono ${
            animating ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-[#00D4FF]' : 'bg-[#0d1527] border-[#00D4FF]/30 text-slate-400'
          }`}
        >
          {animating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{animating ? 'Pause Flow' : 'Play Flow'}</span>
        </button>

        <div className="w-px h-5 bg-[#00D4FF]/20 mx-1" />

        {/* VLAN Selector Filter */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
          <Layers className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>VLAN:</span>
          {['ALL', '10', '20', '30'].map((vlanId) => (
            <button
              key={vlanId}
              onClick={() => setSelectedVlan(vlanId)}
              className={`px-2 py-0.5 rounded ${
                selectedVlan === vlanId
                  ? 'bg-[#00D4FF] text-[#050816] font-bold'
                  : 'bg-[#0d1527] text-slate-400 border border-[#00D4FF]/20 hover:text-white'
              }`}
            >
              {vlanId}
            </button>
          ))}
        </div>
      </div>

      {/* Topology Legend (Top Right) */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-4 bg-[#050816]/90 px-3.5 py-2 rounded-xl border border-[#00D4FF]/30 backdrop-blur-md text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
          <span>Root Bridge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
          <span>Forwarding</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] shadow-[0_0_6px_#FF4D6D]" />
          <span>Blocked (STP)</span>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-30 w-80 bg-[#0a1020]/95 border border-[#00D4FF]/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#00D4FF]/20 pb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00D4FF]" />
              <span className="font-heading font-bold text-white text-sm">{selectedNode.id}</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-[#0d1527] border border-[#00D4FF]/10">
              <div className="text-slate-500">TYPE</div>
              <div className="text-slate-200 uppercase font-bold">{selectedNode.type}</div>
            </div>
            <div className="p-2 rounded bg-[#0d1527] border border-[#00D4FF]/10">
              <div className="text-slate-500">STP ROLE</div>
              <div className={selectedNode.role === 'ROOT_BRIDGE' ? 'text-[#00FF88] font-bold' : 'text-[#00D4FF]'}>
                {selectedNode.role}
              </div>
            </div>
            <div className="p-2 rounded bg-[#0d1527] border border-[#00D4FF]/10">
              <div className="text-slate-500">MAC ADDRESS</div>
              <div className="text-slate-300">{selectedNode.mac || 'N/A'}</div>
            </div>
            <div className="p-2 rounded bg-[#0d1527] border border-[#00D4FF]/10">
              <div className="text-slate-500">PRIORITY</div>
              <div className="text-[#4CC9F0]">{selectedNode.priority || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopologyCanvas;
