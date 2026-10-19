import gsap from 'gsap';
import { EASINGS, DURATIONS, prefersReducedMotion } from './animationConfig';

/**
 * Pinned Horizontal Scroll Experience for Desktop
 * Allows travelers to "glide" through Ethiopian regions (Addis -> Simien -> Danakil -> Omo -> Bale -> Lalibela)
 * Automatically adapts on mobile/tablet to fluid horizontal touch-scrolling.
 */
export const initHorizontalScroll = (container, track, options = {}) => {
  if (prefersReducedMotion() || !container || !track) return null;

  const mm = gsap.matchMedia();

  // Desktop Only: Pin & translate track horizontally
  mm.add('(min-width: 1024px)', () => {
    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth + 120;

    if (scrollDistance <= 0) return;

    gsap.to(track, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1.1,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        invalidateOnRefresh: true,
      },
    });
  });

  return mm;
};

/**
 * Pinned Interactive Itinerary Journey
 * Pin visual highlight card while day-by-day stops scroll past,
 * updating the active day marker and route line.
 */
export const initPinnedItinerary = ({
  container,
  progressLine,
  daysList = [],
  onDayChange = null,
}) => {
  if (prefersReducedMotion() || !container) return null;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', () => {
    // 1. Progress line drawing on scroll
    if (progressLine) {
      gsap.fromTo(
        progressLine,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      );
    }

    // 2. Observe each day element to trigger active change
    daysList.forEach((dayEl, index) => {
      if (!dayEl) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: dayEl,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => onDayChange && onDayChange(index),
          onEnterBack: () => onDayChange && onDayChange(index),
        },
      });
    });
  });

  return mm;
};

/**
 * Staggered Entrance for Card Grids (Tours, Destinations, Guides)
 */
export const staggerCardsReveal = (cards, trigger = null, options = {}) => {
  if (prefersReducedMotion()) {
    gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
    return null;
  }

  const {
    stagger = 0.1,
    y = 40,
    duration = DURATIONS.normal,
    ease = EASINGS.editorial,
    start = 'top 85%',
  } = options;

  return gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: y,
      scale: 0.96,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: duration,
      stagger: stagger,
      ease: ease,
      scrollTrigger: {
        trigger: trigger || cards[0],
        start: start,
        toggleActions: 'play none none none',
      },
    }
  );
};

/**
 * Authentic Animated Number Counter
 * Interpolates from 0 to target number when scrolling into view
 */
export const animateCounter = (element, targetNumber, options = {}) => {
  if (!element) return;
  if (prefersReducedMotion()) {
    element.textContent = targetNumber.toLocaleString();
    return null;
  }

  const { duration = 1.8, suffix = '', prefix = '', decimals = 0 } = options;

  const obj = { val: 0 };
  return gsap.to(obj, {
    val: targetNumber,
    duration: duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      const formatted = obj.val.toFixed(decimals);
      element.textContent = `${prefix}${Number(formatted).toLocaleString()}${suffix}`;
    },
  });
};

/**
 * Animated SVG Route Path Drawing
 */
export const animateSvgPath = (pathElement, trigger = null, options = {}) => {
  if (!pathElement) return null;
  if (prefersReducedMotion()) return null;

  const pathLength = pathElement.getTotalLength ? pathElement.getTotalLength() : 1000;

  gsap.set(pathElement, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });

  return gsap.to(pathElement, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || pathElement,
      start: 'top 80%',
      end: 'bottom 40%',
      scrub: 1.2,
    },
  });
};

export default {
  initHorizontalScroll,
  initPinnedItinerary,
  staggerCardsReveal,
  animateCounter,
  animateSvgPath,
};
