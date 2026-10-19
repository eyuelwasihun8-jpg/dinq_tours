import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Check, ArrowRight, Compass } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import TourCard from '../components/tours/TourCard';

// FIRESTORE INTEGRATION
import experiencesStatic from '../data/experiencesData';
import toursDataStatic from '../data/toursData';
import { useCollection } from '../hooks/useFirestore';

export default function ExperienceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: experiencesData } = useCollection('experiences', experiencesStatic);
  const { data: toursData } = useCollection('tours', toursDataStatic);

  const exp = experiencesData.find(e => e.slug === slug);

  useEffect(() => {
    if (exp) {
      updatePageMeta({
        title: `${exp.title} | DINQ Experience`,
        description: exp.tagline,
        ogImage: exp.heroImage,
      });
    }
  }, [exp]);

  if (!exp && experiencesData.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Sparkles className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Experience Not Found</h1>
        <Link to="/experiences" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold mt-6">
          Back to All Experiences
        </Link>
      </div>
    );
  }

  if (!exp) return null;

  const relatedTours = toursData.filter(t => exp.relatedTourSlugs?.includes(t.slug));

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={exp.heroImage} alt={exp.title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-black/50 to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Experiences', to: '/experiences' },
              { label: exp.shortTitle || exp.title },
            ]}
          />

          <div className="flex flex-wrap gap-3">
            {exp.category && (
              <span className="bg-[#C88A2E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                {exp.category}
              </span>
            )}
            {exp.duration && (
              <span className="bg-black/60 text-stone-200 text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.duration}</span>
              </span>
            )}
            {exp.location && (
              <span className="bg-black/60 text-stone-200 text-xs font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{exp.location}</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight max-w-4xl">
            <SplitReveal text={exp.title} />
          </h1>

          <p className="max-w-3xl text-stone-200 text-base sm:text-xl leading-relaxed font-light italic">
            {exp.tagline}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Summary */}
        {exp.summary && (
          <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
            <p className="text-xl text-stone-800 font-serif italic leading-relaxed">{exp.summary}</p>
          </section>
        )}

        {/* Narrative */}
        {exp.narrative && (
          <section className="bg-stone-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl">
            <h2 className="font-serif text-2xl font-bold mb-4 text-[#D4AF7A]">The Experience</h2>
            <p className="text-stone-300 font-light leading-relaxed whitespace-pre-line">{exp.narrative}</p>
          </section>
        )}

        {/* Highlights */}
        {exp.highlights?.length > 0 && (
          <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Highlights</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-700 font-light p-3 bg-stone-50 rounded-xl">
                  <Check className="w-4 h-4 text-[#C88A2E] shrink-0 mt-1" />
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Program */}
        {exp.program?.length > 0 && (
          <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Program Includes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {exp.program.map((p, i) => (
                <div key={i} className="flex items-center gap-2 p-2 text-xs text-stone-700 font-medium bg-amber-50/50 rounded-lg border border-amber-100">
                  <Sparkles className="w-3 h-3 text-[#C88A2E] shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Signature Line */}
        {exp.signature && (
          <section className="text-center p-10 bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl shadow-2xl">
            <div className="text-[#C88A2E] text-5xl font-serif leading-none mb-4">"</div>
            <blockquote className="font-serif text-2xl text-[#D4AF7A] italic font-light">
              {exp.signature}
            </blockquote>
          </section>
        )}

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-stone-900">Tours Including This Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-10">
          <MagneticButton>
            <button
              onClick={() => navigate('/plan-your-trip')}
              className="btn-gold px-8 py-4 rounded-xl text-sm font-bold shadow-xl inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Build a Journey Around This Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticButton>
        </section>
      </div>
    </div>
  );
}