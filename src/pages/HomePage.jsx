import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Compass, ArrowRight, ShieldCheck, Star, MapPin, Calendar,
  CheckCircle2, Users, Mountain, HeartHandshake, Sparkles,
  ChevronRight, ChevronLeft, Coffee, Flame, Award, Clock,
  Car, Utensils, ShoppingBag, MessageSquare, Globe, Layers,
} from 'lucide-react';
import { updatePageMeta, buildOrganizationSchema } from '../utils/seo';

import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import TripFinder from '../components/common/TripFinder';
import TourCard from '../components/tours/TourCard';
import DestinationCard from '../components/destinations/DestinationCard';
import QuickTourModal from '../components/tours/QuickTourModal';
import InquiryModal from '../components/tours/InquiryModal';

// FIRESTORE INTEGRATION
import toursDataStatic from '../data/toursData';
import destinationsDataStatic from '../data/destinationsData';
import experiencesDataStatic from '../data/experiencesData';
import teamStatic from '../data/teamData';
import companyData from '../data/companyData';
import { regionsData as regionsStatic, fiveWaysToDiscover } from '../data/regionsData';
import signatureRoutesStatic from '../data/signatureRoutesData';
import { shopCategories as shopCategoriesStatic, shopProducts as shopProductsStatic } from '../data/shopData';
import { useCollection, useDocById } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788191639/ja0p18egwk32gflxlq5k.jpg',
    title: 'Simien Mountains',
    tagline: 'Afro-Alpine Pinnacles & Endemic Geladas',
    altitude: '4,543m Elevation',
    region: 'Amhara Region'
  },
  {
    id: 2,
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2023/12/1266829.jpg',
    title: 'Rock-Hewn Lalibela',
    tagline: '12th-Century Subterranean Monoliths',
    altitude: '2,600m Elevation',
    region: 'Northern Historic Circuit'
  },
  {
    id: 3,
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_2023-12-27_22-53-05.jpg',
    title: 'Danakil Depression & Erta Ale',
    tagline: 'Glowing Lava Lakes & Dallol Salt Flats',
    altitude: '-125m Below Sea Level',
    region: 'Afar Depression'
  },
  {
    id: 4,
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2024/12/photo_5807594854723730155_y.jpg',
    title: 'Lower Omo Valley',
    tagline: 'Living Anthropology & Ancestral Tribes',
    altitude: '500m Elevation',
    region: 'Southern Nations'
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788191858/wiml2hzwgdqbvffxuich.jpg',
    title: 'Bale Mountains Plateau',
    tagline: 'Home of the Rare Ethiopian Wolf & Cloud Forests',
    altitude: '4,377m Elevation',
    region: 'Oromia Region'
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  
  // Firestore hooks
  const { data: toursData } = useCollection('tours', toursDataStatic);
  const { data: destinationsData } = useCollection('destinations', destinationsDataStatic);
  const { data: experiencesData } = useCollection('experiences', experiencesDataStatic);
  const { data: regionsData } = useCollection('regions', regionsStatic);
  const { data: signatureRoutesData } = useCollection('signatureRoutes', signatureRoutesStatic);
  const { data: shopCategories } = useCollection('shopCategories', shopCategoriesStatic);
  const { data: allProducts } = useCollection('shopProducts', shopProductsStatic);
  const { data: teamDoc } = useDocById('settings', 'team');
  const teamData = teamDoc || teamStatic;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [previewTour, setPreviewTour] = useState(null);
  const [inquiryTour, setInquiryTour] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    updatePageMeta({
      title: `${companyData.fullName} | Discover Ethiopia Beyond the Ordinary`,
      description: companyData.description,
      jsonLd: buildOrganizationSchema(),
      ogImage: "https://ambaseltourandtravel.com/wp-content/uploads/2021/09/photo_2021-09-06_22-22-06.jpg",
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const featuredTours = toursData.filter((t) => t.isFeatured).slice(0, 6);
  const upcomingTours = toursData.filter((t) => t.isUpcoming).slice(0, 4);
  const featuredDestinations = destinationsData.slice(0, 4);
  const bestSellerProducts = allProducts.filter(p => p.isBestSeller).slice(0, 4);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      
      tl.from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' })
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=0.6")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8")
        .from('.hero-btn', { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, "-=0.8")
        .from('.hero-slideshow-controls', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.6");

      gsap.to('.hero-slides-wrapper', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.utils.toArray('.gsap-clip-reveal').forEach(img => {
        gsap.fromTo(img,
          { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'power4.inOut',
            scrollTrigger: { trigger: img, start: 'top 85%' } }
        );
      });

      ScrollTrigger.batch('.gsap-stagger-card', {
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });

      if (horizontalWrapperRef.current && window.innerWidth > 1024 && regionsData.length > 0) {
        const panels = gsap.utils.toArray('.horizontal-panel');
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            pin: true, scrub: 1,
            snap: 1 / (panels.length - 1),
            end: () => "+=" + horizontalWrapperRef.current.offsetWidth
          }
        });
      }
    });
  }, { scope: containerRef, dependencies: [regionsData.length] });

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#FAF7F2] overflow-x-hidden">
      
      {/* Hero */}
      <section 
        className="hero-section relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-stone-950"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="hero-slides-wrapper absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}>
              <img src={slide.image} alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[3000ms] ease-out ${
                  currentSlide === idx ? 'scale-105' : 'scale-115'
                }`}
                fetchPriority={idx === 0 ? "high" : "low"} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70" />
            </div>
          ))}
        </div>

        <button type="button" onClick={prevSlide}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/50 hover:bg-[#C88A2E] text-white border border-white/20 hover:border-[#C88A2E] backdrop-blur-md items-center justify-center transition-all duration-300 shadow-2xl group hover:scale-110">
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button type="button" onClick={nextSlide}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/50 hover:bg-[#C88A2E] text-white border border-white/20 hover:border-[#C88A2E] backdrop-blur-md items-center justify-center transition-all duration-300 shadow-2xl group hover:scale-110">
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white space-y-6 mt-12">
          <div className="hero-tag inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C88A2E]/50 text-xs sm:text-sm font-medium text-[#D4AF7A] shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A2E]" />
            <span>DINQ Tour, Travel & Events • ድንቅ</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight leading-[1.05] drop-shadow-2xl">
            <SplitReveal text="Discover Ethiopia" className="block" />
            <SplitReveal text="Beyond the Ordinary" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="hero-sub max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-200 font-light leading-relaxed drop-shadow-md">
            One Country. Many Worlds. One Extraordinary Journey. Immerse yourself in 3,000 years of living history, subterranean rock churches, and ancient coffee forests.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="hero-btn w-full sm:w-auto">
              <MagneticButton onClick={() => navigate('/regions')}
                className="w-full btn-gold px-8 py-4 rounded-xl text-sm font-bold shadow-2xl flex items-center justify-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>Explore 5 Master Regions</span>
              </MagneticButton>
            </div>

            <div className="hero-btn w-full sm:w-auto">
              <MagneticButton onClick={() => navigate('/plan-your-trip')}
                className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 px-8 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl">
                <span>Plan Custom Journey</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="hero-slideshow-controls absolute bottom-8 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3.5 bg-black/70 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 text-white shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C88A2E] animate-ping shrink-0" />
            <MapPin className="w-5 h-5 text-[#D4AF7A] shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-white text-sm block leading-tight">{HERO_SLIDES[currentSlide].title}</span>
              <span className="text-stone-300 text-[11px] font-light">{HERO_SLIDES[currentSlide].altitude} • {HERO_SLIDES[currentSlide].region}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-black/70 backdrop-blur-xl px-6 py-3.5 rounded-2xl border border-white/20 shadow-2xl">
            <button type="button" onClick={prevSlide} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#C88A2E] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2.5">
              {HERO_SLIDES.map((_, idx) => (
                <button key={idx} type="button" onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    currentSlide === idx ? 'w-10 bg-[#C88A2E] shadow-[0_0_12px_rgba(200,138,46,0.6)]' : 'w-3.5 bg-white/30 hover:bg-white/60'
                  }`} />
              ))}
            </div>
            <button type="button" onClick={nextSlide} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#C88A2E] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <ChevronRight className="w-6 h-6" />
            </button>
            <span className="text-xs font-mono font-bold text-[#D4AF7A] pl-2 border-l border-white/20">
              0{currentSlide + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>
        </div>
      </section>

      {/* Trip Finder */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16 gsap-clip-reveal">
        <TripFinder />
      </section>

      {/* Ethiopia Introduction */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                <span className="w-6 h-px bg-[#C88A2E]" />
                <span>The Land of Origins</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
                Not Merely a Destination. <br />
                <span className="italic text-[#C88A2E] font-normal">An Awakening of the Senses.</span>
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                Ethiopia stands alone in Africa. Blessed with its own 13-month calendar, its own unique ancient script (Ge'ez), and an unbroken history stretching across three millennia without colonial interruption, it is the ancestral homeland of all humankind.
              </p>
              <div className="pt-4">
                <Link to="/about" className="btn-dark px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md">
                  <span>Our Heritage & Philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/5 gsap-clip-reveal">
                  <img src="https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg" alt="Lalibela" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 rounded-3xl bg-white border border-[#E7E1D7] shadow-sm space-y-2 gsap-stagger-card">
                  <div className="text-3xl font-serif font-bold text-stone-900">3,000+</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Years of Recorded Heritage</div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="p-6 rounded-3xl bg-[#18181B] text-white space-y-2 gsap-stagger-card">
                  <div className="text-3xl font-serif font-bold text-[#D4AF7A]">860+</div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Bird Species & 30+ Endemics</div>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/5 gsap-clip-reveal">
                  <img src="https://ambaseltourandtravel.com/wp-content/uploads/2024/01/photo_2024-01-02_08-45-28.jpg" alt="Danakil" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Documentary (5 Regions) */}
      {regionsData.length > 0 && (
        <div className="hidden lg:block bg-stone-950 text-white overflow-hidden relative border-y border-stone-800" ref={horizontalWrapperRef}>
          <div className="flex h-screen items-center" style={{ width: `${(regionsData.length + 1) * 100}vw` }}>
            <section className="horizontal-panel w-screen h-screen flex items-center justify-center px-20 shrink-0 relative">
              <div className="max-w-2xl z-10 text-center space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#C88A2E] font-bold">5 Regional Framework</div>
                <h2 className="font-serif text-5xl lg:text-7xl font-bold leading-tight">
                  Five Ways <br/><span className="italic text-[#D4AF7A] font-normal">to Discover Ethiopia</span>
                </h2>
                <p className="text-stone-400 text-lg font-light">Scroll horizontally to explore each master regional route.</p>
              </div>
            </section>

            {regionsData.map((reg, i) => (
              <section key={reg.id} className="horizontal-panel w-screen h-screen flex items-center justify-between px-24 shrink-0 gap-16 relative">
                <div className="w-1/2 relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl">
                  <img src={reg.heroImage} alt={reg.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-6 left-6 bg-[#C88A2E] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {reg.signature}
                  </div>
                </div>
                <div className="w-1/2 space-y-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#C88A2E]">0{reg.number} • Master Region</div>
                  <h3 className="font-serif text-5xl font-bold">{reg.name}</h3>
                  <p className="text-stone-300 text-lg leading-relaxed max-w-lg font-light">{reg.shortDesc}</p>
                  <MagneticButton onClick={() => navigate(`/regions/${reg.slug}`)} className="mt-8 border border-white/30 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white hover:text-black transition-colors inline-block shadow-lg">
                    Explore {reg.name.split(' ')[0]} Route
                  </MagneticButton>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Fallback */}
      <section className="lg:hidden py-20 bg-stone-950 text-white border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 space-y-2">
            <div className="text-xs uppercase tracking-widest text-[#D4AF7A] font-bold">5 Regional Framework</div>
            <h2 className="font-serif text-3xl font-bold">Five Ways to Discover Ethiopia</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {regionsData.slice(0, 3).map((reg) => (
              <Link key={reg.id} to={`/regions/${reg.slug}`} className="group relative aspect-16/10 rounded-3xl overflow-hidden bg-stone-900 shadow-md">
                <img src={reg.heroImage} alt={reg.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1">
                  <div className="text-[10px] font-bold text-[#D4AF7A] uppercase tracking-wider">0{reg.number} • {reg.signature}</div>
                  <h3 className="font-serif text-xl font-bold">{reg.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/regions" className="btn-outline-gold text-white px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border-white/30 hover:bg-white hover:text-black">
              View All 5 Master Regions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E] mb-3">
                <span className="w-6 h-px bg-[#C88A2E]" />
                <span>Handcrafted Journeys</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
                Signature Expeditions
              </h2>
            </div>
            <Link to="/tours" className="btn-gold px-6 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 shrink-0 shadow-lg">
              <span>Explore All {toursData.length} Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredTours.map((tour) => (
              <div key={tour.id} className="gsap-stagger-card opacity-0">
                <TourCard tour={tour} onQuickPreview={(t) => setPreviewTour(t)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Dates */}
      {upcomingTours.length > 0 && (
        <section id="upcoming-departures" className="py-24 bg-[#18181B] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
                <Calendar className="w-4 h-4 text-[#C88A2E]" />
                <span>Small-Group Scheduled Departures</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Upcoming Guaranteed Dates
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingTours.map((tour) => {
                const nextDate = tour.upcomingDates?.[0] || { dates: "Departing Monthly", spotsLeft: 6, status: "Open" };
                return (
                  <div key={tour.id} className="gsap-stagger-card opacity-0 bg-stone-900/90 rounded-3xl border border-stone-800 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:border-[#C88A2E]/60 transition-all group shadow-xl">
                    <div className="sm:w-56 aspect-16/10 sm:aspect-square rounded-2xl overflow-hidden shrink-0 relative bg-stone-800">
                      <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {tour.durationDays} Days
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#D4AF7A] font-semibold mb-2">
                          <span>{tour.destination}</span>
                          <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40 text-[10px] font-bold">{nextDate.status}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#D4AF7A] transition-colors leading-snug">
                          <Link to={`/tours/${tour.slug}`}>{tour.title}</Link>
                        </h3>
                        <div className="mt-3 flex items-center gap-2 text-xs text-stone-400 font-light">
                          <Calendar className="w-3.5 h-3.5 text-[#C88A2E]" />
                          <span className="text-white font-medium">{nextDate.dates}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] text-stone-500 uppercase font-bold">From</div>
                          <div className="text-lg font-bold text-white font-serif">{tour.priceFromUSD}</div>
                        </div>
                        <Link to={`/tours/${tour.slug}`} className="btn-gold px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Experiences & Pillars */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          <div>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Living Traditions</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
                Signature Ethiopian Experiences
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiencesData.slice(0, 3).map((exp) => (
                <div key={exp.id} className="gsap-stagger-card opacity-0 rounded-3xl overflow-hidden border border-[#E7E1D7] bg-[#FAF7F2] hover:shadow-xl transition-all duration-500 group flex flex-col">
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-200">
                    <img src={exp.heroImage} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {exp.category}
                    </span>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#C88A2E] transition-colors leading-snug">
                        <Link to={`/experiences/${exp.slug}`}>{exp.title}</Link>
                      </h3>
                      <p className="text-sm text-stone-600 mt-3 line-clamp-2 leading-relaxed font-light">{exp.tagline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                <ShieldCheck className="w-4 h-4" />
                <span>The DINQ Standard</span>
              </div>
              <h2 className="font-serif text-4xl font-bold text-stone-900">Why Travelers Trust DINQ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Award/>, title: "Official Ministry Recognition", desc: "Licensed by the Ethiopian Ministry of Tourism." },
                { icon: <Car/>, title: "Premium 4WD Safari Fleet", desc: "Heavy-duty Toyota Land Cruisers with AC and veteran drivers." },
                { icon: <Users/>, title: "Multilingual Local Guides", desc: "Professional tour leaders speaking English, German, French, Spanish." }
              ].map((pillar, i) => (
                <div key={i} className="gsap-stagger-card opacity-0 p-8 rounded-3xl bg-[#FAF7F2] border border-[#E7E1D7] space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C88A2E] flex items-center justify-center">
                    {React.cloneElement(pillar.icon, { className: 'w-7 h-7' })}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">{pillar.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-light">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      {teamData.leadership?.[0] && (
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center sm:text-left sm:flex-row lg:flex-col gap-6 gsap-clip-reveal">
                <div className="w-48 h-48 rounded-3xl overflow-hidden border-2 border-[#C88A2E] shadow-2xl shrink-0">
                  <img src={teamData.leadership[0].image} alt={teamData.leadership[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-white">{teamData.leadership[0].name}</h3>
                  <div className="text-xs font-bold text-[#D4AF7A] uppercase tracking-wider">{teamData.leadership[0].role}</div>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6">
                <div className="text-[#C88A2E] text-4xl font-serif leading-none">"</div>
                <blockquote className="font-serif text-2xl sm:text-3xl text-stone-100 italic leading-relaxed font-light">
                  {teamData.leadership[0].quote}
                </blockquote>
                <div className="pt-6 border-t border-stone-800">
                  <Link to="/about" className="btn-gold px-6 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg">
                    <span>Read the Full Story of DINQ</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Travel Shop Spotlight */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E] mb-3">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>DINQ Travel Shop</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
                Everything You Need for Your Journey
              </h2>
            </div>
            <Link to="/shop" className="btn-outline-gold px-6 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              <span>Visit the Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
            {shopCategories.slice(0, 4).map((category) => (
              <Link key={category.id} to={`/shop/${category.slug}`}
                className="gsap-stagger-card opacity-0 group relative aspect-4/5 rounded-3xl overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img src={category.heroImage} alt={category.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-[#D4AF7A] transition-colors">
                    {category.shortTitle}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {bestSellerProducts.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#C88A2E] mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Traveler Favorites</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Shop Best Sellers</h3>
                </div>
                <Link to="/shop" className="text-xs font-bold text-[#C88A2E] hover:underline inline-flex items-center gap-1">
                  <span>View All</span><ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {bestSellerProducts.map((product) => (
                  <Link key={product.id} to={`/shop/product/${product.slug}`} className="group flex flex-col">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-3 relative">
                      <img src={product.image} alt={product.name} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#C88A2E] transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-serif text-lg font-bold text-stone-900">${product.price}</span>
                      <div className="flex items-center gap-0.5 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-stone-700">{product.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-r from-stone-950 via-[#18181B] to-stone-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-[#C88A2E]/20 border border-[#C88A2E]/40 text-[#D4AF7A] flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Ready to Begin Your Ethiopian Adventure?
          </h2>
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light max-w-2xl mx-auto">
            Every traveler is unique. Tell us your available dates and preferences — our founder Zerihun Alemayehu will personally tailor the ideal itinerary.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <MagneticButton onClick={() => navigate('/plan-your-trip')}
              className="btn-gold px-10 py-4 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Start Interactive Trip Planner</span>
            </MagneticButton>
            <a href={companyData.contact.whatsappLink} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl text-sm font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center gap-2 transition-colors shadow-lg">
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modals */}
      {previewTour && (
        <QuickTourModal tour={previewTour} onClose={() => setPreviewTour(null)} onOpenInquiry={(t) => { setPreviewTour(null); setInquiryTour(t); }} />
      )}
      {inquiryTour && (
        <InquiryModal tour={inquiryTour} onClose={() => setInquiryTour(null)} />
      )}
    </div>
  );
}