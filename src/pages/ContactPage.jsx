import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { updatePageMeta } from '../utils/seo';
import Breadcrumbs from '../components/common/Breadcrumbs';
import MagneticButton from '../components/animations/MagneticButton';

// FIRESTORE IMPORTS
import { createDoc } from '../firebase/firestore';
import companyDataStatic from '../data/companyData';
import { useDocById } from '../hooks/useFirestore';

export default function ContactPage() {
  // Fetch live company data (or use static fallback)
  const { data: companyDoc } = useDocById('settings', 'company');
  const companyData = companyDoc || companyDataStatic;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    updatePageMeta({
      title: 'Contact Us | DINQ Tour, Travel & Events',
      description: 'Contact DINQ in Addis Ababa. Call, WhatsApp, or send a message — founder Zerihun responds personally.',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🔥 THIS IS THE MAGIC: Saves to Firestore -> Admin Inbox
      await createDoc('inquiries', {
        ...formData,
        formType: 'Contact Page',
        status: 'new',
        tourTitle: null,
      });

      setIsSubmitted(true);
      
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C88A2E', '#D4AF7A', '#18181B'],
        });
      } catch (_) {}
      
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Message failed to send. Please check your internet connection or use WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24">
      {/* Header Area */}
      <div className="bg-stone-950 text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 to-stone-950/95" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <Breadcrumbs items={[{ label: 'Contact', to: '/contact' }]} />
          <h1 className="font-serif text-4xl sm:text-6xl font-bold">Contact Us</h1>
          <p className="text-stone-300 max-w-xl font-light">
            Reach our Addis Ababa office directly. Every message is reviewed by the DINQ team and goes straight to our secure admin portal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Addis Ababa Office</h2>

            <div className="space-y-5 text-sm text-stone-600">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#C88A2E] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{companyData.headquarters.address}, {companyData.headquarters.city}, Ethiopia</span>
              </div>
              <div className="flex gap-4 items-center">
                <Phone className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <a href={`tel:${companyData.contact.phone.replace(/[^0-9+]/g, '')}`} className="font-medium text-stone-900 hover:text-[#C88A2E] transition-colors">
                  {companyData.contact.phone}
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <Mail className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <a href={`mailto:${companyData.contact.primaryEmail}`} className="font-medium text-stone-900 hover:text-[#C88A2E] transition-colors">
                  {companyData.contact.primaryEmail}
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <Clock className="w-5 h-5 text-[#C88A2E] shrink-0" />
                <span>{companyData.hours.weekday}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <a
                href={companyData.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#e8f8ee] hover:bg-[#dcf3e5] text-[#128C7E] border border-[#25D366]/30 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-stone-900">Message Received!</h3>
                <p className="text-base text-stone-600 max-w-md mx-auto leading-relaxed">
                  Amesegenalehu, <strong>{formData.fullName}</strong>. Your message is safely in our admin inbox. We will reply to {formData.email} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ fullName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold mt-4 shadow-md"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-stone-900 mb-1">Send a Message</h2>
                  <p className="text-sm text-stone-500">Goes straight to the DINQ admin portal.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">Phone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all"
                        placeholder="+251..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Tour Booking</option>
                    <option>Custom Itinerary</option>
                    <option>Group / Corporate</option>
                    <option>Shop / Gear Order</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all font-light leading-relaxed"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Message Securely'}</span>
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}