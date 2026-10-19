import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, ShoppingBag, MessageSquare, MapPin, Globe, Sparkles, Mountain,
  Layers, ArrowRight, Loader2, Plus, Database, Activity
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collections = ['tours', 'destinations', 'regions', 'signatureRoutes', 'mountains', 
                        'safari', 'unesco', 'festivals', 'birding', 'experiences',
                        'shopCategories', 'shopProducts', 'inquiries', 'subscribers'];
    
    const unsubscribers = [];
    const counts = {};
    let completed = 0;

    collections.forEach(colName => {
      const unsub = onSnapshot(collection(db, colName), (snapshot) => {
        counts[colName] = snapshot.size;
        setStats({ ...counts });
        completed++;
        if (completed >= collections.length) setLoading(false);
      }, (err) => {
        console.error(`Dashboard: Failed to count ${colName}`, err);
        counts[colName] = 0;
        completed++;
      });
      unsubscribers.push(unsub);
    });

    // Recent inquiries (live)
    const inqQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(5));
    const inqUnsub = onSnapshot(inqQuery, (snapshot) => {
      setRecentInquiries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    unsubscribers.push(inqUnsub);

    return () => unsubscribers.forEach(u => u());
  }, []);

  const formatDate = (ts) => {
    if (!ts) return 'Just now';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const newInquiries = recentInquiries.filter(i => !i.status || i.status === 'new').length;

  const mainStats = [
    { label: 'Active Tours', value: stats.tours || 0, icon: Compass, color: 'text-blue-600', bg: 'bg-blue-100', link: '/admin/tours' },
    { label: 'Shop Products', value: stats.shopProducts || 0, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-100', link: '/admin/shop/products' },
    { label: 'New Inquiries', value: newInquiries, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/admin/inquiries', badge: newInquiries > 0 },
    { label: 'Destinations', value: stats.destinations || 0, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100', link: '/admin/destinations' },
  ];

  const contentModules = [
    { label: 'Regions', count: stats.regions || 0, icon: Globe, link: '/admin/regions', addLink: '/admin/regions/new' },
    { label: 'Signature Routes', count: stats.signatureRoutes || 0, icon: Sparkles, link: '/admin/signature-routes', addLink: '/admin/signature-routes/new' },
    { label: 'Mountains', count: stats.mountains || 0, icon: Mountain, link: '/admin/mountains', addLink: '/admin/mountains/new' },
    { label: 'Experiences', count: stats.experiences || 0, icon: Sparkles, link: '/admin/experiences', addLink: '/admin/experiences/new' },
    { label: 'Safari', count: stats.safari || 0, icon: Layers, link: '/admin/collections/safari', addLink: '/admin/collections/safari/new' },
    { label: 'UNESCO Sites', count: stats.unesco || 0, icon: Layers, link: '/admin/collections/unesco', addLink: '/admin/collections/unesco/new' },
    { label: 'Festivals', count: stats.festivals || 0, icon: Layers, link: '/admin/collections/festivals', addLink: '/admin/collections/festivals/new' },
    { label: 'Birding Spots', count: stats.birding || 0, icon: Layers, link: '/admin/collections/birding', addLink: '/admin/collections/birding/new' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Live overview of DINQ Tour, Travel & Events.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" />
          <p className="text-xs text-stone-500 mt-3">Connecting to Firestore...</p>
        </div>
      ) : (
        <>
          {/* Empty State Warning */}
          {stats.tours === 0 && stats.destinations === 0 && (
            <Card className="bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900">Database is empty!</h3>
                  <p className="text-sm text-amber-800 mt-1 mb-3">
                    No content found in Firestore. You can either seed with sample data, or start adding items manually.
                  </p>
                  <div className="flex gap-2">
                    <Link to="/admin/migration" className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2">
                      <Database className="w-3.5 h-3.5" />
                      <span>Run Migration (Seed Data)</span>
                    </Link>
                    <Link to="/admin/tours/new" className="bg-white border border-stone-300 hover:border-amber-500 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 text-stone-700">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Tour</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat, i) => (
              <Link key={i} to={stat.link}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group relative">
                {stat.badge && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white animate-pulse">
                    NEW
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#C88A2E] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          {/* All Content Modules Grid */}
          <Card title="All Content Modules" description="Click to manage • Click + to add new item">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {contentModules.map((mod, i) => (
                <div key={i} className="relative group">
                  <Link to={mod.link} className="block p-4 bg-stone-50 hover:bg-amber-50 border border-stone-100 hover:border-[#C88A2E] rounded-xl transition-all">
                    <div className="flex items-center gap-2.5 mb-2">
                      <mod.icon className="w-4 h-4 text-[#C88A2E]" />
                      <span className="text-xs font-bold text-stone-700 group-hover:text-[#C88A2E]">{mod.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-stone-900">{mod.count}</div>
                    <div className="text-[10px] text-stone-500 font-medium">items</div>
                  </Link>
                  <Link to={mod.addLink}
                    title={`Add new ${mod.label}`}
                    className="absolute top-2 right-2 w-7 h-7 bg-[#C88A2E] hover:bg-[#b57a24] text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Plus className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions + Recent Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Quick Actions" className="lg:col-span-1">
              <div className="space-y-2">
                {[
                  { label: 'Add New Tour', icon: Compass, link: '/admin/tours/new' },
                  { label: 'Add New Product', icon: ShoppingBag, link: '/admin/shop/products/new' },
                  { label: 'Add Destination', icon: MapPin, link: '/admin/destinations/new' },
                  { label: 'View Inquiries', icon: MessageSquare, link: '/admin/inquiries' },
                  { label: 'Site Settings', icon: Activity, link: '/admin/settings' },
                ].map((action, i) => (
                  <Link key={i} to={action.link} className="flex items-center justify-between p-3 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-100 hover:border-[#C88A2E] transition-all group">
                    <span className="flex items-center gap-2 text-sm font-semibold text-stone-700 group-hover:text-[#C88A2E]">
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C88A2E]" />
                  </Link>
                ))}
              </div>
            </Card>

            <Card title="Recent Inquiries" description="Latest customer submissions" className="lg:col-span-2">
              {recentInquiries.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">No inquiries yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentInquiries.map(inq => (
                    <Link key={inq.id} to="/admin/inquiries" className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-[#C88A2E] flex items-center justify-center font-bold text-sm shrink-0">
                        {inq.fullName?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-stone-900 truncate group-hover:text-[#C88A2E]">{inq.fullName}</div>
                        <div className="text-xs text-stone-500 truncate">
                          {inq.tourTitle || inq.formType || 'General inquiry'}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-stone-400">{formatDate(inq.createdAt)}</div>
                        {(!inq.status || inq.status === 'new') && (
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">NEW</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Live Status Indicator */}
          <div className="text-center text-xs text-stone-400 py-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Live sync active — admin changes update public site instantly</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}