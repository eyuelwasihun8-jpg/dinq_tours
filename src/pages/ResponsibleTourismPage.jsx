import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  HeartHandshake,
  ShieldCheck,
  Check,
  Sparkles,
  Trees,
  Users,
  ArrowRight,
  Compass,
  Leaf
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function ResponsibleTourismPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta({
      title: "Responsible & Sustainable Tourism Charter | DINQ ETHIOPIA TOURS",
      description: "Learn how DINQ Ethiopia Tours practices community-first tourism, fair wages for drivers and scouts, leave-no-trace wilderness camping, and cultural preservation.",
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

      // 3. Clip Reveal on Main Pillar Card
      gsap.fromTo('.gsap-clip-reveal',
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.gsap-clip-reveal', start: 'top 85%' },
        }
      );

      // 4. Staggered Commitment Pillars
      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) => gsap.fromTo(batch,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });

      // 5. CTA Card Reveal
      gsap.fromTo('.gsap-cta-reveal',
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gsap-cta-reveal', start: 'top 90%' },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section bg-stone-950 text-white min-h-[60vh] flex flex-col justify-end py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80"
            alt="Ethiopian Highlands Wilderness & Conservation"
            className="hero-bg w-full h-full object-cover opacity-30 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Responsible Tourism', to: '/responsible-tourism' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <HeartHandshake className="w-4 h-4 text-[#C88A2E]" />
            <span>Ethical Travel Charter</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold drop-shadow-lg">
            <SplitReveal text="We Care Where We Take You" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Responsible and sustainable tourism is not a slogan at DINQ; it is the philosophical core of our company. Here is how our field operations protect ecosystems and empower Ethiopian communities.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 02. COMMITMENTS MANIFESTO & PILLARS                          */}
      {/* ============================================================ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-16">
        
        {/* Core Pillars Card with Clip-Path Reveal */}
        <div className="gsap-clip-reveal bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#E7E1D7] space-y-10">
          
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
              <span className="w-8 h-px bg-[#C88A2E]" />
              <span>Sustainable Stewardship</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Our Ethical Travel Commitments
            </h2>
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-light">
              Tourism has the power to transform remote communities, preserve ancient architecture, and protect endangered wildlife like the Walia ibex and Ethiopian wolf. However, unregulated tourism can erode local dignity and strain fragile environments. We operate with strict ethical boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="gsap-stagger-card opacity-0 p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] space-y-3 hover:border-[#C88A2E]/40 transition-colors">
              <div className="flex items-center gap-3 text-base font-bold text-stone-900 font-serif">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C88A2E] flex items-center justify-center shrink-0 border border-amber-100">
                  <Users className="w-5 h-5" />
                </div>
                <span>1. Community-First Employment</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                We always hire and train licensed local guides from the specific villages and monasteries visited (in Lalibela, Simien, Omo, and Afar), ensuring travel revenue directly supports local families, schools, and artisans.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="gsap-stagger-card opacity-0 p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] space-y-3 hover:border-[#C88A2E]/40 transition-colors">
              <div className="flex items-center gap-3 text-base font-bold text-stone-900 font-serif">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C88A2E] flex items-center justify-center shrink-0 border border-amber-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span>2. Fair Living Wages</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                All drivers, private camp cooks, mountain scouts, and muleteers receive generous fair living wages and complete field gear, well above standard commercial minimums.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="gsap-stagger-card opacity-0 p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] space-y-3 hover:border-[#C88A2E]/40 transition-colors">
              <div className="flex items-center gap-3 text-base font-bold text-stone-900 font-serif">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C88A2E] flex items-center justify-center shrink-0 border border-amber-100">
                  <Trees className="w-5 h-5" />
                </div>
                <span>3. Strict Leave-No-Trace Wilderness</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                On all mountain trekking in Simien and Bale and camping in Danakil, our teams pack out all waste, eliminate single-use plastic bottles with filtered supply systems, and use eco-conscious camp fuel.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="gsap-stagger-card opacity-0 p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] space-y-3 hover:border-[#C88A2E]/40 transition-colors">
              <div className="flex items-center gap-3 text-base font-bold text-stone-900 font-serif">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C88A2E] flex items-center justify-center shrink-0 border border-amber-100">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span>4. Dignified Cultural Respect</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                In sensitive areas like the Lower Omo Valley and Afar, we prohibit intrusive or exploitative photography. We enter through village elders and ensure photography contributions support collective village funds.
              </p>
            </div>
          </div>

          {/* Heritage Restoration Note */}
          <div className="pt-8 border-t border-stone-100 space-y-3">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Support for Ecclesiastical Heritage Restoration
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
              A portion of every expedition's proceeds is directed toward monastery preservation funds in Lalibela and Tigray to preserve ancient Ge'ez manuscripts, 12th-century church frescoes, and sacred architectural sites for future generations.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 03. CALL TO ACTION                                           */}
        {/* ============================================================ */}
        <div className="gsap-cta-reveal p-10 sm:p-14 rounded-[2.5rem] bg-[#18181B] text-white text-center space-y-6 shadow-2xl border border-stone-800">
          <div className="w-14 h-14 rounded-2xl bg-[#C88A2E]/20 border border-[#C88A2E]/40 text-[#D4AF7A] flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          
          <h3 className="font-serif text-3xl sm:text-4xl font-bold">
            Travel With Purpose
          </h3>
          
          <p className="text-base text-stone-300 max-w-lg mx-auto leading-relaxed font-light">
            Choose an operator that respects the land, its ancient wildlife, and its people. Your journey with DINQ leaves an enduring positive footprint.
          </p>
          
          <div className="pt-4 flex justify-center">
            <MagneticButton
              onClick={() => navigate('/plan-your-trip')}
              className="btn-gold px-8 py-4 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2"
            >
              <span>Plan an Ethical Journey</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>

      </div>
    </div>
  );
}