import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';

// FIRESTORE INTEGRATION
import experiencesStatic from '../data/experiencesData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function ExperiencesPage() {
  const containerRef = useRef(null);
  const { data: experiencesData } = useCollection('experiences', experiencesStatic);

  useEffect(() => {
    updatePageMeta({
      title: `${experiencesData.length} Signature Ethiopian Experiences | DINQ Tour, Travel & Events`,
      description: "Immerse yourself in authentic Ethiopian coffee ceremonies, Gelada baboon encounters, Timkat festivals, Omo tribal traditions, and more.",
    });
  }, [experiencesData.length]);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-exp-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
          ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [experiencesData.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6013931637743660605_w.jpg"
            alt="Ethiopian Experiences"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs items={[{ label: 'Experiences', to: '/experiences' }]} />

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Sparkles className="w-4 h-4 text-[#C88A2E]" />
            <span>Living Traditions & Signature Encounters</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="Signature" className="block" />
            <SplitReveal text="Ethiopian Experiences" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Beyond the destinations — these are the sensory, cultural, and spiritual moments that make Ethiopia unforgettable.
          </p>
        </div>
      </div>

      {/* GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiencesData.map((exp) => (
            <Link
              key={exp.id}
              to={`/experiences/${exp.slug}`}
              className="gsap-exp-card opacity-0 bg-white rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={exp.heroImage}
                  alt={exp.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {exp.category && (
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {exp.category}
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#C88A2E] transition-colors leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed font-light">{exp.tagline}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-1 text-[11px] text-stone-500 font-light">
                  {exp.duration && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#C88A2E]" />
                      <span>{exp.duration}</span>
                    </div>
                  )}
                  {exp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#C88A2E]" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-[#C88A2E] group-hover:gap-2 transition-all">
                  <span>Discover This Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}