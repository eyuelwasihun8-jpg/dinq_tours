import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Check,
  ShoppingBag,
  Share2,
  Truck,
  ShieldCheck,
  Package,
  ArrowRight,
  MessageSquare,
  Minus,
  Plus,
} from 'lucide-react';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/shop/ProductCard';
import MagneticButton from '../components/animations/MagneticButton';
import companyData from '../data/companyData';

// FIRESTORE INTEGRATION
import { shopCategories as shopCategoriesStatic, shopProducts as shopProductsStatic } from '../data/shopData';
import { useCollection } from '../hooks/useFirestore';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: shopCategories } = useCollection('shopCategories', shopCategoriesStatic);
  const { data: allProducts } = useCollection('shopProducts', shopProductsStatic);
  
  const product = allProducts.find(p => p.slug === slug);
  const category = product ? shopCategories.find(c => c.slug === product.categorySlug) : null;
  const relatedProducts = product
    ? allProducts.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    if (product) {
      updatePageMeta({
        title: `${product.name} | DINQ Travel Shop`,
        description: product.description,
        ogImage: product.image,
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (!product && allProducts.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F2]">
        <Package className="w-16 h-16 text-stone-400 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Product Not Found</h1>
        <Link to="/shop" className="btn-gold px-8 py-4 rounded-xl text-sm font-bold mt-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hi DINQ, I'm interested in buying: ${product.name} ($${product.price} / ${product.priceETB}). Quantity: ${quantity}`
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: category?.shortTitle, to: `/shop/${category?.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* MAIN PRODUCT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-md">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {product.isBestSeller && (
                <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Best Seller
                </span>
              )}
              {product.isBranded && (
                <span className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  DINQ Branded
                </span>
              )}
              {category && (
                <Link
                  to={`/shop/${category.slug}`}
                  className="text-xs font-semibold text-[#C88A2E] uppercase tracking-wider hover:underline"
                >
                  {category.emoji} {category.shortTitle}
                </Link>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-base text-stone-600 font-light leading-relaxed">{product.tagline}</p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${n <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900">{product.rating}</span>
              <span className="text-xs text-stone-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-stone-200 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">${product.price}</span>
                <span className="text-sm text-stone-500">USD</span>
              </div>
              <div className="text-sm text-stone-500">or {product.priceETB}</div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full border border-stone-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            {product.inStock ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                <Check className="w-4 h-4" />
                <span>In Stock — Ready to Ship from Addis Ababa</span>
              </div>
            ) : (
              <div className="text-sm text-rose-700 font-semibold">Out of Stock — Contact Us for Restock</div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Quantity</span>
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-3">
              <MagneticButton
                onClick={handleAddToCart}
                className="w-full btn-gold py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart — ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </MagneticButton>

              <a
                href={`${companyData.contact.whatsappLink.split('?')[0]}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>

            {/* Trust Features */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <div>
                  <div className="font-bold text-stone-900">Fast Shipping</div>
                  <div className="text-stone-500 font-light">Addis & worldwide</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <div>
                  <div className="font-bold text-stone-900">Guide-Tested</div>
                  <div className="text-stone-500 font-light">Field-approved</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <div>
                  <div className="font-bold text-stone-900">Easy Returns</div>
                  <div className="text-stone-500 font-light">14-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-md">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Product Description</h2>
          <p className="text-base text-stone-700 font-light leading-relaxed">{product.description}</p>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-8">
            <h2 className="font-serif text-3xl font-bold text-stone-900">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}