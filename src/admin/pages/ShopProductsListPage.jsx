import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Package, Search, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocs, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function ShopProductsListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        getAllDocs('shopProducts'),
        getAllDocs('shopCategories')
      ]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('shopProducts', deleteTarget.id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.categorySlug === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Shop Products"
        subtitle={`${products.length} products in catalog`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/shop')}>
              ← Categories
            </Button>
            <Button icon={Plus} onClick={() => navigate('/admin/shop/products/new')}>
              Add Product
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
            />
          </div>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.emoji} {c.title}</option>
            ))}
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No products found</h3>
          <p className="text-sm text-stone-500 mt-2 mb-6">Add your first product to get started</p>
          <Button icon={Plus} onClick={() => navigate('/admin/shop/products/new')}>Add Product</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-0 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative aspect-square bg-stone-100">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {p.isBestSeller && (
                    <span className="bg-[#C88A2E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Best Seller
                    </span>
                  )}
                  {p.isBranded && (
                    <span className="bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Branded
                    </span>
                  )}
                </div>
                {!p.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-2 leading-snug">{p.name}</h4>
                <div className="flex items-center justify-between">
                  <div className="font-serif text-lg font-bold text-stone-900">${p.price}</div>
                  <div className="flex items-center gap-0.5 text-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{p.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <code className="text-[9px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 truncate">{p.categorySlug}</code>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/shop/products/${p.id}/edit`)} className="p-1.5 text-stone-500 hover:text-[#C88A2E] hover:bg-amber-50 rounded">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
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
        title="Delete Product?"
        message={`Delete "${deleteTarget?.name}"?`}
        loading={deleting}
      />
    </div>
  );
}