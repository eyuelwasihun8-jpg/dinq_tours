import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, ArrowRight, Compass, Layers } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import DestinationCard from '../components/destinations/DestinationCard';

// FIRESTORE INTEGRATION
import destinationsDataStatic from '../data/destinationsData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function DestinationsPage() {
  const containerRef = useRef(null);
  
  const { data: destinationsData, loading } = useCollection('destinations', destinationsDataStatic);

  useEffect(() => {
    updatePageMeta({
      title: `${destinationsData.length} Iconic Ethiopian Destinations | DINQ Tour, Travel & Events`,
      description: "Explore Ethiopia's verified destinations: Lalibela, Simien Mountains, Danakil Depression, Omo Valley, Gondar, Addis Ababa, Bale, Axum, Harar, Chebera Churchura, Wonchi.",
    });
  }, [destinationsData.length]);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-dest-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [destinationsData.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg"
            alt="Ethiopian Destinations"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs items={[{ label: 'Destinations', to: '/destinations' }]} />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <MapPin className="w-4 h-4 text-[#C88A2E]" />
            <span>{destinationsData.length} Verified Ethiopian Regions & Cities</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="Explore Destinations" />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            From the subterranean rock churches of Lalibela to the lava lake of Erta Ale — click any destination for historical context, highlights, and practical travel facts.
          </p>
        </div>
      </div>

      {/* REGIONAL ROUTES BANNER */}
      <section className="bg-stone-900 text-white py-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-[#D4AF7A] font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#C88A2E]" />
            <span>Looking for multi-region routes? Browse the 5 Regional Routes Framework.</span>
          </div>
          <Link to="/regions" className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shrink-0">
            View 5 Regional Routes
          </Link>
        </div>
      </section>

      {/* GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading && destinationsData.length === 0 ? (
          <div className="text-center py-20 text-stone-500">Loading destinations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationsData.map((dest) => (
              <div key={dest.id} className="gsap-dest-card opacity-0">
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}