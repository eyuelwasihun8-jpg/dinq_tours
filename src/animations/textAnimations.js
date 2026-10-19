import gsap from 'gsap';
import { EASINGS, DURATIONS, prefersReducedMotion } from './animationConfig';

/**
 * Line-by-line reveal animation for large editorial headers
 * Wraps child lines in overflow-hidden wrappers and reveals them smoothly from below.
 */
export const revealLines = (elements, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return null;
  }

  const {
    delay = 0,
    duration = DURATIONS.slow,
    stagger = 0.12,
    ease = EASINGS.cinematic,
    y = 50,
    scrollTrigger = null,
  } = options;

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger ? {
      trigger: scrollTrigger.trigger || elements,
      start: scrollTrigger.start || 'top 85%',
      toggleActions: scrollTrigger.toggleActions || 'play none none none',
      ...scrollTrigger,
    } : null,
  });

  tl.fromTo(
    elements,
    {
      opacity: 0,
      y: y,
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    },
    {
      opacity: 1,
      y: 0,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: duration,
      stagger: stagger,
      ease: ease,
      delay: delay,
    }
  );

  return tl;
};

/**
 * Subtle Blur-to-Sharp luxury typography reveal
 */
export const blurToSharpReveal = (element, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, filter: 'blur(0px)', y: 0 });
    return null;
  }

  const {
    delay = 0,
    duration = DURATIONS.normal,
    y = 20,
    ease = EASINGS.editorial,
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: y,
      filter: 'blur(10px)',
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: duration,
      delay: delay,
      ease: ease,
      scrollTrigger: scrollTrigger ? {
        trigger: scrollTrigger.trigger || element,
        start: scrollTrigger.start || 'top 88%',
        toggleActions: 'play none none none',
        ...scrollTrigger,
      } : null,
    }
  );
};

/**
 * Staggered word or span reveal
 */
export const staggerWords = (elements, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return null;
  }

  const {
    delay = 0,
    duration = DURATIONS.fast,
    stagger = 0.05,
    ease = EASINGS.luxury,
    scrollTrigger = null,
  } = options;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 18,
    },
    {
      opacity: 1,
      y: 0,
      duration: duration,
      stagger: stagger,
      ease: ease,
      delay: delay,
      scrollTrigger: scrollTrigger ? {
        trigger: scrollTrigger.trigger || elements,
        start: scrollTrigger.start || 'top 85%',
        ...scrollTrigger,
      } : null,
    }
  );
};

/**
 * Large background typography parallax scrub
 */
export const scrubTypographyParallax = (element, trigger, options = {}) => {
  if (prefersReducedMotion()) return null;

  const { xDistance = -120, yDistance = 0, scrub = 1 } = options;

  return gsap.to(element, {
    x: xDistance,
    y: yDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: scrub,
    },
  });
};

export default {
  revealLines,
  blurToSharpReveal,
  staggerWords,
  scrubTypographyParallax,
};
