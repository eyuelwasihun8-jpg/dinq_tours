import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, MessageSquare, Users, Loader2, Trash2,
  Clock, Eye, Search, X, Calendar, MapPin, Globe, Package,
  ExternalLink, Send, Copy, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed: 'bg-stone-100 text-stone-500 border-stone-200',
};

const STATUS_LABELS = {
  new: '🆕 New',
  contacted: '📞 Contacted',
  confirmed: '✅ Confirmed',
  closed: '🗂️ Closed',
};

const FORM_TYPE_ICONS = {
  'Tour Inquiry': '🧭',
  'Custom Trip Planner': '🗺️',
  'Contact Page': '✉️',
  'General Inquiry': '💬',
};

// Build a professional Gmail compose URL with pre-filled reply
function buildGmailReplyLink(inquiry) {
  const to = encodeURIComponent(inquiry.email || '');
  
  const subject = encodeURIComponent(
    inquiry.tourTitle 
      ? `Re: Your ${inquiry.tourTitle} inquiry — DINQ Tour, Travel & Events`
      : inquiry.subject 
      ? `Re: ${inquiry.subject} — DINQ Tour, Travel & Events`
      : `Re: Your message to DINQ Tour, Travel & Events`
  );

  const body = encodeURIComponent(
    `Dear ${inquiry.fullName || 'Traveler'},\n\n` +
    `Amesegenalehu (thank you) for reaching out to DINQ Tour, Travel & Events!\n\n` +
    `[Your personal response here]\n\n` +
    `────────────────────────────\n` +
    `Your original message:\n` +
    `"${inquiry.message || 'No message provided'}"\n` +
    `────────────────────────────\n\n` +
    `Warm regards,\n` +
    `Zerihun Alemayehu\n` +
    `Founder & COO\n` +
    `DINQ Tour, Travel & Events\n` +
    `📱 WhatsApp: +251 913 817 153\n` +
    `✉️ info@dinqethiopiatours.com\n` +
    `🌍 www.dinqethiopiatours.com`
  );

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
}

// Build WhatsApp message with pre-filled reply
function buildWhatsAppLink(inquiry) {
  const phone = (inquiry.phone || '').replace(/[^0-9]/g, '');
  if (!phone) return null;
  
  const message = encodeURIComponent(
    `Hi ${inquiry.fullName || 'there'}! 👋\n\n` +
    `This is Zerihun from DINQ Tour, Travel & Events.\n\n` +
    `Thank you for your inquiry about ${inquiry.tourTitle || 'your Ethiopian journey'}. ` +
    `I'd love to help you plan the perfect experience.`
  );
  
  return `https://wa.me/${phone}?text=${message}`;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null); // Opens as modal
  const [liveConnected, setLiveConnected] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setInquiries(docs);
        setLoading(false);
        setLiveConnected(true);
      },
      (err) => {
        console.error('❌ Inquiries listener error:', err);
        toast.error('Could not load messages.');
        setLoading(false);
        setLiveConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Keep the open modal in sync with live updates
  useEffect(() => {
    if (!selected) return;
    const latest = inquiries.find(i => i.id === selected.id);
    if (latest && JSON.stringify(latest) !== JSON.stringify(selected)) {
      setSelected(latest);
    }
    if (!latest && selected) {
      // Document was deleted
      setSelected(null);
    }
  }, [inquiries]);

  // Close modal on Escape
  useEffect(() => {
    if (!selected) return;
    const handleEsc = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selected]);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
      toast.success(`Marked as ${status}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'inquiries', deleteTarget.id));
      toast.success('Message deleted');
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      toast.error('Copy failed');
    }
  };

  const formatRelative = (ts) => {
    if (!ts) return 'Just now';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatFull = (ts) => {
    if (!ts) return 'Unknown';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filtered = inquiries.filter((inq) => {
    const status = inq.status || 'new';
    if (filter !== 'all' && status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.fullName?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q) ||
      inq.tourTitle?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q)
    );
  });

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => !i.status || i.status === 'new').length,
    contacted: inquiries.filter((i) => i.status === 'contacted').length,
    confirmed: inquiries.filter((i) => i.status === 'confirmed').length,
    closed: inquiries.filter((i) => i.status === 'closed').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Customer Messages"
        subtitle="All inquiries from the website — Tour Booking, Trip Planner, Contact form"
      />

      {/* Status Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${liveConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
              Frontend message inbox
              {liveConnected && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Click any message to see full details and reply via Gmail or WhatsApp.
            </p>
          </div>
        </div>
        {counts.new > 0 && (
          <div className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            {counts.new} unread message{counts.new !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2 flex-1">
          {['all', 'new', 'contacted', 'confirmed', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === s ? 'bg-[#C88A2E] text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {s === 'all' ? `All (${counts.all})` : `${STATUS_LABELS[s]} (${counts[s]})`}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search name, email, tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <Mail className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">
            {search ? 'No matching messages' : 'No messages yet'}
          </h3>
          <p className="text-sm text-stone-500 mt-2">
            When visitors submit forms on the website, they appear here instantly.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const isNew = !inq.status || inq.status === 'new';
            const icon = FORM_TYPE_ICONS[inq.formType] || '💬';

            return (
              <button
                key={inq.id}
                type="button"
                onClick={() => setSelected(inq)}
                className={`w-full text-left p-5 rounded-2xl border transition-all hover:shadow-md ${
                  isNew
                    ? 'bg-blue-50/50 border-blue-200 hover:border-blue-400'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 ${isNew ? 'bg-blue-100' : 'bg-stone-100'}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                        {inq.fullName || 'Anonymous'}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${STATUS_COLORS[inq.status || 'new']}`}>
                        {STATUS_LABELS[inq.status || 'new']}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 truncate mb-1">
                      {inq.email} {inq.phone && `· ${inq.phone}`}
                    </div>
                    <div className="text-sm text-stone-700 font-medium line-clamp-1">
                      {inq.tourTitle || inq.subject || inq.formType || 'Message'}
                    </div>
                    {inq.message && (
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 italic">"{inq.message}"</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelative(inq.createdAt)}</span>
                      <span>·</span>
                      <span className="font-medium text-stone-500">{inq.formType || 'Inquiry'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <Eye className="w-4 h-4 text-stone-300" />
                    <span className="text-xs font-semibold text-[#C88A2E] hidden sm:block">View</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL — Full message details                                  */}
      {/* ============================================================ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full sm:max-w-3xl sm:rounded-3xl shadow-2xl my-0 sm:my-8 overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 bg-gradient-to-br from-amber-50 to-white flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {FORM_TYPE_ICONS[selected.formType] || '💬'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C88A2E] mb-0.5">
                    {selected.formType || 'Customer Inquiry'}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 truncate">
                    {selected.fullName || 'Anonymous'}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatFull(selected.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-10 h-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="px-5 sm:px-6 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between gap-2 shrink-0">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Status:</span>
              <select
                value={selected.status || 'new'}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className={`text-xs font-bold border-2 rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 ${STATUS_COLORS[selected.status || 'new']}`}
              >
                <option value="new">🆕 New</option>
                <option value="contacted">📞 Contacted</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="closed">🗂️ Closed</option>
              </select>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="group relative p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-[#C88A2E] transition-all">
                  <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1">Email Address</div>
                  <div className="font-semibold text-stone-900 truncate pr-8">{selected.email}</div>
                  <button
                    onClick={() => copyToClipboard(selected.email, 'Email')}
                    className="absolute top-3 right-3 text-stone-400 hover:text-[#C88A2E] p-1"
                    title="Copy email"
                  >
                    {copiedField === 'Email' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {selected.phone && (
                  <div className="group relative p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-[#C88A2E] transition-all">
                    <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1">Phone / WhatsApp</div>
                    <div className="font-semibold text-stone-900 truncate pr-8">{selected.phone}</div>
                    <button
                      onClick={() => copyToClipboard(selected.phone, 'Phone')}
                      className="absolute top-3 right-3 text-stone-400 hover:text-[#C88A2E] p-1"
                      title="Copy phone"
                    >
                      {copiedField === 'Phone' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Subject / Interest */}
              {(selected.tourTitle || selected.subject) && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider mb-1 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {selected.tourTitle ? 'Interested in Tour' : 'Subject'}
                  </div>
                  <div className="text-base font-bold text-stone-900">
                    {selected.tourTitle || selected.subject}
                  </div>
                  {selected.tourDuration && (
                    <div className="text-xs text-stone-600 mt-1">
                      {selected.tourDuration} days · {selected.tourPrice}
                    </div>
                  )}
                </div>
              )}

              {/* Trip Details Grid */}
              {(selected.travelDate || selected.travelers || selected.country || selected.packageTier || selected.duration || selected.travelMonth || selected.preferredLanguage) && (
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-3">Travel Details</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selected.travelDate && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />Travel Date
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{selected.travelDate}</div>
                      </div>
                    )}
                    {selected.travelMonth && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />Travel Month
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{selected.travelMonth}</div>
                      </div>
                    )}
                    {selected.travelers && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3" />Travelers
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{selected.travelers}</div>
                      </div>
                    )}
                    {selected.duration && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" />Duration
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{selected.duration} days</div>
                      </div>
                    )}
                    {selected.packageTier && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Package Tier</div>
                        <div className="text-sm font-semibold text-stone-800 capitalize">{selected.packageTier}</div>
                      </div>
                    )}
                    {selected.country && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1 mb-1">
                          <Globe className="w-3 h-3" />Country
                        </div>
                        <div className="text-sm font-semibold text-stone-800">{selected.country}</div>
                      </div>
                    )}
                    {selected.preferredLanguage && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Language</div>
                        <div className="text-sm font-semibold text-stone-800">{selected.preferredLanguage}</div>
                      </div>
                    )}
                    {selected.travelStyle && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Travel Style</div>
                        <div className="text-sm font-semibold text-stone-800 capitalize">{selected.travelStyle}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Destinations */}
              {selected.destinations?.length > 0 && (
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />Requested Destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.destinations.map(d => (
                      <span key={d} className="bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold capitalize">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {selected.interests?.length > 0 && (
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">Special Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.interests.map(i => (
                      <span key={i} className="bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-full text-xs font-semibold capitalize">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* The actual message */}
              <div>
                <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />Message Content
                </div>
                {selected.message ? (
                  <div className="p-5 bg-blue-50 border-l-4 border-blue-400 rounded-xl text-stone-800 whitespace-pre-wrap leading-relaxed font-serif italic">
                    "{selected.message}"
                  </div>
                ) : (
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 italic text-sm">
                    No written message provided.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer — Action Buttons */}
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Message
                </button>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* WhatsApp Reply (if phone exists) */}
                  {selected.phone && buildWhatsAppLink(selected) && (
                    <a
                      href={buildWhatsAppLink(selected)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        if (selected.status === 'new' || !selected.status) {
                          updateStatus(selected.id, 'contacted');
                        }
                      }}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}

                  {/* Gmail Reply */}
                  <a
                    href={buildGmailReplyLink(selected)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (selected.status === 'new' || !selected.status) {
                        updateStatus(selected.id, 'contacted');
                      }
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#C88A2E] hover:bg-[#b57a24] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Reply via Gmail</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message?"
        message={`Permanently delete the message from "${deleteTarget?.fullName}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}