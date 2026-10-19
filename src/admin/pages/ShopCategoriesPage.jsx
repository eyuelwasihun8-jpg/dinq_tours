import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function ShopCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllDocs('shopCategories');
      // Sort by number field
      data.sort((a, b) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0));
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('shopCategories', deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Shop Categories"
        subtitle={`${categories.length} product categories`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/shop/products')}>
              View Products →
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/admin/shop/categories/new')}>
              Add Category
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-video bg-stone-100">
                {cat.heroImage ? (
                  <img src={cat.heroImage} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {cat.number} • {cat.emoji}
                </div>
                {cat.isBranded && (
                  <div className="absolute top-3 right-3 bg-[#C88A2E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    DINQ Branded
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{cat.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">{cat.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">/{cat.slug}</code>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/admin/shop/categories/${cat.id}/edit`)}
                      className="p-2 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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
        title="Delete Category?"
        message={`Delete "${deleteTarget?.title}"? Products inside this category will become uncategorized.`}
        loading={deleting}
      />
    </div>
  );
}