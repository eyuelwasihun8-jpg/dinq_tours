import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, getAllDocs, createDoc, updateDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import UploadWidget from '../../cloudinary/UploadWidget';

const EMPTY = {
  slug: '',
  categorySlug: '',
  name: '',
  tagline: '',
  description: '',
  price: 0,
  priceETB: '',
  image: '',
  rating: 4.8,
  reviewCount: 0,
  inStock: true,
  isBestSeller: false,
  isBranded: false,
  tags: [''],
};

export default function ShopProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [product, setProduct] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllDocs('shopCategories').then(setCategories);
    if (!isNew) {
      getDocById('shopProducts', id).then(data => {
        if (data) setProduct({ ...EMPTY, ...data, tags: data.tags || [''] });
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setProduct(p => ({ ...p, [field]: value }));

  const updateTag = (i, val) => {
    const tags = [...product.tags];
    tags[i] = val;
    update('tags', tags);
  };
  const addTag = () => update('tags', [...product.tags, '']);
  const removeTag = (i) => update('tags', product.tags.filter((_, idx) => idx !== i));

  const generateSlug = () => {
    update('slug', product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSave = async () => {
    if (!product.name.trim() || !product.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }

    setSaving(true);
    try {
      const cleaned = {
        ...product,
        tags: product.tags.filter(t => t.trim()),
        price: parseFloat(product.price) || 0,
        rating: parseFloat(product.rating) || 0,
        reviewCount: parseInt(product.reviewCount) || 0,
      };

      if (isNew) {
        const newId = await createDoc('shopProducts', cleaned);
        toast.success('Product created');
        navigate(`/admin/shop/products/${newId}/edit`);
      } else {
        await updateDocById('shopProducts', id, cleaned);
        toast.success('Product saved');
      }
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={isNew ? 'New Product' : `Edit: ${product.name}`}
        backTo="/admin/shop/products"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save Product</Button>}
      />

      <div className="space-y-6">
        <Card title="Product Image">
          <UploadWidget label="" currentImage={product.image} onUpload={url => update('image', url)} />
        </Card>

        <Card title="Basic Info">
          <div className="space-y-4">
            <Input label="Product Name" required value={product.name} onChange={e => update('name', e.target.value)} placeholder="Pro Trekking Boots — Waterproof" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input label="URL Slug" required value={product.slug} onChange={e => update('slug', e.target.value)} placeholder="pro-trekking-boots" />
                <button onClick={generateSlug} type="button" className="text-xs text-[#C88A2E] font-semibold hover:underline mt-1">Generate from name</button>
              </div>
              <Select
                label="Category"
                value={product.categorySlug}
                onChange={e => update('categorySlug', e.target.value)}
                options={[
                  { value: '', label: 'Select category...' },
                  ...categories.map(c => ({ value: c.slug, label: `${c.emoji} ${c.title}` }))
                ]}
              />
            </div>

            <Textarea label="Tagline" value={product.tagline} onChange={e => update('tagline', e.target.value)} rows={2} />
            <Textarea label="Description" value={product.description} onChange={e => update('description', e.target.value)} rows={5} />
          </div>
        </Card>

        <Card title="Pricing & Stats">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Price USD" type="number" step="0.01" value={product.price} onChange={e => update('price', e.target.value)} />
            <Input label="Price ETB" value={product.priceETB} onChange={e => update('priceETB', e.target.value)} placeholder="10,500 ETB" />
            <Input label="Rating" type="number" step="0.1" min="1" max="5" value={product.rating} onChange={e => update('rating', e.target.value)} />
            <Input label="Review Count" type="number" value={product.reviewCount} onChange={e => update('reviewCount', e.target.value)} />
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.inStock} onChange={e => update('inStock', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm font-medium">✅ In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.isBestSeller} onChange={e => update('isBestSeller', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-[#C88A2E] focus:ring-[#C88A2E]" />
              <span className="text-sm font-medium">⭐ Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.isBranded} onChange={e => update('isBranded', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-800" />
              <span className="text-sm font-medium">🏷️ DINQ Branded</span>
            </label>
          </div>
        </Card>

        <Card title="Tags" description="Short attribute tags (e.g., Waterproof, 100% Cotton)">
          <div className="space-y-2">
            {product.tags.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={t}
                  onChange={e => updateTag(i, e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                  placeholder="Tag"
                />
                <button onClick={() => removeTag(i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addTag}>Add Tag</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}