import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Map, Calendar, ArrowRight } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';

export default function NotFoundPage() {
  useEffect(() => {
    updatePageMeta({
      title: "Page Not Found (404) | DINQ ETHIOPIA TOURS",
      description: "The page you requested could not be found. Explore our authentic Ethiopian tours and destinations.",
    });
  }, []);

  return (
    <div className="bg-[#FAF7F2] min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E7E1D7] shadow-xl">
        <div className="w-20 h-20 bg-amber-50 text-[#C88A2E] rounded-full flex items-center justify-center mx-auto">
          <Compass className="w-10 h-10 animate-spin duration-1000" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-[#C88A2E]">
            404 Error • Lost Trail
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            The Trail Seems to Have Disappeared
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The page or itinerary you are looking for may have moved or no longer exists. Let us guide you back to familiar highlands.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto btn-dark px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/tours"
            className="w-full sm:w-auto btn-gold px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4" />
            <span>Browse Expeditions</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-stone-100 text-xs text-stone-500">
          Need immediate guidance?{' '}
          <Link to="/contact" className="text-[#C88A2E] font-medium hover:underline">
            Contact Zerihun and Tigist
          </Link>
        </div>
      </div>
    </div>
  );
}
