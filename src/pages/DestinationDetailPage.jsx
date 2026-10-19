import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  MapPin, Mountain, Calendar, Plane, Lightbulb,
  ChevronDown, ArrowRight, Compass, Sparkles,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import TourCard from '../components/tours/TourCard';

// FIRESTORE INTEGRATION
import destinationsDataStatic from '../data/destinationsData';
import toursDataStatic from '../data/toursData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  const { data: destinationsData } = useCollection('destinations', destinationsDataStatic);
  const { data: toursData } = useCollection('tours', toursDataStatic);

  const dest = destinationsData.find(d => d.slug === slug);

  useEffect(() => {
    if (dest) {
      updatePageMeta({
        title: `${dest.name} | DINQ Tour, Travel & Events`,
        description: dest.tagline,
        ogImage: dest.heroImage,
      });
    }
  }, [dest]);

  useGSAP(() => {
    if (!dest) return;
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.from('.hero-bg', { scale: 1.15, duration: 2.5, ease: 'power3.out' })
        .from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.8")
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=1.5")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=1.0");

      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) =>
          gsap.fromTo(batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [dest] });

  if (!dest && destinationsData.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <MapPin className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Destination Not Found</h1>
        <Link to="/destinations" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold mt-6">
          Back to All Destinations
        </Link>
      </div>
    );
  }

  if (!dest) return null;

  const relatedTours = toursData.filter(t => dest.relatedTourSlugs?.includes(t.slug));

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={dest.heroImage}
            alt={dest.name}
            className="hero-bg w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-black/50 to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs
              items={[
                { label: 'Destinations', to: '/destinations' },
                { label: dest.name },
              ]}
            />
          </div>

          <div className="hero-tag flex flex-wrap items-center gap-3">
            {dest.region && (
              <span className="bg-[#C88A2E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                {dest.region}
              </span>
            )}
            {dest.altitude && (
              <span className="bg-black/60 backdrop-blur-md text-stone-200 text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" />
                <span>{dest.altitude}</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight max-w-4xl">
            <SplitReveal text={dest.name} />
          </h1>

          <p className="hero-sub max-w-3xl text-stone-200 text-base sm:text-xl leading-relaxed font-light italic">
            {dest.tagline}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Overview */}
          {dest.overview && (
            <section className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">Overview</h2>
              <p className="text-stone-700 font-light leading-relaxed whitespace-pre-line">{dest.overview}</p>
            </section>
          )}

          {/* Highlights */}
          {dest.highlights?.length > 0 && (
            <section className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Signature Highlights</h2>
              <ul className="space-y-3">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 font-light leading-relaxed">
                    <Sparkles className="w-4 h-4 text-[#C88A2E] shrink-0 mt-1" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* History */}
          {dest.history && (
            <section className="gsap-stagger-card opacity-0 bg-stone-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl">
              <h2 className="font-serif text-2xl font-bold mb-3 text-[#D4AF7A]">Historical Context</h2>
              <p className="text-stone-300 font-light leading-relaxed italic">{dest.history}</p>
            </section>
          )}

          {/* FAQs */}
          {dest.faqs?.length > 0 && (
            <section className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {dest.faqs.map((faq, i) => (
                  <div key={i} className="border border-stone-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                      className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                    >
                      <span className="font-serif font-bold text-stone-900">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-[#C88A2E] transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="p-4 text-sm text-stone-600 font-light leading-relaxed border-t border-stone-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Tours */}
          {relatedTours.length > 0 && (
            <section className="gsap-stagger-card opacity-0 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl font-bold text-stone-900">Tours Here</h2>
                <Link to="/tours" className="text-xs font-bold text-[#C88A2E] hover:underline inline-flex items-center gap-1">
                  <span>All Tours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedTours.map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Facts */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E1D7] shadow-sm space-y-4 sticky top-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Quick Facts</h3>
            
            {dest.bestTimeToVisit && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#C88A2E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Best Time</div>
                  <div className="text-sm text-stone-900 font-medium mt-0.5">{dest.bestTimeToVisit}</div>
                </div>
              </div>
            )}

            {dest.howToReach && (
              <div className="flex items-start gap-3">
                <Plane className="w-5 h-5 text-[#C88A2E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">How to Reach</div>
                  <div className="text-sm text-stone-900 font-medium mt-0.5">{dest.howToReach}</div>
                </div>
              </div>
            )}

            {dest.practicalTips?.length > 0 && (
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-[#C88A2E]" />
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Practical Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-600 font-light leading-relaxed">
                  {dest.practicalTips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#C88A2E]">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <MagneticButton
              onClick={() => navigate('/plan-your-trip')}
              className="w-full btn-gold py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md mt-4"
            >
              <Compass className="w-4 h-4" />
              <span>Plan a Trip Here</span>
            </MagneticButton>
          </div>

          {/* Gallery */}
          {dest.gallery?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-[#E7E1D7] shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Gallery</h3>
              <div className="grid grid-cols-2 gap-2">
                {dest.gallery.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img src={img} alt={`${dest.name} ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}