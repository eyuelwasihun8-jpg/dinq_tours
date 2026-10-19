import gsap from 'gsap';
import { EASINGS, DURATIONS, prefersReducedMotion } from './animationConfig';

/**
 * Curtain clip-path wipe reveal for photographic landscapes
 * Simultaneously scales the inner image down from 1.2 -> 1.0 for a high-end cinematic lens effect.
 */
export const clipPathWipe = (container, innerImage = null, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(container, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' });
    if (innerImage) gsap.set(innerImage, { scale: 1 });
    return null;
  }

  const {
    direction = 'bottom-to-top', // 'left-to-right' | 'bottom-to-top' | 'center-out'
    duration = DURATIONS.slow,
    ease = EASINGS.cinematic,
    delay = 0,
    scrollTrigger = null,
  } = options;

  let initialClip = 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';
  let finalClip = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';

  if (direction === 'left-to-right') {
    initialClip = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
    finalClip = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
  } else if (direction === 'center-out') {
    initialClip = 'inset(50% 50% 50% 50%)';
    finalClip = 'inset(0% 0% 0% 0%)';
  }

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger ? {
      trigger: scrollTrigger.trigger || container,
      start: scrollTrigger.start || 'top 82%',
      toggleActions: 'play none none none',
      ...scrollTrigger,
    } : null,
  });

  tl.fromTo(
    container,
    { clipPath: initialClip },
    {
      clipPath: finalClip,
      duration: duration,
      delay: delay,
      ease: ease,
    },
    0
  );

  if (innerImage) {
    tl.fromTo(
      innerImage,
      { scale: 1.22 },
      {
        scale: 1,
        duration: duration * 1.15,
        ease: EASINGS.editorial,
      },
      0
    );
  }

  return tl;
};

/**
 * Parallax scale on scroll for hero or full-width panorama images
 */
export const parallaxImageScale = (imageElement, container, options = {}) => {
  if (prefersReducedMotion()) return null;

  const { startScale = 1.0, endScale = 1.12, yPercent = 8 } = options;

  return gsap.fromTo(
    imageElement,
    { scale: startScale, yPercent: -yPercent },
    {
      scale: endScale,
      yPercent: yPercent,
      ease: 'none',
      scrollTrigger: {
        trigger: container || imageElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    }
  );
};

/**
 * Crossfade between two active photographs in documentary sliders or mega menus
 */
export const crossfadeImages = (currentImg, nextImg, duration = DURATIONS.fast) => {
  if (prefersReducedMotion()) {
    if (currentImg) gsap.set(currentImg, { opacity: 0 });
    if (nextImg) gsap.set(nextImg, { opacity: 1 });
    return null;
  }

  const tl = gsap.timeline();
  if (currentImg) {
    tl.to(currentImg, { opacity: 0, scale: 0.98, duration: duration, ease: EASINGS.luxury }, 0);
  }
  if (nextImg) {
    tl.fromTo(
      nextImg,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: duration * 1.1, ease: EASINGS.luxury },
      0.05
    );
  }
  return tl;
};

export default {
  clipPathWipe,
  parallaxImageScale,
  crossfadeImages,
};
