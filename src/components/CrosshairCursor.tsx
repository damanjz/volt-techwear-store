"use client";

import { useEffect, useRef, useState } from "react";

export default function CrosshairCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!isVisible) setIsVisible(true);
        const target = e.target as HTMLElement;
        setIsHovering(
          target.closest("[data-cursor='pointer']") !== null ||
          target.closest("a") !== null ||
          target.closest("button") !== null ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
        );
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        }
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ${
        isClicking ? 'scale-[0.8]' : isHovering ? 'scale-150' : 'scale-100'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Outer targeting brackets */}
      <div className={`w-full h-full border border-foreground transition-all duration-300 ${isHovering ? 'opacity-100 rotate-45' : 'opacity-40'} relative`}>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-background"></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-background"></div>
         <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-background"></div>
         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 bg-background"></div>
      </div>
      {/* Center dot */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-foreground rounded-full transition-all ${isHovering ? 'scale-0' : 'scale-100'}`}></div>
    </div>
  );
}
