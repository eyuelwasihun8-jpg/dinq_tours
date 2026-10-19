import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass,
  ArrowRight,
  Award,
  Sparkles,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

// FIRESTORE INTEGRATION
import companyStatic from '../data/companyData';
import teamStatic from '../data/teamData';
import { useDocById } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data: teamDoc } = useDocById('settings', 'team');
  const { data: companyDoc } = useDocById('settings', 'company');
  const teamData = teamDoc || teamStatic;
  const companyData = companyDoc || companyStatic;

  useEffect(() => {
    updatePageMeta({
      title: "About Us | DINQ Tour, Travel & Events",
      description: "10+ years of experience across tourism, tour guiding, travel media, events, and outdoor experiences in Ethiopia. Meet founder Zerihun Alemayehu and the team.",
    });
  }, []);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      tl.from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' })
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=0.6")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8");

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
  }, { scope: containerRef, dependencies: [teamData, companyData] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2021/09/photo_2021-09-06_22-22-06.jpg"
            alt="About DINQ Tour, Travel & Events"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'About Us', to: '/about' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Award className="w-4 h-4 text-[#C88A2E]" />
            <span>{companyData.yearsExperience || '10+'} Years Experience in Ethiopian Tourism</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight max-w-4xl">
            <SplitReveal text="Discover Ethiopia." className="block" />
            <SplitReveal text="Travel with Purpose." className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="hero-sub max-w-3xl text-stone-200 text-base sm:text-xl leading-relaxed font-light">
            {companyData.description}
          </p>
        </div>
      </div>

      {/* STATS RIBBON */}
      <section className="bg-white border-b border-stone-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-stone-900">{companyData.yearsExperience || '10+'}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-bold">Years Industry Experience</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-[#C88A2E]">12</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-bold">UNESCO World Heritage Sites</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-stone-900">100%</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-bold">Owner-Managed Operations</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl font-bold text-[#C88A2E]">24/7</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-bold">In-Country Traveler Support</div>
          </div>
        </div>
      </section>

      {/* 3 PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
            Our Core Pillars
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
            What We Do
          </h2>
          <p className="text-sm text-stone-500 font-light">
            Combining tour operations, outdoor recreation, and event management under one trusted platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C88A2E] flex items-center justify-center text-2xl">
              🌍
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">Tour & Travel</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Tailor-made private journeys and small-group expeditions across Ethiopia's iconic heritage, tribal cultures, wildlife, coffee origins, and photography routes.
            </p>
          </div>

          <div className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C88A2E] flex items-center justify-center text-2xl">
              ⛺
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">Outdoor & Adventure</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Mountain treks, wilderness camping, and our signature Urban Camping Ethiopia concept through our outdoor division and Blue Nile Hiking.
            </p>
          </div>

          <div className="gsap-stagger-card opacity-0 bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C88A2E] flex items-center justify-center text-2xl">
              🎪
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">Events & Experiences</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Corporate meetings, conferences, cultural festivals, team-building retreats, and promotional media events across Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      {teamData.leadership?.length > 0 && (
        <section className="py-24 bg-stone-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="text-xs uppercase font-bold tracking-widest text-[#D4AF7A]">Leadership</div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold">The People Behind Your Journey</h2>
              <p className="text-sm text-stone-400 font-light">
                Combining journalism, tourism strategy, marketing, and destination expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {teamData.leadership.map((member) => (
                <div
                  key={member.id || member.name}
                  className="gsap-stagger-card opacity-0 bg-stone-900 rounded-3xl p-8 border border-stone-800 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {member.image && (
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#C88A2E] shadow-xl">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">{member.name}</h3>
                      {member.amharicName && (
                        <div className="text-xs font-serif text-stone-400">{member.amharicName}</div>
                      )}
                      <div className="text-xs font-bold text-[#D4AF7A] uppercase tracking-wider mt-1">
                        {member.role}
                      </div>
                    </div>
                    <p className="text-xs text-stone-300 font-light leading-relaxed">{member.bio}</p>
                  </div>

                  {member.quote && (
                    <div className="pt-4 border-t border-stone-800 text-xs italic text-[#D4AF7A] font-serif">
                      "{member.quote}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FIELD TEAM CATEGORIES */}
      {teamData.teamCategories?.length > 0 && (
        <section className="py-24 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
                Our Professional & Field Crew
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
                {teamData.promise?.headline || 'One Team. One Standard.'}
              </h2>
              <p className="text-sm text-stone-500 font-light">
                {teamData.promise?.body || 'From the office to the road. From the mountains to the villages.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamData.teamCategories.map((cat) => (
                <div
                  key={cat.id || cat.title}
                  className="gsap-stagger-card opacity-0 p-6 rounded-3xl bg-[#FAF7F2] border border-[#E7E1D7] space-y-3"
                >
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{cat.title}</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VALUES & PROMISE */}
      {companyData.values?.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
              Our Guiding Philosophy
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
              Our Promise to Every Traveler
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyData.values.map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E7E1D7] space-y-2 shadow-sm">
                <div className="text-xs font-bold text-[#C88A2E] uppercase tracking-wider">{val.title}</div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white text-center space-y-4 max-w-3xl mx-auto">
            <Sparkles className="w-10 h-10 text-[#D4AF7A] mx-auto" />
            <h3 className="font-serif text-2xl font-bold">Discover Ethiopia. Experience More.</h3>
            <p className="text-stone-300 text-sm font-light leading-relaxed">
              "We don't simply take you to Ethiopia. We help you experience it. We don't simply show you destinations. We introduce you to the stories."
            </p>
            <div className="pt-2">
              <MagneticButton>
                <button
                  onClick={() => navigate('/contact')}
                  className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg inline-flex items-center gap-2"
                >
                  <span>Connect with Our Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}