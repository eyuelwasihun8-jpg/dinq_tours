import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, ArrowRight, Check, Sparkles, Clock, Calendar } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import TourCard from '../components/tours/TourCard';

import tourTypesData from '../data/tourTypesData';
import toursData from '../data/toursData';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function TourTypeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const category = tourTypesData.find((c) => c.slug === slug);

  useEffect(() => {
    if (category) {
      updatePageMeta({
        title: `${category.title} | DINQ ETHIOPIA TOURS`,
        description: category.description.slice(0, 180) + '...',
        ogImage: category.heroImage,
      });
    }
  }, [category]);

  // ============================================================
  // CORE GSAP ANIMATION SYSTEM
  // ============================================================
  useGSAP(() => {
    if (!category) return;

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
        stagger: 0.04,
        ease: 'power4.out',
      }, "-=1.5")
      .from('.hero-sub', {
        y: 25,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, "-=1.0");

      // 2. Hero Background Parallax
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

      // 3. Staggered Content Blocks
      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) => gsap.fromTo(batch,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [category] });

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Compass className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Category Not Found</h1>
        <p className="text-sm text-stone-600 max-w-md mb-6 font-light">
          The requested expedition style cannot be found or may have been relocated.
        </p>
        <MagneticButton onClick={() => navigate('/tour-types')} className="btn-gold px-8 py-4 rounded-xl text-sm font-bold shadow-xl">
          Explore All Tour Types
        </MagneticButton>
      </div>
    );
  }

  const matchingTours = toursData.filter((t) =>
    category.featuredTourSlugs?.includes(t.slug) || t.categorySlug === category.slug
  );

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section relative bg-stone-950 text-white min-h-[75vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={category.heroImage}
            alt={category.title}
            className="hero-bg w-full h-full object-cover opacity-50 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-black/50 to-black/75" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 w-full">
          <div className="hero-tag">
            <Breadcrumbs
              items={[
                { label: 'Tour Types', to: '/tour-types' },
                { label: category.shortTitle },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="hero-tag">
              <span className="bg-[#C88A2E] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                {category.badge}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-xl">
              <SplitReveal text={category.title} />
            </h1>

            <p className="hero-sub text-stone-200 text-base sm:text-xl leading-relaxed font-light">
              {category.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 02. CATEGORY DETAILS & ITINERARIES                           */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-14">
        
        {/* Category Description & Highlights Card */}
        <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#E7E1D7] space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C88A2E]">
              Expedition Philosophy
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              About This Travel Style
            </h2>
          </div>

          <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-light whitespace-pre-line">
            {category.description}
          </p>

          <div className="pt-8 border-t border-stone-100 space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#C88A2E]">
              Key Expedition Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.keyHighlights.map((h, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] flex items-start gap-3 text-sm text-stone-800"
                >
                  <Check className="w-5 h-5 text-[#C88A2E] mt-0.5 shrink-0 font-bold" />
                  <span className="font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Tours Grid */}
        <div className="space-y-8 pt-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C88A2E]">
              Curated Expeditions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
              Curated {category.shortTitle} Itineraries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingTours.map((t) => (
              <div key={t.id} className="gsap-stagger-card opacity-0">
                <TourCard tour={t} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}