import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass,
  Check,
  CheckCircle2,
  Send,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import companyData from '../data/companyData';
import confetti from 'canvas-confetti';
import { createDoc } from '../firebase/firestore';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function PlanYourTripPage() {
  const containerRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [duration, setDuration] = useState('8-14');
  const [travelers, setTravelers] = useState('2');
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [travelMonth, setTravelMonth] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: 'Plan Your Custom Journey | DINQ Tour, Travel & Events',
      description: 'Design your bespoke Ethiopian journey with our interactive trip planner.',
    });
  }, []);

  const destinationOptions = [
    { id: 'lalibela', label: 'Lalibela & Rock Churches' },
    { id: 'simien', label: 'Simien Mountains Trekking' },
    { id: 'danakil', label: 'Danakil Depression & Erta Ale' },
    { id: 'omo', label: 'South Omo Valley Tribal' },
    { id: 'gondar', label: 'Gondar Imperial Castles' },
    { id: 'tana', label: 'Bahir Dar & Lake Tana' },
    { id: 'bale', label: 'Bale Mountains & Wolves' },
    { id: 'harar', label: 'Walled Citadel of Harar' },
    { id: 'addis', label: 'Addis Ababa City Heritage' },
  ];

  const interestOptions = [
    { id: 'culture', label: 'Ancient Architecture & History' },
    { id: 'trekking', label: 'Highland Trekking & Hiking' },
    { id: 'wildlife', label: 'Rare Wildlife & Primates' },
    { id: 'festivals', label: 'Timkat or Genna Festivals' },
    { id: 'photography', label: 'Landscape & Portrait Photography' },
    { id: 'birding', label: 'Birdwatching & Horn Endemics' },
    { id: 'coffee', label: 'Coffee Culture & Culinary' },
    { id: 'community', label: 'Community & Village Immersion' },
  ];

  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🔥 SAVES TO FIRESTORE → appears in /admin/inquiries instantly
      await createDoc('inquiries', {
        fullName: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        country: contactInfo.country,
        destinations: selectedDestinations,
        interests: selectedInterests,
        duration,
        travelers,
        travelStyle,
        travelMonth: travelMonth || 'Flexible',
        preferredLanguage,
        message: additionalNotes,
        formType: 'Custom Trip Planner',
        status: 'new',
      });

      setIsSubmitted(true);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#C88A2E', '#D4AF7A', '#18181B'],
        });
      } catch (err) {}
    } catch (error) {
      console.error('❌ Trip planner submission failed:', error);
      alert('Failed to submit. Please try again or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP animations
  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline();

      tl.from('.hero-bg', { scale: 1.15, filter: 'blur(10px)', duration: 2.5, ease: 'power3.out' })
        .from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.8')
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, '-=1.5')
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.0')
        .from('.gsap-planner-card', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8');

      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-step-container',
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, { scope: containerRef, dependencies: [currentStep] });

  useGSAP(() => {
    if (isSubmitted) {
      gsap.fromTo(
        '.gsap-success-card',
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }
      );
    }
  }, { scope: containerRef, dependencies: [isSubmitted] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      {/* HERO */}
      <div className="hero-section bg-stone-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80"
            alt="Ethiopian Landscape"
            className="hero-bg w-full h-full object-cover opacity-30 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Plan Your Trip', to: '/plan-your-trip' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Compass className="w-4 h-4 text-[#C88A2E]" />
            <span>Tailor-Made Expedition Builder</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold drop-shadow-lg">
            <SplitReveal text="Plan Your Custom Journey" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            Every traveler has distinct dreams. Step through our bespoke expedition builder, and founder Zerihun Alemayehu will personally craft your custom itinerary.
          </p>
        </div>
      </div>

      {/* INTERACTIVE BUILDER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {isSubmitted ? (
          <div className="gsap-success-card bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#E7E1D7] text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
                Amesegenalehu! We Received Your Plan
              </h2>
              <p className="text-base sm:text-lg text-stone-600 max-w-lg mx-auto leading-relaxed font-light">
                Thank you, <strong>{contactInfo.fullName}</strong>. Founder Zerihun Alemayehu will personally review your preferences and send your custom itinerary within 24 hours.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-[#FAF7F2] rounded-2xl border border-[#EBE5DA] text-left text-sm space-y-3 max-w-lg mx-auto font-light text-stone-700">
              <div className="text-xs uppercase font-bold tracking-wider text-[#C88A2E]">
                Summary of Your Expedition Request
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Traveler:</span>
                <span className="font-medium text-stone-900">{contactInfo.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Email:</span>
                <span className="font-medium text-stone-900">{contactInfo.email}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">WhatsApp:</span>
                <span className="font-medium text-stone-900">{contactInfo.phone}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-medium text-stone-900">
                  {duration} Days for {travelers} Travelers
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Target Month:</span>
                <span className="font-medium text-stone-900">{travelMonth || 'Flexible'}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Language:</span>
                <span className="font-medium text-stone-900">{preferredLanguage}</span>
              </div>
              {selectedDestinations.length > 0 && (
                <div className="pt-1">
                  <span className="text-stone-500 block mb-1">Destinations:</span>
                  <span className="font-medium text-stone-900">{selectedDestinations.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link to="/tours" className="btn-dark px-8 py-4 rounded-xl text-xs font-bold inline-block shadow-lg">
                  Browse Pre-Curated Tours
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={companyData.contact.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold px-8 py-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat Direct on WhatsApp</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        ) : (
          <div className="gsap-planner-card bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#E7E1D7] space-y-10">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-8">
              {[
                { step: 1, label: 'Destinations & Style' },
                { step: 2, label: 'Timeline & Dates' },
                { step: 3, label: 'Your Details' },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  className={`flex items-center gap-3 text-xs font-bold cursor-pointer transition-colors ${
                    currentStep === s.step
                      ? 'text-[#C88A2E]'
                      : currentStep > s.step
                      ? 'text-stone-900'
                      : 'text-stone-400'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                      currentStep === s.step
                        ? 'bg-[#C88A2E] text-white shadow-md'
                        : currentStep > s.step
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                  </span>
                  <span className="hidden sm:inline tracking-wider uppercase">{s.label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="gsap-step-container space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      Step 1: Where Would You Like to Go?
                    </h3>
                    <p className="text-sm text-stone-500 font-light">
                      Select all regions of interest. We'll harmonize the route logistics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {destinationOptions.map((opt) => {
                      const isSelected = selectedDestinations.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleDestination(opt.id)}
                          className={`p-4 rounded-2xl border text-left text-xs font-bold flex items-center justify-between transition-all duration-300 ${
                            isSelected
                              ? 'border-[#C88A2E] bg-amber-50/60 text-[#C88A2E] ring-2 ring-[#C88A2E] shadow-sm'
                              : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-[#FAF7F2]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#C88A2E]" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 space-y-3">
                    <label className="text-xs uppercase tracking-wider font-bold text-stone-500 block">
                      What are your special interests?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {interestOptions.map((opt) => {
                        const isSelected = selectedInterests.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleInterest(opt.id)}
                            className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all duration-300 ${
                              isSelected
                                ? 'border-[#C88A2E] bg-[#18181B] text-white shadow-sm'
                                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <label className="text-xs uppercase tracking-wider font-bold text-stone-500 block">
                      Preferred Accommodation Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'standard', label: 'Balanced Standard', desc: 'Comfortable 3–4 star hotels & lodges' },
                        { id: 'luxury', label: 'Luxury Eco-Lodges', desc: 'Premier boutique mountain lodges' },
                        { id: 'adventure', label: 'Adventure & Camping', desc: 'Wilderness camping with private chef' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setTravelStyle(style.id)}
                          className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                            travelStyle === style.id
                              ? 'border-[#C88A2E] bg-amber-50/60 ring-2 ring-[#C88A2E] shadow-sm'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="text-sm font-bold text-stone-900">{style.label}</div>
                          <div className="text-xs text-stone-500 mt-1 font-light leading-relaxed">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <MagneticButton
                      onClick={() => setCurrentStep(2)}
                      className="btn-gold px-8 py-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xl"
                    >
                      <span>Continue to Timeline</span>
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="gsap-step-container space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      Step 2: Dates & Group Composition
                    </h3>
                    <p className="text-sm text-stone-500 font-light">
                      Help us arrange 4WD allocations, chefs, and lodge reservations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Ideal Trip Duration
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      >
                        <option value="1-3">1 to 3 Days (Short Excursion)</option>
                        <option value="4-7">4 to 7 Days (Highlights)</option>
                        <option value="8-14">8 to 14 Days (Comprehensive)</option>
                        <option value="15-20+">15 to 20+ Days (Grand Circuit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Number of Travelers
                      </label>
                      <select
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      >
                        <option value="1">1 Person (Solo)</option>
                        <option value="2">2 Persons (Couple)</option>
                        <option value="3-4">3 to 4 Persons</option>
                        <option value="5+">5+ Persons (10% Discount!)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Approximate Travel Month
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. November or Flexible"
                        value={travelMonth}
                        onChange={(e) => setTravelMonth(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Preferred Guiding Language
                      </label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      >
                        <option value="English">English</option>
                        <option value="German">German (Deutsch)</option>
                        <option value="French">French (Français)</option>
                        <option value="Italian">Italian (Italiano)</option>
                        <option value="Spanish">Spanish (Español)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <MagneticButton
                      onClick={() => setCurrentStep(1)}
                      className="btn-dark px-6 py-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => setCurrentStep(3)}
                      className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xl"
                    >
                      <span>Continue to Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="gsap-step-container space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                      Step 3: Where Should We Send Your Itinerary?
                    </h3>
                    <p className="text-sm text-stone-500 font-light">
                      Direct contact with founder Zerihun. Your submission goes straight to our admin inbox.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-[#C88A2E] mt-0.5 shrink-0" />
                    <span>
                      Free custom proposal, zero obligation. We respond within 24 hours.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Weber"
                        value={contactInfo.fullName}
                        onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                        Country of Residence
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Germany, USA, UK"
                        value={contactInfo.country}
                        onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                      Additional Notes & Special Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specific sights, dietary needs, mobility considerations..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E] font-light"
                    />
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <MagneticButton
                      onClick={() => setCurrentStep(2)}
                      className="btn-dark px-6 py-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </MagneticButton>
                    <MagneticButton
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold px-10 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-2xl disabled:opacity-70"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting Plan...' : 'Submit Custom Journey Request'}</span>
                    </MagneticButton>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}