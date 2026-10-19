// src/components/animations/CustomCursor.jsx
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const [isTouch, setIsTouch] = useState(true); // Default to true to prevent flash on mobile

  useEffect(() => {
    // Strictly disable on mobile/touch screens or reduced motion
    const hasTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      window.innerWidth < 1024;

    if (hasTouch) {
      setIsTouch(true);
      return;
    }

    setIsTouch(false);
    const cursor = cursorRef.current;
    const text = textRef.current;
    if (!cursor || !text) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleHover = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('select') || target.closest('input')) {
        gsap.to(cursor, {
          scale: 2.2,
          backgroundColor: 'rgba(200, 138, 46, 0.1)',
          border: '0.5px solid rgba(200, 138, 46, 0.5)',
          duration: 0.25,
        });
      }
      if (target.closest('.img-zoom-container')) {
        gsap.to(cursor, { scale: 3.5, backgroundColor: 'rgba(24, 24, 27, 0.85)', border: 'none', duration: 0.25 });
        text.innerHTML = 'VIEW';
        gsap.to(text, { opacity: 1, duration: 0.2 });
      }
    };

    const handleHoverOut = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'transparent',
        border: '1.5px solid rgba(212, 175, 122, 0.6)',
        duration: 0.25,
      });
      gsap.to(text, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseover', handleHover);
    document.body.addEventListener('mouseout', handleHoverOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseover', handleHover);
      document.body.removeEventListener('mouseout', handleHoverOut);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-[1.5px] border-[#D4AF7A]/60 pointer-events-none z-[99999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 backdrop-blur-[2px]"
      style={{ pointerEvents: 'none' }}
    >
      <span ref={textRef} className="text-[5px] font-bold tracking-widest text-white opacity-0 pointer-events-none uppercase"></span>
    </div>
  );
}