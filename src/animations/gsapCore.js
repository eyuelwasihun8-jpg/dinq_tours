import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register core plugins once
gsap.registerPlugin(ScrollTrigger);

// Standardized easing and durations for luxury feel
export const ANIMATION_CONFIG = {
  ease: "power3.out",
  easeSlow: "power4.inOut",
  duration: 1.2,
  durationSlow: 1.8,
  stagger: 0.1,
};

// Reusable reduced motion check
export const isReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};