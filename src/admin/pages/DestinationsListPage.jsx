import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function DestinationsListPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllDocs('destinations');
      setDestinations(data);
    } catch (e) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('destinations', deleteTarget.id);
      toast.success('Destination deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = destinations.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Destinations"
        subtitle={`${destinations.length} iconic destinations across Ethiopia`}
        actions={
          <Button icon={Plus} onClick={() => navigate('/admin/destinations/new')}>
            Add Destination
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name or region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
          />
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <MapPin className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No destinations yet</h3>
          <Button icon={Plus} onClick={() => navigate('/admin/destinations/new')} className="mt-6">
            Add First Destination
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(dest => (
            <Card key={dest.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {dest.heroImage ? (
                  <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
                {dest.altitude && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {dest.altitude}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-[#C88A2E] uppercase tracking-wider">{dest.region}</div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">{dest.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">{dest.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">/{dest.slug}</code>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/destinations/${dest.id}/edit`)} className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(dest)} className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
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
        title="Delete Destination?"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}