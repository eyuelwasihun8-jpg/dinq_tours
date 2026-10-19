import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass,
  ArrowRight,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import TourCard from '../components/tours/TourCard';
import DestinationCard from '../components/destinations/DestinationCard';

// FIRESTORE INTEGRATION
import { regionsData as regionsStatic } from '../data/regionsData';
import toursDataStatic from '../data/toursData';
import destinationsDataStatic from '../data/destinationsData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function RegionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { data: regionsData } = useCollection('regions', regionsStatic);
  const { data: toursData } = useCollection('tours', toursDataStatic);
  const { data: destinationsData } = useCollection('destinations', destinationsDataStatic);

  const region = regionsData.find(r => r.slug === slug);

  useEffect(() => {
    if (region) {
      updatePageMeta({
        title: `${region.name} Route | DINQ Tour, Travel & Events`,
        description: region.shortDesc,
        ogImage: region.heroImage,
      });
    }
  }, [region]);

  useGSAP(() => {
    if (!region) return;

    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [region] });

  if (!region && regionsData.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Compass className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Regional Route Not Found</h1>
        <Link to="/regions" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold mt-6">
          Back to All Regional Routes
        </Link>
      </div>
    );
  }

  if (!region) return null;

  const matchingTours = toursData.filter((t) => region.relatedTourSlugs?.includes(t.slug));
  const matchingDestinations = destinationsData.filter((d) => region.relatedDestinationSlugs?.includes(d.slug));

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">

      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={region.heroImage}
            alt={region.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-black/50 to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Regional Routes', to: '/regions' },
              { label: region.name },
            ]}
          />

          <div className="flex items-center gap-3">
            <span className="bg-[#C88A2E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Signature: {region.signature}
            </span>
            <span className="text-xs text-stone-300 font-mono font-bold">
              Region {region.number}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight max-w-4xl">
            <SplitReveal text={region.name} />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-xl leading-relaxed font-light">
            {region.tagline}
          </p>

          <p className="max-w-3xl text-stone-300 text-sm sm:text-base leading-relaxed font-light pt-2 border-t border-white/10">
            {region.shortDesc}
          </p>
        </div>
      </div>

      {/* PILLARS */}
      {region.pillars?.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {region.pillars.map((pillar, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-[#E7E1D7] shadow-sm space-y-3">
                <div className="text-4xl mb-2">{pillar.icon}</div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DISCOVER */}
      {region.discover?.length > 0 && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-stone-900 text-white space-y-4">
            <div className="text-xs uppercase font-bold tracking-widest text-[#D4AF7A]">
              Everything to Discover in {region.name}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {region.discover.map((item, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-stone-800 text-stone-200 text-xs font-medium rounded-full border border-stone-700"
                >
                  • {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED DESTINATIONS */}
      {matchingDestinations.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Destinations in {region.name}
            </h2>
            <Link to="/destinations" className="text-xs font-bold text-[#C88A2E] hover:underline flex items-center gap-1">
              <span>View All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingDestinations.map((dest) => (
              <div key={dest.id} className="gsap-stagger-card opacity-0">
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RELATED TOURS */}
      {matchingTours.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Curated Expeditions in {region.name}
            </h2>
            <Link to="/tours" className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
              <span>Explore All Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingTours.map((tour) => (
              <div key={tour.id} className="gsap-stagger-card opacity-0">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OTHER REGIONS */}
      <section className="py-16 bg-white border-t border-stone-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-stone-900">Explore Other Regional Routes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {regionsData
              .filter((r) => r.slug !== slug)
              .map((r) => (
                <Link
                  key={r.id}
                  to={`/regions/${r.slug}`}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 hover:border-[#C88A2E] hover:bg-amber-50/50 transition-all text-stone-900 group"
                >
                  <div className="text-[10px] font-bold text-[#C88A2E] uppercase">{r.number}</div>
                  <div className="font-serif text-base font-bold group-hover:text-[#C88A2E] transition-colors">{r.name}</div>
                  <div className="text-xs text-stone-500 font-light line-clamp-1">{r.tagline}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}