import gsap from 'gsap';
import { EASINGS, isTouchDevice, prefersReducedMotion } from './animationConfig';

/**
 * Magnetic Button Interaction
 * Pulls the button slightly toward the pointer with buttery performance using gsap.quickTo.
 */
export const initMagneticButton = (element, intensity = 0.3) => {
  if (isTouchDevice() || prefersReducedMotion() || !element) return () => {};

  const xTo = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = element.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * intensity;
    const deltaY = (clientY - centerY) * intensity;

    xTo(deltaX);
    yTo(deltaY);
  };

  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Editorial Image Follow Cursor Interaction
 * When hovering over destination names, a floating photograph follows the pointer.
 */
export const initImageCursorFollow = (container, floatingImageWrapper) => {
  if (isTouchDevice() || prefersReducedMotion() || !container || !floatingImageWrapper) return () => {};

  const xTo = gsap.quickTo(floatingImageWrapper, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(floatingImageWrapper, 'y', { duration: 0.5, ease: 'power3.out' });

  let isInside = false;

  const handleMouseMove = (e) => {
    if (!isInside) return;
    const rect = container.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    xTo(posX);
    yTo(posY);
  };

  const handleMouseEnter = () => {
    isInside = true;
    gsap.to(floatingImageWrapper, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: EASINGS.luxury,
    });
  };

  const handleMouseLeave = () => {
    isInside = false;
    gsap.to(floatingImageWrapper, {
      opacity: 0,
      scale: 0.85,
      duration: 0.3,
      ease: 'power2.in',
    });
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseenter', handleMouseEnter);
  container.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Subtle 3D Card Hover Perspective Tilt
 */
export const initCard3DTilt = (cardElement, maxTilt = 5) => {
  if (isTouchDevice() || prefersReducedMotion() || !cardElement) return () => {};

  const handleMouseMove = (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(cardElement, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.4,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardElement, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.6,
    });
  };

  cardElement.addEventListener('mousemove', handleMouseMove);
  cardElement.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    cardElement.removeEventListener('mousemove', handleMouseMove);
    cardElement.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export default {
  initMagneticButton,
  initImageCursorFollow,
  initCard3DTilt,
};
