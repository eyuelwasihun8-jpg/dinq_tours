import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Globe, ArrowRight, Compass, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import whyEthiopiaData from '../data/whyEthiopiaData';

gsap.registerPlugin(ScrollTrigger);

export default function WhyEthiopiaPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta({
      title: "Why Ethiopia? 12 Reasons to Visit | DINQ Tour, Travel & Events",
      description: "Discover why Ethiopia is Africa's most extraordinary destination — 3,000 years of history, living culture, birthplace of coffee, 12 UNESCO sites, and dramatic landscapes.",
    });
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-reason-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* Hero */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={whyEthiopiaData.hero.heroImage}
            alt="Why Ethiopia"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs items={[{ label: 'Why Ethiopia?', to: '/why-ethiopia' }]} />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Globe className="w-4 h-4 text-[#C88A2E]" />
            <span>{whyEthiopiaData.hero.overline}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text={whyEthiopiaData.hero.headline} className="block" />
            <SplitReveal text={whyEthiopiaData.hero.subheadline} className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-xl leading-relaxed font-light">
            {whyEthiopiaData.hero.intro}
          </p>
        </div>
      </div>

      {/* Invitations Bar */}
      <section className="bg-[#18181B] text-white py-12 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyEthiopiaData.invitations.map((inv, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <div className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">{inv.verb}</div>
                <div className="text-xs text-stone-300 font-light leading-snug">{inv.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Reasons Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
            12 Pillars of Discovery
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            Why Choose Ethiopia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyEthiopiaData.reasons.map((r) => (
            <div
              key={r.number}
              className="gsap-reason-card opacity-0 bg-white p-8 rounded-3xl border border-[#E7E1D7] shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{r.icon}</span>
                  <span className="font-serif text-3xl font-bold text-stone-200">{r.number}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{r.title}</h3>
                <p className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">{r.shortDesc}</p>

                <ul className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600 font-light">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#C88A2E]">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Manifesto Box */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="p-10 rounded-3xl bg-stone-950 text-white space-y-6 border border-stone-800 shadow-2xl">
          <h3 className="font-serif text-3xl font-bold text-[#D4AF7A]">
            {whyEthiopiaData.closing.headline}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-light text-stone-300">
            {whyEthiopiaData.closing.body.map((phrase, idx) => (
              <span key={idx} className="bg-stone-900 px-4 py-2 rounded-full border border-stone-800">
                • {phrase}
              </span>
            ))}
          </div>
          <p className="text-lg font-serif italic text-white font-semibold">
            {whyEthiopiaData.closing.tagline}
          </p>

          <div className="pt-4">
            <MagneticButton>
              <button
                onClick={() => navigate('/plan-your-trip')}
                className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-2xl inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Begin Your Journey</span>
              </button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}