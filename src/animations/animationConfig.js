import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

/**
 * Global animation configuration constants and easing curves
 */
export const EASINGS = {
  luxury: 'power3.out',
  cinematic: 'power4.out',
  editorial: 'expo.out',
  gentle: 'power2.inOut',
  bounceSoft: 'back.out(1.4)',
  linear: 'none',
  smoothScroll: 'power1.out',
};

export const DURATIONS = {
  micro: 0.25,
  fast: 0.45,
  normal: 0.75,
  slow: 1.1,
  cinematic: 1.5,
  epic: 2.2,
};

/**
 * Checks if the user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Helper to check if device is mobile or touch
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Creates a responsive GSAP matchMedia context
 */
export const createResponsiveContext = (setupFunction) => {
  const mm = gsap.matchMedia();
  return mm;
};

/**
 * Centralized GSAP ScrollTrigger refresher
 */
export const refreshScrollTrigger = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
};

export default {
  EASINGS,
  DURATIONS,
  prefersReducedMotion,
  isTouchDevice,
  refreshScrollTrigger,
};
