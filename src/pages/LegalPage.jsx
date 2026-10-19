import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, FileText, Lock, DollarSign, ArrowRight } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import companyData from '../data/companyData';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

export default function LegalPage() {
  const location = useLocation();
  const containerRef = useRef(null);

  // Determine active tab from URL path
  const getTabFromPath = () => {
    if (location.pathname.includes('privacy')) return 'privacy';
    if (location.pathname.includes('terms')) return 'terms';
    if (location.pathname.includes('booking')) return 'booking';
    return 'booking';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    const titles = {
      booking: "Booking & Cancellation Policies | DINQ ETHIOPIA TOURS",
      terms: "Terms & Conditions of Service | DINQ ETHIOPIA TOURS",
      privacy: "Privacy Policy & Data Security | DINQ ETHIOPIA TOURS",
    };
    updatePageMeta({
      title: titles[activeTab] || titles.booking,
      description: "Official legal, booking, cancellation, and privacy policies for DINQ Ethiopia Tours.",
    });
  }, [activeTab]);

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
      }, "-=1.0")
      .from('.gsap-tab-bar', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, "-=0.8");

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
    });
  }, { scope: containerRef });

  // 3. Smooth Content Transition on Tab Switch
  useGSAP(() => {
    gsap.fromTo('.gsap-tab-content',
      { opacity: 0, y: 25, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section bg-stone-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80"
            alt="Ethiopian Heritage Architecture & Safeguards"
            className="hero-bg w-full h-full object-cover opacity-25 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Legal & Policies' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <ShieldCheck className="w-4 h-4 text-[#C88A2E]" />
            <span>Official Client Safeguards</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold drop-shadow-lg">
            <SplitReveal text="Policies & Protocols" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Transparent travel contracts, clear deposit terms, and comprehensive privacy protections for all DINQ travelers.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 02. INTERACTIVE TAB SELECTOR & CONTENT CONTAINER             */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        
        {/* Tab Selector */}
        <div className="gsap-tab-bar bg-white rounded-3xl p-3 shadow-2xl border border-[#E7E1D7] flex flex-col sm:flex-row items-center gap-2">
          <Link
            to="/legal/booking-policy"
            className={`w-full sm:flex-1 py-3 px-4 text-xs font-bold rounded-2xl text-center transition-all duration-300 ${
              activeTab === 'booking'
                ? 'bg-[#18181B] text-white shadow-md transform scale-[1.02]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Booking & Cancellation
          </Link>
          <Link
            to="/legal/terms"
            className={`w-full sm:flex-1 py-3 px-4 text-xs font-bold rounded-2xl text-center transition-all duration-300 ${
              activeTab === 'terms'
                ? 'bg-[#18181B] text-white shadow-md transform scale-[1.02]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal/privacy"
            className={`w-full sm:flex-1 py-3 px-4 text-xs font-bold rounded-2xl text-center transition-all duration-300 ${
              activeTab === 'privacy'
                ? 'bg-[#18181B] text-white shadow-md transform scale-[1.02]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Content Container */}
        <div className="gsap-tab-content bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#E7E1D7] space-y-8 text-base text-stone-700 leading-relaxed font-light">
          {activeTab === 'booking' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                  Booking, Payment & Cancellation Policies
                </h2>
                <p className="text-xs uppercase font-bold tracking-wider text-[#C88A2E] mt-2">
                  Direct Operator Commitment
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  1. Reservation & Deposit
                </h3>
                <p>
                  To secure your tour dates, 4WD vehicle allocation, and premier lodge reservations, a deposit of <strong>30% of the total tour package</strong> is required upon itinerary agreement. For peak festival departures (Timkat and Genna), early deposits are strongly advised due to limited lodge availability in Gondar and Lalibela.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  2. Payment Methods
                </h3>
                <p>
                  Payments can be settled via secure international bank wire transfer (SWIFT) directly into our authorized tour operator account in Addis Ababa, or cash settlement upon arrival by prior agreement. All wire confirmation receipts are issued within 24 hours of bank clearance.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  3. Cancellation Schedule
                </h3>
                <ul className="space-y-2 text-sm text-stone-700 list-disc pl-5">
                  <li><strong>31+ days before departure:</strong> 100% refund of deposit, minus any non-refundable airline ticket fees and $50 administrative fee.</li>
                  <li><strong>15 to 30 days before departure:</strong> 50% refund of total tour cost.</li>
                  <li><strong>Less than 14 days before departure:</strong> Non-refundable due to non-recoverable lodge, transport, and scout allocations.</li>
                </ul>
              </div>

              <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  4. Group Discounts
                </h3>
                <p className="text-sm text-stone-600 font-light">
                  Groups of 5 or more travelers traveling together receive an automatic <strong>10% discount</strong> across both standard and luxury accommodation packages.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                  Terms of Service
                </h2>
                <p className="text-xs uppercase font-bold tracking-wider text-[#C88A2E] mt-2">
                  Operational Guidelines & Requirements
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  1. Travel Insurance Requirement
                </h3>
                <p>
                  All guests traveling on remote wilderness treks (Simien Mountains, Bale Mountains, Danakil Depression) are required to hold valid international travel, medical, and emergency evacuation insurance.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  2. Force Majeure & Itinerary Adaptations
                </h3>
                <p>
                  While we adhere strictly to agreed itineraries, weather conditions (heavy rains, flash river swells in lowlands) or domestic flight schedule adjustments by Ethiopian Airlines may necessitate route adjustments. Our priority is always client safety, and any adjustments will be replaced with equivalent activities.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  3. Cultural Sensitivity
                </h3>
                <p>
                  Travelers agree to follow our guides' guidance regarding modesty, photography etiquette in religious and tribal areas, and leave-no-trace protocols across ancient monastery sites.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                  Privacy & Data Protection Policy
                </h2>
                <p className="text-xs uppercase font-bold tracking-wider text-[#C88A2E] mt-2">
                  Client Confidentiality Standards
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  1. Information Collection
                </h3>
                <p>
                  We collect only necessary information required to arrange your Ethiopian travels: traveler names, passport details (for domestic flight ticketing and national park permits), dietary requests, and emergency contacts.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  2. Zero Third-Party Sharing
                </h3>
                <p>
                  We never sell, rent, or trade your personal data to commercial marketers or third parties. Information is shared strictly with Ethiopian Airlines, authorized park authorities, and lodging properties as needed for your bookings.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  3. Contacting Us
                </h3>
                <p>
                  For any privacy inquiries or to update your personal data, contact us directly at <strong>{companyData.contact.primaryEmail}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}