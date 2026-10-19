import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

// FIRESTORE INTEGRATION
import signatureRoutesStatic from '../data/signatureRoutesData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function SignatureRoutesPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data: signatureRoutesData } = useCollection('signatureRoutes', signatureRoutesStatic);

  useEffect(() => {
    updatePageMeta({
      title: `${signatureRoutesData.length} Signature National Routes | DINQ Tour, Travel & Events`,
      description: "Experience Ethiopia's multi-region signature journeys: Rift Valley, Coffee Origins, Heritage, Wildlife, Community, Urban Camping, and Photography.",
    });
  }, [signatureRoutesData.length]);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-route-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [signatureRoutesData.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80"
            alt="DINQ Signature National Routes"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs items={[{ label: 'Signature Routes', to: '/signature-routes' }]} />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Compass className="w-4 h-4 text-[#C88A2E]" />
            <span>Multi-Region Master Expeditions</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="DINQ Signature" className="block" />
            <SplitReveal text="National Routes" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Transcend single regions. Our {signatureRoutesData.length} signature journeys weave together ancient history, coffee forests, active volcanoes, and indigenous communities into one seamless national story.
          </p>
        </div>
      </div>

      {/* ROUTES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {signatureRoutesData.map((route) => (
          <div
            key={route.id}
            className="gsap-route-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-xl hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0 group"
          >
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px] bg-stone-900 overflow-hidden">
              <img
                src={route.heroImage}
                alt={route.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute top-5 left-5 text-4xl">
                {route.emoji}
              </div>

              {route.isBranded && (
                <div className="absolute top-5 right-5">
                  <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Exclusive Concept
                  </span>
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider mb-1">
                  {route.duration} Expedition
                </div>
                <h3 className="font-serif text-2xl font-bold leading-snug">
                  {route.name}
                </h3>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                  {route.tagline}
                </div>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
                  {route.shortDesc}
                </p>

                {route.stops?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE5DA] space-y-2">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Route Sequence:
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-800">
                      {route.stops.map((stop, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-white px-3 py-1 rounded-lg border border-stone-200 font-semibold shadow-2xs">
                            {stop}
                          </span>
                          {i < route.stops.length - 1 && (
                            <span className="text-[#C88A2E] font-bold">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {route.themes?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {route.themes.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full border border-stone-200"
                      >
                        # {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <div className="text-xs text-stone-500 font-light flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C88A2E]" />
                  <span>Customizable duration</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/plan-your-trip')}
                  className="btn-gold px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md group-hover:translate-x-1 transition-transform"
                >
                  <span>Customize This Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Sparkles className="w-12 h-12 text-[#D4AF7A] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Ready for a Multi-Region Journey?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Tell us your travel window, budget, and party size. We'll harmonize domestic flights, 4WD vehicles, and luxury eco-lodge bookings.
          </p>
          <div className="pt-2">
            <MagneticButton>
              <button
                onClick={() => navigate('/plan-your-trip')}
                className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-2xl inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Start Interactive Trip Builder</span>
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}