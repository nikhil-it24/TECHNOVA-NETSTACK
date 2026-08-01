import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width * 0.06), 70);
    const particles = [];
    const colors = ['#00D4FF', '#4CC9F0', '#00FF88', '#FF4D6D'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Packets moving along links
    const packets = [];
    for (let i = 0; i < 15; i++) {
      packets.push({
        p1: Math.floor(Math.random() * particleCount),
        p2: Math.floor(Math.random() * particleCount),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        color: Math.random() > 0.5 ? '#00D4FF' : '#00FF88'
      });
    }

    const mouse = { x: null, y: null, maxRadius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint grid background
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.pulse += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.maxRadius - dist) / mouse.maxRadius;
            p.x -= Math.cos(angle) * force * 2;
            p.y -= Math.sin(angle) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections between close particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 140) * 0.25;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Animate packet flow on links
      packets.forEach((packet) => {
        const p1 = particles[packet.p1];
        const p2 = particles[packet.p2];

        if (p1 && p2) {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            packet.progress += packet.speed;
            if (packet.progress > 1) {
              packet.progress = 0;
              packet.p1 = Math.floor(Math.random() * particleCount);
              packet.p2 = Math.floor(Math.random() * particleCount);
            }

            const currX = p1.x + (p2.x - p1.x) * packet.progress;
            const currY = p1.y + (p2.y - p1.y) * packet.progress;

            ctx.beginPath();
            ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = packet.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = packet.color;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            packet.p1 = Math.floor(Math.random() * particleCount);
            packet.p2 = Math.floor(Math.random() * particleCount);
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
