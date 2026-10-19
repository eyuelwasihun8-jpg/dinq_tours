import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Globe,
  Layers,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

// FIRESTORE INTEGRATION
import { regionsData as regionsStatic, fiveWaysToDiscover } from '../data/regionsData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function RegionsPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data: regionsRaw } = useCollection('regions', regionsStatic);
  const regionsData = [...regionsRaw].sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));

  useEffect(() => {
    updatePageMeta({
      title: "Explore Ethiopia by Region | DINQ Tour, Travel & Events",
      description: "Discover Ethiopia's 5 master regional routes: The Historic North, Living South, Cultural East, Coffee West, and the National Coffee Route.",
    });
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      tl.from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' })
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=0.6")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8");

      ScrollTrigger.batch('.gsap-region-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [regionsData.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg"
            alt="Explore Ethiopia by Region"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Regional Routes', to: '/regions' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Globe className="w-4 h-4 text-[#C88A2E]" />
            <span>Explore Ethiopia with DINQ</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="One Country." className="block" />
            <SplitReveal text="Many Worlds." className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Ethiopia is vast and layered. We group the nation into {regionsData.length} master regional routes so you can explore by climate, culture, and ancient history.
          </p>
        </div>
      </div>

      {/* FIVE WAYS RIBBON */}
      <section className="bg-[#18181B] text-white py-12 border-y border-stone-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="text-xs uppercase tracking-widest font-bold text-[#D4AF7A]">
              {fiveWaysToDiscover.headline}
            </div>
            <p className="text-stone-400 text-xs font-light">{fiveWaysToDiscover.subheadline}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {fiveWaysToDiscover.ways.map((w, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1 hover:border-[#C88A2E]/60 transition-colors"
              >
                <div className="text-xs font-bold text-[#D4AF7A] uppercase tracking-wider">{w.region}</div>
                <div className="font-serif text-sm font-bold text-white">{w.action}</div>
                <div className="text-[11px] text-stone-400 font-light line-clamp-2">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
            <Layers className="w-3.5 h-3.5" />
            <span>Master Regional Circuits</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Choose Your Horizon
          </h2>
          <p className="text-sm text-stone-500 font-light">
            Click any regional route to explore its destinations, signature tours, and cultural pillars.
          </p>
        </div>

        <div className="space-y-12">
          {regionsData.map((region) => (
            <div
              key={region.id}
              className="gsap-region-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-xl hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0 group"
            >
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-stone-900">
                <img
                  src={region.heroImage}
                  alt={region.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-6 left-6 font-serif text-6xl font-bold text-white/30 leading-none select-none">
                  {region.number}
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    {region.signature}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                    {region.name}
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                    {region.tagline}
                  </div>
                  <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
                    {region.shortDesc}
                  </p>

                  {region.pillars?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {region.pillars.map((p, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EBE5DA] space-y-1">
                          <div className="text-xl">{p.icon}</div>
                          <div className="text-xs font-bold text-stone-900">{p.title}</div>
                          <div className="text-[11px] text-stone-500 font-light leading-snug line-clamp-2">{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {region.discover?.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] uppercase font-bold text-stone-400 mb-2 tracking-wider">
                        Key Highlights & Locations:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {region.discover.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full border border-stone-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-stone-500 font-light">
                    Multiple tours & expeditions available
                  </div>
                  <Link
                    to={`/regions/${region.slug}`}
                    className="btn-gold px-6 py-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Route</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Compass className="w-12 h-12 text-[#D4AF7A] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Want to Combine Multiple Regions?
          </h2>
          <p className="text-stone-300 text-base font-light max-w-2xl mx-auto leading-relaxed">
            Our founder Zerihun Alemayehu can weave North history, South tribal cultures, and Western coffee forests into one seamless national itinerary.
          </p>
          <div className="pt-4">
            <MagneticButton>
              <button
                onClick={() => navigate('/plan-your-trip')}
                className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-2xl inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Multi-Region Journey</span>
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}