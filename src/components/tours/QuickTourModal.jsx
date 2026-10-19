import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, ArrowRight, Check, MapPin, Clock, Star, Calendar, 
  Users, Mountain, Globe, Compass 
} from 'lucide-react';

export default function QuickTourModal({ tour, onClose, onOpenInquiry }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!tour) return;

    // Lock background scroll
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Focus modal
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [tour, onClose]);

  if (!tour) return null;

  // Safe fallbacks for optional fields
  const highlights = tour.highlights || [];
  const overview = tour.overview || tour.tagline || 'A curated Ethiopian expedition.';
  const shortOverview = overview.length > 280 ? overview.slice(0, 280) + '...' : overview;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 focus:outline-none flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: 'calc(100vh - 1rem)' }}
      >
        
        {/* ============================================================ */}
        {/* COMPACT IMAGE HEADER (fixed height — not oversized)          */}
        {/* ============================================================ */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-900 shrink-0 overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Close button — top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition-colors focus:ring-2 focus:ring-[#C88A2E] focus:outline-none z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
            <div className="flex items-center gap-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF7A]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{tour.destination}</span>
              <span className="text-stone-400">•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{tour.durationDays}D/{tour.durationNights}N</span>
            </div>
            <h2 id="quick-modal-title" className="font-serif text-lg sm:text-2xl font-bold leading-tight line-clamp-2">
              {tour.title}
            </h2>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SCROLLABLE CONTENT AREA — this is the fix!                   */}
        {/* ============================================================ */}
        <div 
          className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Category + Rating Row */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
            {tour.category && (
              <span className="text-[10px] font-bold text-[#C88A2E] uppercase tracking-wider">
                {tour.category}
              </span>
            )}
            {tour.rating && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-stone-900">{tour.rating}</span>
                {tour.reviewCount && (
                  <span className="text-stone-500">({tour.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-2">
              Tour Overview
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {shortOverview}
            </p>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-2">
                Key Highlights
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {highlights.slice(0, 4).map((h, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EBE5DA]"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C88A2E] mt-0.5 shrink-0" />
                    <span className="text-xs text-stone-700 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Snapshot Grid */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-2">
              Trip Snapshot
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tour.groupSize && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                  <Users className="w-4 h-4 text-[#C88A2E] mx-auto mb-1" />
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Group Size</div>
                  <div className="text-[11px] font-bold text-stone-800 mt-0.5 leading-tight">
                    {tour.groupSize}
                  </div>
                </div>
              )}
              {tour.difficulty && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                  <Mountain className="w-4 h-4 text-[#C88A2E] mx-auto mb-1" />
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Difficulty</div>
                  <div className="text-[11px] font-bold text-stone-800 mt-0.5 leading-tight">
                    {tour.difficulty}
                  </div>
                </div>
              )}
              {tour.season && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                  <Calendar className="w-4 h-4 text-[#C88A2E] mx-auto mb-1" />
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Best Season</div>
                  <div className="text-[11px] font-bold text-stone-800 mt-0.5 leading-tight">
                    {tour.season}
                  </div>
                </div>
              )}
              {tour.facts?.language && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                  <Globe className="w-4 h-4 text-[#C88A2E] mx-auto mb-1" />
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Languages</div>
                  <div className="text-[11px] font-bold text-stone-800 mt-0.5 leading-tight">
                    {tour.facts.language}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Dates Preview */}
          {tour.upcomingDates && tour.upcomingDates.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-2">
                Next Departure Dates
              </h4>
              <div className="space-y-1.5">
                {tour.upcomingDates.slice(0, 3).map((date, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C88A2E]" />
                      <span className="font-bold text-stone-800">{date.dates}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      {date.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* FOOTER BAR — Price + CTAs (sticky at bottom)                 */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF7F2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Verified Price From
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                {tour.priceFromUSD}
              </span>
              {tour.priceFromETB && (
                <span className="text-[10px] text-stone-500 hidden sm:inline">
                  / {tour.priceFromETB}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInquiry(tour);
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-sm"
              >
                Inquire
              </button>
            )}
            <Link
              to={`/tours/${tour.slug}`}
              onClick={onClose}
              className="flex-1 sm:flex-initial btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>View Full Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}