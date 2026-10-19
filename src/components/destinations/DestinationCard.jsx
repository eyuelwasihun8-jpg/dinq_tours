import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function DestinationCard({ destination }) {
  return (
    <div
      data-cursor="DISCOVER"
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-stone-900 flex flex-col h-80 sm:h-96 hover:-translate-y-1"
    >
      <img
        src={destination.heroImage}
        alt={destination.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

      {/* Top Region Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md text-stone-200 text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
          {destination.region}
        </span>
        {destination.altitude && (
          <span className="bg-[#C88A2E]/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {destination.altitude}
          </span>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center gap-1.5 text-xs text-[#D4AF7A] font-semibold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Ethiopia</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D4AF7A] transition-colors">
          <Link to={`/destinations/${destination.slug}`}>
            {destination.name}
          </Link>
        </h3>
        <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
          {destination.tagline}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {destination.relatedTourSlugs?.length || 2} Guided Tours Available
          </span>
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF7A] hover:text-white transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
