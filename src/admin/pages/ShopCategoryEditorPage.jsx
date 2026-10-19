import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, createDoc, updateDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import UploadWidget from '../../cloudinary/UploadWidget';

const EMPTY = {
  number: '',
  emoji: '',
  slug: '',
  title: '',
  shortTitle: '',
  tagline: '',
  description: '',
  heroImage: '',
  isBranded: false,
};

export default function ShopCategoryEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [cat, setCat] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('shopCategories', id).then(data => {
        if (data) setCat({ ...EMPTY, ...data });
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setCat(c => ({ ...c, [field]: value }));

  const handleSave = async () => {
    if (!cat.title.trim() || !cat.slug.trim()) {
      toast.error('Title and slug required');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const newId = await createDoc('shopCategories', cat);
        toast.success('Category created');
        navigate(`/admin/shop/categories/${newId}/edit`);
      } else {
        await updateDocById('shopCategories', id, cat);
        toast.success('Category saved');
      }
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={isNew ? 'New Category' : `Edit: ${cat.title}`}
        backTo="/admin/shop"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input label="Number" value={cat.number} onChange={e => update('number', e.target.value)} placeholder="01" />
            <Input label="Emoji" value={cat.emoji} onChange={e => update('emoji', e.target.value)} placeholder="🥾" />
            <Input label="Slug" required value={cat.slug} onChange={e => update('slug', e.target.value)} placeholder="hiking-footwear" />
          </div>

          <Input label="Title" required value={cat.title} onChange={e => update('title', e.target.value)} placeholder="Hiking & Trekking Footwear" />
          <Input label="Short Title" value={cat.shortTitle} onChange={e => update('shortTitle', e.target.value)} placeholder="Footwear" />
          <Textarea label="Tagline" value={cat.tagline} onChange={e => update('tagline', e.target.value)} rows={2} />
          <Textarea label="Description" value={cat.description} onChange={e => update('description', e.target.value)} rows={4} />

          <UploadWidget label="Hero Image" currentImage={cat.heroImage} onUpload={url => update('heroImage', url)} />

          <label className="flex items-center gap-2 pt-2">
            <input type="checkbox" checked={cat.isBranded} onChange={e => update('isBranded', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-[#C88A2E] focus:ring-[#C88A2E]" />
            <span className="text-sm font-medium">⭐ Mark as DINQ Branded Collection</span>
          </label>
        </div>
      </Card>
    </div>
  );
}