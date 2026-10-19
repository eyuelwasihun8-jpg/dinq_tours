import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Sparkles, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E7E1D7] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
      {/* Image */}
      <Link to={`/shop/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Best Seller</span>
              </span>
            )}
            {product.isBranded && (
              <span className="bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                DINQ Branded
              </span>
            )}
          </div>

          {product.inStock && (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Check className="w-2.5 h-2.5" />
              <span>In Stock</span>
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-stone-800">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
          <h3 className="font-serif text-base font-bold text-stone-900 leading-snug group-hover:text-[#C88A2E] transition-colors line-clamp-2">
            <Link to={`/shop/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">{product.tagline}</p>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="font-serif text-xl font-bold text-stone-900 leading-none">
              ${product.price}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">{product.priceETB}</div>
          </div>
          <Link
            to={`/shop/product/${product.slug}`}
            className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}