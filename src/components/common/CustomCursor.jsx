import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from '../../animations/animationConfig';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const textRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices or if user prefers reduced motion
    if (isTouchDevice() || prefersReducedMotion()) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const xCursor = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const yCursor = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const xFollower = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
    const yFollower = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      const { clientX, clientY } = e;
      xCursor(clientX);
      yCursor(clientY);
      xFollower(clientX);
      yFollower(clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Scan for elements with data-cursor attributes
    const handleElementHover = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovered(true);
      } else {
        const isClickable = e.target.closest('a, button, input, select, textarea, [role="button"]');
        if (isClickable) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice() || prefersReducedMotion()) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-9999 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Core Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#C88A2E] transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center rounded-full border border-[#C88A2E]/60 backdrop-blur-2xs transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? cursorText
              ? 'w-20 h-20 bg-[#18181B]/85 border-[#C88A2E] text-white'
              : 'w-12 h-12 bg-[#C88A2E]/20 border-[#C88A2E]'
            : 'w-10 h-10 bg-transparent'
        }`}
      >
        {cursorText && (
          <span
            ref={textRef}
            className="text-[9px] font-bold tracking-widest text-[#D4AF7A] uppercase select-none animate-in fade-in zoom-in-75 duration-200"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
