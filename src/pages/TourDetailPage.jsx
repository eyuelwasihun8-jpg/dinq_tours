import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Check,
  X as XIcon,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Compass,
  MessageSquare,
  Phone,
  Sparkles,
  Share2,
  Utensils,
  Bed,
  Car,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { updatePageMeta, buildTourSchema } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import InquiryModal from '../components/tours/InquiryModal';
import TourCard from '../components/tours/TourCard';
import InteractiveItineraryTimeline from '../components/tours/InteractiveItineraryTimeline';

import toursDataStatic from '../data/toursData';
import { useCollection } from '../hooks/useFirestore';
import companyData from '../data/companyData';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: toursData } = useCollection('tours', toursDataStatic);
const tour = toursData.find((t) => t.slug === slug);

  useEffect(() => {
    if (tour) {
      updatePageMeta({
        title: `${tour.title} (${tour.durationDays} Days) | DINQ ETHIOPIA TOURS`,
        description: tour.overview.slice(0, 180) + '...',
        ogImage: tour.heroImage,
        jsonLd: buildTourSchema(tour),
      });
    }
  }, [tour]);

  // ============================================================
  // CORE GSAP ANIMATION SYSTEM
  // ============================================================
  useGSAP(() => {
    if (!tour) return;

    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Hero Entrance Sequence
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
        duration: 1,
        ease: 'power3.out',
      }, "-=1.0")
      .from('.hero-meta', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, "-=0.8")
      .from('.hero-booking-card', {
        y: 35,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, "-=1.1");

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

      // 3. Staggered Content Cards
      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: (batch) => gsap.fromTo(batch,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef, dependencies: [tour] });

  if (!tour) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Compass className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">
          Tour Not Found
        </h1>
        <p className="text-sm text-stone-600 max-w-md mb-6 font-light">
          The requested tour trail cannot be found or may have been relocated.
        </p>
        <MagneticButton onClick={() => navigate('/tours')} className="btn-gold px-8 py-4 rounded-xl text-sm font-bold shadow-xl">
          Explore All Available Tours
        </MagneticButton>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text: tour.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedTours = toursData
    .filter((t) => t.id !== tour.id && (t.destinationSlug === tour.destinationSlug || t.categorySlug === tour.categorySlug))
    .slice(0, 3);

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section relative bg-stone-950 text-white pt-10 pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="hero-bg w-full h-full object-cover opacity-45 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-black/60 to-black/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="hero-tag">
            <Breadcrumbs
              items={[
                { label: 'Tours', to: '/tours' },
                { label: tour.destination, to: `/destinations/${tour.destinationSlug}` },
                { label: tour.shortTitle },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-5">
              
              {/* Badges */}
              <div className="hero-tag flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="bg-[#C88A2E] text-white font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {tour.durationDays} Days / {tour.durationNights} Nights
                </span>
                <span className="bg-white/10 backdrop-blur-md text-stone-200 px-4 py-1.5 rounded-full border border-white/20">
                  {tour.category}
                </span>
                <span className="bg-black/60 backdrop-blur-md text-stone-300 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tour.rating} ({tour.reviewCount} reviews)</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-xl">
                <SplitReveal text={tour.title} />
              </h1>

              {/* Tagline */}
              <p className="hero-sub text-stone-200 text-base sm:text-xl max-w-3xl leading-relaxed font-light">
                {tour.tagline}
              </p>

              {/* Quick Info Grid */}
              <div className="hero-meta pt-2 flex flex-wrap items-center gap-6 text-sm text-stone-300 font-light">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF7A]" />
                  <span>{tour.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF7A]" />
                  <span>{tour.groupSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF7A]" />
                  <span>Season: {tour.season}</span>
                </div>
              </div>
            </div>

            {/* Price & Primary Booking Box (Desktop) */}
            <div className="hero-booking-card lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl space-y-6 shadow-2xl">
              <div>
                <div className="text-xs uppercase tracking-wider text-stone-300 font-bold">
                  Verified Starting Price
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-white">
                    {tour.priceFromUSD}
                  </span>
                  <span className="text-xs text-stone-300 font-light">
                    / {tour.priceFromETB} per person
                  </span>
                </div>
                <div className="text-xs text-amber-300 mt-2 font-medium">
                  ★ Groups of 5+ receive an automatic 10% discount
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <MagneticButton
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full btn-gold py-4 rounded-xl text-sm font-bold shadow-xl flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Inquire / Book This Expedition</span>
                </MagneticButton>

                <a
                  href={`${companyData.contact.whatsappLink}&text=Hi%20DINQ%2C%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(tour.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white border border-[#25D366]/40 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Ask a Question on WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C88A2E]" />
                  <span>Direct with Operator</span>
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Tour'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 02. MAIN CONTENT AREA & SIDEBAR                              */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview Card */}
            <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#E7E1D7] space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Tour Overview & Experience
              </h2>
              <div className="text-base sm:text-lg text-stone-700 leading-relaxed font-light whitespace-pre-line">
                {tour.overview}
              </div>

              {/* Highlights Grid */}
              <div className="pt-6 border-t border-stone-100 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#C88A2E]">
                  Why Choose This Journey
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] flex items-start gap-3 text-sm text-stone-800"
                    >
                      <Check className="w-5 h-5 text-[#C88A2E] mt-0.5 shrink-0 font-bold" />
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day-by-Day Interactive Itinerary Timeline */}
            <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#E7E1D7]">
              <InteractiveItineraryTimeline itinerary={tour.itinerary} tourTitle={tour.title} />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#E7E1D7] space-y-8">
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Package Inclusions & Exclusions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* What is Included */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Included in This Package</span>
                  </div>
                  <ul className="space-y-3 text-sm text-stone-700 font-light">
                    {tour.inclusions.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What is Excluded */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-800 uppercase tracking-wider">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>Not Included (Excluded)</span>
                  </div>
                  <ul className="space-y-3 text-sm text-stone-700 font-light">
                    {tour.exclusions.map((exc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <XIcon className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tour Gallery Photo Stream */}
            {tour.gallery && tour.gallery.length > 1 && (
              <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#E7E1D7] space-y-6">
                <h2 className="font-serif text-3xl font-bold text-stone-900">
                  Visual Field Notes
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {tour.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 img-zoom-container group shadow-sm">
                      <img
                        src={img}
                        alt={`${tour.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Practical Tour Facts Card */}
            <div className="gsap-stagger-card opacity-0 bg-white rounded-3xl p-8 shadow-2xl border border-[#E7E1D7] space-y-6 lg:sticky lg:top-24">
              <h3 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Practical Expedition Facts
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Duration</div>
                  <div className="text-stone-900 font-medium mt-1">
                    {tour.durationDays} Days / {tour.durationNights} Nights
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Transportation</div>
                  <div className="text-stone-900 font-medium mt-1 flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#C88A2E]" />
                    <span>{tour.facts?.transportation || "4WD Toyota Land Cruiser A/C"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Accommodation Standard</div>
                  <div className="text-stone-900 font-medium mt-1 flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#C88A2E]" />
                    <span>{tour.facts?.accommodation || "Heritage Eco-Lodges / Hotels"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Physical Demands</div>
                  <div className="text-stone-900 font-medium mt-1">
                    {tour.difficulty} • {tour.physicalRating}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Elevation Profile</div>
                  <div className="text-stone-900 font-medium mt-1">
                    {tour.facts?.elevation || "1,800m – 3,200m"}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Guiding Languages</div>
                  <div className="text-stone-900 font-medium mt-1">
                    English, French, German, Spanish, Amharic
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100">
                <MagneticButton
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full btn-gold py-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl"
                >
                  <Compass className="w-4 h-4" />
                  <span>Customize This Tour</span>
                </MagneticButton>
              </div>
            </div>

            {/* Scheduled Departure Dates if upcoming */}
            {tour.upcomingDates && tour.upcomingDates.length > 0 && (
              <div className="gsap-stagger-card opacity-0 bg-[#18181B] text-white rounded-3xl p-8 shadow-2xl border border-stone-800 space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF7A] uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#C88A2E]" />
                  <span>Upcoming Group Departures</span>
                </div>
                <div className="space-y-3 text-xs">
                  {tour.upcomingDates.map((item, i) => (
                    <div key={i} className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{item.dates}</div>
                        <div className="text-stone-400 text-[11px] mt-0.5">{item.spotsLeft} spaces remaining</div>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800/40 font-bold uppercase tracking-wider">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                <MagneticButton
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full btn-gold py-3 rounded-xl text-xs font-bold"
                >
                  Reserve Date with 30% Deposit
                </MagneticButton>
              </div>
            )}

            {/* Direct Contact / Question Box */}
            <div className="gsap-stagger-card opacity-0 bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-4 text-xs">
              <h4 className="font-serif font-bold text-stone-900 text-lg">
                Have a Quick Question?
              </h4>
              <p className="text-stone-600 leading-relaxed font-light">
                Connect directly with founder Zerihun Alemayehu to confirm mountain weather, flight connections, or group discounts.
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${companyData.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 text-stone-900 font-bold hover:text-[#C88A2E] text-sm transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#C88A2E] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{companyData.contact.phone}</span>
                </a>
                <a
                  href={companyData.contact.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-[#128C7E] font-bold hover:underline text-sm transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div className="mt-24 pt-16 border-t border-stone-200 space-y-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#C88A2E]">
                Alternative Routes
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
                Related Tours & Expeditions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedTours.map((relTour) => (
                <div key={relTour.id} className="gsap-stagger-card opacity-0">
                  <TourCard tour={relTour} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 px-6 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-[10px] text-stone-500 uppercase font-bold">Starting from</div>
          <div className="font-serif text-2xl font-bold text-stone-900 leading-none">
            {tour.priceFromUSD}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`${companyData.contact.whatsappLink}&text=Inquiring%20about%20${encodeURIComponent(tour.title)}`}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-[#25D366]/10 text-[#128C7E] rounded-xl text-xs font-bold"
            title="WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={() => setIsInquiryOpen(true)}
            className="btn-gold px-6 py-3 rounded-xl text-xs font-bold shadow-md"
          >
            Inquire / Book
          </button>
        </div>
      </div>

      {/* Booking / Inquiry Modal */}
      {isInquiryOpen && (
        <InquiryModal
          tour={tour}
          onClose={() => setIsInquiryOpen(false)}
        />
      )}
    </div>
  );
}