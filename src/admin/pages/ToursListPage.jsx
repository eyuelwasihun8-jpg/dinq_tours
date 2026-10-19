import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Copy, Star, Calendar, Eye, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById, createDoc } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function ToursListPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await getAllDocs('tours');
      setTours(data);
    } catch (error) {
      toast.error('Failed to load tours');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTours(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('tours', deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      loadTours();
    } catch (error) {
      toast.error('Failed to delete tour');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (tour) => {
    try {
      const { id, ...tourData } = tour;
      const newTour = {
        ...tourData,
        title: `${tour.title} (Copy)`,
        slug: `${tour.slug}-copy-${Date.now()}`,
        isFeatured: false,
      };
      await createDoc('tours', newTour);
      toast.success('Tour duplicated');
      loadTours();
    } catch (error) {
      toast.error('Failed to duplicate');
    }
  };

  const categories = ['all', ...new Set(tours.map(t => t.category).filter(Boolean))];

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title?.toLowerCase().includes(search.toLowerCase()) 
      || tour.destination?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Tours & Safaris"
        subtitle={`${tours.length} tours in your catalog`}
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/admin/tours/new')}>
            Add New Tour
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" />
          <p className="text-sm text-stone-500 mt-3">Loading tours...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTours.length === 0 && (
        <Card className="text-center py-16">
          <MapPin className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No tours found</h3>
          <p className="text-sm text-stone-500 mt-2 mb-6">
            {search ? 'Try a different search term' : 'Add your first tour to get started'}
          </p>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/admin/tours/new')}>
            Add First Tour
          </Button>
        </Card>
      )}

      {/* Tours Grid */}
      {!loading && filteredTours.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {tour.heroImage ? (
                  <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {tour.isFeatured && (
                    <span className="bg-[#C88A2E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Featured
                    </span>
                  )}
                  {tour.isUpcoming && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> Upcoming
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {tour.durationDays}D
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-[#C88A2E] uppercase tracking-wider">
                    {tour.category || 'Uncategorized'}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-1 line-clamp-2 leading-snug">
                    {tour.title}
                  </h3>
                  <div className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{tour.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">From</div>
                    <div className="font-serif font-bold text-stone-900">{tour.priceFromUSD}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/tours/${tour.slug}`}
                      target="_blank"
                      className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Preview on site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(tour)}
                      className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}
                      className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tour)}
                      className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
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
        title="Delete Tour?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Tour"
        loading={deleting}
      />
    </div>
  );
}