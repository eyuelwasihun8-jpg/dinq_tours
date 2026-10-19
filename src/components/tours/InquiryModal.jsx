import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, Send, Calendar, Users, Mail, User } from 'lucide-react';
import companyData from '../../data/companyData';
import confetti from 'canvas-confetti';
import { createDoc } from '../../firebase/firestore';

export default function InquiryModal({ tour, initialType = 'inquiry', onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: '2',
    packageTier: 'standard',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🔥 SAVES TO FIRESTORE → appears in /admin/inquiries instantly
      await createDoc('inquiries', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        travelDate: formData.travelDate,
        travelers: formData.travelers,
        packageTier: formData.packageTier,
        message: formData.message,
        tourTitle: tour?.title || null,
        tourSlug: tour?.slug || null,
        tourId: tour?.id || null,
        tourDuration: tour?.durationDays || null,
        tourPrice: tour?.priceFromUSD || null,
        formType: 'Tour Inquiry',
        status: 'new',
      });

      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#C88A2E', '#D4AF7A', '#18181B'],
        });
      } catch (err) {}
    } catch (error) {
      console.error('❌ Failed to submit tour inquiry:', error);
      alert('Failed to submit. Please try again or contact us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 focus:outline-none flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="p-5 bg-[#18181B] text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#D4AF7A] uppercase tracking-wider">
              {tour ? `Tour Booking Inquiry: ${tour.durationDays} Days` : 'Plan Your Journey with DINQ'}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
              {tour ? tour.title : 'Direct Travel Specialist Inquiry'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-stone-900">
                Inquiry Received, Amesegenalehu!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting <strong>DINQ Tour, Travel & Events</strong>. Zerihun will personally review your preferences and respond within 12 hours.
              </p>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E7E1D7] text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="text-stone-500 font-semibold uppercase tracking-wider text-[10px]">Your Inquiry Summary</div>
                <div><strong>Traveler:</strong> {formData.fullName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone}</div>
                {tour && <div><strong>Tour:</strong> {tour.title}</div>}
                <div><strong>Travel Date:</strong> {formData.travelDate || 'Flexible'}</div>
                <div><strong>Travelers:</strong> {formData.travelers}</div>
                <div className="pt-2">
                  <strong>Need faster response?</strong>{' '}
                  <a
                    href={companyData.contact.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366] font-semibold underline"
                  >
                    Message us on WhatsApp
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-dark px-6 py-2.5 rounded-xl text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-[#C88A2E] mt-0.5 shrink-0" />
                <span>
                  <strong>Owner-Managed Guarantee:</strong> Direct communication with founder Zerihun. Zero obligation, free custom itinerary refinement.
                </span>
              </div>

              {tour && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, packageTier: 'standard' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.packageTier === 'standard'
                        ? 'border-[#C88A2E] bg-amber-50/50 ring-1 ring-[#C88A2E]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">Standard Tier</div>
                    <div className="text-[11px] text-stone-500">Quality hotels, 4x4, full support</div>
                    <div className="text-xs font-semibold text-[#C88A2E] mt-1">{tour.priceFromUSD}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, packageTier: 'luxury' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.packageTier === 'luxury'
                        ? 'border-[#C88A2E] bg-amber-50/50 ring-1 ring-[#C88A2E]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">Luxury Eco-Lodge</div>
                    <div className="text-[11px] text-stone-500">Premier boutique lodges & VIP vehicles</div>
                    <div className="text-xs font-semibold text-[#C88A2E] mt-1">Upgrade Available</div>
                  </button>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rossi"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Date & Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Target Travel Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. November 2025"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Number of Travelers</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <select
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                    >
                      <option value="1">1 Traveler (Solo)</option>
                      <option value="2">2 Travelers (Couple/Duo)</option>
                      <option value="3-4">3 - 4 Travelers</option>
                      <option value="5+">5+ Travelers (10% Group Discount!)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Special Interests & Requests</label>
                <textarea
                  rows={3}
                  placeholder="Birding, photography, dietary requirements, hotel preferences..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Tour Inquiry'}</span>
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  🔒 Zero spam. 100% free itinerary quotes. Direct to admin inbox.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}