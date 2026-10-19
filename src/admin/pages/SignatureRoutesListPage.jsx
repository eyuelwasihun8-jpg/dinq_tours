import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function SignatureRoutesListPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllDocs('signatureRoutes');
      setRoutes(data);
    } catch (e) { toast.error('Failed to load'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('signatureRoutes', deleteTarget.id);
      toast.success('Route deleted');
      setDeleteTarget(null);
      load();
    } catch (e) { toast.error('Failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Signature Routes"
        subtitle={`${routes.length} multi-region master journeys`}
        actions={<Button icon={Plus} onClick={() => navigate('/admin/signature-routes/new')}>Add Route</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.map(r => (
            <Card key={r.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {r.heroImage ? (
                  <img src={r.heroImage} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Sparkles className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 text-3xl">{r.emoji}</div>
                {r.duration && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {r.duration}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{r.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-1">{r.tagline}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">/{r.slug}</code>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/signature-routes/${r.id}/edit`)} className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(r)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
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
        title="Delete Route?"
        message={`Delete "${deleteTarget?.name}"?`}
        loading={deleting}
      />
    </div>
  );
}