import React from 'react';
import { Link } from 'react-router-dom';

/* ============================================================ */
/* PASTE YOUR LOGO PATH OR URL HERE                             */
/* ============================================================ */
const LOGO_DARK_BG = '/logo.png';      // For header / light navbar
const LOGO_LIGHT_BG = '/logo.png';     // For footer / dark backgrounds

/**
 * DinqLogoMark - Small icon/emblem only
 */
export function DinqLogoMark({ size = 38, variant = 'dark', className = '' }) {
  const logoSrc = variant === 'light' || variant === 'monochrome-white' 
    ? LOGO_LIGHT_BG 
    : LOGO_DARK_BG;

  return (
    <img
      src={logoSrc}
      alt="DINQ Logo Mark"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 transition-transform duration-300 ${className}`}
    />
  );
}

/**
 * DinqLogo - Full Primary Brand Logo
 */
export function DinqLogo({
  variant = 'dark',
  size = 'md',
  showSubtext = true,
  className = '',
  to = '/',
}) {
  const isLight = variant === 'light' || variant === 'monochrome-white';
  const logoSrc = isLight ? LOGO_LIGHT_BG : LOGO_DARK_BG;

  // Base layout heights (kept slim so it never stretches any container)
  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-14 sm:h-18', // For footer
  };

  const content = (
    <div className="inline-flex items-center select-none">
      <img
        src={logoSrc}
        alt="DINQ Ethiopia Tours"
        className={`${sizeClasses[size] || 'h-8'} w-auto max-w-[220px] object-contain transition-transform duration-300 ${className}`}
      />
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none"
        aria-label="DINQ Ethiopia Tours Homepage"
      >
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * DinqLogoCompact - Compact mobile lockup
 */
export function DinqLogoCompact({ variant = 'dark', className = '', to = '/' }) {
  return (
    <DinqLogo
      variant={variant}
      size="sm"
      className={className}
      to={to}
    />
  );
}

export default DinqLogo;