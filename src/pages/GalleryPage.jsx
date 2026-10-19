import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Camera, X, ArrowRight, MapPin, Compass, Sparkles } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import galleryData from '../data/galleryData';

// Animation Components
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
  const containerRef = useRef(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    updatePageMeta({
      title: "Visual Gallery Archive | DINQ ETHIOPIA TOURS",
      description: "Immerse yourself in high-definition photographs of ancient Ethiopian rock churches, Simien mountain ridges, Danakil lava lakes, and vibrant tribal traditions.",
    });
  }, []);

  const categories = ['All', 'Landscapes', 'Wildlife', 'Culture', 'Architecture', 'Festivals'];

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') return galleryData;
    return galleryData.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

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
        ease: 'power3.out' 
      })
      .from('.hero-tag', { 
        y: 20, opacity: 0, duration: 1, ease: 'power3.out' 
      }, "-=1.8")
      .to('.gsap-word', { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.05, 
        ease: 'power4.out' 
      }, "-=1.5")
      .from('.hero-sub', { 
        y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' 
      }, "-=1.0")
      .from('.gsap-filter-bar', { 
        y: 20, opacity: 0, duration: 1, ease: 'power3.out' 
      }, "-=0.8");

      // 2. Hero Parallax
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // 3. Staggered Grid Initial Load
      ScrollTrigger.batch('.gsap-grid-item', {
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out' }
        ),
        start: 'top 85%',
      });
    });
  }, { scope: containerRef });

  // 4. Reactive Grid Animation on Filter Change
  useGSAP(() => {
    gsap.fromTo('.gsap-grid-item', 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.2)' }
    );
  }, { scope: containerRef, dependencies: [filteredImages] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01. CINEMATIC HERO                                           */}
      {/* ============================================================ */}
      <div className="hero-section bg-stone-950 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://ambaseltourandtravel.com/wp-content/uploads/2024/01/photo_2024-01-02_08-45-28.jpg"
            alt="Ethiopian Visual Gallery"
            className="hero-bg w-full h-full object-cover opacity-30 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Photo Gallery', to: '/gallery' }]} />
          </div>
          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <Camera className="w-4 h-4 text-[#C88A2E]" />
            <span>Visual Storytelling</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold drop-shadow-lg">
            <SplitReveal text="Ethiopia in Frames" />
          </h1>
          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            A curated visual archive capturing the raw landscapes, rare endemic wildlife, living traditions, and sacred architecture of Ethiopia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* ============================================================ */}
        {/* 02. CATEGORY FILTERS                                         */}
        {/* ============================================================ */}
        <div className="gsap-filter-bar bg-white rounded-3xl p-4 shadow-2xl border border-[#E7E1D7] flex flex-wrap items-center justify-center sm:justify-start gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#18181B] text-white shadow-md transform scale-105'
                  : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* 03. GALLERY GRID                                             */}
        {/* ============================================================ */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              // Added img-zoom-container so the Custom Cursor recognizes it as a clickable image
              className="gsap-grid-item img-zoom-container group relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-stone-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF7A]">
                  {img.category} • {img.destination}
                </div>
                <div className="text-sm font-bold leading-snug">{img.title}</div>
                <div className="text-[11px] text-stone-300 line-clamp-2 font-light">{img.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 04. FULLSCREEN LIGHTBOX                                      */}
      {/* ============================================================ */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setActiveImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[90vh] bg-stone-950 rounded-[2rem] overflow-hidden shadow-2xl border border-stone-800 flex flex-col transform scale-100 animate-in zoom-in-95 duration-300"
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-6 right-6 bg-black/60 hover:bg-[#C88A2E] text-white p-3 rounded-full backdrop-blur-md transition-colors"
                aria-label="Close image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider">
                  {activeImage.category} • {activeImage.destination}
                </div>
                <h3 className="font-serif text-2xl font-bold mt-2">{activeImage.title}</h3>
                <p className="text-sm text-stone-400 mt-2 max-w-2xl font-light leading-relaxed">{activeImage.caption}</p>
              </div>

              {activeImage.tourSlug && (
                <MagneticButton
                  onClick={() => {
                    setActiveImage(null);
                  }}
                  className="shrink-0"
                >
                  <Link
                    to={`/tours/${activeImage.tourSlug}`}
                    className="btn-gold px-6 py-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg"
                  >
                    <span>Experience on Tour</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}