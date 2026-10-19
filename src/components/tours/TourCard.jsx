import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, Eye, Star, MapPin, Sparkles } from 'lucide-react';

export default function TourCard({ tour, onQuickPreview }) {
  return (
    <div
      data-cursor="JOURNEY"
      className="bg-white rounded-2xl overflow-hidden border border-[#E7E1D7] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group h-full hover:-translate-y-1"
    >
      {/* Tour Image with Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
        <Link to={`/tours/${tour.slug}`} className="block w-full h-full">
          <img
            src={tour.heroImage}
            alt={tour.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-[#18181B]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {tour.durationDays} Days
            </span>
            {tour.isUpcoming && (
              <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Upcoming</span>
              </span>
            )}
          </div>

          {/* Quick Preview Button (Fixes Problem 21 - secondary action only) */}
          {onQuickPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickPreview(tour);
              }}
              className="pointer-events-auto bg-white/90 hover:bg-white text-stone-800 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
              title="Quick Preview"
              aria-label={`Quick preview for ${tour.title}`}
            >
              <Eye className="w-4 h-4 text-stone-700" />
            </button>
          )}
        </div>

        {/* Bottom Destination & Difficulty Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white pointer-events-none">
          <div className="flex items-center gap-1 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF7A]" />
            <span>{tour.destination}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{tour.rating}</span>
            <span className="text-stone-300">({tour.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#C88A2E]">
            {tour.category}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug group-hover:text-[#C88A2E] transition-colors">
            <Link to={`/tours/${tour.slug}`}>
              {tour.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {tour.tagline}
          </p>

          {/* Highlights Mini-list */}
          <ul className="pt-2 space-y-1 text-xs text-stone-600">
            {tour.highlights.slice(0, 2).map((h, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#C88A2E] font-bold shrink-0">•</span>
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & CTA Row */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
              Starting From
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                {tour.priceFromUSD}
              </span>
              <span className="text-xs text-stone-500">
                / {tour.priceFromETB}
              </span>
            </div>
          </div>

          <Link
            to={`/tours/${tour.slug}`}
            className="btn-gold px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm group-hover:translate-x-0.5 transition-transform"
          >
            <span>View Full Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
