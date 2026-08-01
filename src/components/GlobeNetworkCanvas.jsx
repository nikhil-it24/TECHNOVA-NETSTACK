import React, { useEffect, useRef } from 'react';

const GlobeNetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const radius = Math.min(width, height) * 0.35;
    const globeNodes = [];
    const numNodes = 120;

    // Distribute nodes evenly around a sphere (Fibonacci lattice)
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < numNodes; i++) {
      const y = 1 - (i / (numNodes - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      globeNodes.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
        color: i % 7 === 0 ? '#00FF88' : i % 5 === 0 ? '#FF4D6D' : '#00D4FF'
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Outer glowing ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Second pulsing ring
      const pulseRadius = radius * (1.2 + Math.sin(Date.now() * 0.002) * 0.05);
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotate nodes around sphere center
      const sinX = Math.sin(angleX);
      const cosX = Math.cos(angleX);
      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);

      // Project nodes and store projected coordinates
      const projectedNodes = globeNodes.map((node) => {
        // Rotate Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        node.x = x1;
        node.y = y2;
        node.z = z2;

        // Perspective scale factor
        const perspective = 600;
        const scale = perspective / (perspective + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return { px, py, scale, z: z2, color: node.color };
      });

      // Sort by depth for correct ordering
      projectedNodes.sort((a, b) => a.z - b.z);

      // Draw mesh connections between nearby projected points
      for (let i = 0; i < projectedNodes.length; i++) {
        const n1 = projectedNodes[i];
        if (n1.z < -radius * 0.2) continue; // Skip back face lines for clarity

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n2 = projectedNodes[j];
          if (n2.z < -radius * 0.2) continue;

          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius * 0.45) {
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            const alpha = (1 - dist / (radius * 0.45)) * 0.25 * n1.scale;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 1 * n1.scale;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projectedNodes.forEach((node) => {
        const size = Math.max(1, (node.z + radius) / (radius * 2) * 4);
        const alpha = Math.max(0.2, (node.z + radius) / (radius * 2));

        ctx.beginPath();
        ctx.arc(node.px, node.py, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = size * 3;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      // Core center glowing hub
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.4);
      hubGradient.addColorStop(0, 'rgba(0, 212, 255, 0.2)');
      hubGradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.05)');
      hubGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = hubGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-[450px] relative flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GlobeNetworkCanvas;
