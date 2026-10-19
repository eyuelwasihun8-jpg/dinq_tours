import gsap from 'gsap';
import { EASINGS, DURATIONS, prefersReducedMotion } from './animationConfig';

/**
 * Fast, cinematic page reveal animation
 * Animates main page container from slight scale/opacity with zero lag.
 */
export const animatePageIn = (container, onComplete = null) => {
  if (prefersReducedMotion() || !container) {
    if (onComplete) onComplete();
    return null;
  }

  return gsap.fromTo(
    container,
    {
      opacity: 0,
      y: 15,
    },
    {
      opacity: 1,
      y: 0,
      duration: DURATIONS.fast,
      ease: EASINGS.luxury,
      onComplete: onComplete,
    }
  );
};

export default {
  animatePageIn,
};
