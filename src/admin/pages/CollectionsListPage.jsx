import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

const COLLECTION_META = {
  safari: { 
    label: 'Safari Collection', 
    singular: 'Safari',
    description: 'Wildlife expeditions across Ethiopia',
    emoji: '🦁',
    firestore: 'safari',
  },
  unesco: { 
    label: 'UNESCO Heritage Sites', 
    singular: 'UNESCO Site',
    description: '12 World Heritage properties',
    emoji: '🏛️',
    firestore: 'unesco',
  },
  festivals: { 
    label: 'Cultural Festivals', 
    singular: 'Festival',
    description: 'Living traditions and celebrations',
    emoji: '🎉',
    firestore: 'festivals',
  },
  birding: { 
    label: 'Birding Hotspots', 
    singular: 'Birding Spot',
    description: '14 avian expeditions',
    emoji: '🐦',
    firestore: 'birding',
  },
};

export default function CollectionsListPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const meta = COLLECTION_META[type];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!meta) return;
    setLoading(true);
    try {
      const data = await getAllDocs(meta.firestore);
      data.sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
      setItems(data);
    } catch (e) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [type]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById(meta.firestore, deleteTarget.id);
      toast.success('Deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error('Failed');
    } finally {
      setDeleting(false);
    }
  };

  if (!meta) {
    return <div className="text-center py-16 text-stone-500">Invalid collection type</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={`${meta.emoji} ${meta.label}`}
        subtitle={`${items.length} ${meta.singular}s • ${meta.description}`}
        actions={
          <Button icon={Plus} onClick={() => navigate(`/admin/collections/${type}/new`)}>
            Add {meta.singular}
          </Button>
        }
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No {meta.singular}s yet</h3>
          <Button icon={Plus} onClick={() => navigate(`/admin/collections/${type}/new`)} className="mt-6">
            Add First {meta.singular}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <Card key={item.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {item.heroImage ? (
                  <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-5xl">
                    {meta.emoji}
                  </div>
                )}
                {item.number && (
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    {item.number}
                  </div>
                )}
                {item.timing && (
                  <div className="absolute top-3 right-3 bg-[#C88A2E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {item.timing}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  {item.category && <div className="text-[10px] font-bold text-[#C88A2E] uppercase">{item.category}</div>}
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">{item.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{item.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">/{item.slug}</code>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/collections/${type}/${item.id}/edit`)} className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${meta.singular}?`}
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}