import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, ArrowRight, Sparkles, Filter, Calendar } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import TripFinder from '../components/common/TripFinder';
import TourCard from '../components/tours/TourCard';
import QuickTourModal from '../components/tours/QuickTourModal';
import InquiryModal from '../components/tours/InquiryModal';

// FIRESTORE INTEGRATION
import toursDataStatic from '../data/toursData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function ToursPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Pull from Firestore with static fallback
  const { data: toursData, loading } = useCollection('tours', toursDataStatic);

  const [previewTour, setPreviewTour] = useState(null);
  const [inquiryTour, setInquiryTour] = useState(null);
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    duration: searchParams.get('duration') || '',
    category: searchParams.get('category') || '',
    season: searchParams.get('season') || '',
  });

  useEffect(() => {
    updatePageMeta({
      title: "Tours & Safaris | DINQ Tour, Travel & Events",
      description: "Explore our 15 curated Ethiopian expeditions: Simien trekking, Danakil volcano, Omo tribal journeys, Lalibela heritage, and more.",
    });
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' })
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=0.6")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8");

      ScrollTrigger.batch('.gsap-tour-card', {
        onEnter: (batch) => gsap.fromTo(batch, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [toursData] });

  // Filter logic
  const filteredTours = toursData.filter((tour) => {
    if (filters.destination && tour.destinationSlug !== filters.destination) return false;
    if (filters.category && tour.categorySlug !== filters.category) return false;
    
    if (filters.duration) {
      const days = tour.durationDays || 0;
      if (filters.duration === '1-3' && days > 3) return false;
      if (filters.duration === '4-7' && (days < 4 || days > 7)) return false;
      if (filters.duration === '8-14' && (days < 8 || days > 14)) return false;
      if (filters.duration === '15+' && days < 15) return false;
    }
    
    return true;
  });

  const upcomingTours = toursData.filter((t) => t.isUpcoming);

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* Hero */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788191639/ja0p18egwk32gflxlq5k.jpg"
            alt="Ethiopia Tours"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Tours & Safaris', to: '/tours' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Compass className="w-4 h-4 text-[#C88A2E]" />
            <span>{toursData.length} Curated Expeditions</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="Signature" className="block" />
            <SplitReveal text="Ethiopian Journeys" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            From the lava lakes of Erta Ale to the rock churches of Lalibela — handcrafted multi-day expeditions led by Ethiopia's most experienced local guides.
          </p>
        </div>
      </div>

      {/* Trip Finder */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16">
        <TripFinder initialValues={filters} onFilterChange={setFilters} />
      </section>

      {/* Upcoming Departures Section */}
      {upcomingTours.length > 0 && (
        <section id="upcoming-departures" className="py-20 bg-[#18181B] text-white border-y border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
                <Calendar className="w-4 h-4 text-[#C88A2E]" />
                <span>Guaranteed Departures</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Upcoming Scheduled Trips
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTours.slice(0, 6).map((tour) => (
                <div key={tour.id} className="gsap-tour-card opacity-0">
                  <TourCard tour={tour} onQuickPreview={(t) => setPreviewTour(t)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Tours Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Catalog</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
              All {filteredTours.length} Expeditions
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-stone-500">Loading tours...</div>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Filter className="w-16 h-16 text-stone-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-stone-900">No tours match your filters</h3>
            <p className="text-sm text-stone-500">Try adjusting the trip finder above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="gsap-tour-card opacity-0">
                <TourCard tour={tour} onQuickPreview={(t) => setPreviewTour(t)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Compass className="w-12 h-12 text-[#D4AF7A] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Can't Find Your Perfect Tour?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Tell us your dream and we'll craft a custom journey tailored to your preferences.
          </p>
          <MagneticButton>
            <button
              onClick={() => navigate('/plan-your-trip')}
              className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-2xl inline-flex items-center gap-2"
            >
              <span>Plan Custom Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticButton>
        </div>
      </section>

      {/* Modals */}
      {previewTour && (
        <QuickTourModal 
          tour={previewTour} 
          onClose={() => setPreviewTour(null)} 
          onOpenInquiry={(t) => { setPreviewTour(null); setInquiryTour(t); }}
        />
      )}
      {inquiryTour && (
        <InquiryModal tour={inquiryTour} onClose={() => setInquiryTour(null)} />
      )}
    </div>
  );
}