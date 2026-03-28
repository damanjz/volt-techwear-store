"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Set colors based on theme
    const isDark = theme === 'dark';
    const bgBase = isDark ? "#0a0a0a" : "#f4f4f5";
    
    // We'll use Volt green and Cyber red for dark mode, and sleek greys for light mode
    const particleColor = isDark ? "rgba(212, 255, 51, " : "rgba(24, 24, 27, "; // Volt or Foreground
    const lineColor = isDark ? "rgba(255, 26, 79, " : "rgba(24, 24, 27, "; // Red or Foreground

    // Particle Configuration
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 80;
    const maxDistance = 150;
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor + (isDark ? "0.6)" : "0.3)");
        ctx.fill();
        
        if (isDark) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(212, 255, 51, 0.8)";
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    // Initialize particles
    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initial sizing
    resizeCanvas();
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = bgBase;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reset shadow for lines
      ctx.shadowBlur = 0;

      // Update and draw particles, and connect them
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Opacity based on distance
            const opacity = (1 - distance / maxDistance) * (isDark ? 0.2 : 0.1);
            ctx.strokeStyle = lineColor + opacity + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
      />
      {/* Subtle texture overlay for premium matte finish */}
      <div 
        className="fixed inset-0 w-full h-full -z-40 pointer-events-none mix-blend-overlay opacity-[0.03]"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      ></div>
    </>
  );
}
