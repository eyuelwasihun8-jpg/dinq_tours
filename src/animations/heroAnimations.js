import gsap from 'gsap';
import { EASINGS, DURATIONS, prefersReducedMotion } from './animationConfig';

/**
 * Executes a cinematic, choreographed hero entrance sequence.
 * Sequence:
 * 1. Background image slow cinematic settle (scale: 1.15 -> 1.0)
 * 2. Eyebrow badge / coordinates ticker entrance
 * 3. Headline line-by-line masked clip reveal
 * 4. Subtitle paragraph blur-to-sharp & fade
 * 5. CTA action cluster entry + magnetic ready
 * 6. Continuous breathing scroll prompt
 */
export const animateHeroSequence = ({
  backgroundElement,
  badgeElement,
  headlineLines = [],
  subtitleElement,
  ctaCluster,
  scrollIndicator,
  floatingStats = [],
}, onComplete = null) => {
  if (prefersReducedMotion()) {
    gsap.set([backgroundElement, badgeElement, ...headlineLines, subtitleElement, ctaCluster, scrollIndicator, ...floatingStats], {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'none',
      clipPath: 'none',
    });
    if (onComplete) onComplete();
    return null;
  }

  const masterTl = gsap.timeline({
    delay: 0.15,
    onComplete: onComplete,
  });

  // 1. Background Image Settling
  if (backgroundElement) {
    masterTl.fromTo(
      backgroundElement,
      { scale: 1.18, opacity: 0.7 },
      { scale: 1.0, opacity: 1, duration: 2.2, ease: 'power2.out' },
      0
    );
  }

  // 2. Eyebrow Badge & Ethiopian Coordinates Ticker
  if (badgeElement) {
    masterTl.fromTo(
      badgeElement,
      { opacity: 0, y: -25 },
      { opacity: 1, y: 0, duration: DURATIONS.normal, ease: EASINGS.editorial },
      0.3
    );
  }

  // 3. Headline Lines (Masked Clip-Path Entrance)
  if (headlineLines && headlineLines.length > 0) {
    masterTl.fromTo(
      headlineLines,
      {
        opacity: 0,
        y: 60,
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      },
      {
        opacity: 1,
        y: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: DURATIONS.slow,
        stagger: 0.14,
        ease: EASINGS.cinematic,
      },
      0.5
    );
  }

  // 4. Subtitle Paragraph
  if (subtitleElement) {
    masterTl.fromTo(
      subtitleElement,
      { opacity: 0, y: 25, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: DURATIONS.normal, ease: EASINGS.luxury },
      0.9
    );
  }

  // 5. CTA Action Cluster
  if (ctaCluster) {
    masterTl.fromTo(
      ctaCluster,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATIONS.normal, ease: EASINGS.bounceSoft },
      1.15
    );
  }

  // 6. Floating Fact Pills / Stats
  if (floatingStats && floatingStats.length > 0) {
    masterTl.fromTo(
      floatingStats,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: DURATIONS.normal, stagger: 0.1, ease: EASINGS.editorial },
      1.3
    );
  }

  // 7. Scroll Indicator Continuous Breathing Pulse
  if (scrollIndicator) {
    masterTl.fromTo(
      scrollIndicator,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: DURATIONS.fast, ease: EASINGS.luxury },
      1.5
    );

    // Continuous subtle bounce loop
    gsap.to(scrollIndicator.querySelector('.scroll-dot') || scrollIndicator, {
      y: 10,
      opacity: 0.3,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 1.8,
    });
  }

  return masterTl;
};

/**
 * Links hero depth elements to scroll position via ScrollTrigger
 */
export const initHeroScrollParallax = ({
  heroContainer,
  backgroundLayer,
  mountainLayer = null,
  textLayer,
}) => {
  if (prefersReducedMotion() || !heroContainer) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroContainer,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.1,
    },
  });

  if (backgroundLayer) {
    tl.to(backgroundLayer, { yPercent: 20, ease: 'none' }, 0);
  }

  if (mountainLayer) {
    tl.to(mountainLayer, { yPercent: 35, ease: 'none' }, 0);
  }

  if (textLayer) {
    tl.to(textLayer, { yPercent: 45, opacity: 0.2, ease: 'none' }, 0);
  }

  return tl;
};

export default {
  animateHeroSequence,
  initHeroScrollParallax,
};
