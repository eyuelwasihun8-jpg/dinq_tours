import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import MagneticButton from '../components/animations/MagneticButton';
import ProductCard from '../components/shop/ProductCard';

// FIRESTORE INTEGRATION
import { shopCategories as shopCategoriesStatic, shopProducts as shopProductsStatic } from '../data/shopData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPage() {
  const containerRef = useRef(null);

  const { data: shopCategoriesRaw, loading: catLoading } = useCollection('shopCategories', shopCategoriesStatic);
  const { data: allProducts, loading: prodLoading } = useCollection('shopProducts', shopProductsStatic);

  // ✅ SORT CATEGORIES BY NUMBER (01, 02, 03, 04...)
  const shopCategories = useMemo(() => {
    return [...shopCategoriesRaw].sort((a, b) => {
      const numA = parseInt(a.number) || 999;
      const numB = parseInt(b.number) || 999;
      return numA - numB;
    });
  }, [shopCategoriesRaw]);

  const bestSellers = useMemo(() => 
    allProducts.filter(p => p.isBestSeller).slice(0, 8),
    [allProducts]
  );
  
  const brandedProducts = useMemo(() => 
    allProducts.filter(p => p.isBranded).slice(0, 4),
    [allProducts]
  );

  useEffect(() => {
    updatePageMeta({
      title: "Travel Shop | DINQ Tour, Travel & Events",
      description: "Everything you need for your Ethiopian journey — hiking gear, outdoor clothing, camping equipment, branded merchandise, and authentic Ethiopian souvenirs.",
    });
  }, []);

  // ✅ GENTLE ANIMATION — animates all cards together when section enters view
  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();
      tl.from('.hero-tag', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' })
        .to('.gsap-word', { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out' }, "-=0.6")
        .from('.hero-sub', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8");
    });

    // After data loads, set up card animations
    if (shopCategories.length > 0) {
      // Use a batch animation that fires ALL at once when section enters
      ScrollTrigger.batch('.gsap-category-card', {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true
          }),
        start: 'top 90%',
        once: true, // Only trigger once
      });

      ScrollTrigger.batch('.gsap-product-card', {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: true
          }),
        start: 'top 90%',
        once: true,
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, { scope: containerRef, dependencies: [shopCategories.length, allProducts.length] });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">

      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1920&q=80"
            alt="DINQ Travel Shop"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="hero-tag">
            <Breadcrumbs items={[{ label: 'Travel Shop', to: '/shop' }]} />
          </div>

          <div className="hero-tag inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
            <ShoppingBag className="w-4 h-4 text-[#C88A2E]" />
            <span>DINQ Travel Shop</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-tight">
            <SplitReveal text="Everything You Need" className="block" />
            <SplitReveal text="for Your Journey" className="block italic font-normal text-[#D4AF7A]" />
          </h1>

          <p className="hero-sub max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            From high-altitude trekking boots to authentic Ethiopian coffee — handpicked gear and branded merchandise curated by the DINQ team for every kind of traveler.
          </p>

          <div className="hero-sub pt-6 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-light">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C88A2E]" />
              <span>Hand-Tested by Our Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C88A2E]" />
              <span>Pickup in Addis or Shipped Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C88A2E]" />
              <span>Supporting Local Ethiopian Artisans</span>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
              <Package className="w-3.5 h-3.5" />
              <span>Shop by Category</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
              {shopCategories.length} Categories, Infinite Adventures
            </h2>
            <p className="text-sm text-stone-500 font-light">
              Explore our curated collections — each piece selected or designed with Ethiopian terrain and heritage in mind.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {catLoading && shopCategories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-4/5 rounded-3xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopCategories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug}`}
                className="gsap-category-card opacity-0 translate-y-10 group relative aspect-4/5 sm:aspect-4/5 rounded-3xl overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-shadow duration-500 hover:-translate-y-1"
                style={{ willChange: 'transform, opacity' }}
              >
                <img
                  src={category.heroImage}
                  alt={category.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute top-5 right-5 text-white/30 font-serif text-5xl font-bold leading-none">
                  {category.number}
                </div>

                {category.isBranded && (
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      DINQ Exclusive
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-3">
                  <div className="text-4xl">{category.emoji}</div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D4AF7A] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-light">
                    {category.tagline}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF7A]">
                    <span>Shop Category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="py-20 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C88A2E]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Traveler Favorites</span>
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
                  Best Sellers
                </h2>
              </div>
              <Link to="/shop" className="btn-outline-gold px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <div 
                  key={product.id} 
                  className="gsap-product-card opacity-0 translate-y-10"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DINQ BRANDED */}
      {brandedProducts.length > 0 && (
        <section className="py-24 bg-stone-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-14 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
                <Award className="w-3.5 h-3.5 text-[#C88A2E]" />
                <span>DINQ Signature Merchandise</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
                Wear the Pride of Abyssinia
              </h2>
              <p className="text-sm text-stone-400 font-light leading-relaxed">
                Our exclusive DINQ-branded collection and Urban Camping Ethiopia collaborations — made in Ethiopia, inspired by 3,000 years of civilization.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {brandedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="gsap-product-card opacity-0 translate-y-10"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <MagneticButton>
                <Link to="/shop/ethiopia-collection" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-xl">
                  <span>Explore DINQ Branded Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>
      )}

      {/* BUNDLE WITH TOUR CTA */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#C88A2E] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Booking a Tour? Bundle Your Gear.
          </h2>
          <p className="text-base text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Save 15% on all gear when you add it to your DINQ tour booking. We'll deliver everything to your hotel in Addis Ababa before departure.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton>
              <Link to="/tours" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-xl">
                <span>Browse Tours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/contact" className="btn-dark px-8 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-lg">
                <span>Ask About Bundles</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}