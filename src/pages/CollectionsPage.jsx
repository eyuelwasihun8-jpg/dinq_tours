import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';

// FIRESTORE INTEGRATION
import safariStatic, { safariHeader } from '../data/safariData';
import unescoStatic, { unescoHeader } from '../data/unescoData';
import festivalsStatic, { festivalHeader } from '../data/festivalsData';
import birdingStatic, { birdingHeader } from '../data/birdingData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function CollectionsPage() {
  const { type } = useParams();
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all 4 collections from Firestore
  const { data: safariData } = useCollection('safari', safariStatic);
  const { data: unescoData } = useCollection('unesco', unescoStatic);
  const { data: festivalsData } = useCollection('festivals', festivalsStatic);
  const { data: birdingData } = useCollection('birding', birdingStatic);

  // Select current collection config based on URL
  let config = {
    title: 'Specialty Collections',
    headline: 'Explore Special Collections',
    subheadline: 'Curated by Experts',
    description: '',
    items: [],
  };

  if (type === 'safari') {
    config = {
      title: 'Safari Collection',
      headline: safariHeader.headline,
      subheadline: safariHeader.subheadline,
      description: safariHeader.description,
      items: [...safariData].sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0)),
      badge: '🦁 Wildlife Safari',
    };
  } else if (type === 'unesco') {
    config = {
      title: 'UNESCO World Heritage',
      headline: unescoHeader.headline,
      subheadline: unescoHeader.subheadline,
      description: unescoHeader.description,
      items: [...unescoData].sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0)),
      badge: '🏛️ 12 UNESCO Sites',
    };
  } else if (type === 'festivals') {
    config = {
      title: 'Festivals of Ethiopia',
      headline: festivalHeader.headline,
      subheadline: festivalHeader.subheadline,
      description: festivalHeader.description,
      items: [...festivalsData].sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0)),
      badge: '🎉 Living Traditions',
    };
  } else if (type === 'birding') {
    config = {
      title: 'Birding Expeditions',
      headline: birdingHeader.headline,
      subheadline: birdingHeader.subheadline,
      description: birdingHeader.description,
      items: birdingData,
      badge: '🐦 860+ Species',
      isBirdingSimple: true,
    };
  }

  useEffect(() => {
    updatePageMeta({
      title: `${config.title} | DINQ Tour, Travel & Events`,
      description: config.description,
    });
  }, [type, config.title]);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-item-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [type, config.items.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={config.items[0]?.heroImage || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80'}
            alt={config.title}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Collections', to: '/collections/safari' },
              { label: config.title },
            ]}
          />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            <span>{config.badge}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight max-w-4xl">
            <SplitReveal text={config.title} />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            {config.subheadline} — {config.description}
          </p>
        </div>
      </div>

      {/* GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {config.isBirdingSimple ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.items.map((item) => (
              <div
                key={item.id}
                className="gsap-item-card opacity-0 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E1D7] shadow-sm hover:shadow-xl transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">{item.habitat}</span>
                  <span className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full border border-stone-200">
                    Birding Hotspot
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">{item.name}</h3>
                <p className="text-xs text-stone-500 italic">{item.tagline}</p>

                {item.keySpecies?.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">Target Avian Species:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.keySpecies.map((sp, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-lg border border-amber-200">
                          🦅 {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.items.map((item) => (
              <div
                key={item.id}
                className="gsap-item-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-1"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-stone-900">
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border border-white/20">
                    {item.number} {item.timing ? `• ${item.timing}` : ''}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider line-clamp-1">
                      {item.signature}
                    </div>
                    <h3 className="font-serif text-2xl font-bold leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">
                      {item.tagline}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                      {item.description}
                    </p>

                    {item.isConditionalNotice && (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-[11px] text-amber-900 rounded-xl">
                        ⚠️ {item.isConditionalNotice}
                      </div>
                    )}

                    {item.experiences?.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5">Key Highlights:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.experiences.slice(0, 5).map((exp, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[11px] font-medium rounded-md border border-stone-200">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-light">DINQ Collection</span>
                    <button
                      type="button"
                      onClick={() => navigate('/plan-your-trip')}
                      className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Inquire Journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* OTHER COLLECTIONS */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-stone-900">Explore Other Specialty Collections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { slug: 'safari', title: '🦁 Safari', desc: `${safariData.length} Wildlife Expeditions` },
              { slug: 'unesco', title: '🏛️ UNESCO', desc: `${unescoData.length} World Heritage Sites` },
              { slug: 'festivals', title: '🎉 Festivals', desc: `${festivalsData.length} Living Traditions` },
              { slug: 'birding', title: '🐦 Birding', desc: `${birdingData.length} Avian Hotspots` },
            ].map((col) => (
              <Link
                key={col.slug}
                to={`/collections/${col.slug}`}
                className={`p-5 rounded-2xl border transition-all ${
                  type === col.slug
                    ? 'border-[#C88A2E] bg-amber-50/60 ring-2 ring-[#C88A2E]'
                    : 'border-stone-200 bg-[#FAF7F2] hover:border-stone-300'
                }`}
              >
                <div className="font-serif text-lg font-bold text-stone-900">{col.title}</div>
                <div className="text-xs text-stone-500 font-light mt-1">{col.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}