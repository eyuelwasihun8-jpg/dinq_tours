import React, { useRef, useEffect } from 'react';
import { initMagneticButton } from '../../animations/hoverAnimations';

export default function MagneticButton({ children, className = '', intensity = 0.35, ...props }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const cleanup = initMagneticButton(el, intensity);
    return cleanup;
  }, [intensity]);

  return (
    <div ref={buttonRef} className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}
