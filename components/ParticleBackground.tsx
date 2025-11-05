"use client";

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Detect dark mode
    const isDarkMode = () => {
      return Boolean(canvas.closest('.dark'));
    };

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      baseX: number;
      baseY: number;
    }

    const particles: Particle[] = [];
    const particleCount = 100; // Increased from 100

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 3 + 1, // Increased size
        speedX: Math.random() * 1 - 0.5, // Faster movement
        speedY: Math.random() * 1 - 0.5
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const darkMode = isDarkMode();
      
      // Use different colors based on mode
      const particleColor = darkMode ? '#14b8a6' : 'rgba(13,148,136,0.7)';
      const glowColor = darkMode ? '#14b8a6' : 'rgba(13,148,136,0.4)';
      const particleOpacity = darkMode ? 0.5 : 0.35;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particleOpacity;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = darkMode ? 10 : 6;
        ctx.shadowColor = glowColor;

        // Draw connections
        for (let j = i; j < particleCount; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(
            Math.pow(p.x - p2.x, 2) + 
            Math.pow(p.y - p2.y, 2)
          );

          if (distance < 150) { // Increased connection distance
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineOpacity = Math.max(0, darkMode ? (0.3 - distance / 600) : (0.22 - distance / 700));
            ctx.strokeStyle = `rgba(13, 148, 136, ${lineOpacity})`; // More visible lines
            ctx.lineWidth = 1; // Thicker lines
            ctx.stroke();
          }
        }
        
        ctx.shadowBlur = 0; // Reset shadow
        ctx.globalAlpha = 1;

        // Move particles
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Mouse interaction - push particles away
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 150;
        const force = (maxDistance - distance) / maxDistance;
        
        if (distance < maxDistance) {
          p.x -= forceDirectionX * force * 5;
          p.y -= forceDirectionY * force * 5;
        }

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

export default ParticleBackground;
