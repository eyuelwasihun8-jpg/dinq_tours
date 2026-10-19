import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Mountain } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function MountainsListPage() {
  const navigate = useNavigate();
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllDocs('mountains');
      data.sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
      setMountains(data);
    } catch (e) { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('mountains', deleteTarget.id);
      toast.success('Mountain deleted');
      setDeleteTarget(null);
      load();
    } catch (e) { toast.error('Failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Mountains & Peaks"
        subtitle={`${mountains.length} highland experiences`}
        actions={<Button icon={Plus} onClick={() => navigate('/admin/mountains/new')}>Add Mountain</Button>}
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mountains.map(m => (
            <Card key={m.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {m.heroImage ? (
                  <img src={m.heroImage} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Mountain className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  {m.number} {m.altitude && `• ${m.altitude}`}
                </div>
                {m.unesco && (
                  <div className="absolute top-3 right-3 bg-[#C88A2E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">UNESCO</div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-[#C88A2E] uppercase">{m.region}</div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">{m.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{m.tagline}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">/{m.slug}</code>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/mountains/${m.id}/edit`)} className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(m)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
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
        title="Delete Mountain?"
        message={`Delete "${deleteTarget?.name}"?`}
        loading={deleting}
      />
    </div>
  );
}