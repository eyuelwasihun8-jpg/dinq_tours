import React, { useState, useEffect } from 'react';
import { Database, Trash2, Loader2, AlertTriangle, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';

const COLLECTIONS = [
  { name: 'tours', label: 'Tours', addLink: '/admin/tours/new' },
  { name: 'destinations', label: 'Destinations', addLink: '/admin/destinations/new' },
  { name: 'regions', label: 'Regions', addLink: '/admin/regions/new' },
  { name: 'signatureRoutes', label: 'Signature Routes', addLink: '/admin/signature-routes/new' },
  { name: 'mountains', label: 'Mountains', addLink: '/admin/mountains/new' },
  { name: 'safari', label: 'Safari', addLink: '/admin/collections/safari/new' },
  { name: 'unesco', label: 'UNESCO Sites', addLink: '/admin/collections/unesco/new' },
  { name: 'festivals', label: 'Festivals', addLink: '/admin/collections/festivals/new' },
  { name: 'birding', label: 'Birding Spots', addLink: '/admin/collections/birding/new' },
  { name: 'experiences', label: 'Experiences', addLink: '/admin/experiences/new' },
  { name: 'shopCategories', label: 'Shop Categories', addLink: '/admin/shop/categories/new' },
  { name: 'shopProducts', label: 'Shop Products', addLink: '/admin/shop/products/new' },
  { name: 'inquiries', label: 'Inquiries', addLink: null },
  { name: 'subscribers', label: 'Newsletter Subscribers', addLink: null },
];

export default function DatabaseManagerPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState({});
  const [confirmClear, setConfirmClear] = useState(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const loadCounts = async () => {
    setLoading(true);
    const newCounts = {};
    for (const col of COLLECTIONS) {
      try {
        const snapshot = await getDocs(collection(db, col.name));
        newCounts[col.name] = snapshot.size;
      } catch (e) {
        newCounts[col.name] = 0;
      }
    }
    setCounts(newCounts);
    setLoading(false);
  };

  useEffect(() => { loadCounts(); }, []);

  const clearCollection = async (colName) => {
    setClearing(c => ({ ...c, [colName]: true }));
    try {
      const snapshot = await getDocs(collection(db, colName));
      const deletions = snapshot.docs.map(d => deleteDoc(doc(db, colName, d.id)));
      await Promise.all(deletions);
      toast.success(`Cleared ${snapshot.size} documents from ${colName}`);
      loadCounts();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to clear ${colName}`);
    } finally {
      setClearing(c => ({ ...c, [colName]: false }));
      setConfirmClear(null);
    }
  };

  const clearAllCollections = async () => {
    setConfirmClearAll(false);
    for (const col of COLLECTIONS) {
      await clearCollection(col.name);
    }
    toast.success('🧹 Database fully cleared! Start adding content manually.');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Database Manager"
        subtitle="Clear collections and manually add content from scratch"
      />

      <Card className="mb-6 bg-rose-50 border-rose-200">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm text-rose-900 space-y-2">
            <p><strong>⚠️ Destructive Operations:</strong> Clearing a collection permanently deletes ALL documents in it.</p>
            <p>Use this if you want to <strong>start fresh</strong> and add every tour, destination, product manually via the admin forms.</p>
          </div>
        </div>
      </Card>

      <div className="mb-6 flex gap-3 flex-wrap">
        <Button variant="outline" onClick={loadCounts} icon={Database}>
          Refresh Counts
        </Button>
        <Button variant="danger" onClick={() => setConfirmClearAll(true)} icon={Trash2}>
          Clear Everything
        </Button>
      </div>

      <Card title="Collections Overview">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#C88A2E] mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {COLLECTIONS.map(col => (
              <div key={col.name} className="flex items-center justify-between py-3 px-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone-900">{col.label}</div>
                  <div className="text-xs text-stone-500">
                    <code className="bg-stone-100 px-1.5 py-0.5 rounded">{col.name}</code>
                    {' • '}
                    <span className={counts[col.name] > 0 ? 'text-emerald-700 font-semibold' : 'text-stone-500'}>
                      {counts[col.name] || 0} documents
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {col.addLink && (
                    <Link to={col.addLink} className="p-2 text-[#C88A2E] hover:bg-amber-50 rounded-lg" title="Add new">
                      <Plus className="w-4 h-4" />
                    </Link>
                  )}
                  {counts[col.name] > 0 && (
                    <button
                      onClick={() => setConfirmClear(col)}
                      disabled={clearing[col.name]}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-50"
                      title="Clear collection"
                    >
                      {clearing[col.name] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmModal
        open={!!confirmClear}
        onClose={() => setConfirmClear(null)}
        onConfirm={() => clearCollection(confirmClear.name)}
        title={`Clear ${confirmClear?.label}?`}
        message={`This will permanently delete all ${counts[confirmClear?.name] || 0} documents in "${confirmClear?.name}". This cannot be undone.`}
        confirmLabel="Yes, Clear All"
        loading={clearing[confirmClear?.name]}
      />

      <ConfirmModal
        open={confirmClearAll}
        onClose={() => setConfirmClearAll(false)}
        onConfirm={clearAllCollections}
        title="⚠️ CLEAR ENTIRE DATABASE?"
        message="This will delete EVERY document across ALL collections (tours, destinations, shop, inquiries, everything). You will start with a completely empty database. Are you absolutely sure?"
        confirmLabel="YES, DELETE EVERYTHING"
      />
    </div>
  );
}