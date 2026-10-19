import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Compass,
  ChevronDown,
  Menu,
  X,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

import { DinqLogo } from '../common/DinqLogo';
import MagneticButton from '../animations/MagneticButton';
import companyData from '../../data/companyData';
import { regionsData } from '../../data/regionsData';

// Collections Data (used in both desktop + mobile)
const COLLECTION_CARDS = [
  {
    id: 'mountains',
    emoji: '🏔️',
    title: 'Mountains & Peaks',
    count: '12 Highland Experiences',
    tagline: 'Trek Above the Clouds',
    path: '/mountains',
    image: 'https://res.cloudinary.com/dw1ohipim/image/upload/v1788191639/ja0p18egwk32gflxlq5k.jpg',
  },
  {
    id: 'safari',
    emoji: '🦁',
    title: 'Wildlife Safaris',
    count: '9 Safari Destinations',
    tagline: 'Beyond the Ordinary Wild',
    path: '/collections/safari',
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2024/01/photo_2024-01-09_01-14-21.jpg',
  },
  {
    id: 'unesco',
    emoji: '🏛️',
    title: 'UNESCO Heritage',
    count: '12 World Heritage Sites',
    tagline: 'Ancient Civilizations',
    path: '/collections/unesco',
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2023/11/photo_5974217522561531706_y.jpg',
  },
  {
    id: 'festivals',
    emoji: '🎉',
    title: 'Cultural Festivals',
    count: '12 Living Traditions',
    tagline: 'Timket • Meskel • Irreechaa',
    path: '/collections/festivals',
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2024/12/photo_6013688044378502781_x.jpg',
  },
  {
    id: 'birding',
    emoji: '🐦',
    title: 'Avian Hotspots',
    count: '14 Birding Expeditions',
    tagline: '860+ Species & 30+ Endemics',
    path: '/collections/birding',
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_2023-12-25_01-55-07.jpg',
  },
  {
    id: 'signature',
    emoji: '✨',
    title: 'Signature Routes',
    count: '7 National Journeys',
    tagline: 'Multi-Region Masterpieces',
    path: '/signature-routes',
    image: 'https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg',
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(regionsData[0]);
  const [hoveredCollection, setHoveredCollection] = useState(COLLECTION_CARDS[0]);

  // Mobile accordion states
  const [mobileRegionsOpen, setMobileRegionsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const scrollFrameRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileRegionsOpen(false);
    setMobileCollectionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 20;
        setIsScrolled((p) => (p === nextScrolled ? p : nextScrolled));
        scrollFrameRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  const handleDropdownEnter = useCallback((name) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
  }, []);

  useEffect(() => {
    return () => dropdownTimeoutRef.current && clearTimeout(dropdownTimeoutRef.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    },
    [isMobileMenuOpen]
  );

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, handleKeyDown]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out px-2.5 sm:px-4 lg:px-8 pt-2 sm:pt-3">
      
      {/* Top Concierge Bar */}
      <div
        className={`max-w-7xl mx-auto mb-2 transition-all duration-500 ease-out hidden lg:block ${
          isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden' : 'opacity-100 translate-y-0 h-auto'
        }`}
      >
        <div className="bg-black/50 backdrop-blur-xl text-[#D4AF7A] text-[11px] py-1.5 px-6 rounded-full border border-[#C88A2E]/30 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-stone-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span className="font-light">{companyData.fullName} • <strong className="text-white font-medium">Addis Ababa</strong></span>
            </div>
            <span className="text-white/20">|</span>
            <a href={`tel:${companyData.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors text-stone-300 font-medium">
              <Phone className="w-3 h-3 text-[#C88A2E]" />
              <span>{companyData.contact.phone}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-stone-300 font-light">
            <a href={companyData.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </a>
            <span className="text-white/20">•</span>
            <Link to="/why-ethiopia" className="hover:text-white transition-colors text-[#D4AF7A] flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C88A2E]" />
              <span>Why Ethiopia?</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Capsule Nav */}
      <nav
        className={`mx-auto max-w-7xl rounded-2xl sm:rounded-3xl transition-all duration-500 relative overflow-visible ${
          isScrolled
            ? 'bg-[#0E0E10]/90 backdrop-blur-2xl border border-[#C88A2E]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] py-2 sm:py-2.5 px-2.5 sm:px-6'
            : 'bg-black/40 backdrop-blur-xl border border-white/20 hover:border-[#C88A2E]/40 shadow-[0_10px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)] py-2 sm:py-3 px-2.5 sm:px-7'
        }`}
      >
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none rounded-full" />

        <div className="flex items-center justify-between relative z-10">

          {/* Logo */}
          <div className="flex items-center shrink-0 relative h-9 sm:h-10 -ml-1 sm:-ml-2 mr-2 xs:mr-3 sm:mr-5 lg:mr-8 xl:mr-10">
            <Link to="/" className="group flex items-center focus:outline-none transition-transform active:scale-[0.97]" aria-label="DINQ Homepage">
              <div className="relative flex items-center origin-left transform-gpu -translate-x-2 sm:-translate-x-3 md:-translate-x-4 lg:-translate-x-5 xl:-translate-x-6 transition-transform duration-300 scale-[1.8] xs:scale-[2] sm:scale-[2.25] md:scale-[2.5] lg:scale-[2.7] xl:scale-[3.2]">
                <DinqLogo variant="light" size="md" className="!h-8 xs:!h-[34px] sm:!h-9 md:!h-10 lg:!h-[42px] xl:!h-11 w-auto max-w-none object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">

            <Link
              to="/"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            {/* REGIONS MEGA DROPDOWN */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleDropdownEnter('regions')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'regions' ? null : 'regions')}
                className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border inline-flex items-center gap-1 transition-all duration-300 ${
                  isActive('/regions') || activeDropdown === 'regions'
                    ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                    : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span>Regions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-70 ${activeDropdown === 'regions' ? 'rotate-180 text-[#C88A2E]' : ''}`} />
              </button>

              {activeDropdown === 'regions' && (
                <div className="absolute top-full left-0 pt-3 z-50" onMouseEnter={() => handleDropdownEnter('regions')} onMouseLeave={handleDropdownLeave}>
                  <div className="w-[620px] bg-[#0E0E10]/98 backdrop-blur-3xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_30px_rgba(200,138,46,0.2)] border border-[#C88A2E]/40 p-5 grid grid-cols-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-7 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 border-b border-white/10 flex items-center justify-between">
                        <span>5 Regional Framework</span>
                        <span className="text-[#D4AF7A] bg-[#C88A2E]/20 border border-[#C88A2E]/40 px-2 py-0.5 rounded-full font-bold text-[10px]">Master</span>
                      </div>
                      <div className="space-y-1">
                        {regionsData.map((reg) => (
                          <Link
                            key={reg.id}
                            to={`/regions/${reg.slug}`}
                            onMouseEnter={() => setHoveredRegion(reg)}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs border transition-all group ${
                              hoveredRegion?.id === reg.id
                                ? 'bg-white/15 text-[#D4AF7A] font-bold border-[#C88A2E]/60 shadow-sm translate-x-1'
                                : 'text-stone-200 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2 font-medium">
                              <span className="font-mono text-[10px] text-[#C88A2E]">0{reg.number}</span>
                              <span>{reg.name}</span>
                            </span>
                            <span className="text-[10px] text-stone-400 font-light shrink-0 line-clamp-1 max-w-[120px] text-right">{reg.signature}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-white/10 px-2">
                        <Link to="/regions" className="text-xs font-bold text-[#D4AF7A] flex items-center justify-between hover:underline py-1">
                          <span>Explore All 5 Master Regions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-5 bg-stone-900/90 rounded-2xl overflow-hidden relative flex flex-col justify-end p-4 text-white shadow-xl border border-[#C88A2E]/30 min-h-[260px]">
                      {hoveredRegion && (
                        <>
                          <img src={hoveredRegion.heroImage} alt={hoveredRegion.name} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-all duration-700 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
                          <div className="relative z-10 space-y-2">
                            <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-white/20 inline-block">
                              {hoveredRegion.signature}
                            </span>
                            <h4 className="font-serif text-lg font-bold leading-tight">{hoveredRegion.name}</h4>
                            <p className="text-[11px] text-stone-200 line-clamp-3 leading-relaxed font-light">{hoveredRegion.shortDesc}</p>
                            <div className="pt-1">
                              <span className="text-[11px] font-bold text-[#D4AF7A] inline-flex items-center gap-1 hover:underline">
                                <span>Explore Route</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLLECTIONS MEGA DROPDOWN (NOW SAME SIZE AS REGIONS) */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleDropdownEnter('collections')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'collections' ? null : 'collections')}
                className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border inline-flex items-center gap-1 transition-all duration-300 ${
                  isActive('/collections') || isActive('/mountains') || isActive('/signature-routes') || activeDropdown === 'collections'
                    ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                    : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-70 ${activeDropdown === 'collections' ? 'rotate-180 text-[#C88A2E]' : ''}`} />
              </button>

              {activeDropdown === 'collections' && (
                <div className="absolute top-full left-0 pt-3 z-50" onMouseEnter={() => handleDropdownEnter('collections')} onMouseLeave={handleDropdownLeave}>
                  <div className="w-[620px] bg-[#0E0E10]/98 backdrop-blur-3xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_30px_rgba(200,138,46,0.2)] border border-[#C88A2E]/40 p-5 grid grid-cols-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-7 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1 border-b border-white/10 flex items-center justify-between">
                        <span>Specialty Collections</span>
                        <span className="text-[#D4AF7A] bg-[#C88A2E]/20 border border-[#C88A2E]/40 px-2 py-0.5 rounded-full font-bold text-[10px]">66+</span>
                      </div>
                      <div className="space-y-1">
                        {COLLECTION_CARDS.map((c) => (
                          <Link
                            key={c.id}
                            to={c.path}
                            onMouseEnter={() => setHoveredCollection(c)}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs border transition-all group ${
                              hoveredCollection?.id === c.id
                                ? 'bg-white/15 text-[#D4AF7A] font-bold border-[#C88A2E]/60 shadow-sm translate-x-1'
                                : 'text-stone-200 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2 font-medium min-w-0">
                              <span className="text-base shrink-0">{c.emoji}</span>
                              <span className="truncate">{c.title}</span>
                            </span>
                            <span className="text-[10px] text-stone-400 font-light shrink-0 line-clamp-1 max-w-[110px] text-right">{c.count}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-white/10 px-2">
                        <Link to="/signature-routes" className="text-xs font-bold text-[#D4AF7A] flex items-center justify-between hover:underline py-1">
                          <span>View All Specialty Collections</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-5 bg-stone-900/90 rounded-2xl overflow-hidden relative flex flex-col justify-end p-4 text-white shadow-xl border border-[#C88A2E]/30 min-h-[260px]">
                      {hoveredCollection && (
                        <>
                          <img
                            src={hoveredCollection.image}
                            alt={hoveredCollection.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-all duration-700 ease-out"
                            key={hoveredCollection.id}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                          <div className="relative z-10 space-y-2">
                            <div className="text-3xl drop-shadow-xl">{hoveredCollection.emoji}</div>
                            <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-white/20 inline-block">
                              {hoveredCollection.count}
                            </span>
                            <h4 className="font-serif text-lg font-bold leading-tight">{hoveredCollection.title}</h4>
                            <p className="text-[11px] text-stone-200 italic font-light">"{hoveredCollection.tagline}"</p>
                            <div className="pt-1">
                              <span className="text-[11px] font-bold text-[#D4AF7A] inline-flex items-center gap-1 hover:underline">
                                <span>Explore Collection</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/tours"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                isActive('/tours')
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              Tours
            </Link>

            <Link
              to="/experiences"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                isActive('/experiences')
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              Experiences
            </Link>

            <Link
              to="/shop"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border inline-flex items-center gap-1 transition-all duration-300 ${
                isActive('/shop')
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop</span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                isActive('/about')
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                isActive('/contact')
                  ? 'text-[#D4AF7A] bg-white/10 border-[#C88A2E]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(200,138,46,0.2)] font-bold'
                  : 'text-white/90 border-transparent hover:text-white hover:border-white/20 hover:bg-white/10'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button onClick={() => navigate('/tours')} className="p-2 text-stone-200 hover:text-[#D4AF7A] rounded-full hover:bg-white/10 border border-transparent hover:border-white/20 transition-all hidden lg:inline-flex" title="Search Tours">
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden sm:block">
              <MagneticButton onClick={() => navigate('/plan-your-trip')} className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_8px_20px_rgba(200,138,46,0.4)] border border-amber-300/40 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Plan Your Trip</span>
              </MagneticButton>
            </div>

            <Link to="/plan-your-trip" className="sm:hidden px-2.5 xs:px-3.5 py-1.5 rounded-xl bg-[#C88A2E] text-white text-xs font-bold flex items-center gap-1 shadow-md border border-amber-300/30 active:scale-95 whitespace-nowrap">
              <Compass className="w-3.5 h-3.5" />
              <span>Plan</span>
            </Link>

            <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white hover:text-[#D4AF7A] bg-white/10 rounded-xl border border-white/20 focus:outline-none backdrop-blur-md active:scale-95" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER with ACCORDIONS */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 z-0" onClick={() => setIsMobileMenuOpen(false)} />

          <div ref={menuRef} className="w-[88vw] max-w-[360px] bg-[#0E0E10] h-[100dvh] shadow-2xl flex flex-col justify-between relative text-white z-10 border-l border-[#C88A2E]/40">
            
            {/* Watermark */}
            <div className="absolute right-2 bottom-32 text-[7rem] font-serif font-bold text-white/[0.03] select-none pointer-events-none leading-none">
              ድንቅ
            </div>

            {/* Mobile Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40">
              <div className="relative flex items-center -ml-1">
                <div className="relative flex items-center origin-left transform-gpu scale-[1.25] xs:scale-[1.35] sm:scale-[1.45]">
                  <DinqLogo
                    variant="light"
                    size="md"
                    to={null}
                    className="!h-9 xs:!h-10 sm:!h-11 w-auto max-w-none object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>

              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white rounded-xl bg-white/10 border border-white/15 active:bg-white/20 shrink-0" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar relative z-10">
              
              {/* Home */}
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-serif font-bold rounded-xl text-white bg-white/5 border border-white/10 active:bg-white/10">
                🏠 Home
              </Link>

              {/* REGIONS ACCORDION */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileRegionsOpen(!mobileRegionsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-serif font-bold text-white active:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🌍</span>
                    <span>Regions</span>
                    <span className="text-[10px] text-[#D4AF7A] bg-[#C88A2E]/20 px-2 py-0.5 rounded-full border border-[#C88A2E]/40 font-bold ml-1">5</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#C88A2E] transition-transform duration-300 ${mobileRegionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileRegionsOpen && (
                  <div className="border-t border-white/10 p-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/regions" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-bold rounded-lg text-[#D4AF7A] bg-[#C88A2E]/10 border border-[#C88A2E]/30">
                      🌍 Overview — All 5 Master Regions
                    </Link>
                    {regionsData.map((reg) => (
                      <Link
                        key={reg.id}
                        to={`/regions/${reg.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-stone-300 active:text-white rounded-lg hover:bg-white/5"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#C88A2E]">0{reg.number}</span>
                          <span>{reg.name}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* COLLECTIONS ACCORDION */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-serif font-bold text-white active:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Collections</span>
                    <span className="text-[10px] text-[#D4AF7A] bg-[#C88A2E]/20 px-2 py-0.5 rounded-full border border-[#C88A2E]/40 font-bold ml-1">66+</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#C88A2E] transition-transform duration-300 ${mobileCollectionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileCollectionsOpen && (
                  <div className="border-t border-white/10 p-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {COLLECTION_CARDS.map((c) => (
                      <Link
                        key={c.id}
                        to={c.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-stone-300 active:text-white rounded-lg hover:bg-white/5"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{c.emoji}</span>
                          <span className="flex-1 min-w-0">
                            <span className="block font-bold text-white text-xs truncate">{c.title}</span>
                            <span className="block text-[10px] text-stone-500 truncate">{c.count}</span>
                          </span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Simple Direct Links */}
              <div className="pt-2 space-y-1">
                {[
                  { label: 'Tours & Safaris', icon: '🧭', path: '/tours' },
                  { label: 'Destinations', icon: '📍', path: '/destinations' },
                  { label: 'Experiences', icon: '🎭', path: '/experiences' },
                  { label: 'Travel Shop', icon: '🛍️', path: '/shop' },
                  { label: 'Gallery', icon: '📸', path: '/gallery' },
                  { label: 'About DINQ', icon: 'ℹ️', path: '/about' },
                  { label: 'Why Ethiopia?', icon: '✨', path: '/why-ethiopia' },
                  { label: 'Contact', icon: '📞', path: '/contact' },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-200 active:text-white active:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-black/60 shrink-0 space-y-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <Link to="/plan-your-trip" onClick={() => setIsMobileMenuOpen(false)} className="w-full btn-gold py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg border border-amber-300/40">
                <Compass className="w-4 h-4" />
                <span>Interactive Trip Planner</span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${companyData.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/10 text-white text-xs font-bold rounded-xl border border-white/15 active:bg-white/20">
                  <Phone className="w-3.5 h-3.5 text-[#C88A2E]" />
                  <span>Call</span>
                </a>
                <a href={companyData.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 active:bg-emerald-500/30">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}