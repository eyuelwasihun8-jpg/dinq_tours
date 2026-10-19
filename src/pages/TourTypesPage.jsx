import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, ArrowRight, Mountain, Sparkles, Check } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import tourTypesData from '../data/tourTypesData';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

export default function TourTypesPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    updatePageMeta({
      title: "Tour Types & Travel Styles | DINQ ETHIOPIA TOURS",
      description: "Find your ideal travel style: Trekking & Mountain Expeditions, Cultural & Tribal Heritage, Sacred Religious Festivals, Classic Historic Circuit, Wildlife Safaris, and Birding.",
    });
  }, []);

  // ============================================================
  // CORE GSAP ANIMATION SYSTEM
  // ============================================================
  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Cinematic Hero Entrance
      const tl = gsap.timeline();

      tl.from('.hero-bg', {
        scale: 1.15,
        filter: 'blur(10px)',
        duration: 2.5,
        ease: 'power3.out',
      })
      .from('.hero-tag', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, "-=1.8")
      .to('.gsap-word', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power4.out',
      }, "-=1.5")
      .from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, "-=1.0");

      // 2. Hero Background Parallax on Scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 3. Staggered Batch Entrance for Category Cards
      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) => gsap.fromTo(batch,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section bg-stone-950 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_5835885606733984347_y.jpg"
            alt="Ethiopian Travel Styles and Mountain Expeditions"
            className="hero-bg w-full h-full object-cover opacity-30 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Tour Types', to: '/tour-types' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Sparkles className="w-4 h-4 text-[#C88A2E]" />
            <span>Curated Expedition Styles</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold drop-shadow-lg">
            <SplitReveal text="Tour Types & Categories" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Whether you seek high-altitude alpine ascents, deep cultural immersion with ancient tribes, or the sacred pageantry of biblical festivals.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 02. TOUR TYPES GRID                                          */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tourTypesData.map((type) => (
            <div
              key={type.id}
              className="gsap-stagger-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-900">
                <img
                  src={type.heroImage}
                  alt={type.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#C88A2E] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {type.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold tracking-wide">
                  {type.difficultyRange} • {type.durationRange}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#C88A2E] transition-colors leading-snug">
                    <Link to={`/tour-types/${type.slug}`}>
                      {type.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed font-light">
                    {type.tagline}
                  </p>

                  <ul className="pt-2 space-y-2 text-xs text-stone-700 font-light">
                    {type.keyHighlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#C88A2E] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/tours?category=${type.slug}`}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    View Matching Tours
                  </Link>
                  <Link
                    to={`/tour-types/${type.slug}`}
                    className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transform group-hover:-translate-y-1 transition-transform"
                  >
                    <span>Explore Category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}