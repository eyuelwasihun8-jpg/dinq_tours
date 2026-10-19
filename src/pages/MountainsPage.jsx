import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mountain, ArrowRight, Compass } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

// FIRESTORE INTEGRATION
import { mountainsData as mountainsStatic, mountainCollection } from '../data/mountainsData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function MountainsPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data: mountainsRaw } = useCollection('mountains', mountainsStatic);
  const mountainsData = [...mountainsRaw].sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));

  useEffect(() => {
    updatePageMeta({
      title: `${mountainsData.length}+ Ethiopian Mountain Experiences | DINQ Tour, Travel & Events`,
      description: "Explore Ethiopia above the clouds: Simien, Bale, Ras Dashen, Choke, Zebider Mountain & Gurage, Entoto, and more.",
    });
  }, [mountainsData.length]);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-mountain-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [mountainsData.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788191639/ja0p18egwk32gflxlq5k.jpg"
            alt="Ethiopian Mountain Collection"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs items={[{ label: 'Mountains & Trekking', to: '/mountains' }]} />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Mountain className="w-4 h-4 text-[#C88A2E]" />
            <span>{mountainCollection.tagline}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="Explore Ethiopia" className="block" />
            <SplitReveal text="Above the Clouds" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            {mountainCollection.description}
          </p>
        </div>
      </div>

      {/* GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
            Highland & Peak Inventory
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            {mountainsData.length} Mountain Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mountainsData.map((m) => (
            <div
              key={m.id}
              className="gsap-mountain-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-900">
                <img
                  src={m.heroImage}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border border-white/20">
                  {m.number} • {m.altitude}
                </span>

                {m.unesco && (
                  <span className="absolute top-4 right-4 bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    UNESCO
                  </span>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider">
                    {m.signature}
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-tight">
                    {m.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">
                    {m.tagline}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                    {m.description}
                  </p>

                  {m.subTagline && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 italic">
                      "{m.subTagline}"
                    </div>
                  )}

                  {m.experiences?.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">
                        Included Experiences:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.experiences.slice(0, 5).map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[11px] font-medium rounded-md border border-stone-200"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-light">
                    Region: <strong className="text-stone-800">{m.region}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      m.relatedTourSlug
                        ? navigate(`/tours/${m.relatedTourSlug}`)
                        : navigate('/plan-your-trip')
                    }
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{m.relatedTourSlug ? 'View Expedition' : 'Plan Trek'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Compass className="w-12 h-12 text-[#D4AF7A] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Ready to Climb Above the Clouds?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Our mountain field teams provide 4-season tents, pack mules, armed scouts, and private camp chefs for every trek.
          </p>
          <div className="pt-2">
            <MagneticButton>
              <button
                onClick={() => navigate('/plan-your-trip')}
                className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-2xl inline-flex items-center gap-2"
              >
                <span>Plan Custom Mountain Trek</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}