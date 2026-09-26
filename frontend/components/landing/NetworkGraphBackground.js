'use client';

import React, { useEffect, useRef } from 'react';

export default function NetworkGraphBackground({ density = 65, interactive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      drawStaticNetwork(ctx, width, height);
      return;
    }

    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const nodeCount = Math.floor((width * height) / 18000) || density;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
        isCritical: Math.random() < 0.12,
      });
    }

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        loop(performance.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(loop);

      const delta = currentTime - lastTime;
      if (delta < 16) return;
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += node.pulseSpeed;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.7;

        const dxMouse = mouse.x - node.x;
        const dyMouse = mouse.y - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const isNearMouse = distMouse < mouse.radius;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = node.x - nodeB.x;
          const dy = node.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isNearMouse ? 160 : 120;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isNearMouse ? 0.7 : 0.28);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodeB.x, nodeB.y);

            if (node.isCritical || nodeB.isCritical || isNearMouse) {
              ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 1.4})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);

        if (node.isCritical) {
          ctx.fillStyle = 'rgba(34, 211, 238, 0.7)';
          ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
          ctx.shadowBlur = 10;
        } else if (isNearMouse) {
          ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
          ctx.shadowColor = 'rgba(34, 211, 238, 0.7)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.28)';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    loop(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none z-0 opacity-40" style={{ background: 'transparent' }} />;
}

function drawStaticNetwork(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 26; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = x1 + (Math.random() - 0.5) * 220;
    const y2 = y1 + (Math.random() - 0.5) * 220;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  for (let i = 0; i < 22; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
    ctx.arc(x, y, Math.random() * 2 + 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}
