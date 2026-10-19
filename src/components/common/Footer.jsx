import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  Compass,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Globe,
} from 'lucide-react';
import { DinqLogo } from './DinqLogo';
import MagneticButton from '../animations/MagneticButton';
import companyData from '../../data/companyData';
import confetti from 'canvas-confetti';
import { createDoc } from '../../firebase/firestore';

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('loading');

    try {
      // 🔥 SAVES TO FIRESTORE → appears in /admin/subscribers instantly
      await createDoc('subscribers', {
        email: newsletterEmail.toLowerCase().trim(),
        source: 'footer_newsletter',
        subscribedAt: new Date().toISOString(),
      });
      setNewsletterStatus('success');
      setNewsletterEmail('');
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.9 },
          colors: ['#C88A2E', '#D4AF7A', '#18181B'],
        });
      } catch (err) {}
    } catch (error) {
      console.error('❌ Newsletter subscription failed:', error);
      setNewsletterStatus('idle');
      alert('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-[#0E0E10] text-stone-300 pt-20 pb-12 border-t border-stone-800 relative overflow-hidden mt-auto">
      {/* Background Watermark */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 text-[12vw] font-serif font-black text-stone-900/40 select-none pointer-events-none whitespace-nowrap tracking-widest uppercase">
        Dinkinesh • ድንቅነሽ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Pre-Footer Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-stone-900 via-[#18181B] to-stone-900 border border-stone-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF7A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>{companyData.fullName}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Ready to Design Your Custom Expedition?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Connect directly with founder Zerihun Alemayehu in Addis Ababa for custom flight harmonizations, 4WD allocations, and luxury eco-lodge reservations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <MagneticButton
              onClick={() => navigate('/plan-your-trip')}
              className="btn-gold px-8 py-4 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Bespoke Trip Planner</span>
            </MagneticButton>

            <a
              href={companyData.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl text-xs font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-stone-800/80">
          {/* Brand (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <DinqLogo variant="light" size="lg" />

            <p className="text-xs text-stone-400 leading-relaxed font-light pr-6">
              {companyData.description}
            </p>

            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF7A] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C88A2E]" />
                <span>The Meaning of DINQ (ድንቅ)</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                {companyData.meaning}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                Connect Across Ethiopia
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={companyData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#C88A2E] hover:bg-[#C88A2E] text-stone-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={companyData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#C88A2E] hover:bg-[#C88A2E] text-stone-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={companyData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#C88A2E] hover:bg-[#C88A2E] text-stone-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={companyData.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] text-stone-300 hover:text-white flex items-center justify-center transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                </a>
              </div>
            </div>
          </div>

          {/* 5 Regions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4AF7A] font-sans border-l-2 border-[#C88A2E] pl-3 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>5 Master Regions</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <Link to="/regions" className="hover:text-[#D4AF7A] font-semibold transition-colors">
                  Overview of All 5 Regions
                </Link>
              </li>
              <li>
                <Link to="/regions/north" className="hover:text-[#D4AF7A] transition-colors">
                  01 • Historic North
                </Link>
              </li>
              <li>
                <Link to="/regions/south" className="hover:text-[#D4AF7A] transition-colors">
                  02 • Living South
                </Link>
              </li>
              <li>
                <Link to="/regions/east" className="hover:text-[#D4AF7A] transition-colors">
                  03 • Cultural East
                </Link>
              </li>
              <li>
                <Link to="/regions/west" className="hover:text-[#D4AF7A] transition-colors">
                  04 • Coffee West
                </Link>
              </li>
              <li>
                <Link to="/regions/coffee-route" className="hover:text-[#D4AF7A] transition-colors">
                  05 • National Coffee Route
                </Link>
              </li>
              <li>
                <Link to="/signature-routes" className="text-[#C88A2E] font-bold hover:underline">
                  ★ 7 Signature Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialty Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4AF7A] font-sans border-l-2 border-[#C88A2E] pl-3">
              Specialty Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <Link to="/mountains" className="hover:text-[#D4AF7A] transition-colors">
                  🏔️ 12 Mountains & Peaks
                </Link>
              </li>
              <li>
                <Link to="/collections/safari" className="hover:text-[#D4AF7A] transition-colors">
                  🦁 9 Wildlife Safaris
                </Link>
              </li>
              <li>
                <Link to="/collections/unesco" className="hover:text-[#D4AF7A] transition-colors">
                  🏛️ 12 UNESCO Heritage Sites
                </Link>
              </li>
              <li>
                <Link to="/collections/festivals" className="hover:text-[#D4AF7A] transition-colors">
                  🎉 12 Cultural Festivals
                </Link>
              </li>
              <li>
                <Link to="/collections/birding" className="hover:text-[#D4AF7A] transition-colors">
                  🐦 14 Avian Hotspots
                </Link>
              </li>
              <li>
                <Link to="/why-ethiopia" className="text-[#C88A2E] font-bold hover:underline">
                  Why Ethiopia? (12 Reasons)
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Shop */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4AF7A] font-sans border-l-2 border-[#C88A2E] pl-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3 h-3" />
              <span>Travel Shop</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li>
                <Link to="/shop" className="hover:text-[#D4AF7A] font-semibold transition-colors">
                  Shop All Categories
                </Link>
              </li>
              <li>
                <Link to="/shop/hiking-footwear" className="hover:text-[#D4AF7A] transition-colors">
                  🥾 Hiking Footwear
                </Link>
              </li>
              <li>
                <Link to="/shop/outdoor-clothing" className="hover:text-[#D4AF7A] transition-colors">
                  👕 Outdoor Clothing
                </Link>
              </li>
              <li>
                <Link to="/shop/camping-equipment" className="hover:text-[#D4AF7A] transition-colors">
                  ⛺ Camping Equipment
                </Link>
              </li>
              <li>
                <Link to="/shop/urban-camping" className="hover:text-[#D4AF7A] transition-colors">
                  🏕️ Urban Camping
                </Link>
              </li>
              <li>
                <Link to="/shop/ethiopia-collection" className="hover:text-[#D4AF7A] transition-colors">
                  👕 Ethiopia Branded
                </Link>
              </li>
              <li>
                <Link to="/shop/gifts-souvenirs" className="text-[#C88A2E] font-bold hover:underline">
                  🎁 Coffee & Souvenirs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4AF7A] font-sans border-l-2 border-[#C88A2E] pl-3">
              Addis Ababa Office
            </h4>

            <div className="space-y-3 text-xs text-stone-400 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C88A2E] mt-0.5 shrink-0" />
                <span>
                  {companyData.headquarters.address}, {companyData.headquarters.city}, Ethiopia
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <a
                  href={`tel:${companyData.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white font-medium transition-colors"
                >
                  {companyData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <a
                  href={`mailto:${companyData.contact.primaryEmail}`}
                  className="hover:text-white font-medium transition-colors"
                >
                  {companyData.contact.primaryEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <span>{companyData.hours.weekday}</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 text-[10px] text-stone-400">
                Ministry License: <strong className="text-stone-200">{companyData.licenseNumber}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border-b border-stone-800/80">
          <div className="lg:col-span-1 space-y-1">
            <h4 className="text-white font-serif font-bold text-base">The Ethiopia Field Dispatch</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Seasonal trekking conditions, festival timings, shop arrivals, and expedition notes.
            </p>
          </div>

          <div className="lg:col-span-2">
            {newsletterStatus === 'success' ? (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-300 text-xs animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Amesegenalehu! You are now subscribed. Your email is in our admin list.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-stone-900/90 border border-stone-700 text-stone-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#C88A2E] flex-1 font-light"
                />
                <MagneticButton
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="btn-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-lg disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                </MagneticButton>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500 font-light">
          <div className="space-y-1.5 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} {companyData.fullName}. All rights reserved. Ethiopian Tourism Enterprise Code {companyData.licenseNumber}.
            </p>
            <p className="text-[11px] text-stone-500">
              <strong className="text-stone-400 font-medium">Rebrand Notice:</strong> DINQ Tour, Travel & Events is the transformed digital flagship of the licensed Ethiopian operator previously operating as <em>Ambasel Tour and Travel</em>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 font-medium">
            <Link to="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/legal/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/responsible-tourism" className="hover:text-white transition-colors">
              Ethical Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}