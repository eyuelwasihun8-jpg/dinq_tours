import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mountain, Sparkles, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from '../../animations/animationConfig';
import destinationsData from '../../data/destinationsData';

export default function DestinationCursorList() {
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const [activeDest, setActiveDest] = useState(destinationsData[0]);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const container = containerRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;

    const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });

    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!isHovering) return;
      const rect = container.getBoundingClientRect();
      const posX = e.clientX - rect.left - 160; // center offset
      const posY = e.clientY - rect.top - 120;
      xTo(posX);
      yTo(posY);
    };

    const handleMouseEnter = () => {
      isHovering = true;
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(preview, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.in' });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#E7E1D7] overflow-hidden"
    >
      {/* Floating Cursor-Following Image Preview (Desktop Only) */}
      <div
        ref={previewRef}
        className="pointer-events-none absolute top-0 left-0 z-30 hidden lg:block w-80 h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C88A2E] opacity-0 transform scale-75 transition-opacity"
        style={{ willChange: 'transform' }}
      >
        {activeDest && (
          <div className="relative w-full h-full bg-stone-900">
            <img
              src={activeDest.heroImage}
              alt={activeDest.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF7A]">
                {activeDest.altitude} • {activeDest.region}
              </div>
              <div className="font-serif text-sm font-bold truncate">
                {activeDest.tagline}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
              Editorial Destination Index
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-2">
              Where Wonders Unfold
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mt-1">
              Hover across each province on desktop to reveal high-resolution landscape previews. Click to enter the comprehensive field guide.
            </p>
          </div>

          <Link
            to="/destinations"
            className="btn-dark px-5 py-2.5 rounded-xl text-xs font-semibold self-start md:self-auto inline-flex items-center gap-1.5"
          >
            <span>Explore All 11 Destinations</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial List */}
        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {destinationsData.map((dest, idx) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              onMouseEnter={() => setActiveDest(dest)}
              className="group py-5 sm:py-6 flex items-center justify-between transition-colors hover:bg-white/60 px-3 sm:px-6 rounded-xl"
            >
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="text-xs sm:text-sm font-mono text-stone-400 group-hover:text-[#C88A2E] transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 group-hover:text-[#C88A2E] group-hover:translate-x-2 transition-all duration-300">
                    {dest.name}
                  </h3>
                  <div className="text-xs text-stone-500 line-clamp-1 mt-0.5 sm:hidden">
                    {dest.tagline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="hidden md:inline-block text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full group-hover:bg-amber-50 group-hover:text-[#C88A2E] transition-colors">
                  {dest.region} • {dest.altitude}
                </span>
                <div className="w-8 h-8 rounded-full border border-stone-300 group-hover:border-[#C88A2E] group-hover:bg-[#C88A2E] text-stone-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
