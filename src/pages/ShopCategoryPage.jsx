import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Package, Filter } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SplitReveal from '../components/animations/SplitReveal';
import ProductCard from '../components/shop/ProductCard';

// FIRESTORE INTEGRATION
import { shopCategories as shopCategoriesStatic, shopProducts as shopProductsStatic } from '../data/shopData';
import { useCollection } from '../hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function ShopCategoryPage() {
  const { slug } = useParams();
  const containerRef = useRef(null);
  const [sortBy, setSortBy] = useState('featured');

  const { data: shopCategoriesRaw } = useCollection('shopCategories', shopCategoriesStatic);
  const { data: allProducts } = useCollection('shopProducts', shopProductsStatic);

  // Sort categories by number
  const shopCategories = useMemo(() =>
    [...shopCategoriesRaw].sort((a, b) => {
      const numA = parseInt(a.number) || 999;
      const numB = parseInt(b.number) || 999;
      return numA - numB;
    }),
    [shopCategoriesRaw]
  );

  const category = shopCategories.find(c => c.slug === slug);
  const products = allProducts.filter(p => p.categorySlug === slug);

  useEffect(() => {
    if (category) {
      updatePageMeta({
        title: `${category.title} | DINQ Travel Shop`,
        description: category.description,
      });
    }
  }, [category]);

  useGSAP(() => {
    if (!category) return;
    let mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.gsap-product', {
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
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, { scope: containerRef, dependencies: [category, products.length] });

  if (!category && shopCategories.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Package className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Category Not Found</h1>
        <Link to="/shop" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold mt-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!category) return null;

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <div ref={containerRef} className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">

      {/* HERO */}
      <div className="bg-stone-950 text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={category.heroImage} alt={category.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-black/60 to-stone-950/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Shop', to: '/shop' },
              { label: category.shortTitle },
            ]}
          />

          <div className="flex items-center gap-3">
            <span className="text-5xl">{category.emoji}</span>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
              Category {category.number}
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold drop-shadow-lg leading-tight max-w-3xl">
            <SplitReveal text={category.title} />
          </h1>

          <p className="max-w-2xl text-stone-200 text-base sm:text-lg leading-relaxed font-light">
            {category.description}
          </p>

          <div className="pt-2 text-xs text-stone-400 font-medium">
            {products.length} products available
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border-b border-stone-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{products.length}</strong> items
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Package className="w-16 h-16 text-stone-300 mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-stone-900">No products yet in this category</h3>
            <p className="text-sm text-stone-500 font-light max-w-md mx-auto">
              We're actively curating new items for this collection. Contact us if you're looking for something specific.
            </p>
            <Link to="/shop" className="btn-gold px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-6">
              Back to All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div 
                key={product.id} 
                className="gsap-product opacity-0 translate-y-10"
                style={{ willChange: 'transform, opacity' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* OTHER CATEGORIES */}
      <section className="py-14 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">Explore Other Categories</h3>
          <div className="flex flex-wrap gap-3">
            {shopCategories
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/shop/${c.slug}`}
                  className="px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-stone-200 hover:border-[#C88A2E] hover:bg-amber-50 text-xs font-semibold text-stone-700 hover:text-[#C88A2E] transition-all flex items-center gap-2"
                >
                  <span>{c.emoji}</span>
                  <span>{c.shortTitle}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}