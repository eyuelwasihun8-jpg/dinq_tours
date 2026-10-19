import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Clock,
  Bed,
  Utensils,
  Mountain,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Camera
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../animations/animationConfig';

export default function InteractiveItineraryTimeline({ itinerary = [], tourTitle = '' }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [expandedDays, setExpandedDays] = useState({ 0: true, 1: true });
  const containerRef = useRef(null);
  const progressLineRef = useRef(null);
  const dayRefs = useRef([]);

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const all = {};
    itinerary.forEach((_, i) => (all[i] = true));
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  const activeDay = itinerary[activeDayIdx] || itinerary[0];

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      // Progress line fill on scroll
      if (progressLineRef.current && containerRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 50%',
              end: 'bottom 80%',
              scrub: 0.4,
            },
          }
        );
      }

      // Track active day as user scrolls
      dayRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveDayIdx(idx),
          onEnterBack: () => setActiveDayIdx(idx),
        });
      });
    });

    return () => mm.revert();
  }, [itinerary]);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Itinerary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C88A2E] mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Expedition Route</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Day-by-Day Detailed Itinerary
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {itinerary.length} Days of authentic encounters and certified local guidance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="font-semibold text-[#C88A2E] hover:underline px-2 py-1"
          >
            Expand All Days
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="font-semibold text-stone-500 hover:text-stone-800 px-2 py-1"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Main Grid: Scrolling Timeline (Left) + Pinned Active Day Visual (Right on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Day-by-Day Accordion with Vertical Progress Line */}
        <div className="lg:col-span-7 relative pl-6 sm:pl-8 space-y-5">
          {/* Background Track Line */}
          <div className="absolute top-4 bottom-4 left-2.5 sm:left-3.5 w-0.5 bg-stone-200" />

          {/* Animated Gold Progress Line */}
          <div
            ref={progressLineRef}
            className="absolute top-4 bottom-4 left-2.5 sm:left-3.5 w-0.5 bg-linear-to-b from-[#C88A2E] via-[#E5B869] to-[#C88A2E] origin-top hidden lg:block"
          />

          {itinerary.map((dayItem, idx) => {
            const isExpanded = expandedDays[idx];
            const isActive = activeDayIdx === idx;

            return (
              <div
                key={idx}
                ref={(el) => (dayRefs.current[idx] = el)}
                className={`relative rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-[#C88A2E] bg-white shadow-md ring-1 ring-[#C88A2E]/30'
                    : 'border-[#E7E1D7] bg-white/80 hover:bg-white hover:border-stone-300'
                }`}
              >
                {/* Timeline Waypoint Node Marker */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C88A2E] border-white ring-4 ring-[#C88A2E]/25 scale-110 shadow-sm'
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-stone-400'}`} />
                </div>

                {/* Day Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className="w-full p-4 sm:p-5 flex items-start justify-between text-left gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-[#C88A2E] text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        Day {dayItem.day}
                      </span>
                      {dayItem.altitude && (
                        <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                          <Mountain className="w-3 h-3 text-[#C88A2E]" />
                          <span>{dayItem.altitude}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                      {dayItem.title}
                    </h3>
                  </div>

                  <div className="p-1 text-stone-400 hover:text-stone-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Day Body Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-stone-100 text-xs sm:text-sm text-stone-600 animate-in fade-in duration-200">
                    <p className="leading-relaxed whitespace-pre-line text-stone-700">
                      {dayItem.description}
                    </p>

                    {/* Highlights & Logistics Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] bg-[#FAF7F2] p-3 rounded-xl border border-[#EBE5DA]">
                      <div className="flex items-center gap-2">
                        <Bed className="w-3.5 h-3.5 text-[#C88A2E] shrink-0" />
                        <span><strong>Overnight:</strong> {dayItem.accommodation || 'Handpicked Heritage Hotel / Lodge'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5 text-[#C88A2E] shrink-0" />
                        <span><strong>Meals:</strong> {dayItem.meals || 'Breakfast, Lunch & Dinner Included'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Sticky Active Day Highlight Card (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28">
          {activeDay && (
            <div className="bg-stone-900 text-white rounded-3xl overflow-hidden border border-stone-800 shadow-2xl space-y-4 p-6 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Active Expedition Stage
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {activeDay.day} of {itinerary.length}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#D4AF7A] uppercase tracking-wider">
                  Day {activeDay.day}
                </div>
                <h4 className="font-serif text-xl font-bold text-white mt-0.5">
                  {activeDay.title}
                </h4>
              </div>

              <div className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed max-h-48 overflow-y-auto no-scrollbar">
                {activeDay.description}
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#C88A2E]" />
                    <span>Lodging:</span>
                  </span>
                  <span className="text-stone-200 font-medium">{activeDay.accommodation || 'Scenic Lodge / Camp'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#C88A2E]" />
                    <span>Meals:</span>
                  </span>
                  <span className="text-stone-200 font-medium">{activeDay.meals || 'B, L, D Included'}</span>
                </div>

                {activeDay.altitude && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-[#C88A2E]" />
                      <span>Elevation:</span>
                    </span>
                    <span className="text-[#D4AF7A] font-bold">{activeDay.altitude}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
