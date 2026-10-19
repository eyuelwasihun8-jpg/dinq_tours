import gsap from 'gsap';
import { prefersReducedMotion } from './animationConfig';

/**
 * Multi-layer depth parallax
 * Elements with different data-speed attributes move at varied rates on scroll.
 */
export const initMultiLayerParallax = (container, layers = []) => {
  if (prefersReducedMotion() || !container) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.1,
    },
  });

  layers.forEach(({ element, speed = 1, direction = 'y' }) => {
    if (!element) return;
    const movement = speed * 100;
    if (direction === 'y') {
      tl.fromTo(element, { yPercent: -movement / 2 }, { yPercent: movement / 2, ease: 'none' }, 0);
    } else {
      tl.fromTo(element, { xPercent: -movement / 2 }, { xPercent: movement / 2, ease: 'none' }, 0);
    }
  });

  return tl;
};

/**
 * Giant Background Typography Parallax
 * E.g., "ETHIOPIA", "LALIBELA", "DANAKIL" moving slowly horizontally as user scrolls
 */
export const initTypographyParallax = (textElement, trigger, options = {}) => {
  if (prefersReducedMotion() || !textElement) return null;

  const { distance = -180, scrub = 1 } = options;

  return gsap.fromTo(
    textElement,
    { x: 0 },
    {
      x: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || textElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrub,
      },
    }
  );
};

export default {
  initMultiLayerParallax,
  initTypographyParallax,
};
